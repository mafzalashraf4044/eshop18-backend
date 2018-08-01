/**
 * Ecurrency.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    title: {
      type: 'string',
      required: true
    },

    buyCommission: {
      type: 'json',
      required: true
    },

    sellCommission: {
      type: 'json',
      required: true
    },

    exchangeCommission: {
      type: 'json',
      required: true
    },

    isArchived: {
      type: 'boolean',
      defaultsTo: false
    }
  },

};

