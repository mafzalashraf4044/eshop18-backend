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
    */

    sails.log('OrderController::getOrders called');

    const params = req.allParams();
    
    const criteria = {where: {isArchived: false, type: params.type}};
    const fields = ['_id', 'status'];

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
    if ((params.sortType === 'ASC' || params.sortType === 'DESC') && params.sortBy) {
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
     * - firstAmount (req)
     * - receivedIn (req)
     * - secondAmount (req)
     * - user (req)
     * - type (req)
    */

    sails.log('OrderController:: createOrder called');

    const params = req.allParams();

    const order = await Order.create({
      sentFrom: params.sentFrom,
      firstAmount: params.firstAmount,
      receivedIn: params.receivedIn,
      secondAmount: params.secondAmount,
      user: params.user,
      type: params.type,
    })
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
     * - firstAmount (req)
     * - receivedIn (req)
     * - secondAmount (req)
     * - user (req)
     * - type (req)
     * - status
    */

    sails.log('OrderController:: updateOrder called');

    const params = req.allParams();

    const order = await Order.update({id: params.id, isArchived: false}, {
      sentFrom: params.sentFrom,
      firstAmount: params.firstAmount,
      receivedIn: params.receivedIn,
      secondAmount: params.secondAmount,
      type: params.type,
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
      return res.status(400).json({details: 'The parameters you entered are invalid, please try again.'});     
    }

    const eCurrency = await Ecurrency.findOne({title: params.type === 'buy' ? params.to : params.from, isArchived: false})
    .intercept((err) => {
      return err;
    });

    if (eCurrency) {
      const index = _.findIndex(eCurrency[`${params.type}Commissions`], (commission) => commission.title === (params.type === 'buy' ? params.from : params.to));
      const commission = eCurrency[`${params.type}Commissions`][index];

      const commissionAmount = ((parseFloat(params.firstAmount) * parseFloat(commission.percentage)) / 100) + parseFloat(commission.fixed);
      const serviceCharges =  `${commission.percentage.toString()}% + ${commission.fixed.toString()} = ${commissionAmount.toFixed(2)}`;

      const secondAmount = params.type === 'buy' ? parseFloat(params.firstAmount) + parseFloat(commissionAmount) : parseFloat(params.firstAmount) - parseFloat(commissionAmount);
      return res.status(200).json({serviceCharges, secondAmount: secondAmount.toFixed(2)});
    }
    
    return res.status(400).json({details: 'The parameters you entered are invalid, please try again.'});      
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
      return res.status(400).json({details: 'The parameters you entered are invalid, please try again.'});     
    }

    const eCurrency = await Ecurrency.findOne({title: params.type === 'buy' ? params.to : params.from, isArchived: false})
    .intercept((err) => {
      return err;
    });

    if (eCurrency) {
      const index = _.findIndex(eCurrency[`${params.type}Commissions`], (commission) => commission.title === (params.type === 'buy' ? params.from : params.to));
      const commission = eCurrency[`${params.type}Commissions`][index];

      const commissionAmount = ((parseFloat(params.firstAmount) * parseFloat(commission.percentage)) / 100) + parseFloat(commission.fixed);
      const serviceCharges =  `${commission.percentage.toString()}% + ${commission.fixed.toString()} = ${commissionAmount.toFixed(2)}`;

      const secondAmount = params.type === 'buy' ? parseFloat(params.firstAmount) + parseFloat(commissionAmount) : parseFloat(params.firstAmount) - parseFloat(commissionAmount);

      let to = null;
      let from = null;
      let sentFrom = null;
      let receivedIn = null;
      let fromAccount = null;
      let toAccount = null;

      if (params.type === 'buy') {
        to = eCurrency;
        from = await PaymentMethod.findOne({title: params.from, isArchived: false})
        .intercept((err) => {
          return err;
        });

        fromAccount = await Account.findOne({paymentMethod: from.id, isArchived: false, owner: req.user.id})
        .populate('eCurrency')
        .populate('paymentMethod')
        .intercept((err) => {
          return err;
        });

        toAccount = await Account.findOne({eCurrency: to.id, isArchived: false, owner: req.user.id})
        .populate('eCurrency')
        .populate('paymentMethod')
        .intercept((err) => {
          return err;
        });

        if (!fromAccount || !toAccount) {
          return res.status(400).json({details: `There is no ${!fromAccount ? from.title : to.title} account associated with your profile, kindly add an account and then place your order again.`});
        }

        sentFrom = {
          model: 'paymentMethod',
          id: from.id,
          title: from.title,
          accountId:  fromAccount.id,
        };
        
        receivedIn = {
          model: 'eCurrency',
          id: to.id,
          title: to.title,
          accountId:  toAccount.id,
        };

      } else if (params.type === 'sell') {
        
        from = eCurrency;
        to = await PaymentMethod.findOne({title: params.to, isArchived: false})
        .intercept((err) => {
          return err;
        });        

        fromAccount = await Account.findOne({eCurrency: from.id, isArchived: false, owner: req.user.id})
        .populate('eCurrency')
        .populate('paymentMethod')
        .intercept((err) => {
          return err;
        });

        toAccount = await Account.findOne({paymentMethod: to.id, isArchived: false, owner: req.user.id})
        .populate('eCurrency')
        .populate('paymentMethod')
        .intercept((err) => {
          return err;
        });

        if (!fromAccount || !toAccount) {
          return res.status(400).json({details: `There is no ${!fromAccount ? from.title : to.title} account associated with your profile, kindly add an account and then place your order again.`});
        }

        sentFrom = {
          model: 'eCurrency',
          id: from.id,
          title: from.title,
          accountId:  fromAccount.id,
        };
        
        receivedIn = {
          model: 'paymentMethod',
          id: to.id,
          title: to.title,
          accountId:  toAccount.id,
        };

      } else if (params.type === 'exchange') {

        from = eCurrency;
        to = await Ecurrency.findOne({title: params.to, isArchived: false})
        .intercept((err) => {
          return err;
        });

        fromAccount = await Account.findOne({eCurrency: from.id, isArchived: false, owner: req.user.id})
        .populate('eCurrency')
        .populate('paymentMethod')
        .intercept((err) => {
          return err;
        });

        toAccount = await Account.findOne({eCurrency: to.id, isArchived: false, owner: req.user.id})
        .populate('eCurrency')
        .populate('paymentMethod')
        .intercept((err) => {
          return err;
        });

        if (!fromAccount || !toAccount) {
          return res.status(400).json({details: `There is no ${!fromAccount ? from.title : to.title} account associated with your profile, kindly add an account and then place your order again.`});
        }

        sentFrom = {
          model: 'eCurrency',
          id: from.id,
          title: from.title,
          accountId:  fromAccount.id,
        };
        
        receivedIn = {
          model: 'eCurrency',
          id: to.id,
          title: to.title,
          accountId:  toAccount.id,
        };
      }

      const order = await Order.create({
        sentFrom,
        firstAmount: params.firstAmount,
        receivedIn,
        secondAmount: secondAmount,
        user: req.user.id,
        type: params.type,
      })
      .intercept((err) => {
        return err;
      }).fetch();

      const config = _.head(await Config.find().limit(1)
      .intercept((err) => {
        return err;
      }));
      
      const transporter = nodemailer.createTransport({
        host: 'smtp.ebuyexchange.com',
        port: 587,
        secure: false,
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        },
        auth: {user: config.emailAddress, pass: config.emailPwd},
      });
      
      const createdAt = new Date(order.createdAt);
      transporter.sendMail({
        from: `eBUYexchange <${config.emailAddress}>`, // sender address
        to: req.user.email, // list of receivers
        subject: 'eBUYexchange: Order Placed Successfully', // Subject line
        html: `
          <div>Dear ${req.user.firstName} ${req.user.lastName},</div>
          <br />
          <div>Thank you for placing order at www.ebuyexchange.com, your order details are as follows:</div>
          <br />
          <div><b>Order No:</b> ${order.id}</div>
          <div><b>Email:</b> ${req.user.email}</div>
          <div><b>Order Date:</b> ${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}</div>

          ${order.type === 'buy' ? `<div><b>Buy Amount:</b> USD ${parseFloat(order.firstAmount).toFixed(2)} (${order.receivedIn.title})</div>`: ''}
          ${order.type === 'buy' ? `<div><b>Payment By:</b> ${order.sentFrom.title}</div>`: ''}
          ${order.type === 'buy' ? `<div><b>Service Charges:</b> USD ${parseFloat(commissionAmount).toFixed(2)}</div>`: ''}
          ${order.type === 'buy' ? `<div><b>Have to send:</b> USD ${parseFloat(order.secondAmount).toFixed(2)}</div>`: ''}
          ${order.type === 'buy' ? `<div><b>Delivery to:</b> ${toAccount.accountNum} (${toAccount.accountName})</div>`: ''}

          ${order.type === 'sell' ? `<div><b>Have to send:</b> USD ${parseFloat(order.firstAmount).toFixed(2)} (${order.sentFrom.title})</div>`: ''}
          ${order.type === 'sell' ? `<div><b>Payment received through:</b> ${order.receivedIn.title}</div>`: ''}
          ${order.type === 'sell' ? `<div><b>Service Charges:</b> USD ${parseFloat(commissionAmount).toFixed(2)}</div>`: ''}
          ${order.type === 'sell' ? `<div><b>Receivable Amount:</b> USD ${parseFloat(order.secondAmount).toFixed(2)} (${order.receivedIn.title})</div>`: ''}
          ${order.type === 'sell' ? `<br /><div>You will receive the amount in the following account:</div><br />`: ''}

          ${(order.type === 'sell' && toAccount.paymentMethod.isBankingEnabled) ? `<div><b>Account Name:</b> ${toAccount.accountName}</div>`: ''}
          ${(order.type === 'sell' && toAccount.paymentMethod.isBankingEnabled) ? `<div><b>Account Number:</b> ${toAccount.accountNum}</div>`: ''}
          ${(order.type === 'sell' && toAccount.paymentMethod.isBankingEnabled) ? `<div><b>Bank Name:</b> ${toAccount.bankName}</div>`: ''}
          ${(order.type === 'sell' && toAccount.paymentMethod.isBankingEnabled) ? `<div><b>Bank Address:</b> ${toAccount.bankAddress}</div>`: ''}
          ${(order.type === 'sell' && toAccount.paymentMethod.isBankingEnabled) ? `<div><b>Bank Swift Code:</b> ${toAccount.bankSwiftCode}</div>`: ''}

          ${(order.type === 'sell' && !toAccount.paymentMethod.isBankingEnabled) ? `<div><b>First Name:</b> ${toAccount.firstName}</div>`: ''}
          ${(order.type === 'sell' && !toAccount.paymentMethod.isBankingEnabled) ? `<div><b>Last Name:</b> ${toAccount.lastName}</div>`: ''}
          ${(order.type === 'sell' && !toAccount.paymentMethod.isBankingEnabled) ? `<div><b>City, State, Country, Post Code:</b> ${toAccount.details}</div>`: ''}

          ${order.type === 'exchange' ? `<div><b>Receivable Amount:</b> USD ${parseFloat(order.secondAmount).toFixed(2)} (${order.receivedIn.title})</div>`: ''}
          ${order.type === 'exchange' ? `<div><b>Exchange Charges:</b> USD ${parseFloat(commissionAmount).toFixed(2)}</div>`: ''}
          ${order.type === 'exchange' ? `<div><b>Have to send:</b> USD ${parseFloat(order.firstAmount).toFixed(2)} (${order.sentFrom.title})</div>`: ''}
          ${order.type === 'exchange' ? `<div><b>Delivery to:</b> ${toAccount.accountNum} (${toAccount.accountName})</div>`: ''}

          <br />

          <div>You will receive further details in our next email.</div>

          <br />
          <div>Thanks for using our service.</div>
          <div>Best Wishes &lt;admin ${config.emailAddress}&gt;</div>
          `,
      }, (err, info) => {
        if (err)
          sails.log(err)
        else
          sails.log(info);
      });

      transporter.sendMail({
        from: `eBUYexchange <${config.emailAddress}>`, // sender address
        to: config.emailAddress, // list of receivers
        subject: 'eBUYexchange: New Order Placed', // Subject line
        html: `
          <div>Hi Admin,</div>
          <br />
          <div>A new order has been placed, for further information kindly check ${sails.config.globals.adminURL}.</div>
          <br />
          <div><b>Email:</b> ${req.user.email}</div>
          <div><b>Order Date:</b> ${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}</div>

          ${order.type === 'buy' ? `<div><b>Buy Amount:</b> USD ${parseFloat(order.firstAmount).toFixed(2)} (${order.receivedIn.title})</div>`: ''}
          ${order.type === 'buy' ? `<div><b>Payment By:</b> ${order.sentFrom.title}</div>`: ''}
          ${order.type === 'buy' ? `<div><b>Service Charges:</b> USD ${parseFloat(commissionAmount).toFixed(2)}</div>`: ''}
          ${order.type === 'buy' ? `<div><b>Have to send:</b> USD ${parseFloat(order.secondAmount).toFixed(2)}</div>`: ''}
          ${order.type === 'buy' ? `<div><b>Delivery to:</b> ${toAccount.accountNum} (${toAccount.accountName})</div>`: ''}

          ${order.type === 'sell' ? `<div><b>Have to send:</b> USD ${parseFloat(order.firstAmount).toFixed(2)} (${order.sentFrom.title})</div>`: ''}
          ${order.type === 'sell' ? `<div><b>Payment received through:</b> ${order.receivedIn.title}</div>`: ''}
          ${order.type === 'sell' ? `<div><b>Service Charges:</b> USD ${parseFloat(commissionAmount).toFixed(2)}</div>`: ''}
          ${order.type === 'sell' ? `<div><b>Receivable Amount:</b> USD ${parseFloat(order.secondAmount).toFixed(2)} (${order.receivedIn.title})</div>`: ''}
          ${order.type === 'sell' ? `<br /><div>You will receive the amount in the following account:</div><br />`: ''}

          ${(order.type === 'sell' && toAccount.paymentMethod.isBankingEnabled) ? `<div><b>Account Name:</b> ${toAccount.accountName}</div>`: ''}
          ${(order.type === 'sell' && toAccount.paymentMethod.isBankingEnabled) ? `<div><b>Account Number:</b> ${toAccount.accountNum}</div>`: ''}
          ${(order.type === 'sell' && toAccount.paymentMethod.isBankingEnabled) ? `<div><b>Bank Name:</b> ${toAccount.bankName}</div>`: ''}
          ${(order.type === 'sell' && toAccount.paymentMethod.isBankingEnabled) ? `<div><b>Bank Address:</b> ${toAccount.bankAddress}</div>`: ''}
          ${(order.type === 'sell' && toAccount.paymentMethod.isBankingEnabled) ? `<div><b>Bank Swift Code:</b> ${toAccount.bankSwiftCode}</div>`: ''}

          ${(order.type === 'sell' && !toAccount.paymentMethod.isBankingEnabled) ? `<div><b>First Name:</b> ${toAccount.firstName}</div>`: ''}
          ${(order.type === 'sell' && !toAccount.paymentMethod.isBankingEnabled) ? `<div><b>Last Name:</b> ${toAccount.lastName}</div>`: ''}
          ${(order.type === 'sell' && !toAccount.paymentMethod.isBankingEnabled) ? `<div><b>City, State, Country, Post Code:</b> ${toAccount.details}</div>`: ''}

          ${order.type === 'exchange' ? `<div><b>Receivable Amount:</b> USD ${parseFloat(order.secondAmount).toFixed(2)} (${order.receivedIn.title})</div>`: ''}
          ${order.type === 'exchange' ? `<div><b>Exchange Charges:</b> USD ${parseFloat(commissionAmount).toFixed(2)}</div>`: ''}
          ${order.type === 'exchange' ? `<div><b>Have to send:</b> USD ${parseFloat(order.firstAmount).toFixed(2)} (${order.sentFrom.title})</div>`: ''}
          ${order.type === 'exchange' ? `<div><b>Delivery to:</b> ${toAccount.accountNum} (${toAccount.accountName})</div>`: ''}

          <br />
          <div>Thank you.</div>
          `,
      }, (err, info) => {
        if (err)
          sails.log(err)
        else
          sails.log(info);
      });

      return res.status(200).json({order});
    }
    
    return res.status(400).json({details: 'The parameters you entered are invalid, please try again.'}); 
  },

  getUserOrders: async (req, res) => {
    sails.log('OrderController::getUserOrders called');

    const params = req.allParams();
    
    const criteria = {where: {isArchived: false, user: req.user.id}};

    //  sorting
    if ((params.sortType === 'ASC' || params.sortType === 'DESC') && params.sortBy) {
      criteria.sort = `${params.sortBy} ${params.sortType}`;
    }

    let orders = await Order.find(criteria).intercept((err) => {
      return err;
    });

    return res.status(200).json({orders});
  },

  getUserDetailsFromOrder: async (req, res) => {
    /**
     * Params:
     * - id (req, query param)
    */

    sails.log('OrderController::getUserDetailsFromOrder called');

    const params = req.allParams();
    
    const criteria = {where: {isArchived: false, id: params.id}};

    let order = await Order.findOne(criteria)
    .populate('user')
    .intercept((err) => {
      return err;
    });

    const sentFromAccount = await Account.findOne({owner: order.user.id, id: order.sentFrom.accountId})
    .populate(order.sentFrom.model)
    .intercept((err) => {
      return err;
    });

    const receivedInAccount = await Account.findOne({owner: order.user.id, id: order.receivedIn.accountId})
    .populate(order.receivedIn.model)
    .intercept((err) => {
      return err;
    });

    return res.status(200).json({userDetails: {
      user: order.user,
      sentFromAccount,
      receivedInAccount,
    }});
  },

};

