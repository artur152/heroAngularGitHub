(function ($) {
  'use strict';

  /** Creates Google Maps API v3. */
  Drupal.behaviors.map = {
    attach: function (context, settings) {
      var map;
      $(window).one('load', function () {
        map = new Drupal.map(settings.map);
      });
    }
  };
  /** Map object. * @param {object} settings * Map settings and stations data.*/
  Drupal.map = function (settings) {
    this.elementId = 'map';
    this.settings = settings;
    if(document.getElementById('map')){
      this.init();
    }
  };
  /** Initializes map object. */
  Drupal.map.prototype.init = function () {
    this.initMap();
  };

  Drupal.map.prototype.initMap = function () {

    /** Custom Controls */
    var mapMore = document.getElementById('map-view');
    var mapControl = document.getElementById('map-control');
    var myLocation = document.getElementById('mylocation');
    var searchbox_directions_open = document.getElementById('searchbox-directions-open');
    var searchbox_directions_close = document.getElementById('searchbox-directions-close');
    var more_less_map = $('.more-less-map'),
        hide_show_map = $('.hide-show-map'),
        mymap = $('#block-block-1'),
        street_view = $('#street-view'),
        google_map_wrapper = $('.google-map-wrapper'),
        articles = $('#block-views-articles-block'),
        map_sidebar_splitter = $('#map-sidebar-splitter'),
        more_less_width = 25,
        width = 100,
        percent = '%',
        custom_width = width - more_less_width,
        body = $('body');

    more_less_map.click (function() {
      body.toggleClass("full-map-mode-js");
      if (body.hasClass("full-map-mode-js")) {
        more_less_map.html('Less Map');
      } else {
        more_less_map.html('More Map');
      }
      MapStreetViewUpdate();
    });
    searchbox_directions_open.addEventListener('click', function() {
      map_sidebar_splitter.addClass('searchbox-open-js');
    });
    searchbox_directions_close.addEventListener('click', function() {
      map_sidebar_splitter.removeClass('searchbox-open-js');
    });

    /*    more_less_map.click (function () {
     if (more_less_map.html('More Map').text() == 'More Map') {
     more_less_map.innerHTML = 'Less Map';
     } else {
     console.log('Less Map');
     more_less_map.innerHTML = 'More Map';
     }
     if (mymap.hasClass('small_map_js') && articles.hasClass('big_articles_js')) {
     mymap.removeClass('small_map_js').addClass('big_map_js').width(custom_width + percent);
     articles.removeClass('big_articles_js').addClass('small_articles_js').width(more_less_width + percent);
     }
     else if (mymap.hasClass('big_map_js') && articles.hasClass('small_articles_js')) {
     mymap.removeClass('big_map_js').addClass('small_map_js').width(more_less_width + percent);
     articles.removeClass('small_articles_js').addClass('big_articles_js').width(custom_width + percent);
     }
     else {
     mymap.addClass('big_map_js').width(custom_width + percent);
     articles.addClass('small_articles_js').width(more_less_width + percent);
     }
     google.maps.event.trigger(map, "resize");
     map.setCenter(ny_city);
     });*/
    /*    hide_show_map.click(function () {
     if (mymap.hasClass('hide_map_js') && articles.hasClass('show_map_js')) {
     console.log('show');
     mymap.removeClass('hide_map_js').addClass('show_map_js').css({"width": '50%'});
     articles.removeClass('hide_map_js').addClass('show_map_js').css({"width": '50%'});
     } else {
     console.log('hide');
     mymap.removeClass('show_map_js').addClass('hide_map_js').css({"width": '20'});
     articles.removeClass('hide_map_js').addClass('show_map_js').css({"width": '100%'});
     }
     google.maps.event.trigger(map, "resize");
     map.setCenter(ny_city);
     });*/
    /** Custom Controls */

    /** GoogleMapSplitter */
    /** Map/Articles Splitter */
    $('.node-type-plain-page .region.region-content').height('100%').split({
      orientation: 'vertical',
      limit: '0',
      position: '100%'
    });

    /** Map/StreetView Splitter */
    $('.google-map-block').split({
      orientation: 'vertical',
      limit: '0',
      position: '100%'
    });

    /** Searchbox-directions Splitter */
    map_sidebar_splitter.split({
      orientation: 'vertical',
      limit: '0',
      position: '100%'
    });
    /** GoogleMapSplitter */

    var map_vsplitter = $('#block-block-1 + .vsplitter');
    var streetview_vsplitter  = $('.google-map-wrapper + .vsplitter');
    var vsplitter = $('.vsplitter');
    vsplitter.append("<div class='dragger'><span>drag_dat_shit</span></div>");



    /** Google Maps Sets */
    var park = {lat:  40.7024946, lng: -74.01672357937616};
    var ny_city = {lat: 40.712784,lng: -74.005941};
    var locations = [
      ['New York City Hall, New York, NY 10007, USA', 40.712784,-74.005941],
      ['202 5th Ave, New York, NY 10010, USA', 40.742970, -73.988685],
      ['211 Park Ave S, New York, NY 10003, USA', 40.736779, -73.988685],
      ['64-86 Suffolk St, New York, NY 10002, USA', 40.717553291668246, -73.98657555004877],
      ['640 Broadway, New York, NY 10012, USA', 40.72640005344088, -73.99584526440435],
      ['1400 6th Ave, New York, NY 10019, USA', 40.764474, -73.977086],
      ['427 Main St, New York, NY 10044, USA', 40.758808, -73.952302],
      ['Pulaski Bridge, Long Island City, NY 11101, USA', 40.743092, -73.951261]
    ];
    /*
     var loc = $.getJSON("https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js", function(result){
     console.log(result);
     $.each(result, function(i, field){
     $("div").append(field + " ");
     });
     });
     console.log(loc);
     */
    var blueMarker = {
      url: '/profiles/xxx/themes/xxx-theme/images/markerclusterer/location-icon-blue-1-s.png',
      size: new google.maps.Size(20, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(10, 32)
    };
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: ny_city,
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT
      }
    });

    /** InfoWindow Markers */
    var markers = locations.map(function (location, i) {
          return new google.maps.Marker({
            //label: labels[i % labels.length],
            map: map,
            position: {lat: location[1], lng: location[2]},
            title: location[0],
            title_lat: location[1] + '',
            title_lng: location[2] + '',
            icon: blueMarker,
            draggable: true
          });
        });
    var markerCluster = new MarkerClusterer(map, markers, {imagePath: '/profiles/xxx/themes/xxx-theme/images/markerclusterer/m'});
    var city_marker;
    var geocoder_city = new google.maps.Geocoder();
    var infowindowMarkers = new google.maps.InfoWindow();
    var position_point;
    var position_place;
    var address_name;

    for (var i = 0; i < markers.length; i++) {
      city_marker = markers[i];

      position_point = city_marker.getPosition();
      position_place = position_point.lat() + ', ' + position_point.lng();

      city_marker.addListener('click', function() {
        position_point = this.getPosition();
        position_place =  this.getPosition().lat() + ', ' +  this.getPosition().lng();

        var this_marker = this;
        geocoder_city.geocode({'location': this.position}, function(results, status) {
          address_name = results[0].formatted_address;
          infowindowMarkers.setContent('<div class="infowindow-city"><div><div class="location"><strong>' + position_place + '</strong></div>' + '<div class="address">' + address_name + '</div></div></div>');
          infowindowMarkers.open(map, this_marker);
        });
      });

      city_marker.addListener('dragend', function(){
        infowindowMarkers.close(map, city_marker);
        position_point = this.getPosition();
        position_place =  this.getPosition().lat() + ', ' +  this.getPosition().lng();

        var this_marker = this;
        geocoder_city.geocode({'location': this.position}, function(results, status) {
          address_name = results[0].formatted_address;
          infowindowMarkers.setContent('<div class="infowindow-city"><div><div class="location"><strong>' + position_place + '</strong></div>' + '<div class="address">' + address_name + '</div></div></div>');
          infowindowMarkers.open(map, this_marker);
        });
      });
    }
    /** InfoWindow Markers */

    /** InfoWindow Park */
    var infowindowDrag = new google.maps.InfoWindow();
    var infowindowDragHover = new google.maps.InfoWindow();
    var geocoder = new google.maps.Geocoder();
    var adress;
    var park_marker = new google.maps.Marker({
      map: map,
      draggable: true,
      position: park
    });
    var position = park_marker.getPosition();
    var placePosition = position.lat() + ', ' + position.lng();

    function placeName() {
      geocoder.geocode({'location': park_marker.position}, function(results, status) {
        adress = results[0].formatted_address;
      });
    } placeName();

    park_marker.addListener('dragend', function(){
      var dragend_marker = this;
      geocoder.geocode({'location': park_marker.position}, function(results, status) {
        position = park_marker.getPosition();
        placePosition = position.lat() + ', ' + position.lng();
        adress = results[0].formatted_address;

        infowindowDrag.setContent('<div class="infowindow-park"><div><strong>' + placePosition + '</strong>' + '<br>' + adress + '</div></div>');
        infowindowDrag.open(map, dragend_marker);
      });
    });
    park_marker.addListener('click', function () {
      infowindowDragHover.close(map, park_marker);
      infowindowDrag.setContent('<div class="infowindow-park"><div><strong>' + placePosition + '</strong>' + '<br>' + adress + '</div></div>');
      infowindowDrag.open(map, this);
    });
    park_marker.addListener('mouseover---', function () {
      infowindowDrag.close(map, park_marker);
      infowindowDragHover.setContent('<div class="infowindow-park"><div><strong>' + adress + '</strong></div></div>');
      infowindowDragHover.open(map, this);
    });
    park_marker.addListener('mouseout', function () {
      infowindowDragHover.close(map, this);
    });
    /** InfoWindow Park */

    /**Circle Pin*/
    /*    var cityCircle = new google.maps.Circle({
     map: map,
     center: park,
     path: google.maps.SymbolPath.CIRCLE,
     strokeColor: 'white',
     strokeOpacity: 1,
     strokeWeight: 3,
     fillColor: 'red',
     fillOpacity: 0.9,
     radius: 50
     });*/
    /**Circle Pin*/

    /** Current Geolocation*/
    var infoWindowLocation = new google.maps.InfoWindow();
    var current_address;
    var current_coordinates;
    var current_position;
    myLocation.addEventListener('click', function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          current_position = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          current_coordinates = position.coords.latitude + ', ' + position.coords.longitude;
          geocoder.geocode({'location': current_position}, function(results, status) {
            current_address = results[0].formatted_address;
            infoWindowLocation.setPosition(current_position);
            infoWindowLocation.setContent('<div class="infowindow-geolocation"><div>Geolocation: <strong>' + current_coordinates + '</strong><br>' + current_address + '</div></div>');
            infoWindowLocation.open(map);
            console.log(map);
            map.setCenter(current_position);
          });
        }, function() {
          handleLocationError(true, infoWindowLocation, map.getCenter());
        });
      }else {
        handleLocationError(false, infoWindowLocation, map.getCenter());
      }
      function handleLocationError(browserHasGeolocation, infoWindowLocation, current_position) {
        infoWindowLocation.setPosition(current_position);
        infoWindowLocation.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
      }
    });
    /** Current Geolocation*/

    /** Hide Layers */
    var hide_poi = document.getElementById('hide-poi');
    var show_poi = document.getElementById('show-poi');
    var styles = {
      default: null,
      hide: [
        {
          featureType: 'road',
          elementType: 'labels.icon',
          stylers: [{visibility: 'off'}]
        },
        {
          featureType: 'poi.business',
          stylers: [{visibility: 'off'}]
        },
        {
          featureType: 'poi.medical',
          stylers: [{visibility: 'off'}]
        },
        {
          featureType: 'poi.attraction',
          stylers: [{visibility: 'off'}]
        },
        {
          featureType: 'poi.place_of_worship',
          stylers: [{visibility: 'off'}]
        },
        {
          featureType: 'poi.school',
          stylers: [{visibility: 'off'}]
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [{visibility: 'off'}]
        },
        {
          featureType: 'administrative',
          stylers: [{visibility: 'off'}]
        }
      ]
    };
    hide_poi.addEventListener('click', function () {
      map.setOptions({styles: styles['hide']});
    });
    show_poi.addEventListener('click', function () {
      map.setOptions({styles: styles['default']});
    });
    /** Hide Layers */

    /** Controls */
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(mapMore);
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(mapControl);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(mylocation);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchbox_directions_open);
    /** Controls */

    /** Rectangle */
    /*var bounds = {
      north: 40.7866,
      south: 40.7990,
      east: -73.9580,
      west: -73.9820
    };
    var rectangle = new google.maps.Rectangle({
      bounds: bounds,
      editable: true,
      draggable: true,
      strokeWeight: 2
    });
    rectangle.setMap(map);*/
    /** Rectangle */

    /** Polyline */
    /* var poly = new google.maps.Polyline({
      strokeColor: '#0074E4',
      strokeOpacity: 1.0,
      strokeWeight: 3,
      editable: true
    });
    poly.setMap(map);
    map.addListener('click', addLatLng);
    function addLatLng(event) {
      var path = poly.getPath();
      path.push(event.latLng);

      var circle = new google.maps.Circle({
        path: google.maps.SymbolPath.CIRCLE,
        strokeColor: '#0074E4',
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: 'white',
        fillOpacity: 1,
        scale: 4
      });
      var marker = new google.maps.Marker({
        position: event.latLng,
        title: '#' + path.getLength(),
        map: map,
        icon: circle
      });
    }*/
    /** Polyline */

    /** Search*/
    var main_input = document.getElementById('main-input');
    var autocomplete = new google.maps.places.Autocomplete(main_input);
    autocomplete.bindTo('bounds', map);
    var autocomplete_infowindow = new google.maps.InfoWindow();
    var autocomplete_marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function() {
      autocomplete_infowindow.close();
      autocomplete_marker.setVisible(false);

      var place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("No results.");
        return;
      }
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(16);
      }

      /*marker.setIcon(({
       url: place.icon,
       size: new google.maps.Size(71, 71),
       origin: new google.maps.Point(0, 0),
       anchor: new google.maps.Point(17, 34),
       scaledSize: new google.maps.Size(35, 35)
       }));*/
      autocomplete_marker.setPosition(place.geometry.location);
      autocomplete_marker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
      autocomplete_infowindow.setContent('<div><strong>' + place.geometry.location + '</strong><br>' + '<div>' + address + '</div></div>');
      autocomplete_infowindow.open(map, autocomplete_marker);

    });
    /** Search*/

    /** Destination*/
    var origin_place_id = null;
    var destination_place_id = null;
    //var travel_mode = 'WALKING';
    var travel_mode = 'DRIVING';
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: map,
      panel: document.getElementById('distance-panel')
    });
    var destination_input = document.getElementById('destination-input');
    var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
    destination_autocomplete.bindTo('bounds', map);

    function expandViewportToFitPlace(map, place) {
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
      }
    }
    function route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay) {
      if (!origin_place_id || !destination_place_id) {
        return;
      }
      directionsService.route({
        origin: {'placeId': origin_place_id},
        destination: {'placeId': destination_place_id},
        travelMode: travel_mode,
        provideRouteAlternatives: true
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
          map_sidebar_splitter.addClass('css-value-js');
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }
    autocomplete.addListener('place_changed', function() {
       var place = autocomplete.getPlace();
       if (!place.geometry) {
         window.alert("Origin_autocomplete's returned place contains no geometry");
         return;
       }
       expandViewportToFitPlace(map, place);
       origin_place_id = place.place_id;
       route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay);
     });
    destination_autocomplete.addListener('place_changed', function() {
       var place = destination_autocomplete.getPlace();
       if (!place.geometry) {
         window.alert("Destination_autocomplete's returned place contains no geometry");
         return;
       }
       expandViewportToFitPlace(map, place);
       destination_place_id = place.place_id;
       route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay);
     });
    /** Destination*/

    /** Geocoder Lat-Long*/
    var infowindowGeocoder = new google.maps.InfoWindow;
    document.getElementById('main-input').addEventListener('keydown', function() {
      geocodeLatLng(geocoder, map, infowindowGeocoder);
      //keypress
    });
    function geocodeLatLng(geocoder, map, infowindowGeocoder) {
      var input = document.getElementById('main-input').value;
      var latlngStr = input.split(',', 2);
      var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
      geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
          if (results[1]) {
            map.setZoom(14);
            var marker = new google.maps.Marker({
              position: latlng,
              map: map
            });
            infowindowGeocoder.setContent(results[1].formatted_address);
            infowindowGeocoder.open(map, marker);
          } else {
            //window.alert('Please click on Search Button when looking for coordinates.' + 'Geocoder failed due to: ' + status);
          }
        }
      });
    }
    /** Geocoder Lat-Long*/

    /** StreetViewPanorama */
    var panorama;
    function initializeStreeView() {
      panorama = new google.maps.StreetViewPanorama (document.getElementById('street-view'), {
        position: {lat: 40.75837942795199, lng: -73.98521835228723},
        pov: {heading: 190, pitch: 0},
        zoom: 1,
        motionTracking: true,
        motionTrackingControl: true,
        motionTrackingControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM
        }
      });
      map.setStreetView(panorama);
    }
    initializeStreeView();
    /** StreetViewPanorama */


    function setCenterOnDrag(draggger) {
      draggger.on('mousedown touchstart', function () {
        draggger.addClass('mousedown_js');
      });

      $(window).on('mouseup touchend', function () {
        if (draggger.hasClass('mousedown_js')) {
          draggger.removeClass('mousedown_js');
        }
        if(google_map_wrapper.width() < 140) {
          map_sidebar_splitter.removeClass('searchbox-open-js');
        }
        /*if(articles.width() <= 250) {
          mymap.width('100%');
        }
        if(articles.width() > 0) {
          articles.width('250px');
        } else {
          articles.css({width: "0"});
        }*/
        MapStreetViewUpdate();
      });
    }
    setCenterOnDrag(map_vsplitter);
    setCenterOnDrag(streetview_vsplitter);

    function MapStreetViewUpdate() {
      google.maps.event.trigger(map, "resize");
      google.maps.event.trigger(panorama, 'resize');
    }
    function setCenterPegman() {
      map.setCenter(panorama.getPosition());
    }

    /** Window Resize */
    google.maps.event.addDomListener(window, 'resize', function () {
      MapStreetViewUpdate();
    });
    /** Window Resize */

    /** Styles for Infowindow */
    google.maps.event.addListener(infowindowMarkers, 'domready', function() {
      $('.infowindow-city').parents('.gm-style-iw').parent().addClass('infowindow-style');
      //$('.infowindow-park').parents('.gm-style-iw').parent().addClass('infowindow-style');
      //$('.infowindow-geolocation').parents('.gm-style-iw').parent().addClass('infowindow-style');
    });
    /** Styles for Infowindow */
  };

})(jQuery);




