goog.provide('app');

goog.require('app.FeedController');
goog.require('app.FeedRepository');
goog.require('ng.InPageScrollerStyler');
goog.require('ng.Scroller');
goog.require('ng.directive');


app.main = function () {
  app.module = angular.module('app', []);

  app.module.controller('FeedController', app.FeedController);
  app.module.service('feed', app.FeedRepository);

  app.module.directive('ngScroller', ng.directive(ng.Scroller));
};


goog.exportSymbol('main', app.main);
