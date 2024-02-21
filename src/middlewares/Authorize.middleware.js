export const authorizeAdmin = (req, res, next) => {
  const user = req.session.user
  console.log(user)
    if (user && (user.role === 'ADMIN' || user.role === 'PREMIUM')) {
        next();
    } else {
        return res.status(403).json({ message: 'Acceso prohibido para este usuario' });
    }
};

export const authorizePremium = (req, res, next) => {
  if (req.isAuthenticated() && req.user && (req.user.role === 'PREMIUM')) {
      next();
  } else {
      return res.status(403).json({ message: 'Acceso prohibido para este usuario' });
  }
};

export const authorizeUser = (req, res, next) => {
    if (req.isAuthenticated() || req.session.user.role === 'USER') {
      next();
    } else {
      res.status(403).json({ error: 'Acceso prohibido para este usuario' });
    }
};