var lightStyle = [ { "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" } ] }, { "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "color": "#f5f5f5" } ] }, { "featureType": "administrative.land_parcel", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [ { "color": "#bdbdbd" } ] }, { "featureType": "administrative.locality", "elementType": "labels.text.stroke", "stylers": [ { "color": "#ffffff" }, { "weight": 4 } ] }, { "featureType": "administrative.neighborhood", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#eeeeee" } ] }, { "featureType": "poi", "elementType": "labels.text", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] }, { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#ffffff" } ] }, { "featureType": "road", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#dadada" } ] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] }, { "featureType": "transit.line", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ] }, { "featureType": "transit.station", "elementType": "geometry", "stylers": [ { "color": "#eeeeee" } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#c9c9c9" } ] }, { "featureType": "water", "elementType": "labels.text", "stylers": [ { "visibility": "off" } ] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] } ];
var darkStyle = [ { "elementType": "geometry", "stylers": [ { "color": "#151e29" } ] }, { "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#325272" }, { "visibility": "on" } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "color": "#212121" }, { "weight": 1 } ] }, { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] }, { "featureType": "administrative.land_parcel", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [ { "color": "#6daccb" } ] }, { "featureType": "administrative.locality", "elementType": "labels.text.stroke", "stylers": [ { "color": "#0e161a" }, { "weight": 4 } ] }, { "featureType": "administrative.neighborhood", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#0e161e" } ] }, { "featureType": "poi.park", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] }, { "featureType": "poi.park", "elementType": "labels.text.stroke", "stylers": [ { "color": "#1b1b1b" } ] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [ { "color": "#2c2c2c" } ] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [ { "color": "#000000" }, { "visibility": "off" } ] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [ { "color": "#132633" } ] }, { "featureType": "road.arterial", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#0b151c" } ] }, { "featureType": "road.highway", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [ { "color": "#0b151c" } ] }, { "featureType": "road.highway.controlled_access", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [ { "color": "#000000" }, { "visibility": "simplified" } ] }, { "featureType": "road.local", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [ { "visibility": "off" } ] }, { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#000000" } ] }, { "featureType": "water", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#3d3d3d" } ] } ];
var calgary = new google.maps.LatLng(51.050875, -114.069355);
var toronto = new google.maps.LatLng(43.653252, -79.383934);
var overlay = document.createElement('div');
var modal = document.createElement('div');
var contrastButton = document.createElement('div');
var map, boundingBox, places, placeName, placeCategory;

function initMap() {
    // Set map options
    var mapOptions = {
        center: calgary,
        zoom: 11,
        minZoom: 10,
        maxZoom: 15,
        backgroundColor: '#151E29',
        disableDoubleClickZoom: false,
        keyboardShortcuts: false,
        styles: darkStyle,
        overviewMapControl: false,
        mapTypeControl: false,
        setClickableIcons: false,
        streetViewControl: false,
        zoomControl: false,
        tilt: 0,
        fullscreenControl: false,
        gestureHandling: 'greedy',
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Set map
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Show data on map
    getDataForMap();
    handleDataInteractivity();

    // City Selector
    var cityName = document.getElementById('city');
    cityName.onchange = function() {
        if (cityName.value === 'calgary') {
            map.setCenter(calgary);
        } else if (cityName.value === 'toronto') {
            map.setCenter(toronto);
        }
    };

    // Remove Google link so user doesn't get redirected
    google.maps.event.addListener(map, 'idle', function() {
        $('a[title="Click to see this area on Google Maps"]').attr('href', '#');
        $('a[title="Click to see this area on Google Maps"]').click(function(e) {
            e.preventDefault();
        });
    });

    // Set zoom control
    var zoomControlDiv = document.createElement('div');
    var zoomControlButton = new zoomControl(zoomControlDiv, map);
    zoomControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControlDiv);

    // Set brightness control
    var contrastControlDiv = document.createElement('div');
    var contrastControlButton = new contrastControl(contrastControlDiv, map);
    contrastControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(contrastControlDiv);

    // Set project info control
    var projectInfoControlDiv = document.createElement('div');
    var projectInfoControlButton = new projectInfoControl(projectInfoControlDiv, map);
    projectInfoControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(projectInfoControlDiv);

    // Show coordinates on right click
    google.maps.event.addListener(map, 'rightclick', function(e){
        var lat = e.latLng.lat().toFixed(6);
        var lng = e.latLng.lng().toFixed(6);
        var latLng = document.getElementById('lat-lng');
        latLng.style.bottom = 12 + 'px';
        latLng.innerHTML = lat + ', ' + lng;
        setTimeout(function() {
            latLng.style.bottom = -40 + 'px';
        }, 3500)
    });

    // Remove UI on long press (click or tap)
    var longpress = false;
    google.maps.event.addListener(map, 'click', function(event) {
        (longpress) ? $('#header, #zoom-control, #contrast-control, #project-info-control').addClass('hide') : $('#header, #zoom-control, #contrast-control, #project-info-control').removeClass('hide');
    });
    google.maps.event.addListener(map, 'mousedown', function(event) {
        start = new Date().getTime();
    });
    google.maps.event.addListener(map, 'mouseup', function(event) {
        end = new Date().getTime();
        longpress = (end - start < 500) ? false : true;
    });
}

/** GET BOUNDING BOX
 * This function gets the current bounding box of the map based on the viewport.
 **/
function getBoundingBox() {
	var bBoxNE = map.getBounds().getNorthEast();
	var bBoxSW = map.getBounds().getSouthWest();
	var ne = [ bBoxNE.lng(), bBoxNE.lat() ];
	var nw = [ bBoxSW.lng(), bBoxNE.lat() ];
	var sw = [ bBoxSW.lng(), bBoxSW.lat() ];
	var se = [ bBoxNE.lng(), bBoxSW.lat() ];
	var ne = [ bBoxNE.lng(), bBoxNE.lat() ];
	var bBoxArray = [ ne, nw, sw, se, ne ];
	return bBoxArray;
}

/** GET DATA FOR MAP
 * This function is responsible for getting data from database
 * based on the current bounding box.
 *
**/
function getDataForMap() {
    google.maps.event.addListener(map, 'idle', function() {
        boundingBox = getBoundingBox();
        var getData = '/getData'; // + '?c=' + city;
        $.ajax({
            url: getData,
            type: 'POST',
            data: JSON.stringify(boundingBox),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data) {
                addDataToMap(data);
            }
        });
    });
}

