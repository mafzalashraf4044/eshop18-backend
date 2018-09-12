/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

module.exports = {

  getUsers: async (req, res) => {
    /**
    * Params:
    * - searchTerm
    * - sortBy (ASC or DESC)
    * - sortType
    * - pageNum
    * - pageSize
    */

    sails.log('UsersController::getUsers called');

    const params = req.allParams();
    
    const criteria = {where: {isArchived: false, role: '__customer'}};
    const fields = ['firstName', 'lastName', 'email', 'username', 'country', 'contactNumber'];

    //  search query
    if (params.searchTerm) {
      criteria.where.or = _.map(fields, (field) => ({[field]: {contains: params.searchTerm}}));
    }

    //  pagination
    if ((params.pageNum && params.pageNum > 0) && (params.pageSize && params.pageSize > 0)) {
      criteria.limit = params.pageSize;
      criteria.skip = params.pageSize * (params.pageNum - 1);
    }

    //  sorting
    if ((params.sortType === 'ASC' || params.sortType === 'DESC') && (params.sortBy && fields.indexOf(params.sortBy) !== -1)) {
      criteria.sort = `${params.sortBy} ${params.sortType}`;
    }

    const users = await User.find(criteria)
    .intercept((err) => {
      return err;
    });

    return res.status(200).json({users});

  },

  createUser: async (req, res) => {
    /**
     * Params:
     * - firstName (req)
     * - lastName (req)
     * - username
     * - email (req)
     * - password (req)
     * - country (req)
     * - contactNumber (req)
    */

    sails.log('UsersController:: createUser called');

    const saltRounds = 10;
    const params = req.allParams();
    
    /**
     * Email field is unique for each user, user will be created
     * only if no existing user has the same email address
     * 
     */

    //  Feilds Pattern Validation
    if (params.firstName && !/^[a-zA-Z][a-zA-Z]+[a-zA-Z]$/.test(params.firstName)) {
      return res.json(400, {details: 'First name is invalid.'});
    } else if (params.lastName && !/^[a-zA-Z][a-zA-Z]+[a-zA-Z]$/.test(params.lastName)) {
      return res.json(400, {details: 'Last name is invalid.'});
    } else if (params.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email)) {
      return res.json(400, {details: 'Email is invalid.'});
    } else if (params.username && !/^[a-zA-Z0-9][a-zA-Z0-9]+[a-zA-Z0-9]$/.test(params.username)) {
      return res.json(400, {details: 'Username is invalid.'});
    }

    const user = await User.create({
      firstName: params.firstName,
      lastName: params.lastName,
      username: params.username,
      email: params.email,
      password: params.password,
      country: params.country,
      contactNumber: params.contactNumber,
    })
    .intercept('E_UNIQUE', (err)=> {
      return 'Email or username already exists.';
    }).intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({user});
  },

  updateUser: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
     * - firstName (req)
     * - lastName (req)
     * - username
     * - email (req)
     * - country (req)
     * - contactNumber (req)
    */

    sails.log('UsersController:: updateUser called');

    const params = req.allParams();

    //  Feilds Pattern Validation
    if (params.firstName && !/^[a-zA-Z][a-zA-Z]+[a-zA-Z]$/.test(params.firstName)) {
      return res.json(400, {details: 'First name is invalid.'});
    } else if (params.lastName && !/^[a-zA-Z][a-zA-Z]+[a-zA-Z]$/.test(params.lastName)) {
      return res.json(400, {details: 'Last name is invalid.'});
    } else if (params.username && !/^[a-zA-Z0-9][a-zA-Z0-9]+[a-zA-Z0-9]$/.test(params.username)) {
      return res.json(400, {details: 'Username is invalid.'});
    }

    const user = await User.update({id: params.id, isArchived: false}, {
      firstName: params.firstName,
      lastName: params.lastName,
      username: params.username,
      country: params.country,
      contactNumber: params.contactNumber,
    }).intercept('E_UNIQUE', (err)=> {
      return 'Email or username already exists.';
    }).intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({user: _.head(user)});
  },

  deleteUser: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
    */

    sails.log('UsersController:: deleteUser called');

    const params = req.allParams();

    const user = await User.update({id: params.id, isArchived: false, role: '__customer'}, {
      isArchived: true,
    }).intercept((err) => {
      return err;
    }).fetch();

    if (!user) {
      return res.status(404).json({details: 'User does not exist.'});
    } else {
      return res.status(200).json({details: 'User deleted successfully.'});
    }
    
  },

  updateVerfiedStatus: async (req, res) => {
    /**
     * Params:
     * - isVerified (req)
     * - id (req, query param)
     */

    sails.log('UsersController:: updateVerfiedStatus called');

    const params = req.allParams();

    if (_.isUndefined(params.isVerified)) {
      return res.json(400, {details: 'Field isVerified is required.'});
    }

    const user = await User.update({id: params.id, isArchived: false, role: '__customer'}, {
      isVerified: params.isVerified,
    }).intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({user: _.head(user)});

  },

  verifyEmail: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
     * - emailVerifyHash (req)
     */

    sails.log('UsersController:: updateVerfiedStatus called');

    const params = req.allParams();

    if (_.isUndefined(params.emailVerifyHash)) {
      return res.json(400, {
        details: 'Field emailVerifyHash is required.'
      });
    }

    const user = await User.findOne({id: params.id}).intercept((err) => {
      return err;
    });

    if (user.emailVerifyHash === params.emailVerifyHash) {
      await User.update({id: params.id, isArchived: false, role: '__customer'}, {
        isEmailVerified: true,
      }).intercept((err) => {
        return err;
      });
    }

    return res.status(200).json({details: "User email verified successfully."});

  },

  sendEmailToList: async (req, res) => {
    /**
     * Params:
     * - emails (req)
     * - subject (req)
     * - content (req)
     */

    sails.log('UsersController:: sendEmailToList called');

    const params = req.allParams();

    if (_.isUndefined(params.subject) || _.isUndefined(params.content) || _.isUndefined(params.subject) || _.isUndefined(params.emails) || (params.email && params.email.length === 0)) {
      return res.json(400, {details: 'Invalid arguments provided.'});
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {user: 'muhammadafzal3303@gmail.com', pass: 'ebuyexchange-testing'}
    });

    const mailOptions = {
      from: 'support@ebuyexchange.com', // sender address
      to: params.emails, // list of receivers
      subject: params.subject, // Subject line
      html: params.content,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        sails.log(err)
      else
        sails.log(info);
    });

    return res.status(200).json({details: "Email sent successfully."});

  },

  getUserOrdersAndAccounts: async (req, res) => {
    /**
    * Params:
    * - id (req, query param)
    */

   sails.log('UsersController::getUserOrdersAndAccounts called');

   const params = req.allParams();
   
   const orders = await Order.find({user: params.id})
   .intercept((err) => {
    return err;
   });

   const accounts = await Account.find({owner: params.id})
   .populate('eCurrency')
   .populate('paymentMethod')
   .intercept((err) => {
    return err;
   });

   return res.status(200).json({orders, accounts});
  },

  registerUser: async (req, res) => {
    /**
     * Params:
     * - firstName (req)
     * - lastName (req)
     * - username
     * - email (req)
     * - password (req)
     * - country (req)
     * - contactNumber (req)
    */

    sails.log('UsersController:: registerUser called');

    const params = req.allParams();
    
    /**
     * Email field is unique for each user, user will be created
     * only if no existing user has the same email address
     * 
     */

    //  Feilds Pattern Validation
    if (params.firstName && !/^[a-zA-Z][a-zA-Z]+[a-zA-Z]$/.test(params.firstName)) {
      return res.json(400, {details: 'First name is invalid.'});
    } else if (params.lastName && !/^[a-zA-Z][a-zA-Z]+[a-zA-Z]$/.test(params.lastName)) {
      return res.json(400, {details: 'Last name is invalid.'});
    } else if (params.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email)) {
      return res.json(400, {details: 'Email is invalid.'});
    } else if (params.username && !/^[a-zA-Z0-9][a-zA-Z0-9]+[a-zA-Z0-9]$/.test(params.username)) {
      return res.json(400, {details: 'Username is invalid.'});
    }

    const current_date = (new Date()).valueOf().toString();
    const random = Math.random().toString();
    const emailVerifyHash = crypto.createHash('sha1').update(current_date + random).digest('hex');

    const user = await User.create({
      emailVerifyHash,
      firstName: params.firstName,
      lastName: params.lastName,
      username: params.username,
      email: params.email,
      password: params.password,
      country: params.country,
      contactNumber: params.contactNumber,
    })
    .intercept('E_UNIQUE', (err)=> {
      return 'Email or username already exists.';
    }).intercept((err) => {
      return err;
    }).fetch();

    const config = _.head(await Config.find().limit(1)
    .intercept((err) => {
      return err;
    }));
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {user: config.emailAddress, pass: config.emailPwd}
    });

    transporter.sendMail({
      from: config.emailAddress, // sender address
      to: user.email, // list of receivers
      subject: 'eBUYexchange: Verify Your Account', // Subject line
      html: `
        <div>Hi ${user.firstName} ${user.lastName},</div>
        <br />
        <div>Welcome to eBUYexchange.com, your account has been successfully registered, kindly click on the given link to verify you account: <a href="${sails.config.globals.siteURL}?hash=${emailVerifyHash}&id=${user.id}">Verify you account.</a></div>
        <br />
        <div>Thank you.</div>
        `,
    }, (err, info) => {
      if (err)
        sails.log(err)
      else
        sails.log(info);
    });

    transporter.sendMail({
      from: config.emailAddress, // sender address
      to: config.emailAddress, // list of receivers
      subject: 'eBUYexchange: New User Registered', // Subject line
      html: `
        <div>Hi Admin,</div>
        <br />
        <div>A new user just registered to eBUYexchange.com with the following credentials:</div>
        <br />
        <div><b>ID:</b> ${user.id}</div>
        <div><b>First Name:</b> ${user.firstName}</div>
        <div><b>Last Name:</b> ${user.lastName}</div>
        <div><b>Email:</b> ${user.email}</div>
        <div><b>Username:</b> ${user.username}</div>
        <div><b>Country:</b> ${user.country}</div>
        <div><b>Contact Number:</b> ${user.contactNumber}</div>
        <br />
        <div>Kinldy check ${sails.config.globals.adminURL} for further details.</div>
        <br />
        <div>Thank you.</div>
      `,
    }, (err, info) => {
      if (err)
        sails.log(err)
      else
        sails.log(info);
    });

    return res.status(200).json({user});
  },

  editProfile: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
     * - firstName (req)
     * - lastName (req)
     * - username
     * - email (req)
     * - country (req)
     * - contactNumber (req)
    */

    sails.log('UsersController:: editProfile called');

    const params = req.allParams();

    //  Feilds Pattern Validation
    if (params.firstName && !/^[a-zA-Z][a-zA-Z]+[a-zA-Z]$/.test(params.firstName)) {
      return res.json(400, {details: 'First name is invalid.'});
    } else if (params.lastName && !/^[a-zA-Z][a-zA-Z]+[a-zA-Z]$/.test(params.lastName)) {
      return res.json(400, {details: 'Last name is invalid.'});
    } else if (params.username && !/^[a-zA-Z0-9][a-zA-Z0-9]+[a-zA-Z0-9]$/.test(params.username)) {
      return res.json(400, {details: 'Username is invalid.'});
    }

    const user = await User.update({id: params.id, isArchived: false}, {
      firstName: params.firstName,
      lastName: params.lastName,
      username: params.username,
      country: params.country,
      contactNumber: params.contactNumber,
    }).intercept('E_UNIQUE', (err)=> {
      return 'Username already exists.';
    }).intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({user: _.head(user)});
  },

  changePassword: async (req, res) => {
    /**
     * Params:
     * - oldPwd (req)
     * - newPwd (req)
     * - id (query param, req)
    */

    sails.log('UsersController:: changePassword called');

    const params = req.allParams();

    //  Feilds Pattern Validation
    if (!params.oldPwd || !params.newPwd) {
      return res.json(400, {details: 'Invalid arguments provided.'});
    } 

    let user = await User.findOne({id: params.id, isArchived: false, role: '__customer'})
    .intercept((err) => {
      return err;
    });

    const isPwdMatched = await bcrypt.compare(params.oldPwd, user.password);
    
    if (isPwdMatched) {
      const passwordHash = await bcrypt.hash(params.newPwd, 10);

      user = await User.update({id: params.id, isArchived: false}, {
        password: passwordHash,
      }).intercept((err) => {
        return err;
      }).fetch();

      return res.json(200, {user: _.head(user)});
    } else {
      return res.json(400, {details: 'Old password is invalid.'});
    }


    return res.status(200).json({user});
  },
};
