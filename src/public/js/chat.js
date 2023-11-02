const socketClientChat = io()

let user;

let buttonBack = document.getElementById('buttonAlert-chat');
let buttonChatShow = document.getElementById('chatButton-show');
let chatBox = document.getElementById('chat-container-princ');
let userName = document.getElementById('user');
let chatBoxMessages = document.getElementById('chat-messages-box');
let sendMessageBox = document.getElementById('sendMessageChat');

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
    
            socketClientChat.emit("NewUser", user);
        } else if (input.dismiss === Swal.DismissReason.cancel) {
            setTimeout(function () {
                window.location.href = 'http://localhost:8080/realtimeproducts';
            }, 100);
        }
    });
};


socketClientChat.on("NewUsernew", (newuser) => {
    Toastify({
        text: `${newuser} se ha conectado`,
        duration: 3000
    }).showToast();
});

sendMessageBox.onclick = (e) => {
    e.preventDefault();

    let chatUSerMessage = document.getElementById('chatUSerMessage').value; 

    const infoMensaje = {
        username: user,
        message: chatUSerMessage,
    }

    const infoMensajeJSON = JSON.stringify(infoMensaje);

    fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: infoMensajeJSON
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error al enviar los datos:", error);
        });

    renderMessage("my", infoMensaje)

    document.getElementById('chatUSerMessage').value = ""

    socketClientChat.emit("messageSent", infoMensaje)
}

socketClientChat.on("messageSent", (receivedMessage) => {
    renderMessage("other", receivedMessage);
});

//USUARIO DESCONECTADO

socketClientChat.on("userOff", () => {
    Toastify({
        text: `${user} se ha desconectado`,
        duration: 3000
    }).showToast();
});

//FUNCION PARA ENVIAR EL MENSAJE SI ES USUARIO LOCAL O EXTERNO

const renderMessage = (type, messageUser) => {

    if (type == "my") {
        const messageLine = document.createElement("div");
        messageLine.className = "chatLineBoxClient"

        const messageHtml = `
                        <p class="chatUser">You</p>
                        <p> ${messageUser.message} </p>
                    `;

    messageLine.innerHTML = messageHtml;

    chatBoxMessages.appendChild(messageLine);

    } else if (type == "other") {
        const messageLine = document.createElement("div");
        messageLine.className = "chatLineBoxServer";

        const messageHtml = `
                        <p class="chatUser">${messageUser.username}</p>
                        <p> ${messageUser.message} </p>
                    `;

    messageLine.innerHTML = messageHtml;

    chatBoxMessages.appendChild(messageLine);
    }

}

chatBoxMessages.scrollTop = chatBoxMessages.scrollHeight - chatBoxMessages.clientHeight