/** ADD DATA TO MAP
 * This function is responsible for adding data to the map
 * using Maps API's DataLayer addGeoJSON feature.
 **/
function addDataToMap(data) {
    // Minor fix for data layer flicker
    places = map.data.addGeoJson(data['places']);
    if (typeof places !== 'undefined') {
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });
    }
    // Add places data to map
    places = map.data.addGeoJson(data['places']);
    // Set marker styles
    map.data.setStyle(markerStyle);
}

/** MARKER STYLES
 * Set marker styles based on place category.
**/
var markerStyle = function(feature) {
    placeCategory = feature.getProperty('category');
    // Eating
    if (placeCategory === 'coffee shop' || placeCategory === 'restaurant' || placeCategory === 'bakery' || placeCategory === 'ice cream shop' || placeCategory === 'juice shop' || placeCategory === 'pizza shop' || placeCategory === 'pub') {
        return ({
            icon: '/static/images/markers/blue.svg',
            clickable: true,
            opacity: 0.3,
            optimized: true
        });
    // Living
    } else if (placeCategory === 'home' || placeCategory === 'office' || placeCategory === 'residence' || placeCategory === 'coworking space' || placeCategory === 'university' || placeCategory === 'downtown') {
        return ({
            icon: '/static/images/markers/indigo.svg',
            clickable: true,
            opacity: 0.3,
            optimized: true
        });
    // Shopping
    } else if (placeCategory === 'supermarket' || placeCategory === 'shopping mall' || placeCategory === 'clothing store' || placeCategory === 'electronics store' || placeCategory === 'department store' || placeCategory === 'pharmacy' || placeCategory === 'dollar store' || placeCategory === 'supermarket' || placeCategory === 'convenience store' || placeCategory === 'hardware store' || placeCategory === 'art supply store' || placeCategory === 'sports store' || placeCategory === 'camera store' || placeCategory === 'print shop' || placeCategory === 'toy store' || placeCategory === 'shopping mall' || placeCategory === 'gift store') {
        return ({
            icon: '/static/images/markers/pink.svg',
            clickable: true,
            opacity: 0.3,
            optimized: true
        });
    // Activities
    } else if (placeCategory === 'park' || placeCategory === 'outdoor centre' || placeCategory === 'bridge' || placeCategory === 'tower' || placeCategory === 'tourist attraction' || placeCategory === 'beach' || placeCategory === 'gym' || placeCategory === 'leisure centre') {
        return ({
            icon: '/static/images/markers/green.svg',
            clickable: true,
            opacity: 0.7,
            optimized: true
        });
    // Transporation
    } else if (placeCategory === 'transit station' || placeCategory === 'airport') {
        return ({
            icon: '/static/images/markers/amber.svg',
            clickable: true,
            opacity: 0.3,
            optimized: true
        });
    // Entertainment
    } else if (placeCategory === 'movie theatre' || placeCategory === 'car wash' || placeCategory === 'event venue' || placeCategory === 'plaza' || placeCategory === 'museum' || placeCategory === 'arcade' || placeCategory === 'bowling alley' || placeCategory === 'arena' || placeCategory === 'aquarium' || placeCategory === 'festival hall' || placeCategory === 'art centre' || placeCategory === 'cultural centre') {
        return ({
            icon: '/static/images/markers/light-blue.svg',
            clickable: true,
            opacity: 0.7,
            optimized: true
        });
    // Misc
    } else if (placeCategory === 'spa' || placeCategory === 'hotel' || placeCategory === 'church' || placeCategory === 'post office' || placeCategory === 'bank' || placeCategory === 'convention centre') {
        return ({
            icon: '/static/images/markers/white.svg',
            clickable: true,
            opacity: 0.3,
            optimized: true
        });
    // Vehicle
    } else if (placeCategory === 'car dealership' || placeCategory === 'registry office' || placeCategory === 'gas station' || placeCategory === 'oil change service') {
        return ({
            icon: '/static/images/markers/yellow.svg',
            clickable: true,
            opacity: 0.9,
            optimized: true
        });
    }
};

