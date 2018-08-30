/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const nodemailer = require('nodemailer');

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
     * - sentFrom (req)
     * - amountSent (req)
     * - receivedIn (req)
     * - amountReceived (req)
     * - user (req)
     * - type (req)
     * - status
    */

    sails.log('OrderController:: updateOrder called');

    const params = req.allParams();

    const order = await Order.update({id: params.id, isArchived: false}, params).intercept((err) => {
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

  updateOrderStatus: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
     * - status (req)
    */

    sails.log('OrderController:: updateOrderStatus called');

    const params = req.allParams();

    if (['completed', 'pending', 'cancelled', 'rejected'].indexOf(params.status) === -1) {
      return res.status(400).json({details: 'Status field is invalid.'});
    }

    const order = await Order.update({id: params.id, isArchived: false}, {
      status: params.status,
    }).intercept((err) => {
      return err;
    }).fetch();

    return res.status(200).json({order: _.head(order)});
  },

  currencyCalculator: async (req, res) => {
    /**
     * Params:
     * - type (req)
     * - firstAmount (req)
     * - from (req)
     * - to (req)
    */

    sails.log('OrderController:: currencyCalculator called');

    const params = req.allParams();

    if (['buy', 'sell', 'exchange'].indexOf(params.type) === -1 || !params.firstAmount || !params.from || !params.to) {
      return res.status(400).json({details: 'Provided parameters are invaid.'});     
    }

    const eCurrency = await Ecurrency.findOne({title: params.type === 'buy' ? params.to : params.from})
    .intercept((err) => {
      return err;
    });

    if (eCurrency) {
      const index = _.findIndex(eCurrency[`${params.type}Commissions`], (commission) => commission.title === (params.type === 'buy' ? params.from : params.to));
      const commission = eCurrency[`${params.type}Commissions`][index];

      const commissionAmount = ((parseFloat(params.firstAmount) * parseFloat(commission.percentage)) / 100) + parseFloat(commission.fixed);
      const serviceCharges =  `${commission.percentage.toString()}% + ${commission.fixed.toString()} = ${commissionAmount.toFixed(2)}`;

      const secondAmount = parseFloat(params.firstAmount) + parseFloat(commissionAmount);
      return res.status(200).json({serviceCharges, secondAmount: secondAmount.toFixed(2)});
    }
    
    return res.status(400).json({details: 'Provided parameters are invaid.'});      
  },

  placeOrder: async (req, res) => {
    /**
     * Params:
     * - type (req)
     * - firstAmount (req)
     * - from (req)
     * - to (req)
    */

    sails.log('OrderController:: placeOrder called');

    const params = req.allParams();

    if (['buy', 'sell', 'exchange'].indexOf(params.type) === -1 || !params.firstAmount || !params.from || !params.to) {
      return res.status(400).json({details: 'Provided parameters are invaid.'});     
    }

    const eCurrency = await Ecurrency.findOne({title: params.type === 'buy' ? params.to : params.from})
    .intercept((err) => {
      return err;
    });

    if (eCurrency) {
      const index = _.findIndex(eCurrency[`${params.type}Commissions`], (commission) => commission.title === (params.type === 'buy' ? params.from : params.to));
      const commission = eCurrency[`${params.type}Commissions`][index];

      const commissionAmount = ((parseFloat(params.firstAmount) * parseFloat(commission.percentage)) / 100) + parseFloat(commission.fixed);
      const serviceCharges =  `${commission.percentage.toString()}% + ${commission.fixed.toString()} = ${commissionAmount.toFixed(2)}`;

      const secondAmount = parseFloat(params.firstAmount) + parseFloat(commissionAmount);

      const order = await Order.create({
        sentFrom: params.from,
        amountSent: params.firstAmount,
        receivedIn: params.to,
        amountReceived: secondAmount,
        user: req.user.id,
        type: params.type,
      })
      .intercept((err) => {
        return err;
      }).fetch();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {user: 'muhammadafzal3303@gmail.com', pass: 'ebuyexchange-testing'}
      });
  
      const mailOptions = {
        from: 'support@ebuyexchange.com', // sender address
        to: user.email, // list of receivers
        subject: 'eBuyExhcange: Order Confirmation', // Subject line
        html: "<p>Your order has been placed successfully.</p>"
      };
  
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          sails.log(err)
        else
          sails.log(info);
      });

      return res.status(200).json({order});
    }
    
    return res.status(400).json({details: 'Provided parameters are invaid.'});      
  },

  getUserOrders: async (req, res) => {
    sails.log('OrderController::getUserOrders called');

    const params = req.allParams();
    
    const criteria = {where: {isArchived: false, user: req.user.id}};

    let orders = await Order.find(criteria).intercept((err) => {
      return err;
    });

    sails.log('orders', orders)

    return res.status(200).json({orders});
  }
};

