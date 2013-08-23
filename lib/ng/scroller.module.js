goog.provide('ng.Scroller.module');

goog.require('ng.Scroller');
goog.require('ng.directive');


ng.Scroller.module = angular.module('ngScroller', []);
ng.Scroller.module.directive('ngScroller', ng.directive(ng.Scroller));
