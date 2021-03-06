/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'pages/homepage'
  },

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/

  'POST /login': 'AuthController.login',
  'GET /logout': 'AuthController.logout',
  'POST /admin-login': 'AuthController.adminLogin',
  'GET /is-logged-in': 'AuthController.isLoggedIn',
  
  'GET /user': 'UserController.getUsers',
  // 'POST /user': 'UserController.createUser',
  // 'PATCH /user/:id': 'UserController.updateUser',
  // 'DELETE /user/:id': 'UserController.deleteUser',
  'POST /update-verifed-status/:id': 'UserController.updateVerfiedStatus',
  'POST /verify-email/:id': 'UserController.verifyEmail',
  'POST /send-email-to-list': 'UserController.sendEmailToList',
  'GET /get-user-orders-and-accounts/:id': 'UserController.getUserOrdersAndAccounts',
  'POST /change-password-admin/:id': 'UserController.changePasswordAdmin',
  'POST /register-user': 'UserController.registerUser',
  'PATCH /edit-profile/:id': 'UserController.editProfile',
  'POST /change-password/:id': 'UserController.changePassword',
  'POST /forgot-password': 'UserController.forgotPwd',
  'POST /reset-password/:id': 'UserController.resetPassword',

  'GET /news': 'NewsController.getNews',
  'POST /news': 'NewsController.createNews',
  'PATCH /news/:id': 'NewsController.updateNews',
  'DELETE /news/:id': 'NewsController.deleteNews',

  'GET /review': 'ReviewController.getReviews',
  'POST /review': 'ReviewController.createReview',
  'PATCH /review/:id': 'ReviewController.updateReview',
  'DELETE /review/:id': 'ReviewController.deleteReview',

  'GET /paymentmethod': 'PaymentMethodController.getPaymentMethods',
  'POST /paymentmethod': 'PaymentMethodController.createPaymentMethod',
  'PATCH /paymentmethod/:id': 'PaymentMethodController.updatePaymentMethod',
  'DELETE /paymentmethod/:id': 'PaymentMethodController.deletePaymentMethod',
  'POST /update-is-banking-enabled/:id': 'PaymentMethodController.updateIsBankingEnabled',

  'GET /ecurrency': 'EcurrencyController.getECurrencies',
  'POST /ecurrency': 'EcurrencyController.createECurrency',
  'PATCH /ecurrency/:id': 'EcurrencyController.updateECurrency',
  'DELETE /ecurrency/:id': 'EcurrencyController.deleteECurrency',

  'GET /order': 'OrderController.getOrders',
  // 'POST /order': 'OrderController.createOrder',
  // 'PATCH /order/:id': 'OrderController.updateOrder',
  // 'DELETE /order/:id': 'OrderController.deleteOrder',
  'POST /update-order-status/:id': 'OrderController.updateOrderStatus',
  'POST /currency-calculator': 'OrderController.currencyCalculator',
  'POST /place-order': 'OrderController.placeOrder',
  'GET /user-orders': 'OrderController.getUserOrders',
  'GET /user-details-from-order/:id': 'OrderController.getUserDetailsFromOrder',

  // 'GET /account': 'AccountController.getAccounts',
  // 'POST /account': 'AccountController.createAccount',
  // 'PATCH /account/:id': 'AccountController.updateAccount',
  // 'DELETE /account/:id': 'AccountController.deleteAccount',
  'GET /user-account': 'AccountController.getUserAccounts',
  'POST /user-account': 'AccountController.createUserAccount',
  'PATCH /user-account/:id': 'AccountController.editUserAccount',
  'DELETE /user-account/:id': 'AccountController.deleteUserAccount',

  'GET /config-user': 'ConfigController.getConfigUser',
  'GET /config-admin': 'ConfigController.getConfigAdmin',
  'POST /config': 'ConfigController.createOrUpdateConfig',
};
