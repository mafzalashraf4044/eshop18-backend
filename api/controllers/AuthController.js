/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports = {

  login: function (req, res) {
    passport.authenticate('local', {
      session: false
    }, (err, user, message) => {

      if (err || !user) {
        return res.status(400).json({ message, user });
      }

      req.login(user, {
        session: false
      }, (err) => {
        if (err) {
          res.send(err);
        }
        // generate a signed json web token with the contents of user object and return it in the response
        const token = jwt.sign(user, 'your_jwt_secret', { expiresIn: '7d' });
        return res.status(200).json({ user, token });
      });
    })(req, res);
  },

  logout: function(req, res) {
    req.logout();
    res.status(200).json({ msg: 'Logout successful.' })
  },

  // login: async (req, res) => {
  //   /**
  //   * Params:
  //   * - email
  //   * - username
  //   * - password
  //   */

  //   sails.log('UsersController::login called');

  //   const params = req.allParams();  
    
  //   if (!(params.email || params.username) && !params.password) {
  //     return res.status(400).json({msg: 'Invalid credentials1.'});
  //   }

  //   const user = _.head(await User.find({
  //     or : [
  //       { email: params.email },
  //       { username: params.username },
  //     ],
  //   }));

  //   sails.log('req.session.user', req.session.user);

  //   const isMatched = await bcrypt.compare(params.password, user.password);

  //   if (isMatched) {
  //     req.session.user = user;
  //     return res.status(200).json({msg: 'Login successful.', user});
  //   } else {
  //     return res.status(400).json({msg: 'Invalid credentials2.'});
  //   }

  // }, 
};

