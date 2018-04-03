var map;

function initMap() {
    // Constructor to create a new map JS object.
    //13.105549,80.288377- Chennai.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 13.105549,
            lng: 80.288377
        },
        zoom: 10
    });

    // Location function used for marker.
	var LocationFn = function(data) {
        var self = this;
        this.title = data.title;
        this.lng = data.lng;
        this.lat = data.lat;
        this.venueId = data.venueId;
        this.cat = data.cat;
		
        // By default every marker will be visible
		this.visible = ko.observable(true);

        // getInfoContent function retrieves 5 most recent tips from foursquare for the marker location.
        this.getInfoContent = function() {
            var recentComments = [];
            var venueUrl = 'https://api.foursquare.com/v2/venues/' + self.venueId + '/tips?sort=recent&v=20171231&client_id=ZLBOT1JMFL3MS3VCHEVNQ4WKSHXGJSMBTFBHXPZID2ZMNXPS&client_secret=TTUAEA3SPGSLA51VI2ZKTLJU01KJXBSY4GLT3TGVVLBDGPY3';

            $.getJSON(venueUrl,
                function(data) {
                    $.each(data.response.tips.items, function(i, tips) {
                        if (i < 4) {
                            if (tips.type == 'user') {
                                recentComments.push('<li>' + tips.text + ' -- <b>' + tips.user.firstName + '</b></li>');
                            } else {
                                recentComments.push('<li>' + tips.text + '</li>');
                            }
                        }
                    });

                }).done(function() {

                self.content = '<h2>' + self.title + '</h2>' + '<h3>Most Recent Comments</h3>';
                self.content += '<ol class="tips">' + recentComments.join('') + '</ol>';

            }).fail(function(jqXHR, textStatus, errorThrown) {
                self.content = '<h2>' + self.title + '</h2><h4>Oops. There was a problem retrieving this location\'s comments.</h4>';
            });
        }();

        // Info window details
        this.infowindow = new google.maps.InfoWindow();
        this.icon = 'http://www.googlemapsmarkers.com/v1/009900/';
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(self.lng, self.lat),
            map: map,
            title: self.title,
            icon: self.icon,
            animation: google.maps.Animation.DROP
        });
		
		//Display function for marker
		this.showMarker = ko.computed(function() {
			if(this.visible() === true) {
				this.marker.setMap(map);
			} else {
				this.marker.setMap(null);
			}
			return true;
		}, this);

        // Opens the info window for the location marker.
        this.openInfowindow = function() {
            for (var i = 0; i < locationsModel.locations.length; i++) {
                locationsModel.locations[i].infowindow.close();
            }
            map.panTo(self.marker.getPosition());

            //Setting content in map popup
            self.infowindow.setContent(self.content);
            self.infowindow.open(map, self.marker);
			
			//Animate the selected marker
			self.marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
				self.marker.setAnimation(null);
			}, 2100);
        };
		
		// Animate whenever we clicking the marker
		this.bounce = function(place) {
			google.maps.event.trigger(self.marker, 'click');
		};

        // Assigns a click event for marker
        this.addListener = google.maps.event.addListener(self.marker, 'click', (this.openInfowindow));
    };

    // Location model
	let temporaryLocations = [{
			title: 'Phoenix Marketcity',
			lng: 12.991314,
			lat: 80.216574,
			venueId: '4fe16257e4b0e4cc311bb9ab',
		},{
			title: 'Express Avenue',
			lng: 13.058677,
			lat: 80.264138,
			venueId: '4bf3d4eed2fbef3b05b1a4c5',
		},{
			title: 'AGS Cinemas',
			lng: 12.850516,
			lat: 80.225591,
			venueId: '4deb60a0ae60e98923712b0f',
		},{
			title: 'Marina Beach',
			lng: 13.050161,
			lat: 80.281793,
			venueId: '4d046ec926adb1f721c3d270',
		},{
			title: 'Elliots Beach',
			lng: 13.000794,
			lat: 80.271877,
			venueId: '4b5abae4f964a5205cd228e3',
		}
	];
    
	var locationsArray = [];
	for(let i=0; i<temporaryLocations.length; i++){
		locationsArray.push(new LocationFn(temporaryLocations[i]));
	}
	var locationsModel = {
		locations : locationsArray,
		query: ko.observable('')
	};

    locationsModel.availablePlaces = ko.computed(function() {
        var self = this;
        return ko.utils.arrayFilter(self.locations, function(location) {
            return location.title.toLowerCase();
        });
    }, locationsModel);

    // Search function for filtering
    locationsModel.search = ko.computed(function() {
        var self = this;
		var filter = this.query().toLowerCase();
		if (!filter) {
            self.locations.forEach(function(locationItem) {
                locationItem.visible(true);
            });
            return self.locations;
        } else {
            return ko.utils.arrayFilter(self.locations, function(locationItem) {
                var string = locationItem.title.toLowerCase();
                var result = (string.search(filter) >= 0);
                locationItem.visible(result);
                return result;
            });
        }
    }, locationsModel);

    ko.applyBindings(locationsModel);
}

function mapError() {
    $('#map').html('<span class="errorMsg">Sorry, some issue with map.</span>');
}

function openNavigation() {
    $("#mySidenavigation").show();
}

function closeNavigation() {
    $("#mySidenavigation").hide();
}