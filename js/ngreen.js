// ngreen.js
//
// Table of Contents
//	- Progress bars
//	- Carousel

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


// Carousel
// --------------------------------------------------
// trigger factory function in different ways to support modular JS libraries
;(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports !== 'undefined') {
		module.exports = factory(require('jquery'));
	} else {
		factory(jQuery);
	}
})(function($){
	var NGCarousel = (function(element, settings) {
		var instanceIDCounter = 0; // tracks unique IDs

		// constructor
		function _NGCarousel(element, settings) {
			this.defaults = {
				slideDuration: '3000',
				speed: 500,
				arrowRight: '.arrow-right',
				arrowLeft: '.arrow-left'
			};

			// create new property to hold merged default/user settings
			this.settings = $.extend({}, this, this.defaults, settings);

			// state values that change
			this.initials = {
				currSlide : 0,
				$currSlide: null,
				totalSlides : false,
				cssTransitions: false
			};

			// attach properties to the initials
			$.extend(this, this.initials);

			// hold reference to dom element
			this.$el = $(element);

			// ensure this references NGCarousel
			this.changeSlide = $.proxy(this.changeSlide, this);

			// starts everything
			this.init();
			// give a unique ID
			this.instanceID = instanceIDCounter++;
		}

		return _NGCarousel;
	})();
	// calls starter methods and associates .ng-carousel-class class

	NGCarousel.prototype.init = function() {
		// test for css animations
		this.cssTransitionsTest();
		// add class to style carousel
		this.$el.addClass('ngreen-carousel');
		// build dom elements for carousel
		this.build();
		// handle events
		this.events();
		// bind events
		this.activate();
		// start timer for slide progression
		// this.initTimer();
	};
	// creates dom element to test existence of properties on its style object to see if css transitions are available
	NGCarousel.prototype.cssTransitionsTest = function() {
		var elem = document.createElement('modernizr');
		var props = ["transition","WebkitTransition","MozTransition","OTransition","msTransition"];
		for ( var i in props ) {
			var prop = props[i];
			var result = elem.style[prop] !== undefined ? prop : false;
			if( result ) {
				this.cssTransitions = result;
				break;
			}
		}
	};
	// add css transition duration to dom object's style property. this is triggered just before slides animate
	NGCarousel.prototype.addCSSDuration = function() {
    var thisPtr = this;
		this.$el.find('.slide').each(function(){
			this.style[thisPtr.cssTransitions+'Duration'] = thisPtr.settings.speed+'ms';
		});
	};
	// remove css transition duration
	NGCarousel.prototype.removeCSSDuration = function() {
    var thisPtr = this;
		this.$el.find('.slide').each(function(){
			this.style[thisPtr.cssTransitions+'Duration'] = '';
		});
	};
	// create list of indicators based on amount of slides
	NGCarousel.prototype.build = function() {
		var $indicators = this.$el.append('<ul class="indicators" >').find('.indicators');
		this.totalSlides = this.$el.find('.slide').length;
		for( var i = 0; i < this.totalSlides; ++i ) {
			$indicators.append('<li data-index='+i+'>');
		}
	};
	// activates the first slide
	NGCarousel.prototype.activate = function() {
			this.$currSlide = this.$el.find('.slide').eq(0);
			this.$el.find('.indicators li').eq(0).addClass('active');
	};
	// associates event handlers to events
	NGCarousel.prototype.events = function() {
		$('body')
			.on('click',this.settings.arrowRight,{direction:'right'},this.changeSlide)
			.on('click',this.settings.arrowLeft,{direction:'left'},this.changeSlide)
			.on('click','.indicators li',this.changeSlide);
	};
	// resets the timer
	NGCarousel.prototype.clearTimer = function() {
		if( this.timer ) {
			clearInterval(this.timer);
		}
	};
	// initialize the timer
	NGCarousel.prototype.initTimer = function(first_argument) {
		this.timer = setInterval(this.changeSlide, this.settings.slideDuration);
	};
	// starts the timer
	NGCarousel.prototype.startTimer = function(first_argument) {
		this.initTimer();
		this.throttle = false;
	};
	// triggers set of functions to change slides
	NGCarousel.prototype.changeSlide = function(e) {
		// ensure animations are triggered one at a time
		if( this.throttle ) {
			return;
		}
		this.throttle = true;

		// stop timer as animation is happening
		this.clearTimer();

		// which direction are we going?
		var direction = this._direction(e);

		// select next slide
		var animate = this._next(e,direction);
		if( !animate ) {
			return;
		}

		// activate next slide to scroll into view
		var $nextSlide = this.$el.find('.slide').eq(this.currSlide).addClass(direction + ' active');

		if( !this.cssTransitions ){
			this._jsAnimation($nextSlide,direction);
		} else {
			this._cssAnimation($nextSlide,direction);
		}
	};
	// returns animation direction
	NGCarousel.prototype._direction = function(e) {
		var direction;
		if (typeof e !== 'undefined'){
			direction = (typeof e.data === 'undefined' ? 'right' : e.data.direction);
		} else {
			direction = 'right';
		}
		return direction;
	};
	// updates next slide number
	NGCarousel.prototype._next = function(e, direction) {
		// if event was triggered by a slide indicator, store data index
		var index = (typeof e !== 'undefined' ? $(e.currentTarget).data('index') : undefined);

		// horrible logic determine block
		switch( true ) {
			// if triggered by indicator, set next slide based on index
			case( typeof index !== 'undefined'): {
				if (this.currSlide == index){
					this.startTimer();
					return false;
				}
				this.currSlide = index;
				break;
			}

			case(direction == 'right' && this.currSlide < (this.totalSlides - 1)): {
				this.currSlide++;
				break;
			}

			case(direction == 'right'): {
				this.currSlide = 0;
				break;
			}

			case(direction == 'left' && this.currSlide === 0): {
				this.currSlide = (this.totalSlides - 1);
				break;
			}

			case(direction == 'left'): {
				this.currSlide--;
				break;
			}
		}
		return true;
	};
	// executes animation via css transitions
	NGCarousel.prototype._cssAnimation = function($nextSlide, direction) {
		// init css transitions
		setTimeout(function(){
			this.$el.addClass('transition');
			this.addCSSDuration();
			this.$currSlide.addClass('shift-'+direction);
		}.bind(this),100);

		// after animation played out, remove transitions
		setTimeout(function(){
			this.$el.removeClass('transition');
			this.removeCSSDuration();
			this.$currSlide.removeClass('active shift-left shift-right');
			this.$currSlide = $nextSlide.removeClass(direction);
			this._updateIndicators();
			this.startTimer();
		}.bind(this),100 + this.settings.speed);
	};
	// executes animation via js transitions
	NGCarousel.prototype._jsAnimation = function($nextSlide, direction) {
    var thisPtr = this;

		if(direction == 'right') {
			thisPtr.$currSlide.addClass('js-reset-left');
		}

		var animation = {};
		animation[direction] = '0%';

		var animationPrev = {};
		animationPrev[direction] = '100%';

		// current slide
		this.$currSlide.animate(animationPrev,this.settings.speed);

		// next slide
		$nextSlide.animate(animation,this.settings.speed,'swing',function(){
			// get rid of js animations
			thisPtr.$currSlide.removeClass('active js-reset-left').attr('style','');
			// cache next slide after classes and inline styles have been removed
			thisPtr.$currSlide = $nextSlide.removeClass(direction).attr('style','');
			thisPtr._updateIndicators();
			thisPtr.startTimer();
		});
	};
	// ensures the slide indicators are pointing to the currently active
	NGCarousel.prototype._updateIndicators = function() {
		this.$el.find('.indicators li').removeClass('active').eq(this.currSlide).addClass('active');
	};
	// init plugin once for each dom object passed to jquery
	$.fn.NGCarousel = function(options) {
		return this.each(function(index, el) {
			el.NGCarousel = new NGCarousel(el, options);
		});
	};
});
