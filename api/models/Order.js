/**
 * Order.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    sentFrom: {
      type: 'json',
      required: true,
    },

    amountSent: {
      type: 'number',
      defaultsTo: 0,
    },

    receivedIn: {
      type: 'json',
      required: true,
    },

    amountReceived: {
      type: 'number',
      defaultsTo: 0,
    },

    user: {
      model: 'user',
      required: true,
    },

    type: {
      type: 'string',
      isIn: ['buy', 'sell', 'exchange'],
      required: true,
    },
    
    status: {
      type: 'string',
      isIn: ['completed', 'pending', 'cancelled', 'rejected'],
      defaultsTo: 'pending',
    },
    
    isArchived: {
      type: 'boolean',
      defaultsTo: false
    }
  },

};

