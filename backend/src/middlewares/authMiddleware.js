const firebaseAuth = require("../config/firebase");

function authenticate({ checkRevoked = false } = {}) {
  return async (req, res, next) => {
    const authorization = req.get("authorization");
    try {
      const token = authorization?.replace(/^Bearer\s+/i, "");
      if (!token) return res.status(401).json({ message: "Autenticação necessária." });
      req.user = await firebaseAuth.verifyIdToken(token, checkRevoked);
    } catch {
      return res.status(401).json({ message: "Sessão inválida." });
    }
    return next();
  };
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Acesso administrativo necessário." });
  return next();
}

module.exports = { authenticate, requireAdmin };
