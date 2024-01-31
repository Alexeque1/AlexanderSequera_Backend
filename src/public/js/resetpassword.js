const alertMessage = (icon, title, message) => {
    Swal.fire({
        icon: icon,
        title: title,
        text: message,
        timer: 3000
      });
  }
  

// RESET PASSWORD
let resetPasswordButton = document.getElementById("resetPasswordButton");

resetPasswordButton.onclick = () => {
    let resetEmail = document.getElementById("login_email_reset").value;
    let resetPassword = document.getElementById("login_newpassword_reset").value;

    if (resetEmail == "" || resetPassword == "") {
       alertMessage("error", "Error", "Está faltando algún dato");
    }

    const formDataJson = {
      email: resetEmail,
      newPassword: resetPassword
  };

    fetch("/api/sessions/resetpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formDataJson)
    })
      .then(response => response.json())
      .then(data => {
        if (data.error === "Error") {
          alertMessage("error", data.error, data.message);
      } else if (data.state === "resetpas") {
          alertMessage("success", "¡Hecho!", data.message);
          setTimeout(function () {
            window.location.href = 'http://localhost:8080/login';
        }, 3000);
      }
      })
      .catch(error => {
        console.error("Error al enviar los datos:", error);
      });
}