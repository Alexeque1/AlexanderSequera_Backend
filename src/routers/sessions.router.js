import { Router } from "express";
import { userManagerInfo } from "../Dao/usersManager.js";
import { hashData, compareData } from "../app.js";
import passport from "passport";

const router = Router();

router.get('/getUserName', async (req, res) => {
    const user = req.session.user
    const userAlreadyLogged = user.first_name
    console.log(userAlreadyLogged)

    try {
        return res.status(200).json({message: "Success", username: userAlreadyLogged})

    } catch (error) {
        return res.status(500).json('Cannot create file.')
    }
});

// router.post('/signup', async (req, res) => {
//     try {
//         const { first_name, last_name, email, password } = req.body

//         if (!first_name || !last_name || !email || !password) {
//             return res.status(400).json({ message: "Debe completar todos los datos", state: "incompleted" })
//         }

//         const user = await userManagerInfo.findByEmail(email)

//         if(user) {
//             return res.status(401).json({message: "El email ya está registrado", state: "registered"})
//         }

//         const hashedPassword = await hashData(password)

//         const create = await userManagerInfo.createOne({
//             ...req.body, 
//             password: hashedPassword
//         })
//         return res.status(200).json({ message: "Usuario creado", user: create, state: "alreadysign" })

//     } catch (error) {
//         return res.status(500).json('Cannot create file.')
//     }
// });

// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body

//         const user = await userManagerInfo.findByEmail(email)

//         if(!user) {
//             return res.status(401).json({message: "El email no está registrado", state: "noregistered"})
//         }

//         const isPasswordValid = await compareData(password, user.password)

//         if (!isPasswordValid) {
//             return res.status(401).json({message: "La contraseña es incorrecta", state: "nopassword"})
//         }

//         const sessionInfo = email === "adminCoder@coder.com" && password === "adminCod3r123"
//         ? req.session.user = { email, first_name: user.first_name, isAdmin: true } 
//         : req.session.user = { email, first_name: user.first_name , isAdmin: false }

//         req.session.user = sessionInfo
//         return res.status(200).json({message: "Usted ha ingresado con exito", state: "login", user: req.body, name: user.first_name})

//     } catch (error) {
//         return res.status(500).json('Error while loging.')
//     }
// });

// LOCAL PASSPORT

router.post('/signup', (req, res, next) => {
    passport.authenticate('signup', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Error interno del servidor', state: 'error' });
        }
        if (!user) {
            return res.status(400).json({ message: info.message, state: info.state });
        }
        
        return res.status(200).json({ message: 'Usuario creado', user, state: 'alreadysign' });
    })(req, res, next);
});

router.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Error interno del servidor', state: 'error' });
        }
        if (!user) {
            return res.status(401).json({ message: info.message, state: info.state });
        }

        return res.status(200).json({ message: 'Usted ha ingresado con éxito', state: 'login', user: req.body, name: user.first_name });
    })(req, res, next);
});

// GITHUB PASSPORT

router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/callback', 
  passport.authenticate('github'), (req, res) => {
    req.session.user = req.user;
    res.redirect('http://localhost:8080/realtimeproducts')
  });

// GOOGLE PASSPORT

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('http://localhost:8080/realtimeproducts')
  });

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            return res.status(500).json({ message: 'Error al cerrar sesión', state: 'error' });
        }

        return res.status(200).json({ message: 'Se ha deslogeado con exito', state: 'logout'})
    });
});

///CURRENT USER
router.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ error: 'No autenticado' });
    }
  });

export default router