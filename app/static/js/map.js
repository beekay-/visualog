/** INIT MAP
 * Set map, map options, loading of data, and map UI.
 **/
function initMap() {
    // Set map options
    var mapOptions = {
        center: calgary,
        zoom: 11,
        minZoom: 4,
        maxZoom: 14,
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

    // Set data layers
    placesLayer = new google.maps.Data({
        map: map
    });
    movementLayer = new google.maps.Data({
        map: map
    });

    // Show data on map
    getDataForMap();
    handleDataInteractivity();

    // City Selector
    var cityName = document.getElementById('city');
    cityName.onchange = function() {
        if (cityName.value === 'banff') {
            map.panTo(banff);
        } else if (cityName.value === 'brampton') {
            map.panTo(brampton);
        } else if (cityName.value === 'burlington') {
            map.panTo(burlington);
        } else if (cityName.value === 'calgary') {
            map.panTo(calgary);
        } else if (cityName.value === 'etobicoke') {
            map.panTo(etobicoke);
        } else if (cityName.value === 'hamilton') {
            map.panTo(hamilton);
        } else if (cityName.value === 'mississauga') {
            map.panTo(mississauga);
        } else if (cityName.value === 'oakville') {
            map.panTo(oakville);
        } else if (cityName.value === 'toronto') {
            map.panTo(toronto);
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
    google.maps.event.addListener(map, 'rightclick', function(e) {
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
        (longpress) ? $('#header, #zoom-control, #contrast-control, #project-info-control').addClass('hide'): $('#header, #zoom-control, #contrast-control, #project-info-control').removeClass('hide');
    });
    google.maps.event.addListener(map, 'mousedown', function(event) {
        start = new Date().getTime();
    });
    google.maps.event.addListener(map, 'mouseup', function(event) {
        end = new Date().getTime();
        longpress = (end - start < 500) ? false : true;
    });

    activitySelector.onchange = function() {
        handleDynamicStyling();
    };
}

/** GET BOUNDING BOX
 * This function gets the current bounding box of the map based on the viewport.
 **/
function getBoundingBox() {
    var bBoxNE = map.getBounds().getNorthEast();
    var bBoxSW = map.getBounds().getSouthWest();
    var ne = [bBoxNE.lng(), bBoxNE.lat()];
    var nw = [bBoxSW.lng(), bBoxNE.lat()];
    var sw = [bBoxSW.lng(), bBoxSW.lat()];
    var se = [bBoxNE.lng(), bBoxSW.lat()];
    var ne = [bBoxNE.lng(), bBoxNE.lat()];
    var bBoxArray = [ne, nw, sw, se, ne];
    return bBoxArray;
}

/** GET DATA FOR MAP
 * This function is responsible for getting data from database
 * based on the current bounding box.
 **/
function getDataForMap() {
    // if (navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('Android') != -1) {}
    google.maps.event.addListener(map, 'idle', function() {
        boundingBox = getBoundingBox();
        if (activitySelector.value === 'all') {
            if (map.getZoom() >= 4 && map.getZoom() <= 11) {
                $.ajax({
                    url: '/getMovement',
                    type: 'POST',
                    data: JSON.stringify(boundingBox),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(data) {
                        addMovementToMap(data);
                    }
                });
                $.ajax({
                    url: '/getPlaces',
                    type: 'POST',
                    data: JSON.stringify(boundingBox),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(data) {
                        addPlacesToMap(data);
                    }
                });
            }
        }
    });
}

/** ADD PLACES TO MAP
 * This function is responsible for adding places data to the map
 * using Maps API's DataLayer addGeoJSON feature.
 **/
function addPlacesToMap(data) {
    // Minor fix for data layers flicker
    places = placesLayer.addGeoJson(data['places']);
    if (typeof places !== 'undefined') {
        placesLayer.forEach(function(feature) {
            placesLayer.remove(feature);
        });
    }
    // Add places data to map
    places = placesLayer.addGeoJson(data['places']);
    // Set marker styles
    placesLayer.setStyle(markerStyle);
}

/** ADD MOVEMENT TO MAP
 * This function is responsible for adding movement data to the map
 * using Maps API's DataLayer addGeoJSON feature.
 **/
function addMovementToMap(data) {
    // Minor fix for data layer flicker
    movement = movementLayer.addGeoJson(data['movement']);
    if (typeof movement != 'undefined') {
        movementLayer.forEach(function(feature) {
            movementLayer.remove(feature);
        });
    }
    // Add movement data to map
    movement = movementLayer.addGeoJson(data['movement']);
    // Set polyline styles
    movementLayer.setStyle(movementStyle);
}

/** MOVEMENT STYLE
 * Set basic movement style.
 **/
var movementStyle = function(feature) {
    return ({
        geodesic: true,
        strokeColor: '#FFF',
        strokeWeight: 0.5,
        strokeOpacity: 0.1,
        clickable: false,
        zIndex: 2
    });
}

/** HANDLE DYNAMIC STYLING
 * Apply styles based on the item selected from the Activity dropdown.
 **/
function handleDynamicStyling() {
    if (activitySelector.value === 'all') {
        movementLayer.setStyle(movementStyle);
        placesLayer.setStyle(markerStyle);

    } else if (activitySelector.value === 'places') {
        movementLayer.setStyle({
            visible: false
        });
        placesLayer.setStyle(markerStyle);

    } else if (activitySelector.value === 'driving') {
        movementLayer.setStyle(function(feature) {
            var activity = feature.getProperty('activity');
            if (activity === 'car') {
                return {
                    strokeColor: '#F50057',
                    strokeWeight: 0.5,
                    strokeOpacity: 0.25,
                    clickable: false,
                    zIndex: 2
                };
            } else {
                return ({
                    visible: false
                });
            }
        });
        placesLayer.setStyle({
            visible: false
        });
    } else if (activitySelector.value === 'walking') {
        movementLayer.setStyle(function(feature) {
            var activity = feature.getProperty('activity');
            if (activity === 'walking' || activity === 'cycling' || activity === 'running') {
                return {
                    strokeColor: '#2979FF',
                    strokeWeight: 0.5,
                    strokeOpacity: 0.25,
                    clickable: false,
                    zIndex: 2
                };
            } else {
                return ({
                    visible: false
                });
            }
        });
        placesLayer.setStyle({
            visible: false
        });
    } else if (activitySelector.value === 'transit') {
        movementLayer.setStyle(function(feature) {
            var activity = feature.getProperty('activity');
            if (activity === 'train' || activity === 'bus' || activity === 'underground') {
                return {
                    strokeColor: '#00E676',
                    strokeWeight: 0.5,
                    strokeOpacity: 0.25,
                    clickable: false,
                    zIndex: 2
                };
            } else {
                return ({
                    visible: false
                });
            }
        });
        placesLayer.setStyle({
            visible: false
        });
    } else if (activitySelector.value === 'airplane') {
        movementLayer.setStyle(function(feature) {
            var activity = feature.getProperty('activity');
            if (activity === 'airplane') {
                return {
                    strokeColor: '#FF3D00',
                    strokeWeight: 0.5,
                    strokeOpacity: 0.25,
                    clickable: false,
                    zIndex: 2
                };
            } else {
                return ({
                    visible: false
                });
            }
        });
        placesLayer.setStyle({
            visible: false
        });
    }
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
            optimized: true,
            zIndex: 1
        });
    // Living
    } else if (placeCategory === 'home' || placeCategory === 'office' || placeCategory === 'residence' || placeCategory === 'coworking space' || placeCategory === 'university' || placeCategory === 'downtown') {
        return ({
            icon: '/static/images/markers/indigo.svg',
            clickable: true,
            opacity: 0.3,
            optimized: true,
            zIndex: 1
        });
    // Shopping
    } else if (placeCategory === 'supermarket' || placeCategory === 'shopping mall' || placeCategory === 'clothing store' || placeCategory === 'electronics store' || placeCategory === 'department store' || placeCategory === 'pharmacy' || placeCategory === 'dollar store' || placeCategory === 'supermarket' || placeCategory === 'convenience store' || placeCategory === 'hardware store' || placeCategory === 'art supply store' || placeCategory === 'sports store' || placeCategory === 'camera store' || placeCategory === 'print shop' || placeCategory === 'toy store' || placeCategory === 'shopping mall' || placeCategory === 'gift store') {
        return ({
            icon: '/static/images/markers/pink.svg',
            clickable: true,
            opacity: 0.3,
            optimized: true,
            zIndex: 1
        });
    // Activities
    } else if (placeCategory === 'park' || placeCategory === 'outdoor centre' || placeCategory === 'bridge' || placeCategory === 'tower' || placeCategory === 'tourist attraction' || placeCategory === 'beach' || placeCategory === 'gym' || placeCategory === 'leisure centre') {
        return ({
            icon: '/static/images/markers/green.svg',
            clickable: true,
            opacity: 0.7,
            optimized: true,
            zIndex: 1
        });
    // Transporation
    } else if (placeCategory === 'transit station' || placeCategory === 'airport') {
        return ({
            icon: '/static/images/markers/amber.svg',
            clickable: true,
            opacity: 0.3,
            optimized: true,
            zIndex: 1
        });
    // Entertainment
    } else if (placeCategory === 'movie theatre' || placeCategory === 'car wash' || placeCategory === 'event venue' || placeCategory === 'plaza' || placeCategory === 'museum' || placeCategory === 'arcade' || placeCategory === 'bowling alley' || placeCategory === 'arena' || placeCategory === 'aquarium' || placeCategory === 'festival hall' || placeCategory === 'art centre' || placeCategory === 'cultural centre') {
        return ({
            icon: '/static/images/markers/light-blue.svg',
            clickable: true,
            opacity: 0.7,
            optimized: true,
            zIndex: 1
        });
    // Misc
    } else if (placeCategory === 'spa' || placeCategory === 'hotel' || placeCategory === 'church' || placeCategory === 'post office' || placeCategory === 'bank' || placeCategory === 'convention centre') {
        return ({
            icon: '/static/images/markers/brown.svg',
            clickable: true,
            opacity: 0.4,
            optimized: true,
            zIndex: 1
        });
    // Vehicle
    } else if (placeCategory === 'car dealership' || placeCategory === 'registry office' || placeCategory === 'gas station' || placeCategory === 'oil change service') {
        return ({
            icon: '/static/images/markers/yellow.svg',
            clickable: true,
            opacity: 0.9,
            optimized: true,
            zIndex: 1
        });
    }
};

