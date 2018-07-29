/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

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

    isVerified: {
      type: 'boolean',
      defaultsTo: false,
    },

    isEmailVerified: {
      type: 'boolean',
      defaultsTo: false,
    },

  },

};

