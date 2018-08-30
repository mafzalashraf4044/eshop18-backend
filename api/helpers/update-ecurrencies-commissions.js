module.exports = {


  friendlyName: 'Update Ecurrencies Commissions',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    const eCurrencies = await Ecurrency.find({where: {isArchived: false}})
    .intercept((err) => {
      return err;
    });

    const paymentMethods = await PaymentMethod.find({where: {isArchived: false}})
    .intercept((err) => {
      return err;
    });

    const buyCommissions = paymentMethods.map(paymentMethod => ({
      title: paymentMethod.title, percentage: 0, fixed: 0
    }));
    
    const sellCommissions = paymentMethods.map(paymentMethod => ({
      title: paymentMethod.title, percentage: 0, fixed: 0
    }));

    const exchangeCommissions = eCurrencies.map(eCurrency => ({
      title: eCurrency.title, percentage: 0, fixed: 0
    }));

    _.forEach(eCurrencies, async (eCurrency, index) => {
      
      // buy commission
      const newBuyCommissions = _.filter(buyCommissions, (commission) => (eCurrency.title !== commission.title));
      
      _.forEach(eCurrency.buyCommissions, buyCommission => {
        const index = _.findIndex(newBuyCommissions, (newBuyCommission) => (newBuyCommission.title === buyCommission.title));

        if (index !== -1) {
          newBuyCommissions[index] = buyCommission;
        }
      });

      // sell commission
      let newSellCommissions = _.filter(sellCommissions, (commission) => (eCurrency.title !== commission.title));

      _.forEach(eCurrency.sellCommissions, sellCommission => {
        const index = _.findIndex(newSellCommissions, (newSellCommission) => (newSellCommission.title === sellCommission.title));

        if (index !== -1) {
          newSellCommissions[index] = sellCommission;
        }
      });

      // exchange commission
      let newExchangeCommissions = _.filter(exchangeCommissions, (commission) => (eCurrency.title !== commission.title));

      _.forEach(eCurrency.exchangeCommissions, exchangeCommission => {
        const index = _.findIndex(newExchangeCommissions, (newExchangeCommission) => (newExchangeCommission.title === exchangeCommission.title));

        if (index !== -1) {
          newExchangeCommissions[index] = exchangeCommission;
        }
      });

      const updateECurrency = await Ecurrency.update({id: eCurrency.id}, {
        buyCommissions: newBuyCommissions,
        sellCommissions: newSellCommissions,
        exchangeCommissions: newExchangeCommissions,
      }).intercept((err) => {
        return err;
      }).fetch();    
      
    });

    // All done.
    return exits.success();

  }


};

