import express from 'express';
import productsRouter from './routers/products.router.js'
import cartRouter from './routers/cart.router.js'

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Route
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
