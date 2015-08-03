/**
 * Implementation for http.storefront.pages.global.request.after
 * This function will receive the following context object:
 */

var setAlternative = require('../../set-alternative');

module.exports = function(context, callback) {

  if (context.response.viewName) {
    setAlternative(context);
  }

  callback();
  
};