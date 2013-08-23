goog.provide('app');

goog.require('app.ChatListController');
goog.require('app.NewsFeedController');
goog.require('app.NewsFeedScroller');
goog.require('app.PostRepository');
goog.require('app.TickerController');
goog.require('app.UpdateRepository');
goog.require('ng.Scroller.module');


app.main = function () {
  app.module = angular.module('app', [ 'ngScroller' ]);

  app.module.controller('ChatListController', app.ChatListController);
  app.module.controller('NewsFeedController', app.NewsFeedController);
  app.module.controller('TickerController', app.TickerController);

  app.module.service('posts', app.PostRepository);
  app.module.service('updates', app.UpdateRepository);
};


goog.exportSymbol('main', app.main);
