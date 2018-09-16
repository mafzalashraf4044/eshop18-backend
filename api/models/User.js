/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt');

module.exports = {

  customToJSON: function() {
    return _.omit(this, ['password', 'emailVerifyHash']);
  },

  beforeCreate: async (user, proceed) => {
    if (user.password) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      user.password = passwordHash;
    }

    return proceed();
  },

  attributes: {

    firstName: {
      type: 'string',
      required: true
    },

    lastName: {
      type: 'string',
      required: true
    },

    username: {
      type: 'string',
      unique: true,
    },

    email: {
      type: 'string',
      required: true,
      unique: true,
    },

    password: {
      type: 'string',
      required: true,
    },

    country: {
      type: 'string',
      required: true,
    },

    contactNumber: {
      type: 'string',
      required: true,
    },

    accounts: {
      collection: 'account',
      via: 'owner',
    },

    orders: {
      collection: 'order',
      via: 'user',
    },

    role: {
      type: 'string',
      isIn: ['__admin', '__customer'],
      defaultsTo: '__customer',
    },

    isVerified: {
      type: 'boolean',
      defaultsTo: false,
    },

    isEmailVerified: {
      type: 'boolean',
      defaultsTo: false,
    },

    emailVerifyHash: {
      type: 'string',
      defaultsTo: '',
    },

    forgotPwdHash: {
      type: 'string',
      defaultsTo: '',
    },

    isArchived: {
      type: 'boolean',
      defaultsTo: false
    }
  },

};

