/**
 * This is a scaffold for unit tests for the custom function for
 * `http.storefront.pages.global.request.after`.
 * Modify the test conditions below. You may:
 *  - add special assertions for code actions from Simulator.assert
 *  - create a mock context with Simulator.context() and modify it
 *  - use and modify mock Mozu business objects from Simulator.fixtures
 *  - use Express to simulate request/response pairs
 */

'use strict';

var Simulator = require('mozu-action-simulator');
var assert = Simulator.assert;

describe('http.storefront.pages.global.request.after', function () {

  var action;

  before(function () {
    action = require('../src/domains/storefront/http.storefront.pages.global.request.after');
  });

  function tryUrl(url, shouldChange) {
    return function(done) {

      var context;

      var callback = function(err) {
        assert.ok(!err, "Callback was called with an error: " + err);
        assert.equal(context.response.viewName, shouldChange? "faceting-partial" : "original");
        done();
      };

      context = Simulator.context('http.storefront.pages.global.request.after', callback);

      context.response = {
        viewName: "original",
        url: url
      };


      Simulator.simulate('http.storefront.pages.global.request.after', action, context, callback);
    }
  }


  it('sets the viewName to "faceting-partial" if the url parameter "partial=true" exists', tryUrl('/c/167?other=parameters&partial=true', true));
  it('leaves the viewName alone if the url parameter "partial=true" does not exist', tryUrl('/c/167?other=parameters', false));
});
