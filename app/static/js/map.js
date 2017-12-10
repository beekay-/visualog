/** INIT MAP
 * Set map, map options, loading of data, and map UI.
 **/
function initMap() {
    // Set map options
    var mapOptions = {
        center: calgary,
        zoom: 11,
        minZoom: 3,
        maxZoom: 16,
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
    dataLayer = new google.maps.Data({
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

    lightTheme = sessionStorage.getItem('light-theme');
    if (lightTheme) {
        addLightTheme();
    }

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
    // google.maps.event.addListener(map, 'rightclick', function(e) {
    //     var lat = e.latLng.lat().toFixed(6);
    //     var lng = e.latLng.lng().toFixed(6);
    //     var latLng = document.getElementById('lat-lng');
    //     latLng.style.bottom = 12 + 'px';
    //     latLng.innerHTML = lat + ', ' + lng;
    //     setTimeout(function() {
    //         latLng.style.bottom = -40 + 'px';
    //     }, 3500)
    // });

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
        dataLayer.setStyle(dataLayerStyle);
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
            if (map.getZoom() >= 3 && map.getZoom() <= 11) {
                $.ajax({
                    url: '/getData',
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
    placesMovement = dataLayer.addGeoJson(data['placesMovement']);
    if (typeof placesMovement !== 'undefined') {
        dataLayer.forEach(function(feature) {
            dataLayer.remove(feature);
        });
    }
    // Add places data to map
    placesMovement = dataLayer.addGeoJson(data['placesMovement']);
    // Set marker styles
    dataLayer.setStyle(dataLayerStyle);
}

/** DATA LAYER STYLES
 * Set marker styles based on place category.
 **/
var dataLayerStyle = function(feature) {
    placeCategory = feature.getProperty('category');
    movementType = feature.getProperty('activity');

    if (activitySelector.value === 'all') {
        // Eating
        if (placeCategory === 'coffee shop' || placeCategory === 'restaurant' || placeCategory === 'bakery' || placeCategory === 'ice cream shop' || placeCategory === 'juice shop' || placeCategory === 'pizza shop' || placeCategory === 'pub') {
            return ({
                icon: '/static/images/markers/cyan.svg',
                clickable: true,
                opacity: 0.3,
                optimized: true,
                zIndex: 1
            });
        // Work
        } else if (placeCategory === 'office' || placeCategory === 'coworking space' || placeCategory === 'university' || placeCategory === 'downtown') {
            return ({
                icon: '/static/images/markers/indigo.svg',
                clickable: true,
                opacity: 0.3,
                optimized: true,
                zIndex: 1
            });
        // Living
        } else if (placeCategory === 'home' || placeCategory === 'residence') {
            return ({
                clickable: false,
                visible: false
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
        // Movement
        } else if (movementType === 'car' || movementType === 'walking' || movementType === 'cycling' || movementType === 'running' || movementType === 'train' || movementType === 'bus' || movementType === 'underground' || movementType === 'airplane' || movementType === 'transport') {
            if ($('body').hasClass('light')) {
                return ({
                    strokeColor: '#333',
                    strokeWeight: 0.5,
                    strokeOpacity: 0.1,
                    clickable: false,
                    zIndex: 2
                });
            } else {
                return ({
                    strokeColor: '#FFF',
                    strokeWeight: 0.5,
                    strokeOpacity: 0.1,
                    clickable: false,
                    zIndex: 2
                });
            }
        }
    } else if (activitySelector.value === 'visits') {
        // Eating
        if (placeCategory === 'coffee shop' || placeCategory === 'restaurant' || placeCategory === 'bakery' || placeCategory === 'ice cream shop' || placeCategory === 'juice shop' || placeCategory === 'pizza shop' || placeCategory === 'pub') {
            return ({
                icon: '/static/images/markers/cyan.svg',
                clickable: true,
                opacity: 0.3,
                optimized: true,
                zIndex: 1
            });
        // Work
        } else if (placeCategory === 'office' || placeCategory === 'coworking space' || placeCategory === 'university' || placeCategory === 'downtown') {
            return ({
                icon: '/static/images/markers/indigo.svg',
                clickable: true,
                opacity: 0.3,
                optimized: true,
                zIndex: 1
            });
        // Living
        } else if (placeCategory === 'home' || placeCategory === 'residence') {
            return ({
                clickable: false,
                visible: false
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
        } else if (movementType === 'car' || movementType === 'walking' || movementType === 'cycling' || movementType === 'running' || movementType === 'train' || movementType === 'bus' || movementType === 'underground' || movementType === 'airplane' || movementType === 'transport') {
            return ({
                visible: false
            });
        }
    } else if (activitySelector.value === 'driving') {
        if (movementType === 'car' || movementType === 'transport') {
            return ({
                strokeColor: '#F50057',
                strokeWeight: 0.5,
                strokeOpacity: 0.25,
                clickable: false,
                zIndex: 2
            });
        } else {
            return ({
                visible: false
            });
        }
    } else if (activitySelector.value === 'walking') {
        if (movementType === 'walking' || movementType === 'cycling' || movementType === 'running') {
            return ({
                strokeColor: '#2979FF',
                strokeWeight: 0.5,
                strokeOpacity: 0.25,
                clickable: false,
                zIndex: 2
            });
        } else {
            return ({
                visible: false
            });
        }
    } else if (activitySelector.value === 'transit') {
        if (movementType === 'train' || movementType === 'bus' || movementType === 'underground') {
            return ({
                strokeColor: '#00E676',
                strokeWeight: 0.5,
                strokeOpacity: 0.25,
                clickable: false,
                zIndex: 2
            });
        } else {
            return ({
                visible: false
            });
        }
    } else if (activitySelector.value === 'airplane') {
        if (movementType === 'airplane') {
            return ({
                strokeColor: '#FFEA00',
                strokeWeight: 0.5,
                strokeOpacity: 0.25,
                clickable: false,
                zIndex: 2
            });
        } else {
            return ({
                visible: false
            });
        }
    }
};

/** HANDLE DATA INTERACTIVITY
 * This function is responsible for handling interactivity of
 * data such as click and mouseover events.
 **/
function handleDataInteractivity() {
    // When data on map is clicked...
    dataLayer.addListener('click', function(event) {
        placeName = event.feature.getProperty('name');
        placeCategory = event.feature.getProperty('category');
        var placeLat = event.feature.getGeometry().get().lat();
        var placeLng = event.feature.getGeometry().get().lng();
        var coordinates = new google.maps.LatLng(placeLat, placeLng);
        $.ajax({
            url: '/getTotalVisits?p=' + placeName,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function(data) {
                if (data.total === 0) {
                    totalVisits = 1;
                } else {
                    totalVisits = data.total;
                }
            }
        });
        // Close infoWindow if already opened
        if (infoWindow) {
            infoWindow.close();
        }
        // If map is less than 13
        if (map.getZoom() < 12) {
            // Zoom into map and pan to clicked place
            map.setZoom(14);
            map.panTo(coordinates);
            map.setCenter(coordinates);
            // If zoom is greater than 13, just pan to the clicked place
        } else {
            map.panTo(coordinates);
            map.setCenter(coordinates);
        }
        createInfoWindow(coordinates, placeName, totalVisits);
    });
    // When data on map is hovered...
    // dataLayer.addListener('mouseover', function(event) {
    //     setInfoWindow('hover', event);
    // });
}

/** CREATE INFO WINDOW
 * This function is responsible for the creation of infoWindow
 * to display place related data.
 **/
function createInfoWindow(coordinates, placeName, totalVisits) {
    // Create content div for infoWindow to display place name and category
    infoWindowContent.id = 'info-window';
    if ($('body').hasClass('light')) {
        infoWindowContent.classList = 'ui-light flexbox';
    } else {
        infoWindowContent.classList = 'ui-dark flexbox';
    }
    if (totalVisits === 1) {
        infoWindowContent.innerHTML = '<h1>' + placeName + '</h1>' + '<h2><span style="margin-right: 5px;" class="circle ' + placeCategory + '"></span>' + placeCategory + ' / visited ' + totalVisits + ' time' + '</h2>';
    } else {
        infoWindowContent.innerHTML = '<h1>' + placeName + '</h1>' + '<h2><span style="margin-right: 5px;" class="circle ' + placeCategory + '"></span>' + placeCategory + ' / visited ' + totalVisits + ' times' + '</h2>';
    }
    // Set infoWindow options
    var infoWindowOptions = {
        content: infoWindowContent,
        disableAutoPan: true,
        closeBoxMargin: '1em',
        pixelOffset: new google.maps.Size(-140, -90),
        // infoBoxClearance: new google.maps.Size(1, 1),
        zIndex: 3
    };
    // Create infoWindow using infoBox.js
    infoWindow = new InfoBox(infoWindowOptions);
    // Set infoWindow position and open on map
    infoWindow.setPosition(coordinates);
    infoWindow.open(map);
    // map.setCenter(coordinates);
}

/** ZOOM CONTROLS
 * Custom UI control for handling map zoom in and out.
 **/
function zoomControl(controlDiv, map) {
    controlDiv.style.padding = '0 12px 12px 12px';
    var controlWrapper = document.createElement('div');
    controlWrapper.id = 'zoom-control';
    if ($('body').hasClass('light')) {
        controlWrapper.classList = 'ui-light map-control';
    } else {
        controlWrapper.classList = 'ui-dark map-control';
    }
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
    if ($('body').hasClass('light')) {
        controlWrapper.classList = 'ui-light map-control';
    } else {
        controlWrapper.classList = 'ui-dark map-control';
    }
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
    if ($('body').hasClass('light')) {
        controlWrapper.classList = 'ui-light map-control';
    } else {
        controlWrapper.classList = 'ui-dark map-control';
    }
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
        modal.innerHTML = '<strong>Visualog</strong> is an experiment at visualizing the journey of Bilal Karim in 2017 using Google Maps API, with data from Moves and Instagram.';
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
    dataLayer.setStyle(dataLayerStyle);
    contrastButton.innerHTML = '<i class="material-icons">brightness_5</i>';
    map.setOptions({
        backgroundColor: '#F5F5F5',
        styles: lightStyle
    });
    $('body, #header, #header > .logo, #app-controls a, #app-controls a.selected, #map, #map-controls > .custom-select > select, #map-controls > .custom-select > .label').addClass('light');
    $('#map-controls, #zoom-control, #contrast-control, #project-info-control, #info-window').removeClass('ui-dark').addClass('ui-light');
    $('img[src="/static/images/close-white.svg"]').attr('src', '/static/images/close-black.svg');
    $('.dark-border').removeClass('dark-border').addClass('light-border');
    sessionStorage.setItem('light-theme', true);
}

/** ADD DARK THEME
 * Change app components to show dark theme.
 **/
function addDarkTheme() {
    dataLayer.setStyle(dataLayerStyle);
    contrastButton.innerHTML = '<i class="material-icons">brightness_4</i>';
    map.setOptions({
        backgroundColor: '#151E29',
        styles: darkStyle
    });
    $('body, #header, #header > .logo, #app-controls a, #app-controls a.selected, #map, #map-controls > .custom-select > select, #map-controls > .custom-select > .label').removeClass('light');
    $('#map-controls, #zoom-control, #contrast-control, #project-info-control, #info-window').removeClass('ui-light').addClass('ui-dark');
    $('img[src="/static/images/close-black.svg"]').attr('src', '/static/images/close-white.svg');
    $('.dark-border').removeClass('light-border').addClass('dark-border');
    sessionStorage.removeItem('light-theme');
}
