/*
 The waterfall and nature icons are licensed by Flaticon Basic License
 */

//MODEL of locations[latitude, longitude, name, image file, image icon]
var locations = [
  [44.8654, 15.5820, "Plitvice National Park", "images/plitvice.jpg", "images/waterfall-icon.svg"], //flat
  [43.8666, 15.9725, "Krka National Park", "images/krka.jpg", "images/waterfall-icon.svg"],
  [43.3252778, 17.046978, "Biokovo", "images/biokovo.jpg", "images/mountain.svg"],
  [43.2595, 17.1025, "vrata biokova", "images/cheeseburger.jpg", "images/hamburger.svg"],
  [43.1561, 17.6080, "Kravica", "images/kravice.jpg", "images/waterfall-icon.svg"],
  [43.2622, 16.6541, "Island Bol", "", "images/nature.svg"],
  [45.0809, 14.5926, "Krk Island", "", "images/nature.svg"],
  [43.8707, 15.2324, "Kornati National Park", "", "images/nature.svg"]
];

var map;

var ViewModel = function () {
  var marker, i, content;
  var infowindow = new google.maps.InfoWindow();

  //CREATE MARKERS
  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][0], locations[i][1]),
      map: map,
      icon: {
        url: (locations[i][4]),
        scaledSize: new google.maps.Size(30, 30)
      },
      animation: google.maps.Animation.DROP,
    });

    //ADD INFOWINDOW CONTENT ON CLICK
    content = '<div><p>' + locations[i][2] + '</p><img src=" ' + locations[i][3] + '"></div>';
    google.maps.event.addListener(marker, 'click', (function (marker, i, content) {
      return function () {
        infowindow.setContent(content);
        infowindow.open(map, marker);
      };
    })(marker, i, content));
  }

  document.getElementById("marker-btn").addEventListener("click", function () {
    var value = document.getElementById("marker-input-filter").value;
    console.log(value);
  });

  //RESTRICT THE AUTOCOMPLETE
  var options = {
    componentRestrictions: {country: 'hr'}
  };
  var input = document.getElementById("input");
  new google.maps.places.Autocomplete(input, options);

  //ZOOM
  document.getElementById("zoom").addEventListener("click", function () {
    zoomToArea();
  });

  function zoomToArea() {
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById("input").value;
    if (address == '') {
      console.log("you must enter an address");
    } else {
      geocoder.geocode({address: address,}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          console.log("geo" + results[0].geometry.location);
          map.setZoom(12);
        } else {
          console.log("location not found");
        }
      });
    }
  }

  var self = this;
  self.filterItems = ko.observable(); //input value
  var titles = [];
  for (var j = 0; j < locations.length; j++) {
    titles.push(locations[j][2]);
  }
  self.allLocations = ko.observableArray(titles); //complete array
  self.filteredItems = ko.computed(function () {
    var filterItems = self.filterItems();
    if (!filterItems) {
      return self.allLocations();
    } else {
     return self.allLocations().filter(function (i) {
        return i.indexOf(filterItems) >= 0;
      });
    }
  });
};


//INITIALIZE THE MAP
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 44.288834, lng: 17.0725821},
    zoom: 8,
  });
  ko.applyBindings(new ViewModel());
}

