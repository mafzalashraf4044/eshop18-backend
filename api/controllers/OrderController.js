/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  getOrders: async (req, res) => {
    /**
    * Params:
    * - searchTerm
    * - sortBy (ASC or DESC)
    * - sortType
    * - pageNum
    * - pageSize
    * - user
    * - type
    * - type
    */

    sails.log('OrderController::getOrders called');

    const params = req.allParams();
    
    const criteria = {where: {isArchived: false, type: params.type}};
    const fields = ['_id' ,'country', 'sentFrom', 'receivedIn', 'status'];

    //  search query
    if (params.searchTerm) {
      criteria.where.or = _.map(fields, (field) => ({[field]: field === '_id' ? params.searchTerm : {contains: params.searchTerm}}));
    }

    //  user query
    if (params.user) {
      criteria.where.user = params.user.toString();
    }

    //  type query
    if (params.type) {
      criteria.where.type = params.type;
    }

    //  pagination
    if ((params.pageNum && params.pageNum > 0) && (params.pageSize && params.pageSize > 0)) {

      criteria.limit = params.pageSize;
      criteria.skip = params.pageSize * (params.pageNum - 1);
    }

    //  sorting
    if ((params.sortType === 'ASC' || params.sortType === 'DESC') && (params.sortBy && fields.indexOf(params.sortBy) !== -1)) {
      criteria.sort = `${params.sortBy} ${params.sortType}`;
    }

    let orders = await Order.find(criteria).intercept((err) => {
      return err;
    });

    return res.status(200).json({orders});

  },

  createOrder: async (req, res) => {
    /**
     * Params:
     * - country (req)
     * - sentFrom (req)
     * - amountSent (req)
     * - receivedIn (req)
     * - amountReceived (req)
     * - user (req)
     * - type (req)
     * - status
     * - action
    */

    sails.log('OrderController:: createOrder called');

    const params = req.allParams();

    const order = await Order.create(params)
    .intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({order});
  },

  updateOrder: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
     * - country (req)
     * - sentFrom (req)
     * - amountSent (req)
     * - receivedIn (req)
     * - amountReceived (req)
     * - user (req)
     * - type (req)
     * - status
     * - action
    */

    sails.log('OrderController:: updateOrder called');

    const params = req.allParams();

    const order = await Order.update({id: params.id, isArchived: false}, {
      title: params.title,
    }).intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({order: _.head(order)});
  },

  deleteOrder: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
    */

    sails.log('OrderController:: deleteOrder called');

    const params = req.allParams();

    const order = await Order.update({id: params.id, isArchived: false}, {
      isArchived: true,
    }).intercept((err) => {
      return err;
    }).fetch();

    if (!order) {
      return res.status(404).json({details: 'Order does not exist.'});
    } else {
      return res.status(200).json({details: 'Order deleted successfully.'});
    }
    
  },

};