/** HANDLE DATA INTERACTIVITY
 * This function is responsible for handling interactivity of
 * data such as click and mouseover events.
 **/
function handleDataInteractivity() {
    // When data on map is clicked...
    placesLayer.addListener('click', function(event) {
        // Close infoWindow if already opened
        if (infoWindow) {
            infoWindow.close();
        }
        // Get name, category and location
        placeName = event.feature.getProperty('name');
        placeCategory = event.feature.getProperty('category');
        var placeLat = event.feature.getGeometry().get().lat();
        var placeLng = event.feature.getGeometry().get().lng();
        var coordinates = new google.maps.LatLng(placeLat, placeLng);
        // If map is less than 13
        if (map.getZoom() < 13) {
            // Zoom into map and pan to clicked place
            map.setZoom(map.getZoom() + 2);
            map.panTo(coordinates);
            map.setCenter(coordinates);
            // If zoom is greater than 13, just pan to the clicked place
        } else {
            map.panTo(coordinates);
            map.setCenter(coordinates);
        }
        // Create content div for infoWindow to display place name and category
        infoWindowContent.id = 'info-window';
        infoWindowContent.classList = 'ui-dark flexbox';
        infoWindowContent.innerHTML = '<h1>' + placeName + '</h1>' + '<h2>' + placeCategory + '</h2>';
        // Set infoWindow options
        var infoWindowOptions = {
            content: infoWindowContent,
            disableAutoPan: true,
            closeBoxMargin: '1em',
            pixelOffset: new google.maps.Size(-140, -85),
            // infoBoxClearance: new google.maps.Size(1, 1),
            zIndex: 3
        };
        // Create infoWindow using infoBox.js
        infoWindow = new InfoBox(infoWindowOptions);
        // Set infoWindow position and open on map
        infoWindow.setPosition(coordinates);
        infoWindow.open(map);
        map.panTo(coordinates);
        // map.setCenter(coordinates);
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
        map.setZoom(map.getZoom() - 2);
        // ga("send", "event", "Zoomed Out", "Clicks");
    });
    google.maps.event.addDomListener(zoomInButton, 'click', function() {
        map.setZoom(map.getZoom() + 2);
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
    overlay.onclick = function() {
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
    map.setOptions({
        backgroundColor: '#F5F5F5',
        styles: lightStyle
    });
    $('body, #header, #header > .logo, #app-controls a, #app-controls a.selected, #map-controls > .custom-select > select, #map-controls > .custom-select > .label').addClass('light');
    $('#map-controls, #zoom-control, #contrast-control, #project-info-control, #info-window').removeClass('ui-dark').addClass('ui-light');
    $('img[src="/static/images/close-white.svg"]').attr('src', '/static/images/close-black.svg');
    $('.dark-border').removeClass('dark-border').addClass('light-border');
    if (activitySelector.value === 'all') {
        movementLayer.setStyle({
            strokeColor: '#555',
            strokeWeight: 0.2,
            strokeOpacity: 0.3,
            clickable: false,
            zIndex: 2
        });
    }
}

/** ADD DARK THEME
 * Change app components to show dark theme.
 **/
function addDarkTheme() {
    contrastButton.innerHTML = '<i class="material-icons">brightness_4</i>';
    map.setOptions({
        backgroundColor: '#151E29',
        styles: darkStyle
    });
    $('body, #header, #header > .logo, #app-controls a, #app-controls a.selected, #map-controls > .custom-select > select, #map-controls > .custom-select > .label').removeClass('light');
    $('#map-controls, #zoom-control, #contrast-control, #project-info-control, #info-window').removeClass('ui-light').addClass('ui-dark');
    $('img[src="/static/images/close-black.svg"]').attr('src', '/static/images/close-white.svg');
    $('.dark-border').removeClass('light-border').addClass('dark-border');
    if (activitySelector.value === 'all') {
        movementLayer.setStyle({
            strokeColor: '#FFF',
            strokeWeight: 0.2,
            strokeOpacity: 0.2,
            clickable: false,
            zIndex: 2
        });
    }
}
