/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');

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
    
    const criteria = {where: {isArchived: false}};
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
      return res.json(400, {msg: 'First name is invalid.'});
    } else if (params.lastName && !/^[a-zA-Z][a-zA-Z]+[a-zA-Z]$/.test(params.lastName)) {
      return res.json(400, {msg: 'Last name is invalid.'});
    } else if (params.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email)) {
      return res.json(400, {msg: 'Email is invalid.'});
    } else if (params.username && !/^[a-zA-Z0-9][a-zA-Z0-9]+[a-zA-Z0-9]$/.test(params.username)) {
      return res.json(400, {msg: 'Username is invalid.'});
    }

    const user = await User.create(params)
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

    if (params.password) {
      return res.json(400, {msg: 'Invalid arguments provided.'});
    }

    //  Feilds Pattern Validation
    if (params.firstName && !/^[a-zA-Z][a-zA-Z]+[a-zA-Z]$/.test(params.firstName)) {
      return res.json(400, {msg: 'First name is invalid.'});
    } else if (params.lastName && !/^[a-zA-Z][a-zA-Z]+[a-zA-Z]$/.test(params.lastName)) {
      return res.json(400, {msg: 'Last name is invalid.'});
    } else if (params.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email)) {
      return res.json(400, {msg: 'Email is invalid.'});
    } else if (params.username && !/^[a-zA-Z0-9][a-zA-Z0-9]+[a-zA-Z0-9]$/.test(params.username)) {
      return res.json(400, {msg: 'Username is invalid.'});
    }

    const user = await User.update({id: params.id, isArchived: false}, {
      firstName: params.firstName,
      lastName: params.lastName,
      username: params.username,
      email: params.email,
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

    const user = await User.update({id: params.id, isArchived: false}, {
      isArchived: true,
    }).intercept((err) => {
      return err;
    }).fetch();

    if (!user) {
      return res.status(404).json({msg: 'User does not exist.'});
    } else {
      return res.status(200).json({msg: 'User deleted successfully.'});
    }
    
  },

  updateVerfiedStatus: async (req, res) => {
    /**
     * Params:
     * - isVerified (req)
     */

    sails.log('UsersController:: updateVerfiedStatus called');

    const params = req.allParams();

    if (_.isUndefined(params.isVerified)) {
      return res.json(400, {
        msg: 'Field isVerified is required.'
      });
    }

    const user = await User.update({id: req.user.id}, {
      isVerified: params.isVerified,
    }).intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({user: _.head(user)});

  },

};
