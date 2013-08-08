goog.provide('app.NewsFeedController');

goog.require('ng.Controller');


app.NewsFeedController = function ($scope, posts) {
  ng.Controller.call(this, $scope);

  this.$scope['posts'] = posts;
};

goog.inherits(app.NewsFeedController, ng.Controller);
