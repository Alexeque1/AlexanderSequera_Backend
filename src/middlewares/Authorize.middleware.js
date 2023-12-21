export const authorizeAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'ADMIN') {
      next();
    } else {
      res.status(403).json({ error: 'Acceso prohibido para este usuario' });
    }
  };

export const authorizeUser = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'USER') {
      next();
    } else {
      res.status(403).json({ error: 'Acceso prohibido para este usuario' });
    }
};