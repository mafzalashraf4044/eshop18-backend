/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  getAccounts: async (req, res) => {
    /**
    * Params:
    * - searchTerm
    * - sortBy (ASC or DESC)
    * - sortType
    * - pageNum
    * - pageSize
    */

    sails.log('AccountController::getAccounts called');

    const params = req.allParams();
    
    const criteria = {where: {isArchived: false}};
    const fields = ['title', 'content'];

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

    const accounts = await Account.find(criteria)
    .intercept((err) => {
      return err;
    });

    return res.status(200).json({accounts});

  },

  createAccount: async (req, res) => {
    /**
     * Params:
     * - accountName (req)
     * - accountNum (req)
     * - accountType (req)
     * - paymentMethod
     * - eCurrency
     * - owner (req)
    */

    sails.log('AccountController:: createAccount called');

    const params = req.allParams();

    const account = await Account.create(params)
    .intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({account});
  },

  updateAccount: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
     * - accountName (req)
     * - accountNum (req)
     * - accountType (req)
     * - paymentMethod
     * - eCurrency
     * - bankName
     * - bankAddress
     * - bankSwiftCode
     * - owner (req)
    */

    sails.log('AccountController:: updateAccount called');

    const params = req.allParams();

    const account = await Account.update({id: params.id, isArchived: false}, {
      accountName: params.accountName,
      accountNum: params.accountNum,
      accountType: params.accountType,
      paymentMethod: params.paymentMethod,
      eCurrency: params.eCurrency,
      bankName: params.bankName,
      bankAddress: params.bankAddress,
      bankSwiftCode: params.bankSwiftCode,
      owner: params.owner,
    }).intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({user: _.head(account)});
  },

  deleteAccount: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
    */

    sails.log('AccountController:: deleteAccount called');

    const params = req.allParams();

    const account = await Account.update({id: params.id, isArchived: false}, {
      isArchived: true,
    }).intercept((err) => {
      return err;
    }).fetch();

    if (!account) {
      return res.status(404).json({details: 'Account does not exist.'});
    } else {
      return res.status(200).json({details: 'Account deleted successfully.'});
    }
    
  },

  getUserAccounts: async (req, res) => {
    /**
    * Params:
    * - searchTerm
    * - sortBy (ASC or DESC)
    * - sortType
    * - pageNum
    * - pageSize
    */

    sails.log('AccountController::getAccounts called');

    const params = req.allParams();
    
    const criteria = {where: {isArchived: false, owner: req.user.id}};
    const fields = ['title', 'content'];

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

    const accounts = await Account.find(criteria)
    .populate('eCurrency')
    .populate('paymentMethod')
    .intercept((err) => {
      return err;
    });

    return res.status(200).json({accounts});

  },

  createUserAccount: async (req, res) => {
    /**
     * Params:
     * - firstName
     * - lastName
     * - accountName
     * - accountNum
     * - details
     * - bankName
     * - bankAddress
     * - bankSwiftCode
     * - accountType (req)
     * - paymentMethod
     * - eCurrency
    */

    sails.log('AccountController:: createUserAccount called');

    const params = req.allParams();
    const accountModel = params.accountType === 'paymentmethod' ? {paymentMethod: params.paymentMethod} : {eCurrency: params.eCurrency};

    if (['paymentmethod', 'ecurrency'].indexOf(params.accountType) === -1) {
      return res.status(400).json({details: 'Invalid parameters.'});
    }

    let account = await Account.create({
      ...accountModel,
      owner: req.user.id,
      ...params,
    })
    .intercept((err) => {
      return err;
    }).fetch();
    
    account = await Account.findOne({id: account.id})
    .populate('eCurrency')
    .populate('paymentMethod')
    .intercept((err) => {
      return err;
    });

    return res.status(200).json({account});
  },

  editUserAccount: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
     * - firstName
     * - lastName
     * - accountName
     * - accountNum
     * - details
     * - bankName
     * - bankAddress
     * - bankSwiftCode
    */

    sails.log('AccountController:: editUserAccount called');

    const params = req.allParams();
    const criteria = {id: params.id, isArchived: false};

    if (params.accountType || params.eCurrency || params.paymentMethod || params.owner) {
      return res.status(400).json({details: 'Invalid parameters.'});
    }

    let account = await Account.update(criteria, params).intercept((err) => {
      return err;
    }).fetch();

    account = await Account.findOne(criteria)
    .populate('eCurrency')
    .populate('paymentMethod')
    .intercept((err) => {
      return err;
    });

    return res.status(200).json({account});
  },

  deleteUserAccount: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
    */

    sails.log('AccountController:: deleteUserAccount called');

    const params = req.allParams();

    const account = await Account.update({id: params.id, isArchived: false}, {
      isArchived: true,
    }).intercept((err) => {
      return err;
    }).fetch();

    if (!account) {
      return res.status(404).json({details: 'User account does not exist.'});
    } else {
      return res.status(200).json({details: 'User account deleted successfully.'});
    }
    
  },

};

