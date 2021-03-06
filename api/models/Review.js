/**
 * Review.js
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

    content: {
      type: 'string',
      required: true
    },

    isArchived: {
      type: 'boolean',
      defaultsTo: false
    }

  },

};

