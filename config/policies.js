/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  AuthController: {
    login: true,
    adminLogin: true,
    isLoggedIn: true,
    logout: true,
  },

  UserController: {
    getUsers: 'isAuthenticatedAdmin',
    createUser: 'isAuthenticatedAdmin',
    updateUser: 'isAuthenticatedAdmin',
    deleteUser: 'isAuthenticatedAdmin',
    updateVerfiedStatus: 'isAuthenticatedAdmin',
    verifyEmail: 'isAuthenticatedAdmin',
    sendEmailToList: 'isAuthenticatedAdmin',
    getUserOrdersAndAccounts: 'isAuthenticatedAdmin',

    registerUser: true,
    editProfile: 'isAuthenticatedCustomer',
    changePassword: 'isAuthenticatedCustomer',
  },

  AccountController: {
    getAccounts: 'isAuthenticatedAdmin',
    createAccount: 'isAuthenticatedAdmin',
    updateAccount: 'isAuthenticatedAdmin',
    deleteAccount: 'isAuthenticatedAdmin',
  },

  EcurrencyController: {
    getECurrencies: 'isAuthenticatedAdmin',
    createECurrency: 'isAuthenticatedAdmin',
    updateECurrency: 'isAuthenticatedAdmin',
    deleteECurrency: 'isAuthenticatedAdmin',
  },

  OrderController: {
    getOrders: 'isAuthenticatedAdmin',
    createOrder: 'isAuthenticatedAdmin',
    updateOrder: 'isAuthenticatedAdmin',
    deleteOrder: 'isAuthenticatedAdmin',
    updateOrderStatus: 'isAuthenticatedAdmin',
  },

  PaymentMethodController: {
    getPaymentMethods: 'isAuthenticatedAdmin',
    createPaymentMethod: 'isAuthenticatedAdmin',
    updatePaymentMethod: 'isAuthenticatedAdmin',
    deletePaymentMethod: 'isAuthenticatedAdmin',
  },

  NewsController: {
    getNews: true,
    createNews: 'isAuthenticatedAdmin',
    updateNews: 'isAuthenticatedAdmin',
    deleteNews: 'isAuthenticatedAdmin',
  },

};
