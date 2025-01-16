const { verifyToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    res.status(401).json({ error: error });
  }
};
