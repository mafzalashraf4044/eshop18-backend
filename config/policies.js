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
    verifyEmail: true,
    sendEmailToList: 'isAuthenticatedAdmin',
    getUserOrdersAndAccounts: 'isAuthenticatedAdmin',

    registerUser: true,
    editProfile: 'isAuthenticatedCustomer',
    changePassword: 'isAuthenticatedCustomer',
  },

  AccountController: {
    getAccounts: true,
    createAccount: 'isAuthenticatedAdmin',
    updateAccount: 'isAuthenticatedAdmin',
    deleteAccount: 'isAuthenticatedAdmin',

    getUserAccounts: 'isAuthenticatedCustomer',
    createUserAccount: 'isAuthenticatedCustomer',
    editUserAccount: 'isAuthenticatedCustomer',
    deleteUserAccount: 'isAuthenticatedCustomer',
  },

  EcurrencyController: {
    getECurrencies: true,
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
    getUserDetailsFromOrder: 'isAuthenticatedAdmin',

    placeOrder: 'isAuthenticatedCustomer',
    getUserOrders: 'isAuthenticatedCustomer',
  },

  PaymentMethodController: {
    getPaymentMethods: true,
    createPaymentMethod: 'isAuthenticatedAdmin',
    updatePaymentMethod: 'isAuthenticatedAdmin',
    deletePaymentMethod: 'isAuthenticatedAdmin',
    updateIsBankingEnabled: 'isAuthenticatedAdmin',
  },

  NewsController: {
    getNews: true,
    createNews: 'isAuthenticatedAdmin',
    updateNews: 'isAuthenticatedAdmin',
    deleteNews: 'isAuthenticatedAdmin',
  },

  ConfigController: {
    getConfigUser: 'isAuthenticatedCustomer',
    getConfigAdmin: 'isAuthenticatedAdmin',
    createOrUpdateConfig: 'isAuthenticatedAdmin',
  },

};
