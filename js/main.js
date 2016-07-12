jQuery(window).load(function(){

  //---------------------------------- Google map location -----------------------------------------//
  var mapElem = document.getElementById('map');
  if (!mapElem) {
    return;
  }

  // Create an array of styles.
  var styles = [
      {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [
              { visibility: 'simplified' }
          ]
      },
      {
          featureType: 'road',
          elementType: 'labels',
          stylers: [
              { visibility: 'off' }
          ]
      }
  ],
                  
  // Lagitute and longitude for your location goes here
  ceremonyLat = 32.3220666,
  ceremonyLng = -111.0177941,

  receptionLat = 32.5540873,
  receptionLng = -110.8766263,
          
  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  customMap = new google.maps.StyledMapType(styles,
        { name: 'Styled Map' }),
          
  // Create a map object, and include the MapTypeId to add
  // to the map type control.
  mapOptions = {
      zoom: 10,
      scrollwheel: false,
      center: new google.maps.LatLng( 32.40, ceremonyLng),
      mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP]
      }
  },

  map = new google.maps.Map(mapElem, mapOptions),

  ceremony = new google.maps.LatLng(ceremonyLat, ceremonyLng),
  reception = new google.maps.LatLng(receptionLat, receptionLng),

  marker = new google.maps.Marker({
      position: ceremony,
      map: map,
      title: 'The Ceremony'
  });

  marker = new google.maps.Marker({
      position: reception,
      map: map,
      title: 'The Reception'
  });

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', customMap);
  map.setMapTypeId('map_style');
      
  //---------------------------------- End google map location -----------------------------------------//

});

$.easing.easeOutCubic = function (x, t, b, c, d) {
    return c*((t=t/d-1)*t*t + 1) + b;
}

$('h1').fitText(0.8, {
    minFontSize: '20px',
    maxFontSize: '40px'
});

//HERO DIMENSTION AND CENTER
(function() {
  function heroInit(){
    var hero = jQuery('.hero'),
    ww = jQuery(window).width(),
    wh = jQuery(window).height(),
    heroHeight = wh;

    hero.css({
      height: heroHeight + 'px'
    });

    var heroContent = jQuery('.hero .title'),
    contentHeight = heroContent.height(),
    parentHeight = hero.height(),
    topMargin = (parentHeight - contentHeight) * .9;

    heroContent.css({
      'margin-top' : topMargin + 'px'
    });
  }

  jQuery(window).on('resize', heroInit);
  jQuery(document).on('ready', heroInit);
})();

$(document).ready(function() {
    /*if (jQuery.browser.msie && jQuery.browser.version == 9) {
      jQuery('html').addClass('ie9');
    }*/

    $('#top').click(function () {
      return jQuery('body, html').stop().animate({
        scrollTop: 0
      }, 800, 'easeOutCubic'), !1;
    });

    $('.navbar-nav a, #start-here').click(function(event) {
        event.preventDefault();
        $('html, body').animate({
          scrollTop: $(this.hash).offset().top
        }, 1000);
    });

    if ($(window).width() > 767) {
        $('.hero').parallax("50%", 0.5);
        $('.registry').parallax("50%", 0.4);

        $('.rsvp-header').parallax("50%", 0.2);
    }

    var yesMessage = "Yay! We are so glad you can make it. We look forward to celebrating this joyous occasion with you.";
    var noMessage = "We're sorry you won't be able to make it. Either way, we are so thankful for your love and support.";

    $('.rsvp-form').validate({
      highlight: function(element) {
          $(element).closest('.form-group').addClass('has-error');
      },
      unhighlight: function(element) {
          $(element).closest('.form-group').removeClass('has-error');
      },
      errorElement: 'span',
      errorClass: 'help-block',
      errorPlacement: function(error, element) {
          if(element.parent('.input-group').length) {
              error.insertAfter(element.parent());
          } else {
              error.insertAfter(element);
          }
      },
      submitHandler: function(form) {
        var $form = $(form);
        $.post($form.attr('url'), $form.serialize(), function(result) {
          $form.parent().html($('.attending:checked').val() === 'yes' ? yesMessage : noMessage);
        });
        return false;
      }
    });

    $('.attending').on('change', function(e) {
      if (e.target.value === 'no') {
        $('.guests').hide();
      } else {
        $('.guests').show();
      }
    });

});
