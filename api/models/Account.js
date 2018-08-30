/**
 * Account.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    accountName: {
      type: 'string',
      required: true,
    },

    accountNum: {
      type: 'string',
      required: true,
    },

    accountType: {
      type: 'string',
      isIn: ['paymentmethod', 'ecurrency'],
      required: true,
    },

    paymentMethod: {
      model: 'paymentmethod'
    },

    eCurrency: {
      model: 'ecurrency'
    },

    owner: {
      model: 'user',
      required: true,
    },

    isArchived: {
      type: 'boolean',
      defaultsTo: false
    }
  },

};

