/*
 The waterfall and nature icons are licensed by Flaticon Basic License
 */

//MODEL
var locations = [
  {lat: 44.8654, lng: 15.5820, title: "Plitvice Lakes National Park", marker: "images/waterfall-icon.svg"},
  {lat: 43.8666, lng: 15.9725, title: "Krka National Park", marker: "images/waterfall-icon.svg"},
  {lat: 43.3252778, lng: 17.046978, title: "Biokovo", marker: "images/mountain.svg"},
  {lat: 43.1561, lng: 17.6080, title: "Kravica", marker: "images/waterfall-icon.svg"},
  {lat: 43.2622, lng: 16.6541, title: "Bol, Croatia", marker: "images/nature.svg"},
  {lat: 45.0809, lng: 14.5926, title: "Krk", marker: "images/nature.svg"},
  {lat: 43.8707, lng: 15.2324, title: "Kornati", marker: "images/nature.svg"}
];

var map;

var ViewModel = function () {
  var marker, i;
  var infowindow = new google.maps.InfoWindow();

  //CREATE MARKERS
  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
      map: map,
      icon: {
        url: locations[i].marker,
        scaledSize: new google.maps.Size(30, 30)
      },
      animation: google.maps.Animation.DROP,
      title: locations[i].title
    });

    //ADD INFOWINDOW CONTENT ON CLICK
    google.maps.event.addListener(marker, 'click', (function (marker) {
      var content, image, url;
      return function () {
        $.ajax({
          url: "https://en.wikipedia.org/w/api.php?action=query&indexpageids=1&format=json&prop=pageimages|info&pithumbsize=250&inprop=url&utf8=1&titles=" + marker.title,
          dataType: "jsonp"
        }).done(function (response) {
          var result = response.query.pages[response.query.pageids[0]];
          if (response.query.pageids < 0) {
            content = '<div><h2>' + marker.title + '</h2><p>data could not be loaded</p></div>';
          } else {
            image = result.thumbnail.source;
            url = result.fullurl;
            content = '<div><img src="' + image + '" alt=""><h2>' + marker.title + '</h2><p><a href="' + url + '" target="_blank">Read More</a></p></div>';
          }
          infowindow.setContent(content);
          infowindow.open(map, marker);
        }).error(function () {
          content = '<div><h2>' + marker.title + '</h2><p>data could not be loaded</p></div>';
          infowindow.setContent(content);
          infowindow.open(map, marker);
        });
      };
    })(marker));

    //MAKE MARKER BOUNCE
    marker.addListener("mouseover", function () {
      toggleBounce(this);
    });
  }

  function toggleBounce(currentIcon) {
    currentIcon.setAnimation(null);
    if (currentIcon.getAnimation() != null) {
      currentIcon.setAnimation(null);
    } else {
      currentIcon.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  //RESTRICT THE AUTOCOMPLETE TO CROATIA
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
      geocoder.geocode({address: address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          // console.log("geo" + results[0].geometry.location);
          map.setZoom(12);
        } else {
          console.log("location not found");
        }
      });
    }
  }

  //FILTER
  var self = this;
  self.inputFilter = ko.observable(); //input value
  var locArray = [];
  for (var j = 0; j < locations.length; j++) {
    locArray.push(locations[j].title);
  }

  //todo lower case
  self.allLocations = ko.observableArray(locArray); //complete array of objects
  self.filteredItems = ko.computed(function () {
    var inputFilter = self.inputFilter();
    if (!inputFilter) {
      return self.allLocations();
    } else {
      return ko.utils.arrayFilter(self.allLocations(), function (i) {
        return i.toLowerCase().indexOf(inputFilter) >= 0;
      });
    }
  });
};



//INITIALIZE THE MAP
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 44.288834, lng: 17.0725821},
    zoom: 8,
    icon: "images/mountain.svg"
  });
  ko.applyBindings(new ViewModel());
}

