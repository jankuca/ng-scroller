goog.provide('twitter');

goog.require('twitter.FeedController');
goog.require('twitter.FeedRepository');
goog.require('ng.InPageScrollerStyler');
goog.require('ng.Scroller');
goog.require('ng.directive');


twitter.main = function () {
  twitter.module = angular.module('twitter', []);

  twitter.module.controller('FeedController', twitter.FeedController);
  twitter.module.service('feed', twitter.FeedRepository);

  twitter.module.directive('ngScroller', ng.directive(ng.Scroller));
};


goog.exportSymbol('main', twitter.main);
