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
      required: true,
      unique: true,
    },

    reserves: {
      type: 'string',
      required: true,
    },

    buyCommissions: {
      type: 'json',
      required: true
    },

    sellCommissions: {
      type: 'json',
      required: true
    },

    exchangeCommissions: {
      type: 'json',
      required: true
    },

    isArchived: {
      type: 'boolean',
      defaultsTo: false
    }
  },

};

