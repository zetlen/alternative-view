/**
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
  },
  headers: function(rule, context) {
    if (!rule.headers) {
      throw new Error("Rule of type 'headers' specified without 'headers' collection.");
    }
    if (Object.keys(rule.headers).every(function(key) {
      return context.request.headers[key] === rule.headers[key];
    })) {
      return createAlternativeViewName(rule, context);
    }
  }
};


module.exports = function setAlternative(context, rules) {

  if ((!rules || rules.length === 0) && (!context.configuration || !context.configuration.rules)) {
    throw new Error("No rules found! Please create rules in your action configuration.");
  }

  rules = rules || context.configuration.rules;

  var alternative = [].reduce.call(rules, function(qual, rule) {

    if (!RuleStrategies[rule.type]) {
      throw new Error("Unknown AlternativeView rule type: " + rule.type);
    }
    console.log('alternative-view: the context matched a ' + rule.type + ' rule');
    return qual || RuleStrategies[rule.type](rule, context);

  }, false);

  if (alternative) {
    console.log('alternative-view: updating context.response.viewName to ' + alternative);
    context.response.set('X-Canonical-Url', context.request.url);
    context.response.viewName = alternative;
  }

};