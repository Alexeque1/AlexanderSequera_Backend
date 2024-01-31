const alertMessage = (icon, title, message) => {
  Swal.fire({
      icon: icon,
      title: title,
      text: message,
      timer: 3000
    });
}

//LOG IN

//Esta variable contendrá el nombre del usuario
let userName = ''

let showLogin = (name) => {
  contenedor1.style.display = "none";
  welcomeDiv.style.display = "block";
  welcomeDiv.innerHTML = `<p class="title-text">Bienvenido, ${name}</p>`;
}


let mostrarPassword = (passwordInput) => {
  if (passwordInput.type == 'password') {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
};

let isPasswordText = (password) => {
  if (password.type === 'password') {
    password.type = 'text';
  }
  return password;
};

let show

let signLog = document.getElementById('signUp');
let contenedor1 = document.getElementById('formVisible1');
let contenedor2 = document.getElementById('formVisible2');

signLog.onclick = function () {
  if (contenedor1.style.display === 'block' || contenedor1.style.display === '') {
    contenedor2.style.display = 'block';
    contenedor1.style.display = 'none';
  }
};

let btnMostrar = document.getElementById('btn_button');
let passwordInput = document.getElementById('login_password');

btnMostrar.onclick = () => {
  mostrarPassword(passwordInput);
};

let loginButton = document.getElementById("login_button");
let welcomeDiv = document.getElementById("welcomeDiv");

loginButton.onclick = () => {
  let loginEmail = document.getElementById("login_email").value;
  let loginPassword = document.getElementById("login_password").value;
  let isTextPasswordLogin = isPasswordText(loginPassword);

  if (loginEmail == '' || loginPassword == '') {
    Swal.fire({
      icon: "error",
      title: "Ups, algo falta",
      text: "Tiene que completar todos los datos",
      timer: 3000
    });
    return "Ups"
  }

  let formData = {
    email: loginEmail,
    password: isTextPasswordLogin,
  };

  let formDataJSON = JSON.stringify(formData);

  fetch("/api/sessions/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: formDataJSON
  })
    .then(response => response.json())
    .then(data => {
      if (data.state == "error") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message,
          timer: 3000
        });
        return "Ups"
      } else if (data.state == "login") {
        const user = data.name
        userName = data.name
        showLogin(user);

        setTimeout(function () {
          window.location.href = 'http://localhost:8080/realtimeproducts';
        }, 1500);
      }
    })
    .catch(error => {
      console.error("Error al enviar los datos:", error);
    });
}

// LOGIN GITHUB

//   let btnLoginGithub = document.getElementById('login_button_github');

// btnLoginGithub.onclick = () => {
//   fetch("/api/sessions/auth/github", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json"
//     },
//   })
//     .then(response => response.json())
//     .then(data => {
//       if (data.state == "errorlogin") {
//         Swal.fire({
//           icon: "error",
//           title: data.message,
//           text: "Hay un error de nuestro lado",
//           timer: 3000
//         });
//       } else if (data.state == "githublogin") {
//         const user = data.name
//         userName = data.name
//         showLogin(user);

//         setTimeout(function () {
//           window.location.href = 'http://localhost:8080/realtimeproducts';
//         }, 1500);
//       } else if (data.state == "alreadysignup") {
//         Swal.fire({
//           icon: "success",
//           title: data.message,
//           timer: 2000
//         });
//       }

//     })
//     .catch(error => {
//       console.error("Error al enviar los datos:", error);
//     });
// }


// SING UP

let btnBack = document.getElementById('btn');

btnBack.onclick = function () {
  if (contenedor1.style.display === 'none' || contenedor2.style.display === '') {
    contenedor1.style.display = 'block';
    contenedor2.style.display = 'none';
  }
};

let btnMostrarLogin = document.getElementById("btn_buttonLogin");
let passwordLogin = document.getElementById("loginPassword");

btnMostrarLogin.onclick = () => {
  mostrarPassword(passwordLogin);
};

