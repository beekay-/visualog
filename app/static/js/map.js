function initMap() {
  var mapOptions = {
    zoom: 14,
    clickableIcons: false,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    disableDoubleClickZoom: true,
    center: {
      lat: 40.749481,
      lng: -73.984290
    }
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // map.data.addGeoJson(data);

  var lines = data.features;
  for (var i = 0; i < lines.length; i++) {
    var coords = [];
    for (var j = 0; j < lines[i].geometry.coordinates.length; j++) {
      coords.push([lines[i].geometry.coordinates[j][1], lines[i].geometry.coordinates[j][0]]);
    }
    // console.log('array: ', coords);
    runSnapToRoad(coords);
  }
}

// Snap a user-created polyline to roads and draw the snapped path
function runSnapToRoad(finalArray) {
  $.get('https://roads.googleapis.com/v1/snapToRoads', {
    interpolate: true,
    key: apiKey,
    path: finalArray.join('|')
  }, function(data) {
    processSnapToRoadResponse(data);
    drawSnappedPolyline();
  });
}

// Store snapped polyline returned by the snap-to-road service.
function processSnapToRoadResponse(data) {
  snappedCoordinates = [];
  placeIdArray = [];
  for (var i = 0; i < data.snappedPoints.length; i++) {
    var latlng = new google.maps.LatLng(
      data.snappedPoints[i].location.latitude,
      data.snappedPoints[i].location.longitude);
    snappedCoordinates.push(latlng);
    placeIdArray.push(data.snappedPoints[i].placeId);
  }
}

// Draws the snapped polyline (after processing snap-to-road response).
function drawSnappedPolyline() {
  var snappedPolyline = new google.maps.Polyline({
    path: snappedCoordinates,
    strokeColor: 'blue',
    strokeWeight: 5,
    geodesic: true,
    map: map
  });
  // snappedPolyline.setMap(map);
  polylines.push(snappedPolyline);

  // When a polyline is clicked...
  google.maps.event.addListener(snappedPolyline, 'click', function(e) {
    console.log('selected route.');
    console.log(this.getPath().getArray().slice(0, 7).toString());
    customWaypoints.push(this.getPath().getArray().slice(0, 7).toString());
    console.log(customWaypoints);
    // Change its color...
    if (this.getPath()) {
      console.log('selected route.');
      deColor(polylines.indexOf(snappedPolyline));
      snappedPolyline.setOptions({
        strokeColor: 'lime',
        strokeWeight: 5
      });
    }
    // Show start position on polyline
    var startMarker = new google.maps.Marker({
      position: snappedPolyline.getPath().getAt(0),
      map: map,
      label: 'A',
      title: 'Start'
    });
    // Show end position on polyline
    var endMarker = new google.maps.Marker({
      position: snappedPolyline.getPath().getAt(snappedPolyline.getPath().getLength() - 1),
      map: map,
      label: 'B',
      title: 'End'
    });
    var startPosition = new google.maps.LatLng(startMarker.position.lat(), startMarker.position.lng());
    var endPosition = new google.maps.LatLng(endMarker.position.lat(), endMarker.position.lng());
    // Send start and end positions to directions service
    getDirections(startPosition, endPosition);
  });
}

function deColor(selectedIndex) {
  if (selectedIndex !== -1) {
    for (var i = 0; i < polylines.length; i++) {
      if (i !== selectedIndex) {
        polylines[i].setOptions({
          strokeColor: 'blue',
          strokeWeight: 5
        });
      }
    }
  }
}

// Function to handle directions sevice options and request
function getDirections(startPosition, endPosition) {
  // Directions display options
  directionsDisplay = new google.maps.DirectionsRenderer({
    hideRouteList: false,
    preserveViewport: true,
    polylineOptions: {
      strokeColor: '#e8392f',
      strokeOpacity: 0.75,
      strokeWeight: 5
    }
  });
  directionsDisplay.setMap(map);

  // Start and end positions
  p1 = startPosition;
  p2 = endPosition;

  // Origin, destination, and travel mode as part of request sent to directions service
  var request = {
    origin: p1,
    destination: p2,
    // waypoints: customWaypoints,
    // stopover: false,
    optimizeWaypoints: true,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };

  // Check for directions
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      directionsDisplay.setMap(map);
      var distance = document.getElementById('distance');
      distance.style.display = 'block';
      distance.innerHTML = '<strong>' + response.routes[0].legs[0].distance.text + '</strong>' + " " + "away";
    }
  });

  // Show Street View on Starting Point
  showStreetView(startPosition);
}

// Function to handle Street View options and initialization
function showStreetView(startPosition) {
  var streetViewService = new google.maps.StreetViewService();
  var streetViewOptions = {
    position: startPosition,
    disableDefaultUI: true
  };
  streetView = new google.maps.StreetViewPanorama(document.getElementById("street-view"), streetViewOptions);
  var streetViewContainer = document.getElementById('street-view');
  streetViewContainer.style.display = 'block';
}

$(window).load(initMap);

// Initial data
var data = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [-73.97056102752686, 40.74811853855757],
        [-73.96944522857666, 40.74953279908402],
        [-73.96798610687256, 40.75135341202851],
        [-73.97109746932983, 40.75314146550602],
        [-73.97472381591797, 40.75346656097219],
        [-73.97573232650755, 40.75182481261268],
        [-73.97721290588379, 40.750768220446936],
        [-73.97757768630981, 40.74940275339479]
      ]
    }
  }, {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [-73.96279335021973, 40.75512452312348],
        [-73.96549701690674, 40.75109332751696],
        [-73.96974563598633, 40.74719193776603],
        [-73.9726209640503, 40.74481848035928],
        [-73.97279262542723, 40.74137193935539]
      ]
    }
  }, {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [-74.00107383728026, 40.75931800754126],
        [-73.99519443511963, 40.757270059827206],
        [-73.99536609649658, 40.75453936473234],
        [-73.99888515472412, 40.75304393655622]
      ]
    }
  }]
};

var apiKey = 'AIzaSyA5KqqUzvJyoC9msz_70ns-CdAF33N-6tM';
var map;
var streetView;
var snappedCoordinates = [];
var coords;
var subArray;
var placeIdArray = [];
var finalArray = [];
var polylines = [];
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var stepDisplay;
var customWaypoints = [];
var speed = 0.000005;
var wait = 1;
