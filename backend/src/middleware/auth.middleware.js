// Legacy JWT / cookie-based auth middleware (used for routes that issue
// a JWT stored in an httpOnly cookie rather than a Firebase Bearer token).
// For Firebase token verification see middleware/auth.js (verifyToken).
import jwt from 'jsonwebtoken';

async function authAdmin(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: "You don't have access" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    // Log at debug level only — avoid leaking token details
    console.debug('[authAdmin] Token verification failed:', err.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

async function authUser(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'user') {
      return res.status(403).json({ message: "You don't have access" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.debug('[authUser] Token verification failed:', err.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

export { authAdmin, authUser };