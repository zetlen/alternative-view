/**
 * Implementation for http.storefront.pages.global.request.after
 * This function will receive the following context object:
 *
 * http://www.infinitelooper.com/?v=6_9blTxwFeA&p=n#/110;123
 *
 */

var url = require('url');
var qs = require('querystring');

function getQuery(u) {
  return qs.parse(url.parse(u).query);
}

function createAlternativeViewName(rule, context) {
  if (!rule.viewName) {
    throw new Error("Rule specified with no viewName or viewName rule.");
  }
  if (typeof rule.viewName === "string") {
    return rule.viewName;
  }
}

var RuleStrategies = {
  queryparams: function(rule, context) {
    if (!rule.params) {
      throw new Error("Rule of type 'queryparams' specified without 'params' collection.");
    }
    var querystring = getQuery(context.request.url);
    if (Object.keys(rule.params).every(function(key) {
      return querystring[key] === rule.params[key].toString();
    })) {
      return createAlternativeViewName(rule, context);
    }
  }
};


function getAlternative(context) {

  if (!context.configuration || !context.configuration.rules) {
    throw new Error("No rules found! Please create rules in your action configuration.");
  }

  return [].reduce.call(context.configuration.rules, function(qual, rule) {

    if (!RuleStrategies[rule.type]) {
      throw new Error("Unknown AlternativeView rule type: " + rule.type);
    }

    return qual || RuleStrategies[rule.type](rule, context);

  }, false);

}

module.exports = function(context, callback) {

  if (context.response.viewName)
    context.response.viewName = getAlternative(context) || context.response.viewName;

  callback();
};