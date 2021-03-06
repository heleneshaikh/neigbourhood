/*
 The waterfall and nature icons are licensed by Flaticon Basic License
 */

//MODEL REPRESENTING THE GREATEST NATIONAL PARKS AND WATERFALLS IN KROATIA
var locations = [
  {lat: 44.8654, lng: 15.5820, title: "Plitvice Lakes National Park", icon: "images/waterfall-icon.svg"},
  {lat: 43.8666, lng: 15.9725, title: "Krka National Park", icon: "images/waterfall-icon.svg"},
  {lat: 43.3252778, lng: 17.046978, title: "Biokovo", icon: "images/mountain.svg"},
  {lat: 43.1561, lng: 17.6080, title: "Kravica", icon: "images/waterfall-icon.svg"},
  {lat: 43.2622, lng: 16.6541, title: "Bol, Croatia", icon: "images/nature.svg"},
  {lat: 45.0809, lng: 14.5926, title: "Krk", icon: "images/nature.svg"},
  {lat: 43.8707, lng: 15.2324, title: "Kornati", icon: "images/nature.svg"}
];

var map;

var ViewModel = function () {
  var marker, i;
  var infowindow = new google.maps.InfoWindow();

  //CREATE AND DISPLAY THE MARKERS ON THE MAP
  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
      map: map,
      icon: {
        url: locations[i].icon,
        scaledSize: new google.maps.Size(30, 30)
      },
      animation: google.maps.Animation.DROP,
      title: locations[i].title
      //THE CLICK ANIMATION IS IMPLEMENTED BELOW
    });


    //DATA RETRIEVED FROM THE WIKIPEDIA API. WHEN THE USER CLICKS ON A MARKER, IT DISPLAYS THAT INFORMATION IN ITS INFOWINDOW
    google.maps.event.addListener(marker, "click", (function (marker) {
      var content, image, url;
      return function () {
        $.ajax({
          url: "https://en.wikipedia.org/w/api.php?action=query&indexpageids=1&format=json&prop=pageimages|info&pithumbsize=250&inprop=url&utf8=1&titles=" + marker.title,
          dataType: "jsonp"
        }).done(function (response) {
          var result = response.query.pages[response.query.pageids[0]];
          if (response.query.pageids < 0) { //IF WIKIPEDIA CANNOT RETRIEVE THE INFO, JUST DISPLAY THE TITLE
            content = '<div><h2>' + marker.title + '</h2><p>data could not be loaded</p></div>';
          } else {
            image = result.thumbnail.source;
            url = result.fullurl;
            content = '<div><img src="' + image + '" width="250"><h2>' + marker.title + '</h2><p><a href="' + url + '" target="_blank">Read More</a></p></div>';
          }
          infowindow.setContent(content);
          infowindow.open(map, marker);
        }).fail(function () {
          content = '<div><h2>' + marker.title + '</h2><p>data could not be loaded</p></div>';
          infowindow.setContent(content);
          infowindow.open(map, marker);
        });
      };
    })(marker));

    function toggleBounce(currentIcon) {
      if (currentIcon.getAnimation() != null) {
        currentIcon.setAnimation(null);
      } else {
        currentIcon.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
          currentIcon.setAnimation(null);
        }, 1400);
      }
    }

    //MAKE THE MARKER BOUNCE
    marker.addListener("click", function () {
      toggleBounce(this);
    });

    locations[i].marker = marker;
  }

  //RESTRICT THE AUTOCOMPLETE SERACH TO LOCATIONS IN CROATIA
  var options = {
    componentRestrictions: {country: 'hr'}
  };

  //FILTER THE LOCATIONS BASED ON INPUT
  var self = this;
  self.inputFilter = ko.observable(); //input value
  var locArray = [];
  for (var j = 0; j < locations.length; j++) {
    locArray.push(locations[j]);
  }

  self.allLocations = ko.observableArray(locArray); //COMPLETE ARRAY OF OBJECTS
  self.filteredItems = ko.computed(function () { //INPUT
    var inputFilter = self.inputFilter();
    if (!inputFilter) {
      var locations = self.allLocations();
      for (var i = 0; i < locations.length; i++) {
        locations[i].marker.setVisible(true);
      }
      return locations;
    } else { //FILTER THE LOCATION ITEMS AND SHOW THEIR MARKER
      return ko.utils.arrayFilter(self.allLocations(), function (location) {
        var match = location.title.toLowerCase().indexOf(inputFilter.toLowerCase()) >= 0;
        location.marker.setVisible(match);
        return match;
      });
    }
  });

  //WHEN A LIST ITEM IS CLICKED, SHOW ITS MARKER AND OPEN ITS INFOWINDOW
  self.showMarker = function(data){
    new google.maps.event.trigger(data.marker, 'click');
  };
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

function mapError() {
  alert("Map could not be loaded");
}

//TOGGLE MENU
var menu = document.getElementById('menu');
document.getElementById('menu-toggle').addEventListener('click', function (e) {
  menu.classList.toggle('-is-active');
});
