import passport from "passport";
import { userController } from "./Controllers/userController.js";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as gitHubStrategy } from "passport-github2";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import config from "./config.js";
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
            let userRole 

            if (!first_name || !last_name || !email || !password) {
                return done(null, false, { message: "Debe completar todos los datos", state: "incompleted" });
            }

            const user = await userController.findByEmail(email)

            if (user) {
                return done(null, false, { message: "El email ya está registrado", state: "registered" });
            }

            const hashedPassword = await hashData(password)

            if (email.includes("@admin.com")) {
                userRole = "ADMIN";
              } 

            const createData = await userController.createOne({
                ...req.body,
                password: hashedPassword,
                role: userRole
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
            const user = await userController.findByEmail(email);
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
        clientID: config.github_id,
        clientSecret: config.github_client,
        callbackURL: "http://localhost:8080/api/sessions/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userController.findByEmail(profile._json.email);

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
                const createdUser = await userController.createOne(infoUser);
                return done(null, createdUser);
            }
        } catch (error) {
            return done(error);
        }
    }
));

// Google
passport.use('google', new googleStrategy({
    clientID: config.github_id,
    clientSecret: config.github_client,
    callbackURL: "http://localhost:8080/api/sessions/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userController.findByEmail(profile._json.email);

            if (user) {
                // Usuario existe, iniciar sesión
                return done(null, user);
            } else {
                // Usuario no existe, registrar
                const infoUser = {
                    first_name: profile._json.given_name,
                    last_name: profile._json.family_name,
                    email: profile._json.email,
                    fromGoogle: true
                };
                const createdUser = await userController.createOne(infoUser);
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
        const findUser = await userController.findUserById(id)
        done(null, findUser)
    } catch (error) {
        done(null)
    }
})
