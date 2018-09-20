//passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password' }, async (email, password, proceed)  => {
  const user = _.head(await User.find({email}));

  if (!user) {
    return proceed(null, null, {details: 'The email or password you entered is wrong, please try again.'});
  } else {
    const isPwdMatched = await bcrypt.compare(password, user.password);
    
    if (isPwdMatched) {
      if (!user.isEmailVerified) {
        return proceed(null, null, {details: 'Email verifcation is required.'});
      } else {
        return proceed(null, user, {details: 'Login Successful.'}); 
      }
    } else {
      return proceed(null, null, {details: 'The email or password you entered is wrong, please try again.'});
    }
  }
}));

const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
  },
  function (jwtPayload, cb) {

    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return User.findOne({id: jwtPayload.id})
      .then(user => {
        return cb(null, user);
      })
      .catch(err => {
        return cb(err);
      });
  }
));