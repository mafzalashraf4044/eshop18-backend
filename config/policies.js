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
    logout: 'isAuthenticated',
  },

  UserController: {
    getUsers: 'isAdmin',
    createUser: 'isAdmin',
    updateUser: 'isAdmin',
    deleteUser: 'isAdmin',
    updateVerfiedStatus: 'isAdmin',
    sendEmailToList: 'isAdmin',
    getUserOrdersAndAccounts: 'isAdmin',
    changePasswordAdmin: 'isAdmin',

    verifyEmail: true,
    registerUser: true,
    forgotPwd: true,
    resetPassword: true,
    editProfile: 'isAuthenticated',
    changePassword: 'isAuthenticated',
  },

  AccountController: {
    getAccounts: 'isAdmin',
    createAccount: 'isAdmin',
    updateAccount: 'isAdmin',
    deleteAccount: 'isAdmin',

    getUserAccounts: 'isAuthenticated',
    createUserAccount: 'isAuthenticated',
    editUserAccount: 'isAuthenticated',
    deleteUserAccount: 'isAuthenticated',
  },

  EcurrencyController: {
    getECurrencies: true,
    createECurrency: 'isAdmin',
    updateECurrency: 'isAdmin',
    deleteECurrency: 'isAdmin',
  },

  OrderController: {
    getOrders: 'isAdmin',
    createOrder: 'isAdmin',
    updateOrder: 'isAdmin',
    deleteOrder: 'isAdmin',
    updateOrderStatus: 'isAdmin',
    getUserDetailsFromOrder: 'isAdmin',

    currencyCalculator: true,
    placeOrder: 'isAuthenticated',
    getUserOrders: 'isAuthenticated',
  },

  PaymentMethodController: {
    getPaymentMethods: true,
    createPaymentMethod: 'isAdmin',
    updatePaymentMethod: 'isAdmin',
    deletePaymentMethod: 'isAdmin',
    updateIsBankingEnabled: 'isAdmin',
  },

  NewsController: {
    getNews: true,
    createNews: 'isAdmin',
    updateNews: 'isAdmin',
    deleteNews: 'isAdmin',
  },

  ReviewController: {
    getReviews: true,
    createReview: 'isAdmin',
    updateReview: 'isAdmin',
    deleteReview: 'isAdmin',
  },

  ConfigController: {
    getConfigUser: 'isAuthenticated',
    getConfigAdmin: 'isAdmin',
    createOrUpdateConfig: 'isAdmin',
  },

};
