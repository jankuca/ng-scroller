goog.provide('app.TickerController');

goog.require('ng.Controller');


/**
 * @constructor
 * @extends {ng.Controller}
 * @param {!angular.Scope} $scope A scope.
 * @param {!app.UpdateRepository} updates A ticket update repository.
 * @ngInject
 */
app.TickerController = function ($scope, updates) {
  ng.Controller.call(this, $scope);

  this.$scope['updates'] = updates;
};

goog.inherits(app.TickerController, ng.Controller);
