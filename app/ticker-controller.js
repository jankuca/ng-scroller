goog.provide('app.TickerController');

goog.require('ng.Controller');


app.TickerController = function ($scope, updates) {
  ng.Controller.call(this, $scope);

  this.$scope['updates'] = updates;
};

goog.inherits(app.TickerController, ng.Controller);
