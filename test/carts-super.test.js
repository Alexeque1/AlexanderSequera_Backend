import supertest from "supertest";
import { expect } from "chai";


const request = supertest('http://localhost:8080');

describe("Testing routing de Carts", () => {
    describe("Test de obtención de carritos", () => {
        it("El endpoint GET /api/cart debe obtener todos los carritos como JSON y con status 200", async () => {
            const response = await request.get("/api/cart");
            expect(response.status).to.equal(200);
            expect(response.type).to.equal("application/json");
        })

        it('El endpoint GET /api/cart debe traer la propiedad "Message"', async () => {
            const response = await request.get("/api/cart");
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("message");
        });

        it("El endpoint GET /api/cart/:id debe obtener un carrito por su ID como JSON y con status 200", async () => {
            const cartID = "6541c5c7b7a7899dad7ab4c9"; // ID real
            const response = await request.get(`/api/cart/${cartID}`);

            expect(response.status).to.equal(200);
            expect(response.type).to.equal("application/json");
        });

        it('El endpoint GET /api/cart/:id con un ID real debería traer una propiedad "getProducts" que a su vez tenga una propiedad "products" que sea un array', async () => {
            const cartID = "6548ede37b509df457edd5f5"; // ID real
            const response = await request.get(`/api/cart/${cartID}`);

            expect(response.body.getProducts).to.have.property('products').that.is.an('array');
        });

        it("El endpoint GET /api/products/:id debería devolver un error 404 para un ID no existente", async () => {
            const cartID = "6548ede37b509df457edd522"; //ID falso
            const response = await request.get(`/api/cart/${cartID}`);

            expect(response.status).to.equal(404);
            expect(response.type).to.equal("application/json");
        });
    })

    describe('Pruebas para la ruta POST', () => {
        describe("Test de compra de productos", () => {

            ////PARA FUNCIONAR SE DEBE INGRESAR UN ID CORRECTO, PERO ESTE TEST FUNCIONA
            it('El endpoint POST /api/cart/:cid/purchase debería realizar una compra exitosa con un carrito válido y suficiente stock', async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };

                    const loginResponse = await request
                    .post('/api/sessions/login')
                    .send(authenticatedUser)
                    .set('Content-Type', 'application/json');

                    expect(loginResponse.status).to.equal(200);
                    const cookies = loginResponse.headers['set-cookie'];

                const cartId = "6542e50c45a027a9399a73da"; //ID Real
                const response = await request
                    .post(`/api/cart/${cartId}/purchase`)
                    .set('Cookie', cookies); 

                    expect(response.status).to.equal(200);
                    expect(response.body.message).to.equal('¡Hecho!');
            });

            it('El endpoint POST /api/cart/:cid/purchase debería devolver un error 403 y el mensaje "No autenticado" cuando el usuario no está autenticado', async () => {
                const cartId = "6548ede37b509df457edd5f5";
                const response = await request
                    .post(`/api/cart/${cartId}/purchase`)

                expect(response.status).to.equal(401);
                expect(response.body.error).to.equal('No autenticado');
            });

            it('El endpoint POST /api/cart/:cid/purchase debería devolver un error 404 y el mensaje "Carrito no encontrado" cuando el carrito no existe', async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };

                const loginResponse = await request
                    .post('/api/sessions/login')
                    .send(authenticatedUser)
                    .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);
                const cookies = loginResponse.headers['set-cookie'];

                const cartId = "6548ede37b509df457edd789"; //ID Falso
                const response = await request
                    .post(`/api/cart/${cartId}/purchase`)
                    .set('Cookie', cookies);

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('Carrito no encontrado');
            });

            it('Debería devolver un error 400 cuando no hay suficiente stock para algunos productos', async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };

                const loginResponse = await request
                .post('/api/sessions/login')
                .send(authenticatedUser)
                .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);
                const cookies = loginResponse.headers['set-cookie'];

                const cartId = "c65874e008b65d0ae971ae140";
                const response = await request
                    .post(`/api/cart/${cartId}/purchase`)
                    .set('Cookie', cookies); 
                expect(response.status).to.equal(400);
                expect(response.body.message).to.equal('Error');
            });

            //// PARA FUNCIONAR SE DEBE INGRESAR UN ID CORRECTO SIN STOCK, PERO ESTE TEST FUNCIONA
            it('Debería devolver un error 400 y el mensaje de error "Stock insuficiente" cuando se intenta comprar con un carrito vacio', async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };

                const loginResponse = await request
                .post('/api/sessions/login')
                .send(authenticatedUser)
                .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);
                const cookies = loginResponse.headers['set-cookie'];

                const cartId = "65874e008b65d0ae971ae140";
                const response = await request
                    .post(`/api/cart/${cartId}/purchase`)
                    .set('Cookie', cookies); 

                expect(response.status).to.equal(400);
                expect(response.body.error).to.contain('El carrito está vacío');
            });

            it('El endpoint POST /api/cart/:cid/products/:pid debe realmente restar el stock del producto en la base de datos que fue agregado al carrito', async () => {
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };

                const loginResponse = await request
                    .post('/api/sessions/login')
                    .send(authenticatedUser)
                    .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);
                const cookies = loginResponse.headers['set-cookie'];

                const cartId = "65874dd08b65d0ae971ae132"; // ID REAL
                const prodID = "653725423e8c4ee955e86779"; // ID REAL

                const getProductBefore = await request.get(`/api/products/${prodID}`);
                const stockBefore = getProductBefore.body.stock;

                const data = {
                    quantity: 1
                };

                const response = await request
                    .post(`/api/cart/${cartId}/products/${prodID}`)
                    .send(data)
                    .set('Cookie', cookies);

                expect(response.status).to.equal(200);
                expect(response.body.title).to.equal('¡Hecho!');

                const getProductAfter = await request.get(`/api/products/${prodID}`);
                const stockAfter = getProductAfter.body.stock;

                expect(stockAfter).to.equal(stockBefore - data.quantity);
            });
        })

        describe('Test de creación de carrito', () => {
            // FUNCIONA
            it('El endpoint POST /api/cart/ debería crear un carrito con exito. El resultado debe tener una propiedad "Products" que sea un array.', async () => {
                const response = await request
                    .post('/api/cart')

                expect(response.status).to.equal(200);
                expect(response.body.message).to.exist;
                expect(response.body.message).to.have.property("products").that.is.an("array")
            });
        })


        describe('Test de agregado de productos al carrito', () => {
            it('El endpoint POST /api/cart/:cid/products/:pid debe agregar con exito un producto al carrito despues de que el usuario está autenticado', async () => {
                const authenticatedUser = { email: 'nopremium@nopremium.com', password: '123456' };

                const loginResponse = await request
                    .post('/api/sessions/login')
                    .send(authenticatedUser)
                    .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);
                const cookies = loginResponse.headers['set-cookie'];

                const cartId = "65874e008b65d0ae971ae140";
                const prodID = "653725423e8c4ee955e86779";
                const data = {
                    quantity: 1
                };

                const response = await request
                    .post(`/api/cart/${cartId}/products/${prodID}`)
                    .send(data)
                    .set('Cookie', cookies);

                expect(response.status).to.equal(200);
                expect(response.body.title).to.equal('¡Hecho!');
            });

            it('El endpoint POST /api/cart/:cid/products/:pid debe devolver un error 401 cuando el usuario no está autenticado', async () => {
                const cartId = "65874e008b65d0ae971ae140";
                const prodID = "653725423e8c4ee955e86779";
                const data = {
                    quantity: 1
                };

                const response = await request
                    .post(`/api/cart/${cartId}/products/${prodID}`)
                    .send(data)

                expect(response.status).to.equal(401);
                expect(response.body.message).to.equal('Usuario no autenticado');
            });

            // FUNCIONA
            it('El endpoint POST /api/cart/:cid/products/:pid debe devolver un error 403 cuando el usuario está intentando agregar un producto al carrito cuando su rol es PREMIUM y es dueño del producto', async () => {     
                const authenticatedUser = { email: 'premium@premium.com', password: '123456' };

                const loginResponse = await request
                    .post('/api/sessions/login')
                    .send(authenticatedUser)
                    .set('Content-Type', 'application/json');

                expect(loginResponse.status).to.equal(200);
                const cookies = loginResponse.headers['set-cookie'];

                const cartId = "65874e008b65d0ae971ae140";
                const prodID = "653725423e8c4ee955e86779";
                const data = {
                    quantity: 1
                };

                const response = await request
                    .post(`/api/cart/${cartId}/products/${prodID}`)
                    .send(data)
                    .set('Cookie', cookies); 

                expect(response.status).to.equal(403);
                expect(response.body.message).to.equal('No puedes agregar tu propio producto al carrito');
            });  
        })

        //FUNCIONA
        describe("Test de eliminación con router DELETE", () => {
            describe("Test de eliminación de productos dentro de un carrito", () => {
                //FUNCIONA
                it('El endpoint DELETE /api/cart/:cid/products/:pid debería eliminar un producto del carrito exitosamente con codigo 200 y que contenga el mensaje "Producto eliminado del carrito exitosamente"', async () => {
                    const cartId = '6548ede37b509df457edd5f5'; //ID real
                    const productId = '653724d63e8c4ee955e8676a'; //ID real

                    const response = await request
                        .delete(`/api/cart/${cartId}/products/${productId}`);

                    expect(response.status).to.equal(200);
                    expect(response.body.message).to.equal('Producto eliminado del carrito exitosamente');
                });

                it('El endpoint DELETE /api/cart/:cid/products/:pid debería devolver un error 404 cuando un producto que se está intentando borrar no existe dentro del mismo. Debe contener el status error y la propiedad message', async () => {
                    const cartId = '6548ede37b509df457edd5f5'; //ID real
                    const productId = '653724d63e8c4ee955e8333'; //ID falso

                    const response = await request
                        .delete(`/api/cart/${cartId}/products/${productId}`);

                    expect(response.status).to.equal(404);
                    expect(response.body).to.have.property('message');
                    expect(response.body.status).to.equal('error');
                });

                it('El endpoint DELETE /api/cart/:cid/products/:pid debería devolver un error 404 cuando el carrito no existe. Debe contener el status error y la propiedad message', async () => {
                    const cartId = '6548ede37b509df457ed3333'; //ID falso
                    const productId = '653724d63e8c4ee955e8676a'; //ID real

                    const response = await request
                        .delete(`/api/cart/${cartId}/products/${productId}`);

                    expect(response.status).to.equal(404);
                    expect(response.body).to.have.property('message');
                    expect(response.body.status).to.equal('error');
                });
            })

            describe("Test de eliminación del carrito", () => {
                //FUNCIONA
                it('El El endpoint DELETE /api/cart/:cid debería eliminar un carrito existente y devolver estatus 200 con la propiedad "message"', async () => {
                    const cartID = "65c4086f3e59a4ac0dda8947" //ID real
                
                    const response = await request.delete(`/api/cart/${cartID}`);
                
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('message');
                });

                it('El El endpoint DELETE /api/cart/:cid debería devolver un error 404 si el carrito no existe al intentar eliminarlo y ademas devolver un mensaje de error', async () => {
                    const cartID = "65c408b83e59a4ac0dda8961" //ID real
                
                    const response = await request.delete(`/api/cart/${cartID}`);
                
                    expect(response.status).to.equal(404);
                    expect(response.body.message).to.equal('Carrito no encontrado');
                });
            })
        })
    })
})