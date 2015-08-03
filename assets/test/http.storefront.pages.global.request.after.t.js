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

var actionName = 'http.storefront.pages.global.request.after'; 

describe(actionName, function () {

  var action;

  before(function () {
    action = require('../src/domains/storefront/http.storefront.pages.global.request.after');
  });

  it("passes right through if the context doesn't have a response.viewName", function(done) {
    var callback = function(err) {
      assert.ok(!err, "Callback was called with an error: " + err);
      done();
    }
    var context = Simulator.context(actionName, callback);

    context.response.viewName = '';

    Simulator.simulate(actionName, action, context, callback);
  });

  describe("throws an informative error if", function() {

    it("you didn't make rules", function(done) {
      var callback = function(err) {
        throw new Error("Arrived at callback and shouldn't have.");
        done();
      };

      var context = Simulator.context(actionName, callback);

      context.response.viewName = 'original';

      assert.throws(function() {
        Simulator.simulate(actionName, action, context, callback);
      }, "No rules found");
      done();
    });

    it("you specify an unknown ruletype", function(done) {
      var callback = function(err) {
        throw new Error("Arrived at callback and shouldn't have.");
        done();
      };

      var context = Simulator.context(actionName, callback);

      context.configuration = {
        rules: [
          {
            type: 'bad'
          }
        ]
      };

      context.response.viewName = 'original';

      assert.throws(function() {
        Simulator.simulate(actionName, action, context, callback);
      }, "Unknown AlternativeView rule type");
      done();
    });

    it("you specified a queryparams rule and did not supply params", function(done) {
      var callback = function(err) {
        throw new Error("Arrived at callback and shouldn't have.");
        done();
      };

      var context = Simulator.context(actionName, callback);

      context.configuration = {
        rules: [
          {
            type: 'queryparams'
          }
        ]
      };

      context.response.viewName = 'original';

      assert.throws(function() {
        Simulator.simulate(actionName, action, context, callback);
      }, "specified without 'params'");
      done();
    });

    it("you specified a headers rule and did not supply params", function(done) {
      var callback = function(err) {
        throw new Error("Arrived at callback and shouldn't have.");
        done();
      };

      var context = Simulator.context(actionName, callback);

      context.configuration = {
        rules: [
          {
            type: 'headers'
          }
        ]
      };

      context.response.viewName = 'original';

      assert.throws(function() {
        Simulator.simulate(actionName, action, context, callback);
      }, "specified without 'headers'");
      done();
    });
  
    it("you didn't supply a viewName in your rule", function(done) {
      var callback = function(err) {
        throw new Error("Arrived at callback and shouldn't have.");
        done();
      };

      var context = Simulator.context(actionName, callback);

      context.configuration = {
        rules: [
          {
            type: 'queryparams',
            params: {
              some: 'thing'
            }
          }
        ]
      };

      context.request.url = "/?some=thing";

      context.response.viewName = 'original';

      assert.throws(function() {
        Simulator.simulate(actionName, action, context, callback);
      }, "specified with no viewName");
      done();
    });
  });

  describe('queryparams rules', function() {
    function tryUrl(url, shouldChange) {
      return function(done) {

        var context;

        var callback = function(err) {
          assert.ok(!err, "Callback was called with an error: " + err);
          assert.equal(context.response.viewName, shouldChange? "faceting-partial" : "original");
          done();
        };

        context = Simulator.context(actionName, callback);

        context.request = {
          url: url,
        };

        context.response = {
          viewName: "original",
          set: function(h, v) {
            assert.equal(h, "X-Canonical-Url", "Tried to set a header that wasn't X-Canonical-Url");
            assert.equal(v, url, "Tried to set a header that wasn't X-Canonical-Url");
          }
        };

        context.configuration = {
          rules: [
            {
              type: 'queryparams',
              params: {
                partial: 'true'
              },
              viewName: 'faceting-partial'
            }
          ]
        };


        Simulator.simulate(actionName, action, context, callback);
      }
    }

    it('sets the viewName to the queryparam rule viewName if the url parameter matches', tryUrl('/c/167?other=parameters&partial=true', true));
    it('does not apply a queryparam rule if the url parameters do not exist', tryUrl('/c/167?other=parameters', false));
    it('does not apply a queryparam rule if the url parameters are wrong', tryUrl('/c/167?other=parameters&partial=FLOO', false));
  });

  describe('headers rules', function() {
    function tryHeaders(headers, shouldChange) {
      return function(done) {

        var context;

        var callback = function(err) {
          assert.ok(!err, "Callback was called with an error: " + err);
          assert.equal(context.response.viewName, shouldChange? "faceting-partial" : "original");
          done();
        };

        context = Simulator.context(actionName, callback);

        context.request = {
          url: '/',
          headers: headers
        };

        context.response = {
          viewName: "original",
          set: function(h, v) {
            assert.equal(h, "X-Canonical-Url", "Tried to set a header that wasn't X-Canonical-Url");
          }
        };

        context.configuration = {
          rules: [
            {
              type: 'headers',
              headers: {
                'X-Requested-With': 'A cherry on top'
              },
              viewName: 'faceting-partial'
            }
          ]
        };


        Simulator.simulate(actionName, action, context, callback);
      }
    }
    it('sets the viewName to the headers rule viewName if there is a header matching', tryHeaders({ 'X-Requested-With': 'A cherry on top' }, true));
    it('does not apply a headers rule if there is no such header', tryHeaders({}, false));
    it('does not apply a headers rule if the header does not match', tryHeaders({ 'X-Requested-With': 'A banana' }, false));
  });

});
