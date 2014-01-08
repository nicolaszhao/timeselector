/*
 * timeselector
 * https://github.com/nicolaszhao/timeselector
 *
 * Copyright (c) 2014 Nicolas Zhao
 * Licensed under the MIT license.
 */

(function($) {

  // Collection method.
  $.fn.timeselector = function() {
    return this.each(function(i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

  // Static method.
  $.timeselector = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.timeselector.options, options);
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.timeselector.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].timeselector = function(elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

}(jQuery));
