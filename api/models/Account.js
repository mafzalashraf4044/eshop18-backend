/**
 * Account.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    
    firstName: {
      type: 'string',
      defaultsTo: '-',
    },

    lastName: {
      type: 'string',
      defaultsTo: '-',
    },

    accountName: {
      type: 'string',
      defaultsTo: '-',
    },

    accountNum: {
      type: 'string',
      defaultsTo: '-',
    },

    details: {
      type: 'string',
      defaultsTo: '-',
    },

    bankName: {
      type: 'string',
      defaultsTo: '-',
    },

    bankAddress: {
      type: 'string',
      defaultsTo: '-',
    },

    bankSwiftCode: {
      type: 'string',
      defaultsTo: '-',
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

