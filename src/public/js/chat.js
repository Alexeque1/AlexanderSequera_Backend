const socketClientChat = io();
let user;

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
    }
}).then((input) => {
    if (input.value) {
        user = input.value;

        Swal.fire('Hola', `¡Bienvenido, ${user}!`, 'success');

        socketClientChat.emit("newUser", user);
    } else if (input.dismiss === Swal.DismissReason.cancel) {
        window.location.href = 'http://localhost:8080/realtimeproducts';
    }
});

socketClientChat.on("newUsernew", (newuser) => {
    console.log("newuser");
});
