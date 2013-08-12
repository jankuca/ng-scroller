goog.provide('app.NewsFeedScroller');

goog.require('ng.InPageScrollerStyler');


/**
 * @constructor
 * @extends {ng.InPageScrollerStyler}
 */
app.NewsFeedScroller = function (scroller, container, carousel) {
  ng.InPageScrollerStyler.call(this, scroller, container, carousel);

  this.viewport = window;
};

goog.inherits(app.NewsFeedScroller, ng.InPageScrollerStyler);


app.NewsFeedScroller.prototype.getItemTemplateKey = function (item) {
  if (item['photo_url']) return 'photo';
  return null;
};