contenedor2.onsubmit = (e) => {
  e.preventDefault();

  let first_name = document.getElementById("loginName").value;
  let last_name = document.getElementById("loginLastName").value;
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  if (
    first_name.trim() === "" ||
    last_name.trim() === "" ||
    email.trim() === "" ||
    password.trim() === ""
  ) {
    Swal.fire({
      icon: "error",
      title: "Ups, algo falta",
      text: "Tiene que completar todos los datos",
      timer: 3000
    });
    return "Ups"
  } else {
    let formData = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
    };

    let formDataJSON = JSON.stringify(formData);

    fetch("/api/sessions/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: formDataJSON
    })
      .then(response => response.json())
      .then(data => {
        if (data.state == "incompleted") {
          Swal.fire({
            icon: "error",
            title: "Ups, algo falta",
            text: "Tiene que completar todos los datos",
            timer: 3000
          });
        } else if (data.state == "registered") {
          Swal.fire({
            icon: "error",
            title: data.message,
            text: "Por favor, verifique el email",
            timer: 3000
          });
        } else if (data.state == "alreadysign") {
          Swal.fire({
            icon: "success",
            title: data.message,
            timer: 2000
          });

          first_name = document.getElementById("loginName").value = '';
          last_name = document.getElementById("loginLastName").value = '';
          email = document.getElementById("loginEmail").value = '';
          password = document.getElementById("loginPassword").value = '';
        }
      })
      .catch(error => {
        console.error("Error al enviar los datos:", error);
      });
  }

}

// FORGOT PASSWORD

let forgotPasswordContainer = document.getElementById("forgotPasswordContainer");
let isForgotPasswordVisible = false;

forgotPassword.onclick = () => {
  isForgotPasswordVisible = !isForgotPasswordVisible;

  if (isForgotPasswordVisible) {
    if (forgotPasswordContainer.style.display !== 'flex') {
      forgotPasswordContainer.innerHTML = '';

      forgotPasswordContainer.style.display = 'flex';
      const forgotPasswordForm = `
        <div class='itemPicture forgotpassword_box'>
          <label class="formLabel" for="email_login">Correo Electronico</label>
          <div class="formAlign_second">
              <input class="formInput" type="email" name="correo_electronico_forgot" id="login_email_forgot">
          </div>
          <div>
              <button class="btn btn_gray" type="button" id="forgotpassword_button_send">Mandar email</button>
              <button class="btn btn_gray" type="button" id="forgotpassword_button_back">Atrás</button>
          </div>
        </div>
      `;
      forgotPasswordContainer.insertAdjacentHTML('beforeend', forgotPasswordForm);

      let forgotpassword_button_back = document.getElementById('forgotpassword_button_back');

      forgotpassword_button_back.onclick = () => {
        isForgotPasswordVisible = !isForgotPasswordVisible;

        if (isForgotPasswordVisible) {
          forgotPasswordContainer.style.display = 'flex';
        } else {
          forgotPasswordContainer.style.display = 'none';
        }
      };

      let forgotpassword_button_send = document.getElementById('forgotpassword_button_send');

      forgotpassword_button_send.onclick = async () => {
        let login_email_forgot = document.getElementById('login_email_forgot').value;
    
        let formDataForgot = {
            email: login_email_forgot,
        };
    
        try {
            const response = await fetch("/mail/forgotpassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formDataForgot)
            });
    
            const data = await response.json();
    
            if (data.error === "Error") {
                alertMessage("error", data.error, data.message);
            } else if (data.message === "¡Hecho!") {
                alertMessage("success", data.message, "El email ha sido enviado");
                if (forgotPasswordContainer.style.display === 'flex') {
                  forgotPasswordContainer.style.display = 'none';
                  forgotPasswordContainer.innerHTML = '';
                }
            }
        } catch (error) {
            console.error("Error al enviar los datos:", error);
        }
    };
    }
  } else {
    if (forgotPasswordContainer.style.display === 'flex') {
      forgotPasswordContainer.style.display = 'none';
      forgotPasswordContainer.innerHTML = '';
    }
  }
};


