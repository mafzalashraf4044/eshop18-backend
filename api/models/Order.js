/**
 * Order.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    country: {
      type: 'string',
      required: true,
    },

    sentFrom: {
      type: 'string',
      required: true,
    },

    amountSent: {
      type: 'number',
      defaultsTo: 0,
    },

    receivedIn: {
      type: 'string',
      required: true,
    },

    amountReceived: {
      type: 'number',
      defaultsTo: 0,
    },

    user: {
      model: 'user'
    },

    type: {
      type: 'string',
      isIn: ['buy', 'sell', 'exchange'],
      required: true,
    },
    
    status: {
      type: 'string',
      isIn: ['completed', 'pending', 'cancelled', 'rejected'],
      required: true,
    },

    action: {
      type: 'string',
      required: true,
    },
  },

};

