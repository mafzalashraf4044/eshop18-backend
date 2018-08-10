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
  ******************************************************or*********************/

  'POST /login': 'AuthController.login',
  'GET /logout': 'AuthController.logout',

  'GET /user': 'UserController.getUsers',
  'POST /user': 'UserController.createUser',
  'PATCH /user/:id': 'UserController.updateUser',
  'DELETE /user/:id': 'UserController.deleteUser',
  'POST /update-verifed-status/:id': 'UserController.updateVerfiedStatus',
  'POST /verify-email/:id': 'UserController.verifyEmail',
  'POST /send-email-to-list': 'UserController.sendEmailToList',
  
  'GET /news': 'NewsController.getNews',
  'POST /news': 'NewsController.createNews',
  'PATCH /news/:id': 'NewsController.updateNews',
  'DELETE /news/:id': 'NewsController.deleteNews',

  'GET /paymentmethod': 'PaymentMethodController.getPaymentMethods',
  'POST /paymentmethod': 'PaymentMethodController.createPaymentMethod',
  'PATCH /paymentmethod/:id': 'PaymentMethodController.updatePaymentMethod',
  'DELETE /paymentmethod/:id': 'PaymentMethodController.deletePaymentMethod',

  'GET /ecurrency': 'EcurrencyController.getECurrencies',
  'POST /ecurrency': 'EcurrencyController.createECurrency',
  'PATCH /ecurrency/:id': 'EcurrencyController.updateECurrency',
  'DELETE /ecurrency/:id': 'EcurrencyController.deleteECurrency',

  'GET /order': 'OrderController.getOrders',
  'POST /order': 'OrderController.createOrder',
  'PATCH /order/:id': 'OrderController.updateOrder',
  'DELETE /order/:id': 'OrderController.deleteOrder',

  'GET /account': 'AccountController.getAccounts',
  'POST /account': 'AccountController.createAccount',
  'PATCH /account/:id': 'AccountController.updateAccount',
  'DELETE /account/:id': 'AccountController.deleteAccount',

};
