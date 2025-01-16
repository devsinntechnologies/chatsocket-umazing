const jwt = require('jsonwebtoken');

module.exports = {
  generateToken: (user) => {
    return jwt.sign(
      { id: user.id, email: user.email },
      'umazing-key_jwt_secret_key',
    );
  },
  verifyToken: (token) => {
    return jwt.verify(token, 'umazing-key_jwt_secret_key');
  },
};
