/**
 * EcurrencyController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  getECurrencies: async (req, res) => {
    /**
    * Params:
    * - searchTerm
    * - sortBy (ASC or DESC)
    * - sortType
    * - pageNum
    * - pageSize
    */

    sails.log('EcurrencyController::getECurrencies called');

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

    const eCurrencies = await Ecurrency.find(criteria)
    .intercept((err) => {
      return err;
    });

    return res.status(200).json({eCurrencies});
  },

  createECurrency: async (req, res) => {
    /**
     * Params:
     * - title (req)
    */

    sails.log('EcurrencyController:: createECurrency called');

    const params = req.allParams();

    const eCurrency = await Ecurrency.create(params)
    .intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({eCurrency});
  },

  updateECurrency: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
     * - title (req)
    */

    sails.log('EcurrencyController:: updateECurrency called');

    const params = req.allParams();

    const eCurrency = await Ecurrency.update({id: params.id, isArchived: false}, {
      title: params.title,
    }).intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({user: _.head(eCurrency)});
  },

  deleteECurrency: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
    */

    sails.log('EcurrencyController:: deleteECurrency called');

    const params = req.allParams();

    const eCurrency = await Ecurrency.update({id: params.id, isArchived: false}, {
      isArchived: true,
    }).intercept((err) => {
      return err;
    }).fetch();

    if (!eCurrency) {
      return res.status(404).json({msg: 'E-Currency does not exist.'});
    } else {
      return res.status(200).json({msg: 'E-Currency deleted successfully.'});
    }
    
  },

};

