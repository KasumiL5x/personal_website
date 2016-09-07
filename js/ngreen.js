// ngreen.js
//
// Table of Contents
//  - Progress bars

var ng = {
  initProgressBars: function(bars) {
    $(bars).each(function(a, t) {
      var element = $(this);
      var percent = parseInt(element.attr('ng-percent')) || 0; // value of progress bar
      var delay = parseInt(element.attr('ng-delay')) || 0; // time before animation starts in ms
      var duration = parseInt(element.attr('ng-duration')) || 500; // duration of animation in ms

      if( element.hasClass('ng-animated') ) {
        element.css({width: '0%'}); // reset first
        setTimeout(function() {
          element.animate({
            width: percent + '%' // parameters to animate
          }, {
            duration: duration, // time for animation
          }, "easeInOutExpo"); // easing for animation
        }, delay); // delay before animation
      } else {
        element.css({
          width: percent + '%' // force percentage
        });
      }
    });
  },

  initAllProgressBars: function() {
    this.initProgressBars($('.ng-progress'));
  }
}

