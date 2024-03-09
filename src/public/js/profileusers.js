// FUNCTIONS
function tienePropiedades(arrayObjetos) {
    for (const objeto of arrayObjetos) {
        if ('name' in objeto) {
            const nombre = objeto.name;
            if (nombre === 'identificacion' && nombre === 'comprobanteDomicilio' && nombre === 'comprobanteEstadoCuenta') {
                return true;
            }
        }
    }
    return false;
}

const profileBoxes = document.querySelectorAll(".profileFullBox");
let profileDocuments = []
let userProfileID

function getSVG(uploaded) {
    if (uploaded) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="28.45" height="24" viewBox="0 0 32 27"><path fill="green" d="M26.99 0L10.13 17.17l-5.44-5.54L0 16.41L10.4 27l4.65-4.73l.04.04L32 5.1z"/></svg>`;

    } else {
        return ` <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="red" d="M15.854 12.854L11 8l4.854-4.854a.503.503 0 0 0 0-.707L13.561.146a.499.499 0 0 0-.707 0L8 5L3.146.146a.5.5 0 0 0-.707 0L.146 2.439a.499.499 0 0 0 0 .707L5 8L.146 12.854a.5.5 0 0 0 0 .707l2.293 2.293a.499.499 0 0 0 .707 0L8 11l4.854 4.854a.5.5 0 0 0 .707 0l2.293-2.293a.499.499 0 0 0 0-.707"/></svg>`;
    }
}

profileBoxes.forEach(profileBox => {
    const userProfileId = profileBox.getAttribute("data-userprofile-id");
    userProfileID = profileBox.getAttribute("data-userprofile-id");
    const identificationVerification = profileBox.querySelector("#identificationVerificationUserProfile");
    const addressVerification = profileBox.querySelector("#addressVerificationUserProfile");
    const accountVerification = profileBox.querySelector("#accountVerificationUserProfile");

    fetch(`/api/user/${userProfileId}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                let identification = false;
                let address = false;
                let account = false;
                const documents = data.payload.documents;
                profileDocuments = data.payload.documents

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
            } else {
                console.error('No se recibió data del servidor');
            }
        })
        .catch(error => console.error('Error al obtener la información del usuario:', error));
});

// BOTON CAMBIAR ROLE
const changeRoleButtons = document.querySelectorAll("#toChangeRoleProfile");
const changeRoleContainer = document.querySelector(".changeRoleContainer");
const ChangeRoleProfileClose = document.querySelector("#ChangeRoleProfileClose");
const toChangeRoleProfileSubmit = document.querySelector("#toChangeRoleProfileSubmit");

changeRoleButtons.forEach(button => {
    button.addEventListener("click", function () {
        if (changeRoleContainer.style.display === 'none' || changeRoleContainer.style.display === '') {
            changeRoleContainer.style.display = 'flex';
        } else {
            changeRoleContainer.style.display = 'none';
        }
    });
});

ChangeRoleProfileClose.onclick = (e) => {
    e.preventDefault();
    if (changeRoleContainer.style.display === 'flex') {
        changeRoleContainer.style.display = 'none';
    }
};

const toChangeRoleForm = document.getElementById('toChangeRoleForm');
const optionToChangeRole = document.getElementById('optionToChangeRole');
const profileBox_accountType = document.querySelector('.profileBox_accountType');

toChangeRoleForm.onsubmit = (e) => {
    e.preventDefault();
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';

    const selectedRole = optionToChangeRole.value;
    const currentRole = profileBox_accountType.textContent.trim().split(' ')[2];
    console.log(userProfileID)
    console.log(selectedRole)

    if (selectedRole === currentRole) {
        setTimeout(() => {
            alertMessage("error", "Error", `El usuario ya tiene el rol ${selectedRole}. Por favor, seleccione otro rol.`);
            loadingIndicator.style.display = 'none';
        }, 3000);
    } else {
        let checkPropiedades = false

        if (selectedRole === "PREMIUM") {
            checkPropiedades = tienePropiedades(profileDocuments)
        }

        if ((checkPropiedades || (selectedRole === "ADMIN" || selectedRole === "USER"))) {
            fetch(`/api/user/changerole/${userProfileID}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ selectedRole: selectedRole })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "error") {
                        setTimeout(() => {
                            alertMessage(data.status, "Error", data.message);
                            loadingIndicator.style.display = 'none';
                        }, 3000);
                    } else {
                        profileBox_accountType.innerText = `Cuenta tipo ${selectedRole}`;
                        setTimeout(() => {
                            alertMessage(data.status, "¡Hecho!", data.message);
                            loadingIndicator.style.display = 'none';
                            changeRoleContainer.style.display = 'none'
                        }, 3000);
                    }
                })
                .catch(error => console.error('Error al obtener la información del usuario:', error));
        } else if (!checkPropiedades) {
            setTimeout(() => {
                alertMessage("error", "Error", `El usuario no ha subido la documentación necesaria, no se puede cambiar de rol a PREMIUM.`);
                loadingIndicator.style.display = 'none';
            }, 3000);
        }
    }

}