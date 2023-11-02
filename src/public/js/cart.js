///CART

let productsBox = document.getElementById('products_list_picture'); 
let productsIcons = document.getElementById('products_list_icons'); 
let buttonBackCart = document.getElementById('buttonBack-cart');

buttonBackCart.onclick = () => {
    setTimeout(function () {
        window.location.href = 'http://localhost:8080/realtimeproducts';
    }, 100);
}