const socketClient = io();
let productsList

console.log('Probado');

const addProductsButton = document.getElementById('buttonAlert');
const formProductsShow = document.getElementById('formProducts');
const form = document.getElementById('productForm');
const backButton = document.getElementById('backButton');
const alertBox = document.getElementById('alertBox');
const alertBoxDuplicate = document.getElementById('alertBoxDuplicate');
const alertBoxUndefined = document.getElementById('alertBoxUndefined');

addProductsButton.onclick = () => {
    if (formProductsShow.style.display === 'none' || formProductsShow.style.display === '') {
        formProductsShow.style.display = 'flex';
    } else {
        formProductsShow.style.display = 'none';
    }
};

backButton.onclick = () => {
    if (formProductsShow.style.display === 'none' || formProductsShow.style.display === '') {
        formProductsShow.style.display = 'flex';
    } else {
        formProductsShow.style.display = 'none';
    }
};

form.onsubmit = (event) => {
    event.preventDefault();

    fetch(`/api/products`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data.products)) {
                productsList = data.products;
            } else {
                productsList = [data.products];
            }
    
            console.log(productsList);
    

            let title = document.getElementById("title").value;
            let price = document.getElementById("price").value;
            let code = document.getElementById("code").value;
            let stock = document.getElementById("stock").value;
            let status = document.getElementById("status").value;
            let category = document.getElementById("category").value;
            let thumbnail = document.getElementById("thumbnail").value;
            let description = document.getElementById("description").value;

            if (
                title === undefined || title.trim() === "" ||
                price === undefined || price.trim() === "" ||
                code === undefined || code.trim() === "" ||
                stock === undefined || stock.trim() === "" ||
                status === undefined || status.trim() === "" ||
                category === undefined || category.trim() === "" ||
                thumbnail === undefined || thumbnail.trim() === "" ||
                description === undefined || description.trim() === ""
            ) {
                if (alertBoxUndefined.style.display === 'none' || alertBoxUndefined.style.display === '') {
                    alertBoxUndefined.style.display = 'flex';
                    setTimeout(function () {
                        alertBoxUndefined.style.display = 'none';
                    }, 1500);
                } else {
                    alertBox.style.display = 'none';
                }
            } else {
                const filterProductsCode = productsList.find(prod => prod.code === code);
                console.log(filterProductsCode);

                if (filterProductsCode) {
                    if (alertBoxDuplicate.style.display === 'none' || alertBoxDuplicate.style.display === '') {
                        alertBoxDuplicate.style.display = 'flex';
                        setTimeout(function () {
                            alertBoxDuplicate.style.display = 'none';
                        }, 1500);
                    } else {
                        alertBoxDuplicate.style.display = 'none';
                    }
                    return 'No avanza';
                }

                let formData = {
                    title: title,
                    price: price,
                    code: code,
                    stock: stock,
                    status: status,
                    category: category,
                    thumbnail: thumbnail,
                    description: description
                };

                let formDataJSON = JSON.stringify(formData);

                console.log(formDataJSON);

                fetch("/api/products", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: formDataJSON
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        formProductsShow.style.display = 'none';
                        if (alertBox.style.display === 'none' || alertBox.style.display === '') {
                            alertBox.style.display = 'flex';
                            setTimeout(function () {
                                alertBox.style.display = 'none';
                            }, 1500);
                        } else {
                            alertBox.style.display = 'none';
                        }

                        fetch(`/api/products/code/${formData.code}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application.json"
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                getProduct = data;
                                socketClient.emit("Product", getProduct);
                            })
                            .catch(error => {
                                console.error("Error al recuperar datos del archivo JSON:", error);
                            });
                    })
                    .catch(error => {
                        console.error("Error al enviar los datos:", error);
                    });

                socketClient.on("ProductAdded", (getProduct) => {
                    const productList = document.getElementById("productContainer");

                    const productItem = document.createElement("div");
                    productItem.className = "productContainer";

                    const productHTML = `
                        <div class='itemPicture'>
                            <img src="${getProduct.thumbnail}" alt="${getProduct.title}" />
                        </div>
                        <div class='ItemBox_inf'>
                            <h3 class='ItemBox_title'>${getProduct.title}</h3>
                            <p class='ItemBox_point spaceBetw'> <span class="info_span">PRECIO:</span> $${getProduct.price} </p>
                            <p class='ItemBox_point spaceBetw'> <span class="info_span">ID:</span> ${getProduct._id} </p>
                            <p class='ItemBox_description spaceBetw'> ${getProduct.description} </p>
                            <p class='ItemBox_category spaceBetw'> ${getProduct.category} </p>
                        </div>
                    `;

                    productItem.innerHTML = productHTML;

                    productList.appendChild(productItem);
                });
            }
        })
        .catch(error => {
            console.error("Error al recuperar datos del archivo JSON:", error);
        });
};

/// CHAT

let user;

let buttonBack = document.getElementById('buttonAlert-chat');
let buttonChatShow = document.getElementById('chatButton-show');
let chatBox = document.getElementById('chat-container-princ');
let userName = document.getElementById('user');
let chatBoxMessages = document.getElementById('chat-messages-box');
let sendMessageBox = document.getElementById('sendMessageChat');
let chatUSerMessage = document.getElementById('chatUSerMessage').value; 

buttonBack.onclick = () => {
    setTimeout(function () {
        window.location.href = 'http://localhost:8080/realtimeproducts';
    }, 100);
}


buttonChatShow.onclick = () => {
    if (chatBox.style.display === 'none' || chatBox.style.display === '') {
        chatBox.style.display = 'flex';
    } else {
        chatBox.style.display = 'none';
    }

    Swal.fire({
        title: '¡Bienvenido!',
        text: 'Ingrese su nombre',
        input: 'text',
        showCancelButton: true,
        cancelButtonText: 'Volver',
        inputPlaceholder: 'Nombre',
        inputValidator: (value) => {
            if (!value) {
                return 'Debe escribir un nombre para ingresar al chat';
            }
        },
        confirmButtonText: 'Enter',
    }).then((input) => {
        if (input.value) {
            user = input.value;
    
            Swal.fire('Hola', `¡Bienvenido, ${user}!`, 'success');
    
            socketClient.emit("NewUser", user);
        } else if (input.dismiss === Swal.DismissReason.cancel) {
            setTimeout(function () {
                window.location.href = 'http://localhost:8080/realtimeproducts';
            }, 100);
        }
    });
};


socketClient.on("NewUsernew", (newuser) => {
    Toastify({
        text: `${newuser} se ha conectado`,
        duration: 3000
    }).showToast();
});

sendMessageBox.onsubmit = (e) => {
    e.preventDefault();

    const infoMensaje = {
        username: user,
        message: chatUSerMessage
    }

    console.log(infoMensaje)

    socketClient.emit("messageSent", infoMensaje)
}