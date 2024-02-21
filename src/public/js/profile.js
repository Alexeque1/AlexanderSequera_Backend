// FUNCIONES

function getCookieValue(cookieName) {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim(); 
        if (cookie.startsWith(cookieName + '=')) {
            return decodeURIComponent(cookie.substring(cookieName.length + 1));
        }
    }

    return null;
}

function getSVG(uploaded) {
    if (uploaded == true ) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="28.45" height="24" viewBox="0 0 32 27"><path fill="green" d="M26.99 0L10.13 17.17l-5.44-5.54L0 16.41L10.4 27l4.65-4.73l.04.04L32 5.1z"/></svg>`;
    } else if (uploaded == false) {
        return ` <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="red" d="M15.854 12.854L11 8l4.854-4.854a.503.503 0 0 0 0-.707L13.561.146a.499.499 0 0 0-.707 0L8 5L3.146.146a.5.5 0 0 0-.707 0L.146 2.439a.499.499 0 0 0 0 .707L5 8L.146 12.854a.5.5 0 0 0 0 .707l2.293 2.293a.499.499 0 0 0 .707 0L8 11l4.854 4.854a.5.5 0 0 0 .707 0l2.293-2.293a.499.499 0 0 0 0-.707"/></svg>`;
    }
}

function innerTextToRole(user, element) {
    if (user.role === "USER") {
        element.innerText = "Cuenta normal";
    } else if (user.role === "ADMIN") {
        element.innerText = "Cuenta tipo administrador";
    } else if (user.role === "PREMIUM") {
        element.innerText = "Cuenta premium";
    }
}

// NOMBRE DEL USUARIO
const userData = getCookieValue("user")
const jsonUserData = userData.substring(2);
console.log(jsonUserData)

let userObject

if (jsonUserData) {
    try {
        userObject = JSON.parse(jsonUserData);
        console.log("Data del usuario:", userObject);
    } catch (error) {
        console.error("Error al parsear la cookie:", error);
    }
} else {
    console.log("La cookie 'user' no existe o está vacía.");
}

const profileFullName = document.getElementById('profileBox_name')
profileFullName.innerText  = userObject.name + ' ' + userObject.last_name;



// IR AL CARRITO
const cartID = localStorage.getItem('cartID');
const toCartButton = document.getElementById('toCartProfile');

toCartButton.onclick = () => {
    window.location.href = `http://localhost:8080/cart/${cartID}`;
}

// PHOTO UPLOAD VARIABLES
const uploadPhotoButton = document.getElementById('uploadPhoto')
const uploadPhotoDivBox = document.getElementById('uploadPhotoDivBox')
const closeButton = document.getElementById('photoEnviarButtonClose');
const sendPhoto = document.getElementById('photoEnviarButtonDone');
const userID = userObject.id;

const uploadPhotoForm = document.getElementById('uploadPhotoForm');
const profileImage = document.getElementById('profileImage');

// FETCH PARA OBTENER TODA LA DATA DEL USUARIO
fetch(`/api/user/${userID}`, {
    method: 'GET',
    headers: {
        "Content-Type": "application/json"
    }
})
.then(response => response.json())
.then(data => {
    if (data) {
        // Código para manipular la respuesta del servidor y actualizar el DOM
        const profilePhotoPath = data.payload.documents.find(doc => doc.name === "profileImage")
        // OBTENER FOTO DE PERFIL
        if (data.payload.documents.length > 0) {
            if(profilePhotoPath) {
                profileImage.src = profilePhotoPath.document;
            } else {
                profileImage.src = "/IMG/userNotLogged.png"
            }
        } else {
            profileImage.src = "/IMG/userNotLogged.png"
            console.error('El usuario no tiene documentos de perfil.');
        }

        // ACTUALIZAR VERIFICACIÓN DE DOCUMENTOS
        let identification = false;
        let address = false;
        let account = false;
        const documents = data.payload.documents;

        for (let i = 0; i < documents.length; i++) {
            const documentsName = documents[i].name;
            if (documentsName === "identificacion") {
                identification = true;
            } else if (documentsName === "comprobanteDomicilio") {
                address = true;
            } else if (documentsName === "comprobanteEstadoCuenta") {
                account = true;
            }
        }

        identificationVerification.innerHTML = getSVG(identification);
        addressVerification.innerHTML = getSVG(address);
        accountVerification.innerHTML = getSVG(account);
        const profileBox_accountType = document.getElementById('profileBox_accountType')
        
        // ACTUALIZAR EL ROL DEL USUARIO
        innerTextToRole(data.payload, profileBox_accountType); // Se asume que el rol del usuario está disponible en data.payload

    } else {
        console.error('No se recibió data del servidor');
    }
})
.catch(error => console.error('Error al obtener la información del usuario:', error));

// UPLOAD DOCUMENTS

const uploadFormDocuments = document.getElementById('uploadForm')

uploadFormDocuments.onsubmit = (e) => {
    e.preventDefault();
    const uploadPhotoButtonFiles = document.getElementById('documentoEnviar')
    const selectElement = document.getElementById('tipoDocumento').value;

    const userID = userObject.id;
    const file = uploadPhotoButtonFiles.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('documents', file); 
        formData.append('documentType', selectElement); 

        fetch(`/api/user/${userID}/documents`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === "error") {
                alertMessage(data.status,"Error",data.message)
            } else {
                alertMessage(data.status,"¡Exito!",data.message)
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        })
        .catch(error => console.error('Error al cargar la imagen:', error));
    } else {
        alertMessage("error","Error","No se ha seleccionado ningún archivo");
    }
}

// CAMBIAR ROLE

const toChangeRole = document.getElementById('toChangeRole')

toChangeRole.onclick = (e) => {
    e.preventDefault()
    fetch(`/api/user/premium/${userID}`, {
        method: 'PUT',
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === "error") {
            alertMessage(data.status,"Error",data.message)
        } else {
            alertMessage(data.status,"¡Exito!",data.message)
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    })
    .catch(error => console.error('Error al cargar la imagen:', error));
}

// SUBIR FOTO DE PERFIL
uploadPhotoButton.onclick = (e) => {
    if (uploadPhotoDivBox.style.display === 'none' || uploadPhotoDivBox.style.display === '') {
        uploadPhotoDivBox.style.display = 'flex';
    } else {
        uploadPhotoDivBox.style.display = 'none';
    }
}

const fileInput = document.getElementById('photoEnviar');

photoEnviarButtonDone.onclick = (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('photoEnviar');
    const file = fileInput.files[0];

    if (!file) {
        alertMessage("error","Error","No se ha seleccionado ningún archivo");
        return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    const userID = userObject.id;

    fetch(`/api/user/${userID}/profileImage`, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alertMessage(data.status, "¡Éxito!", data.message);
            console.log(data.imageUrl)
            profileImage.src = data.imageUrl;
        } else {
            alertMessage(data.status, "Error", data.message);
        }
    })
    .catch(error => console.error('Error al subir la foto de perfil:', error));
}

const selectedFileMessage = document.getElementById('selectedFileMessage');

fileInput.addEventListener('change', function() {
    if (this.files.length > 0) {
        selectedFileMessage.innerHTML = `<p class="textPhotoSelected">Se ha subido el archivo <span class="textPhotoSelectedSpan">${this.files[0].name}</span></p>`
    } else {
        console.log('No se ha seleccionado ningún archivo');
    }
});

closeButton.onclick = () => {
    if (uploadPhotoDivBox.style.display === 'flex') {
        uploadPhotoDivBox.style.display = 'none';
    }
}