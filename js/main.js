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


// carousel stuff
$('#carousel1').NGCarousel({
  arrowLeft: '#carousel1left',
  arrowRight: '#carousel1right',
  speed: 1000,
  slideDuration: 4000
});
$('#carousel2').NGCarousel({
  arrowLeft: '#carousel2left',
  arrowRight: '#carousel2right',
  speed: 1000,
  slideDuration: 2000
});
