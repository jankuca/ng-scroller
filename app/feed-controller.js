goog.provide('twitter.FeedController');

goog.require('ng.Controller');


/**
 * @constructor
 * @extends {ng.Controller}
 * @param {!angular.Scope} $scope A scope.
 * @param {!twitter.FeedRepository} feed A feed item repository.
 * @ngInject
 */
twitter.FeedController = function ($scope, feed) {
  ng.Controller.call(this, $scope);

  this.$scope['feed'] = feed;
};

goog.inherits(twitter.FeedController, ng.Controller);
