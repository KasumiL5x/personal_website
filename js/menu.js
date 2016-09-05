$('.header__mobile-nav-toggle').on('click', function() {
  this.classList.toggle('active');
  if( $('.header__nav').hasClass("opened") ) {
    $('.header__nav').removeClass("opened");
    $('.header__nav').addClass("closed");
  } else {
    $('.header__nav').addClass("opened");
    $('.header__nav').removeClass("closed");    
  }
  // $('.header__nav__wrapper').slideToggle();
});
