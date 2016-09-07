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

$(document).ready(function() {
  // test: init only specific progress bars
  // var bars = [];
  // $('.ng-progress').each(function(){
  //   if( parseInt($(this).attr('ng-percent')) >= 90 ) {
  //     bars.push($(this));
  //   }
  // });
  // ng.initProgressBars(bars);

  ng.initAllProgressBars();
});
