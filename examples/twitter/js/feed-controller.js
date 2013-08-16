goog.provide('app.FeedController');

goog.require('ng.Controller');


/**
 * @constructor
 * @extends {ng.Controller}
 * @param {!angular.Scope} $scope A scope.
 * @param {!app.FeedRepository} feed A feed item repository.
 * @ngInject
 */
app.FeedController = function ($scope, feed) {
  ng.Controller.call(this, $scope);

  this.$scope['feed'] = feed;
};

goog.inherits(app.FeedController, ng.Controller);
