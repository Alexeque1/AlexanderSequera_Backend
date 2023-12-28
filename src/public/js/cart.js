const alertMessage = (icon, title, message) => {
    Swal.fire({
        icon: icon,
        title: title,
        text: message,
        timer: 3000
      });
}

/// CART

let productsBox = document.getElementById('products_list_picture'); 
let productsIcons = document.getElementById('products_list_icons'); 
let buttonBackCart = document.getElementById('buttonBack-cart');

buttonBackCart.onclick = () => {
    setTimeout(function () {
        window.location.href = 'http://localhost:8080/realtimeproducts';
    }, 100);
}

/// SHOP

let shopButton = document.getElementById("shopButton")
let cartID = localStorage.getItem('cartID');

shopButton.onclick = () => {
    fetch(`/api/cart/${cartID}/purchase`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Error") {
                alertMessage("error", data.message, data.error)
            } else if (data.message === "¡Hecho!") {
                alertMessage("success", data.message, "¡La compra se ha realizado con exito")
            }
        })
        .catch(error => {
            console.error("Error al enviar los datos:", error);
        });
};
