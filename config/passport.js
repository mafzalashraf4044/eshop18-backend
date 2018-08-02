//passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password' }, async (email, password, proceed)  => {
  const user = _.head(await User.find({email}));
  if (!user) {
    return proceed(null, false, {message: 'Invalid credentials.'});
  } else {
    const isPwdMatched = await bcrypt.compare(password, user.password);
    
    if (isPwdMatched) {
      return proceed(null, user, {message: 'Login Successful.'}); 
    } else {
      return proceed(null, false, {message: 'Invalid credentials.'});
    }
  }
}));