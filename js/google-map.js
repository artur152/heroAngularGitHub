"use strict"

document.addEventListener("DOMContentLoaded", function () {

    // Google Map
    if(document.getElementById('map')){
        initMap();
    }

    function initMap() {
        var map;
        var panorama;
        var marker;
        var markers;
        var markerCluster;
        var park_marker;
        var park = {lat: 40.7024946, lng: -74.01672357937616};
        var ny_city = {lat: 40.72332237562719, lng: -73.9986886068238};
        var blueMarker = {
            url: 'img/googleMap/markerclusterer/location-icon-blue-1-s.png',
            size: new google.maps.Size(20, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(10, 32)
        };
        var parkMarker = {
            url: 'img/googleMap/markerclusterer/location-icon-green32.png',
            size: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(16, 32)
        };
        var locations = [
            ['New York City Hall, New York, NY 10007, USA', 40.712784, -74.005941],
            ['202 5th Ave, New York, NY 10010, USA', 40.742970, -73.988685],
            ['211 Park Ave S, New York, NY 10003, USA', 40.736779, -73.988685],
            ['64-86 Suffolk St, New York, NY 10002, USA', 40.717553291668246, -73.98657555004877],
            ['640 Broadway, New York, NY 10012, USA', 40.72640005344088, -73.99584526440435],
            ['1400 6th Ave, New York, NY 10019, USA', 40.764474, -73.977086],
            ['427 Main St, New York, NY 10044, USA', 40.758808, -73.952302],
            ['Pulaski Bridge, Long Island City, NY 11101, USA', 40.743092, -73.951261]
        ];
        var mapControl = document.getElementById('map-control');
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
        var infoWindow;

        /** Map */
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: ny_city,
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            }
        });
        /** Map */


        /** Hide Layers */
        hide_poi.addEventListener('click', function () {
            map.setOptions({styles: styles['hide']});
        });
        show_poi.addEventListener('click', function () {
            map.setOptions({styles: styles['default']});
        });

        map.controls[google.maps.ControlPosition.RIGHT_TOP].push(mapControl);
        /** Hide Layers */


        /** Marker */
        marker = new google.maps.Marker({
            position: ny_city,
            map: map,
            draggable: true
        });
        park_marker = new google.maps.Marker({
            position: park,
            map: map,
            icon: parkMarker
        });
        markers = locations.map(function (location, i) {
            return new google.maps.Marker({
                map: map,
                position: {lat: location[1], lng: location[2]},
                title: location[0],
                title_lat: location[1] + '',
                title_lng: location[2] + '',
                icon: blueMarker,
                draggable: true
            });
        });
        markerCluster = new MarkerClusterer(map, markers, {imagePath: 'img/googleMap/markerclusterer/m'});
        /** Marker */

        /** HTML5 geolocation. */
        infoWindow = new google.maps.InfoWindow;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent('Location found.');
                infoWindow.open(map);
                map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            handleLocationError(false, infoWindow, map.getCenter());
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
        }
        /** HTML5 geolocation. */


        /** StreetViewPanorama */
        function initializeStreeView() {
            panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view'), {
                position: ny_city,
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
    }

});
