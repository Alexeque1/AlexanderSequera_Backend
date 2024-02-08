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
                        if (data.status !== "ok") {
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: data.message,
                                timer: 3000
                              })
                        } else if (data.status == "ok") {
                            Swal.fire({
                                icon: "success",
                                title: "¡Hecho!",
                                text: "Producto agregado",
                                timer: 3000
                              })
                        }

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

/// BUTTONS

const previousButton = document.getElementById("buttonPrevious");
const nextButton = document.getElementById("buttonNext");
const previousButtonOfic = document.getElementById("buttonPrevious_button");
const nextButtonOfic = document.getElementById("buttonNext_button");
const pageNumberInfo = document.getElementById("paginationInfo");
let getData 

const fetchInfo = () => {
    fetch(`/api/products`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            getData = data.products.info;

            disableButtonPrevious();
            disableButtonNext();
            paginationInfoNumber();
        })
        .catch(error => {
            console.error("Error al recuperar datos del archivo JSON:", error);
        });
}

const disableButtonPrevious = () => {
    const currentUrl = window.location.href;

    if (currentUrl === 'http://localhost:8080/realtimeproducts' || currentUrl === 'http://localhost:8080/realtimeproducts?page=1') {
        previousButton.style.display = 'none';
    } else {
        previousButton.style.display = 'block';
    }
}

const disableButtonNext = () => {

    if (getData) {
        const totalPages = getData.pages;

        const currentPage = getCurrentPageFromUrl();

        if (currentPage >= totalPages) {
            nextButton.style.display = 'none';
        } else {
            nextButton.style.display = 'block';
        }
    }
}

const getCurrentPageFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('page')) || 1;
};


previousButtonOfic.onclick = (e) => {
    e.preventDefault();
    currentPage = getCurrentPageFromUrl();

    if (currentPage > 1) {
        currentPage--;

        const newUrl = `http://localhost:8080/realtimeproducts?page=${currentPage}`;
        window.location.href = newUrl;
    }

};

nextButtonOfic.onclick = (e) => {
    e.preventDefault()
    currentPage = getCurrentPageFromUrl() || 1;

    currentPage++;

    const newUrl = `http://localhost:8080/realtimeproducts?page=${currentPage}`;
    window.location.href = newUrl;
}

const paginationInfoNumber = () => {
    const currentPage = getCurrentPageFromUrl();
    const nextPage = currentPage + 1;

    if (getData) {
        const totalPages = getData.pages;

        const currentPage = getCurrentPageFromUrl();

        if (currentPage >= totalPages) {
            paginationInfo.innerHTML = `
        <p class="paginationInfoNumbers"> <span class="paginationCurrentPage">${currentPage}</span></p>
    `;
        } else {
            paginationInfo.innerHTML = `
        <p class="paginationInfoNumbers"> <span class="paginationCurrentPage">${currentPage}</span> / ${nextPage}</p>
    `;
        }
    }
}
paginationInfoNumber();
fetchInfo();

// ADD TO CART

let addToCartButtons = document.querySelectorAll('.addToCart');
let cartID = localStorage.getItem('cartID');

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        console.log("Button clicked!");
        e.preventDefault();

        let idProduct = button.getAttribute('data-product-id');
        console.log(idProduct)
        console.log(cartID)

        if (cartID) {
            console.log("Making request to add product to cart...");
            fetch(`/api/cart/${cartID}/products/${idProduct}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ quantity: 1 })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (data.status == "error") {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: data.message,
                            timer: 3000
                          })
                    } else {
                        Swal.fire({
                            icon: "success",
                            title: data.title,
                            text: data.message,
                            timer: 3000
                          })
                    }
                })
                .catch(error => {
                    console.log(error)
                    console.error("Error al enviar los datos:", error);
                });
        } else {
            console.log("Creating a new cart and adding product...");
            fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(data => {
                cartID = data.message._id;
                localStorage.setItem('cartID', cartID);
    
                fetch(`/api/cart/${cartID}/products/${idProduct}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ quantity: 1 })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                    })
                    .catch(error => {
                        console.error("Error al enviar los datos:", error);
                    });
    
            })
            .catch(error => {
                console.error("Error al enviar los datos:", error);
            });
        }
    });
});

/// CART BOX

let cartNumberProds = document.getElementById("cartNumber");
const cartContainer = document.getElementById("cartContainer");
let producCant 

const toggleCartContainer = () => {
    if (!cartID) {
        cartContainer.style.display = 'none';
    } else {
        cartContainer.style.display = 'block';
        showCantProds();
    }
}

const showCantProds = async () => {
    try {
        const response = await fetch(`/api/cart/${cartID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        const productsList = data.getProducts.products;

        producCant = 0;

        for (const product of productsList) {
            producCant += product.quantity;
        }

        cartNumberProds.innerText = producCant;
    } catch (error) {
        console.error("Error al recuperar datos del archivo JSON:", error);
    }
}

cartContainer.onclick = () => {
    window.location.href = `http://localhost:8080/cart/${cartID}`;
}


toggleCartContainer();

//PRODUCTS

let showMoreButtons = document.querySelectorAll(".showMoreBtn");

showMoreButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        let idProduct = e.currentTarget.getAttribute('data-product-id');
        window.location.href = `http://localhost:8080/products/${idProduct}`;
    });
});