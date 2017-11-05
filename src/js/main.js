
var testOne = require('./modules/test');

testOne.test();
/*
var screenWidth = $(window).width();
var screenHeight = $(window).height();

jQuery(document).ready(function() {
    $(window).scroll(function() {
        if ($(this).scrollTop() >= 50) {     
            $('#nav').fadeIn(200);  
        } else {
            $('#nav').fadeOut(200);  
        }
    });


    $('#nav').click(function() {
        $('body,html').animate({
            scrollTop : 0                       
        }, 500);
    });


    $("#nav").affix({offset: {top: $(".nav-wrapper").outerHeight(true)} });



});


$(document).ready(function(){       
    var scroll_start = 0;
    var startchange = $('.content');
    var offset = startchange.offset();
    var width = window.innerWidth;
 
    if (width > 569){
    if (startchange.length){
    $(document).scroll(function() { 
       scroll_start = $(this).scrollTop();
       if(scroll_start > offset.top) {
         $(".titlebar").css('transition',' background .5s ease .300ms');
         $(".titlebar").css('background-color', '#000000');
        } else {
           $('.titlebar').css('background-color', 'transparent');
        }
    });
    }
 }
 });

 */

 // Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();
    
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
    
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('header').removeClass('nav-down').addClass('nav-up');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('header').removeClass('nav-up').addClass('nav-down');
        }
    }
    
    lastScrollTop = st;
}