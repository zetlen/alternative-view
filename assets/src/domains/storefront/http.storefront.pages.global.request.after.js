/**
 * Implementation for http.storefront.pages.global.request.after
 * This function will receive the following context object:

http://www.infinitelooper.com/?v=6_9blTxwFeA&p=n#/110;123

 */

var url = require('url');
var qs = require('querystring');

function getQuery(u) {
  return qs.parse(url.parse(u).query);
}

function getAlternative(response) {
  if (getQuery(response.url).partial === "true")
    return "faceting-partial";
}

module.exports = function(context, callback) {
  context.response.viewName = getAlternative(context.response) || context.response.viewName;
  callback();
};