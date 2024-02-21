import supertest from "supertest";
import { expect } from "chai";
import { generateToken } from "../src/Fuctions/jwt.js";


const request = supertest('http://localhost:8080');

describe("Testing routing de Sessions", () => {
    describe("Test de obtención del usuario logeado", () => {
        it('El endpoint GET /api/sessions/getUserName debe traer como resultado una propiedad message que diga "Success" y el nombre del usuario logeado', async () => {
            const authenticatedUser = { email: 'premium@premium.com', password: '123456', first_name: 'Premium' };

            const loginResponse = await request
                .post('/api/sessions/login')
                .send(authenticatedUser)
                .set('Content-Type', 'application/json');

            expect(loginResponse.status).to.equal(200);
            const cookies = loginResponse.headers['set-cookie'];

            const response = await request
                .get(`/api/sessions/getUserName`)
                .set('Cookie', cookies);

            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal("Success");
            expect(response.body.username).to.equal(authenticatedUser.first_name);
        });

        it('El endpoint GET /api/sessions/current debe obtener los datos del usuario logeado. Para comprobarlo, debe coincidir el email logeado con el resultado del router.', async () => {
            const authenticatedUser = { email: 'premium@premium.com', password: '123456', first_name: 'Premium' };

            const loginResponse = await request
                .post('/api/sessions/login')
                .send(authenticatedUser)
                .set('Content-Type', 'application/json');

            expect(loginResponse.status).to.equal(200);
            const cookies = loginResponse.headers['set-cookie'];

            const response = await request
                .get(`/api/sessions/current`)
                .set('Cookie', cookies);

            expect(response.status).to.equal(200);
            expect(response.body.user.email).to.equal("premium@premium.com");
        });

        it('El endpoint GET /api/sessions/current debe traer error si se intenta ingresar no logeado. Para eso, debe traer el error "Usuario no loggeado"', async () => {
            const response = await request
                .get(`/api/sessions/current`)

            expect(response.status).to.equal(401);
            expect(response.body.error).to.equal("Usuario no loggeado");
        });
    });

    describe("Test con method POST", () => {
        describe("Test de registro de usuario", () => {
            it('El endpoint POST /api/sessions/signup debería crear un nuevo usuario y devolver un mensaje de éxito', async () => {
                const userData = {
                  first_name: 'John',
                  last_name: 'Doe',
                  email: 'john.doe@example.com',
                  password: 'password123'
                };

                const response = await request
                  .post('/api/sessions/signup')
                  .send(userData);

                expect(response.status).to.equal(200);
                expect(response.body.message).to.equal('Usuario creado');
                expect(response.body).to.have.property("user");
                expect(response.body.state).to.equal('alreadysign');
              });

            it('El endpoint POST /api/sessions/signup debería devolver un error si faltan datos', async () => {
                const incompleteUserData = {
                    first_name: 'User',
                    last_name: 'Name',
                    // email y password faltantes
                };

                const response = await request
                    .post('/api/sessions/signup')
                    .send(incompleteUserData);

                expect(response.status).to.equal(400);
                expect(response.body).to.have.property("error")
                expect(response.body.error).to.equal('DATA_MISSING');
            });

            it('El endpoint POST /api/sessions/signup debería devolver un error si el email ya está registrado', async () => {
                const existingUserEmail = 'premium@premium.com';

                const existingUserData = {
                    first_name: 'Premium',
                    last_name: 'Premium2',
                    email: existingUserEmail,
                    password: '123456'
                };

                const response = await request
                    .post('/api/sessions/signup')
                    .send(existingUserData);

                expect(response.status).to.equal(400);
                expect(response.body).to.have.property("error")
                expect(response.body.error).to.equal('USER_ALREADY_LOGGED');
            });
        });

        describe("Test de registro de log in", () => {
            it('El endpoint POST /api/sessions/login debería iniciar sesión correctamente con credenciales válidas', async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };

                const loginResponse = await request
                    .post('/api/sessions/login')
                    .send(authenticatedUser)
                    .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);
                expect(loginResponse.body).to.have.property('message');
                expect(loginResponse.body.state).to.equal('login');
                expect(loginResponse.body).to.have.property('user');
            });

            it('El endpoint POST /api/sessions/login debería iniciar sesión correctamente y además tener una sesión abierta', async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };

                const loginResponse = await request
                    .post('/api/sessions/login')
                    .send(authenticatedUser)
                    .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);
                expect(loginResponse.body).to.have.property('message');
                expect(loginResponse.body.state).to.equal('login');
                expect(loginResponse.body).to.have.property('user');
                expect(loginResponse.headers).to.have.property('set-cookie');
            });

            it('El endpoint POST /api/sessions/login debería devolver un error 401 si el correo electrónico no está registrado', async () => {
                const authenticatedUser = { email: 'noregistrado@premium.com', password: '123456' };

                const loginResponse = await request
                    .post('/api/sessions/login')
                    .send(authenticatedUser)
                    .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(401);
                expect(loginResponse.body).to.have.property('message');
                expect(loginResponse.body.state).to.equal('error');
                expect(loginResponse.body.errorCode).to.equal('USER_NOT_LOGGED');
            });

            it('El endpoint POST /api/sessions/login debería devolver un error 401 si la contraseña es incorrecta', async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '1234567' };

                const loginResponse = await request
                    .post('/api/sessions/login')
                    .send(authenticatedUser)
                    .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(401);
                expect(loginResponse.body).to.have.property('message');
                expect(loginResponse.body.state).to.equal('error');
                expect(loginResponse.body.errorCode).to.equal('PASSWORD_NOT_ACCEPTED');
            });
        })

        describe("Test de registro de log out", () => {
            it("El endpoint GET /api/sessions/logout debería cerrar sesión exitosamente", async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };
    
                const loginResponse = await request
                    .post('/api/sessions/login')
                    .send(authenticatedUser)
                    .set('Content-Type', 'application/json');
    
                expect(loginResponse.status).to.equal(200);
    
                const response = await request
                    .get('/api/sessions/logout')
    
                expect(loginResponse.status).to.equal(200);
                expect(response.body.message).to.equal('Se ha deslogeado con exito');
                expect(response.body.state).to.equal('logout');
            })
        })

        describe("Tes de recuperación de contraseña", () => {
            it("Debería restablecer la contraseña con éxito", async () => {
                const user = {
                    email: 'hola@gmail.com',
                    newPassword: '123456',
                  };

                  const generatedToken = generateToken(user);
                  const tokenData = {
                    token: generatedToken,
                    user: "65d13fd79367f6d8e132766c",
                    createdAt: new Date()
                  }

                  const response = await request
                  .post('/api/sessions/resetpassword')
                  .send(user)
                  .set('Cookie', `token=${JSON.stringify(tokenData)}`)
                  
                  const result = response.body.message
                  console.log(result)
                  expect(response.status).to.equal(200);
                  expect(response.body.message).to.equal('Contraseña restablecida con éxito.');
            })
        })
    })
})