/** HANDLE DATA INTERACTIVITY
 * This function is responsible for handling interactivity of
 * data such as click and mouseover events.
 **/
function handleDataInteractivity() {
    map.data.addListener('click', function(event) {
        placeName = event.feature.getProperty('name');
        placeCategory = event.feature.getProperty('category');
        console.log(placeName, placeCategory);
    });
}

/** ZOOM CONTROLS
 * Custom UI control for handling map zoom in and out.
 **/
function zoomControl(controlDiv, map) {
    controlDiv.style.padding = '0 12px 12px 12px';
    var controlWrapper = document.createElement('div');
    controlWrapper.id = 'zoom-control';
    controlWrapper.classList = 'ui-dark map-control';
    controlDiv.appendChild(controlWrapper);
    // Zoom In Button
    var zoomInButton = document.createElement('div');
    zoomInButton.style.padding = '4px';
    zoomInButton.innerHTML = '<i class="material-icons">add</i>';
    controlWrapper.appendChild(zoomInButton);
    // Zoom Out Button
    var zoomOutButton = document.createElement('div');
    zoomOutButton.style.padding = '4px';
    zoomOutButton.classList = 'dark-border';
    zoomOutButton.innerHTML = '<i class="material-icons">remove</i>';
    controlWrapper.appendChild(zoomOutButton);
    // Controls Functionality
    google.maps.event.addDomListener(zoomOutButton, 'click', function() {
        map.setZoom(map.getZoom() - 1);
        // ga("send", "event", "Zoomed Out", "Clicks");
    });
    google.maps.event.addDomListener(zoomInButton, 'click', function() {
        map.setZoom(map.getZoom() + 1);
        // ga("send", "event", "Zoomed In", "Clicks");
    });
}

