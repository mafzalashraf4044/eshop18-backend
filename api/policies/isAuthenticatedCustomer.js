const passport = require('passport');

module.exports = (req, res, proceed) => {
  passport.authenticate('jwt', {
    session: false
  }, (err, user) => {
    if (err || !user || (user && user.role === '__admin')) {
      return res.forbidden();
    } else {
      req.user = user;
      proceed();
    }
  })(req, res);
}