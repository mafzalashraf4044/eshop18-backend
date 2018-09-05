/**
 * ConfigController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  getConfig: async (req, res) => {

    sails.log('ConfigController::getConfig called');

    const params = req.allParams();
    
    const criteria = {where: {isArchived: false}};

    let config = await Config.find().limit(1)
    .intercept((err) => {
      return err;
    });

    if (req.user.role === '__costumer') {
      config = _.omit(this, ['emailAddress', 'emailPwd']);
    }

    return res.status(200).json({config});

  },

  createOrUpdateConfig: async (req, res) => {
    /**
     * Params:
     * - buyOrderConfirmedText (req)
     * - sellOrderConfirmedText (req)
     * - exchangeOrderConfirmedText (req)
     * - emailAddress (req)
     * - emailPwd (req)
    */

    sails.log('ConfigController:: createOrUpdateConfig called');

    const params = req.allParams();

    let config = await Config.find().limit(1)
    .intercept((err) => {
      return err;
    });

    if (config.length === 0) {
      config = await Config.create(params)
      .intercept((err) => {
        return err;
      }).fetch();
    } else {
      config = await Config.update({id: _.head(config).id}, params)
      .intercept((err) => {
        return err;
      }).fetch();
    }

    return res.status(200).json({config});
  },

};

