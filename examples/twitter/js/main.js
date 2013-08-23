goog.provide('app');

goog.require('app.FeedController');
goog.require('app.FeedRepository');
goog.require('ng.Scroller.module');


app.main = function () {
  app.module = angular.module('app', [ 'ngScroller' ]);

  app.module.controller('FeedController', app.FeedController);
  app.module.service('feed', app.FeedRepository);
};


goog.exportSymbol('main', app.main);
