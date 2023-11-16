import passport from "passport";
import { userManagerInfo } from "./Dao/usersManager.js";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as gitHubStrategy } from "passport-github2";
import { hashData, compareData } from "./app.js";

//Local
passport.use('signup', new localStrategy(
    {
        passReqToCallback: true,
        usernameField: 'email'
    },
    async (req, email, password, done) => {
        try {
            const { first_name, last_name } = req.body

            if (!first_name || !last_name || !email || !password) {
                return done(null, false, { message: "Debe completar todos los datos", state: "incompleted" });
            }

            const user = await userManagerInfo.findByEmail(email)

            if (user) {
                return done(null, false, { message: "El email ya está registrado", state: "registered" });
            }

            const hashedPassword = await hashData(password)

            const createData = await userManagerInfo.createOne({
                ...req.body,
                password: hashedPassword
            })

            return done(null, createData, { message: "Usuario creado", state: "alreadysign" });

        } catch (error) {
            return done(error);
        }
    }
));

passport.use('login', new localStrategy(
    {
        usernameField: 'email',
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        try {
            const user = await userManagerInfo.findByEmail(email);
            if (!user) {
                return done(null, false, { message: 'El email no está registrado', state: 'noregistered' });
            }

            const isPasswordValid = await compareData(password, user.password);
            if (!isPasswordValid) {
                return done(null, false, { message: 'La contraseña es incorrecta', state: 'nopassword' });
            }

            req.session.user = user;

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));


// GitHub
passport.use('github',
    new gitHubStrategy({
        clientID: "Iv1.7b9adb1fbb8b5b80",
        clientSecret: "5599ad5575fbb28618e872cb55383244a950b4b7",
        callbackURL: "http://localhost:8080/api/sessions/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userManagerInfo.findByEmail(profile._json.email);

            if (user) {
                // Usuario existe, iniciar sesión
                return done(null, user);
            } else {
                // Usuario no existe, registrar
                const infoUser = {
                    first_name: profile._json.name.split(' ')[0],
                    last_name: profile._json.name.split(' ')[1],
                    email: profile._json.email,
                    fromGithub: true
                };
                const createdUser = await userManagerInfo.createOne(infoUser);
                return done(null, createdUser);
            }
        } catch (error) {
            return done(error);
        }
    }
));


passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await userManagerInfo.findUserById(id)
        done(null, findUser)
    } catch (error) {
        done(null)
    }
})
