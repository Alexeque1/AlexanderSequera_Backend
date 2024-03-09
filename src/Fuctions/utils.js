export function generateRandomCode(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      code += charset[randomIndex];
    }
    return code;
}

export const generateAlertMessage = (icon, title, message) => {
    Swal.fire({
        icon: icon,
        title: title,
        text: message,
        timer: 3000
      });
}

export const generateToken = (user) => {
  return jwt.sign(user, config.jwt_key)
}

export const isTokenValid = (token, createdAt) => {
  if (!token) {
      return false;
  }

  const expirationTime = new Date(createdAt).getTime() + 3600000; // 1 hora en milisegundos
  const currentTime = new Date().getTime();

  if (currentTime > expirationTime) {
      return false;
  }

  // El token es válido
  return true;
};

export function getProfilePhoto(documents) {
  if (!documents || documents.length === 0) {
      return "/IMG/userNotLogged.png";
  }

  const profileImage = documents.find(document => document.name === "profileImage");
  return profileImage ? profileImage.document : "/IMG/userNotLogged.png";
}

export function documentsVerifier(documents) {
  if (!documents || documents.length === 0) {
      return "/IMG/userNotLogged.png";
  }

  const profileImage = documents.find(document => document.name === "profileImage");
  return profileImage ? profileImage.document : "/IMG/userNotLogged.png";
}