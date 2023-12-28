
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

