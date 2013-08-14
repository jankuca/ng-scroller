goog.provide('app.NewsFeedController');

goog.require('ng.Controller');


/**
 * @constructor
 * @extends {ng.Controller}
 * @param {!angular.Scope} $scope A scope.
 * @param {!app.PostRepository} posts A post repository.
 * @ngInject
 */
app.NewsFeedController = function ($scope, posts) {
  ng.Controller.call(this, $scope);

  this.$scope['posts'] = posts;

  this.$scope.getScrollerItemTemplateKey = function (item, item_id) {
    if (item['photo_url']) return 'photo';
    return null;
  };
};

goog.inherits(app.NewsFeedController, ng.Controller);
