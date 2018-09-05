/**
 * Account.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    
    buyOrderConfirmedText: {
      type: 'string',
      required: true,
    },

    sellOrderConfirmedText: {
      type: 'string',
      required: true,
    },

    exchangeOrderConfirmedText: {
      type: 'string',
      required: true,
    },

    emailAddress: {
      type: 'string',
      required: true,
    },

    emailPwd: {
      type: 'string',
      required: true,
    },

  },

};

