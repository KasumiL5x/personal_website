// toggle mobile nav
$('.header__mobile-nav-toggle').on('click', function() {
  this.classList.toggle('active');
  if( $('.header__nav').hasClass("opened") ) {
    $('.header__nav').removeClass("opened");
    $('.header__nav').addClass("closed");
  } else {
    $('.header__nav').addClass("opened");
    $('.header__nav').removeClass("closed");
  }
});

var Utils = {
  isElementInView: function(element, fullyInView, screenBias) {
    var pageTop = $(window).scrollTop() - ($(window).height() * screenBias);
    var pageBottom = pageTop + $(window).height();
    var elementTop = $(element).offset().top;
    var elementBottom = elementTop + $(element).height();

    if( fullyInView === true ) {
      return ((pageTop < elementTop) && (pageBottom > elementBottom));
    } else {
      return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
    }
  }
};

var Page = {};
// gather all activations
Page.activations = [];
$('.skills-list').each(function() {
  Page.activations.push({
    triggerObject: $(this), // object to trigger activation
    objects: $(this).find('.ng-progress'), // objects to do something to
    activated: false // whether or not this activation has been activated; TODO: Remove instead of using this bool check!
  });
});

Page.activateOnScroll = function() {
  var yPos = window.pageYOffset;
  for (var i = 0; i < this.activations.length; i++) {
    var curr = this.activations[i];
    var inView = Utils.isElementInView(curr.triggerObject, false, 0);
    if( !curr.activated && inView ) {
      // console.log('Activating: ' + curr.objects);
      curr.activated = true;
      ng.initProgressBars(curr.objects);
    }
  }
};

$(window).on('scroll', function() {
  Page.activateOnScroll();
});

$(document).ready(function() {
  // try to activate upon load in case elements are already visible
  Page.activateOnScroll();
});


// filterable gallery stuff
$(document).ready(function() {
    $('.portfolio-filter a').click(function() {
      $('.portfolio-filter .current').removeClass('current');
      $(this).addClass('current');

      var selectedCategory = $(this).attr("data-filter");

      // make everything not current
      $('.portfolio > .items-wrapper > figure ').removeClass('current').addClass('not-current');

      $('.portfolio > .items-wrapper > figure ').each(function() {
        if( selectedCategory === '*' ) {
          // if all, remove non/current from everything
          $(this).removeClass('current, not-current');
        } else if( $(this).attr('data-categories').indexOf(selectedCategory) > -1 ) {
          // enable current for only matching elements
          $(this).removeClass('not-current');
          $(this).addClass('current');
        }
      });

      return false;
    });
});
