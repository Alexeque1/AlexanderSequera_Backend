// FUNCTIONS
function getSVG(uploaded) {
    if (uploaded == true) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="28.45" height="24" viewBox="0 0 32 27"><path fill="green" d="M26.99 0L10.13 17.17l-5.44-5.54L0 16.41L10.4 27l4.65-4.73l.04.04L32 5.1z"/></svg>`;
    } else if (uploaded == false) {
        return ` <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="red" d="M15.854 12.854L11 8l4.854-4.854a.503.503 0 0 0 0-.707L13.561.146a.499.499 0 0 0-.707 0L8 5L3.146.146a.5.5 0 0 0-.707 0L.146 2.439a.499.499 0 0 0 0 .707L5 8L.146 12.854a.5.5 0 0 0 0 .707l2.293 2.293a.499.499 0 0 0 .707 0L8 11l4.854 4.854a.5.5 0 0 0 .707 0l2.293-2.293a.499.499 0 0 0 0-.707"/></svg>`;
    }
}

function getCookie(name) {
    const cookiesArray = document.cookie.split(';');
    for (let i = 0; i < cookiesArray.length; i++) {
        const cookie = cookiesArray[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

const userRemoved = getCookie('userRemoved');


/// BUSQUEDA DE USUARIO

const searchInput = document.getElementById('searchUsers');
const userListContainer = document.querySelector('.listUsersContainer_list');

searchInput.addEventListener('input', function () {
    const searchText = this.value.toLowerCase();

    const userItems = userListContainer.querySelectorAll('.listUsersContainer_box');

    userItems.forEach(function (userItem) {
        const userName = userItem.querySelector('h2').textContent.toLowerCase();
        if (userName.includes(searchText)) {
            userItem.style.display = 'flex';
        } else {
            userItem.style.display = 'none';
        }
    });
});

// IR AL PERFIL
const showProfileData = document.querySelectorAll('.showProfileData');

showProfileData.forEach(button => {
    button.addEventListener("click", (e) => {
        const userId = button.parentElement.getAttribute('data-user-id');
        window.location.href = `http://localhost:8080/profile/user/${userId}`;
    });
});

// BOTON PARA ELIMINAR

const removeUserButton = document.querySelectorAll("#toRemoveUserProfile");

removeUserButton.forEach(button => {
    button.addEventListener("click", function () {
        const userId = button.closest('.listUsersContainer_box').getAttribute('data-user-id');
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Estás a punto de eliminar a est@ usuari@",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/api/user/remove/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error('Error al eliminar el usuario.');
                    })
                    .then(data => {
                        alertMessage("success", "¡Hecho!", data.message);
                        setTimeout(function () {
                            window.location.href = 'http://localhost:8080/manageusers';
                        }, 3500);
                    })
                    .catch(error => console.error('Error al obtener la información del usuario:', error));
            }
        });
    });
});