/** CONTRAST CONTROL
 * Custom UI control for handling map contrast.
 **/
function contrastControl(controlDiv, map) {
    controlDiv.style.padding = '12px';
    var controlWrapper = document.createElement('div');
    controlWrapper.id = 'contrast-control';
    controlWrapper.classList = 'ui-dark map-control';
    controlDiv.appendChild(controlWrapper);
    // Contrast Button
    contrastButton.style.padding = '4px';
    contrastButton.innerHTML = '<i class="material-icons">brightness_4</i>';
    controlWrapper.appendChild(contrastButton);
    // Contrast Button Functionality
    google.maps.event.addDomListener(contrastButton, 'click', function() {
        if (!$('body').hasClass('light')) {
            addLightTheme();
        } else {
            addDarkTheme();
        }
        // ga("send", "event", "Zoomed Out", "Clicks");
    });
}

/** PROJECT INFO CONTROL
 * Custom UI control for showcasing project info in a modal.
 **/
function projectInfoControl(controlDiv, map) {
    controlDiv.style.padding = '12px 12px 0 12px';
    var controlWrapper = document.createElement('div');
    controlWrapper.id = 'project-info-control';
    controlWrapper.classList = 'ui-dark map-control';
    controlDiv.appendChild(controlWrapper);
    // Project Info Button
    var projectInfoButton = document.createElement('div');
    projectInfoButton.style.padding = '4px';
    projectInfoButton.innerHTML = '<i class="material-icons">info_outline</i>';
    controlWrapper.appendChild(projectInfoButton);
    // Project Info Button Functionality
    google.maps.event.addDomListener(projectInfoButton, 'click', function() {
        overlay.id = 'overlay';
        overlay.classList = 'flexbox';
        // Check to see to see active theme is light
        if ($('body').hasClass('light')) {
            // If so change the theme of modal as well
            modal.classList = 'modal ui-light animated fadeInUp';
            overlay.classList = 'flexbox light';
        } else {
            // Else keep it dark
            modal.classList = 'modal ui-dark animated fadeInUp';
        }
        document.body.appendChild(overlay);
        overlay.appendChild(modal);
        // ga("send", "event", "Project Info", "Views");
    });
    // Destroy overlay and modal if clicked inside overlay
    overlay.onclick = function () {
        this.parentElement.removeChild(overlay);
        this.removeChild(modal);
    }
    // Don't destroy overlay and modal if clicked inside the modal
    modal.onclick = function(e) {
        e.stopPropagation();
    };
}

/** ADD LIGHT THEME
 * Change app components to show light theme.
 **/
function addLightTheme() {
    contrastButton.innerHTML = '<i class="material-icons">brightness_5</i>';
    map.setOptions({ backgroundColor: '#F5F5F5', styles: lightStyle });
    $('body, #header, #header > .logo, #app-controls a, #app-controls a.selected, #map-controls > .custom-select > select, #map-controls > .custom-select > .label').addClass('light');
    $('#map-controls, #zoom-control, #contrast-control, #project-info-control').removeClass('ui-dark').addClass('ui-light');
    $('.dark-border').removeClass('dark-border').addClass('light-border');
}

/** ADD DARK THEME
 * Change app components to show dark theme.
 **/
function addDarkTheme() {
    contrastButton.innerHTML = '<i class="material-icons">brightness_4</i>';
    map.setOptions({ backgroundColor: '#151E29', styles: darkStyle });
    $('body, #header, #header > .logo, #app-controls a, #app-controls a.selected, #map-controls > .custom-select > select, #map-controls > .custom-select > .label').removeClass('light');
    $('#map-controls, #zoom-control, #contrast-control, #project-info-control').removeClass('ui-light').addClass('ui-dark');
    $('.dark-border').removeClass('light-border').addClass('dark-border');
}
