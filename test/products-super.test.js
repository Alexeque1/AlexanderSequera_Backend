import supertest from "supertest";
import { expect } from "chai";


const request = supertest('http://localhost:8080');

describe("Testing routing de Products", () => {
    describe("Test de obtención de productos", () => {
        it("El endpoint GET /api/products debe obtener todos lo productos como JSON y con status 200", async () => {
            const response = await request.get("/api/products");
            expect(response.status).to.equal(200);
            expect(response.type).to.equal("application/json");
        });

        it('El endpoint GET /api/products debe traer las propiedades "Info" y "Results" dentro de "Products"', async () => {
            const response = await request.get("/api/products");
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("products");
            expect(response.body.products).to.be.an("object");
            expect(response.body.products).to.have.property("info");
            expect(response.body.products).to.have.property("results");
        });

        it("El endpoint GET /api/products/:id debe obtener un producto por su ID como JSON y con status 200", async () => {
            const productId = "653725063e8c4ee955e8676d"; // ID real
            const response = await request.get(`/api/products/${productId}`);

            expect(response.status).to.equal(200);
            expect(response.type).to.equal("application/json");
        });

        it('El endpoint GET /api/products/:id debería traer una respuesta que contenga la propiedad "Title"', async () => {
            const productId = "653725063e8c4ee955e8676d"; // ID real
            const response = await request.get(`/api/products/${productId}`);

            expect(response.body).to.have.property("title");
        });

        it("El endpoint GET /api/products/:id debería devolver un error 404 para un ID no existente", async () => {
            const productId = "653725063e8c4ee955e8333"; //ID falso
            const response = await request.get(`/api/products/${productId}`);

            expect(response.status).to.equal(404);
            expect(response.type).to.equal("application/json");
        });

        it('El endpoint GET /api/products/code/:code debe obtener un producto por su propiedad "Code" como JSON y con status 200', async () => {
            const productCode = "keus746"; // Code real
            const response = await request.get(`/api/products/code/${productCode}`);

            expect(response.status).to.equal(200);
            expect(response.type).to.equal("application/json");
        });

        it('El endpoint GET /api/products/code/:code debería traer una respuesta que contenga la propiedad "Title"', async () => {
            const productCode = "keus746"; // Code real
            const response = await request.get(`/api/products/code/${productCode}`);

            expect(response.body).to.have.property("title");
        });

        it("El endpoint GET /api/products/code/:code debería devolver un error 404 para un ID no existente", async () => {
            const productCode = "ahsb555"; //Code falso
            const response = await request.get(`/api/products/code/${productCode}`);

            expect(response.status).to.equal(404);
            expect(response.type).to.equal("application/json");
        });
    });

    describe("Test de agregado de productos", () => {
        describe('Pruebas para la ruta POST', () => {
            it('El endpoint POST /api/products/ debe agregar un producto y tener un status 200 mientras el usuario tenga rol "PREMIUM"', async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };

                const loginResponse = await request
                .post('/api/sessions/login')
                .send(authenticatedUser)
                .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);

                const cookies = loginResponse.headers['set-cookie'];

                const productData = {
                    title: "Producto de ejemplo",
                    description: "Descripción del producto",
                    price: 1099,
                    thumbnail: "url_de_la_imagen",
                    code: "ABC12345",
                    stock: 100,
                    status: true,
                    category: "Disney"
                  };

                  const response = await request
                  .post('/api/products')
                  .send(productData)
                  .set('Cookie', cookies); 
                  
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal("ok");
            });

              it('El endpoint POST /api/products/ debe devolver un error 403 y el mensaje "Acceso prohibido para este usuario" si se está intentando agregar un producto sin tener el rol autorizado', async () => {
                const authenticatedUser = { email: 'nopremium@nopremium.com', password: '123456' };

                const loginResponse = await request
                .post('/api/sessions/login')
                .send(authenticatedUser)
                .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);

                const cookies = loginResponse.headers['set-cookie'];

                const productData2 = {
                    title: "Producto de ejemplo2",
                    description: "Descripción del producto2",
                    price: 10999,
                    thumbnail: "url_de_la_imagen2",
                    code: "ABC123452",
                    stock: 1000,
                    status: true,
                    category: "Disney"
                  };

                  const response = await request
                  .post('/api/products')
                  .send(productData2)
                  .set('Cookie', cookies); 
            
                expect(response.status).to.equal(403);
                expect(response.body.message).to.equal("Acceso prohibido para este usuario")                
              });

              it('El endpoint POST /api/products/ debe devolver un error 403 y el mensaje "Acceso prohibido para este usuario" si un usuario no está logeado', async () => {
                const productData2 = {
                    title: "Producto de ejemplo2",
                    description: "Descripción del producto2",
                    price: 10999,
                    thumbnail: "url_de_la_imagen2",
                    code: "ABC123452",
                    stock: 1000,
                    status: true,
                    category: "Disney"
                  };

                  const response = await request
                  .post('/api/products')
                  .send(productData2)
            
                expect(response.status).to.equal(403);
                expect(response.body.message).to.equal("Acceso prohibido para este usuario")   
              });

              it('El endpoint POST /api/products/ debe devolver un error 400 y el status "noCode" cuando se intenta agregar un producto con un codigo ya existente', async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };

                const loginResponse = await request
                .post('/api/sessions/login')
                .send(authenticatedUser)
                .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);

                const cookies = loginResponse.headers['set-cookie'];

                const productDataReal = {
                    title: "Hades",
                    description: "Hades ha estado llevando la cuenta y está planeando cómo expandir su dominio. Ten cuidado con los juegos que juegas con él. ¡Agrega pop! Hades con tablero a tu colección de Villanos de Disney. La figura de vinilo mide aproximadamente 5,25 pulgadas de alto.",
                    price: 7500,
                    thumbnail: "./IMG/HadesSale.png",
                    code: "keus746",
                    stock: 40,
                    status: "true",
                    category: "Disney",
                  };

                  const response = await request
                  .post('/api/products')
                  .send(productDataReal)
                  .set('Cookie', cookies); 
                  
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal("noCode");
            });
          });
    });

    describe("Test de actualización de productos", () => {
        describe("Pruebas para la ruta PUT", () => {
            it('El endpoint PUT /api/products/:id debe actualizar un producto y tener un status 200 mientras el usuario tenga rol "PREMIUM", además debe tener la propiedad "message"', async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };

                const loginResponse = await request
                .post('/api/sessions/login')
                .send(authenticatedUser)
                .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);

                const cookies = loginResponse.headers['set-cookie'];

                const realID = "653724d63e8c4ee955e8676a"

                const productDataUpdate = {
                    code: "abcd123",
                  };

                  const response = await request
                  .put(`/api/products/${realID}`)
                  .send(productDataUpdate)
                  .set('Cookie', cookies); 

                expect(response.status).to.equal(200);
                expect(response.body).to.have.an.property("message");   
            });

            it('El endpoint PUT /api/products/:id debe poder actualizar un producto correctamente y debe coincidir este dato con la base de datos', async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };
            
                const loginResponse = await request
                    .post('/api/sessions/login')
                    .send(authenticatedUser)
                    .set('Content-Type', 'application/json');
            
                expect(loginResponse.status).to.equal(200);
            
                const cookies = loginResponse.headers['set-cookie'];
            
                const realID = "653724d63e8c4ee955e8676a";
            
                const productDataUpdate = {
                    stock: 15,
                };
            
                const response = await request
                    .put(`/api/products/${realID}`)
                    .send(productDataUpdate)
                    .set('Cookie', cookies);
            
                expect(response.status).to.equal(200);
            
                const getProduct = await request
                    .get(`/api/products/${realID}`)
            
                // Verificar que el producto existe y que el stock coincida con los datos actualizados
                expect(getProduct).to.exist;
                expect(getProduct.body.stock).to.equal(productDataUpdate.stock);
            });

            it('El endpoint PUT /api/products/:id debe tener un error 400 y tener un status "noProduct" si el ID no existe o no se pudo conseguir el producto por el ID', async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };

                const loginResponse = await request
                .post('/api/sessions/login')
                .send(authenticatedUser)
                .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);

                const cookies = loginResponse.headers['set-cookie'];

                const fakeID = "653724d63e8c4ee955e86222"

                const productDataUpdate = {
                    code: "abcd123",
                  };

                  const response = await request
                  .put(`/api/products/${fakeID}`)
                  .send(productDataUpdate)
                  .set('Cookie', cookies); 

                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal("noProduct");   
            })

            it('El endpoint PUT /api/products/:id debe tener un error 403 y el mensaje "Acceso prohibido para este usuario" si se está intentando agregar un producto sin tener el rol autorizado', async () => {
                const authenticatedUser = { email: 'nopremium@nopremium.com', password: '123456' };

                const loginResponse = await request
                .post('/api/sessions/login')
                .send(authenticatedUser)
                .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);

                const cookies = loginResponse.headers['set-cookie'];

                const fakeID = "653724d63e8c4ee955e86222"

                const productDataUpdate = {
                    code: "abcd123",
                  };

                  const response = await request
                  .put(`/api/products/${fakeID}`)
                  .send(productDataUpdate)
                  .set('Cookie', cookies); 

                expect(response.status).to.equal(403);
                expect(response.body.message).to.equal("Acceso prohibido para este usuario")
            })
            
            
        })
    })

    describe("Test de eliminación de productos", () => {
        describe("Pruebas para la ruta DELETE", () => {

            ////PARA FUNCIONAR SE DEBE INGRESAR UN ID CORRECTO, PERO ESTE TEST FUNCIONA
            it('El endpoint DELETE /api/products/:id debe eliminar un producto y tener un status 200 mientras el usuario tenga rol "PREMIUM", además debe tener la propiedad "message"', async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };

                const loginResponse = await request
                .post('/api/sessions/login')
                .send(authenticatedUser)
                .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);

                const cookies = loginResponse.headers['set-cookie'];

                const realID = "65c2de37c83eab9d3cc469bb"

                  const response = await request
                  .delete(`/api/products/${realID}`)
                  .set('Cookie', cookies); 
                  
                expect(response.status).to.equal(200);
                expect(response.body).to.have.an.property("message");  
            });

            it('El endpoint DELETE /api/products/:ID debe devolver un error 403 y el mensaje "Acceso prohibido para este usuario" si se está eliminar agregar un producto sin tener el rol autorizado', async () => {
                const authenticatedUser = { email: 'nopremium@nopremium.com', password: '123456' };

                const loginResponse = await request
                .post('/api/sessions/login')
                .send(authenticatedUser)
                .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);

                const cookies = loginResponse.headers['set-cookie'];
                const ID = "653724d63e8c4ee955e86764"
                  const response = await request
                  .delete(`/api/products/${ID}`)
                  .set('Cookie', cookies); 
            
                expect(response.status).to.equal(403);
                expect(response.body.message).to.equal("Acceso prohibido para este usuario")  
            });

            it('El endpoint DELETE /api/products/:id debería devolver un error 404 para un ID no existente', async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };

                const loginResponse = await request
                .post('/api/sessions/login')
                .send(authenticatedUser)
                .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);

                const cookies = loginResponse.headers['set-cookie'];
                const fakeID = "653724d63e8c4ee955e86555"
                  const response = await request
                  .delete(`/api/products/${fakeID}`)
                  .set('Cookie', cookies); 
            
                expect(response.status).to.equal(404);
                expect(response.body.message).to.equal("Producto no encontrado") 
            });
            
        })
    })
});