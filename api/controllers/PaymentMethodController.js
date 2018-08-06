/**
 * PaymentMethodController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  getPaymentMethods: async (req, res) => {
    /**
    * Params:
    * - searchTerm
    * - sortBy (ASC or DESC)
    * - sortType
    * - pageNum
    * - pageSize
    */

    sails.log('PaymentMethodController::getPaymentMethods called');

    const params = req.allParams();
    
    const criteria = {where: {isArchived: false}};
    const fields = ['title'];

    //  search query
    if (params.searchTerm) {
      criteria.or = _.map(fields, (field) => ({[field]: {contains: params.searchTerm}}));
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

    const paymentMethods = await PaymentMethod.find(criteria)
    .intercept((err) => {
      return err;
    });

    return res.status(200).json({paymentMethods});

  },

  createPaymentMethod: async (req, res) => {
    /**
     * Params:
     * - title (req)
    */

    sails.log('PaymentMethodController:: createPaymentMethod called');

    const params = req.allParams();

    const paymentMethod = await PaymentMethod.create(params)
    .intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({paymentMethod});
  },

  updatePaymentMethod: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
     * - title (req)
    */

    sails.log('PaymentMethodController:: updatePaymentMethod called');

    const params = req.allParams();

    const paymentMethod = await PaymentMethod.update({id: params.id, isArchived: false}, {
      title: params.title,
    }).intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({user: _.head(paymentMethod)});
  },

  deletePaymentMethod: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
    */

    sails.log('PaymentMethodController:: deletePaymentMethod called');

    const params = req.allParams();

    const paymentMethod = await PaymentMethod.update({id: params.id, isArchived: false}, {
      isArchived: true,
    }).intercept((err) => {
      return err;
    }).fetch();

    if (!paymentMethod) {
      return res.status(404).json({msg: 'Payment method does not exist.'});
    } else {
      return res.status(200).json({msg: 'Payment method deleted successfully.'});
    }
    
  },

};

