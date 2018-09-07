/**
 * ConfigController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  getConfigUser: async (req, res) => {

    sails.log('ConfigController::getConfigUser called');

    const params = req.allParams();

    const config = await Config.find().limit(1)
    .intercept((err) => {
      return err;
    });

    return res.status(200).json({config: _.omit(_.head(config), ['emailAddress', 'emailPwd'])});

  },

  getConfigAdmin: async (req, res) => {

    sails.log('ConfigController::getConfigAdmin called');

    const params = req.allParams();

    let config = await Config.find().limit(1)
    .intercept((err) => {
      return err;
    });

    return res.status(200).json({config: _.head(config)});

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

