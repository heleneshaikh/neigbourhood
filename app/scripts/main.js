//MODEL of locations[latitude, longitude, name]
var locations = [
  [44.8798398, 15.60908, "Plitvice Jezera", "images/plitvice.jpg"],
  [43.8437695, 16.3016561, "Krka National Park", "images/krka.jpg"],
  [43.3252778, 17.046978, "Biokovo", "images/biokovo.jpg"],
  [43.270625, 16.6340962, "Bol"],
];

var map;

var ViewModel = function () {
  var marker, i, content;
  var infowindow = new google.maps.InfoWindow();

  //CREATE MARKERS
  for (i = 0; i < locations.length; i++) {
    console.log(locations[i][1]);
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][0], locations[i][1]),
      map: map,
      icon: {
        url: ('images/waterfall.svg'),
        scaledSize: new google.maps.Size(45, 45)
      },
      animation: google.maps.Animation.DROP,
    });

    //ADD INFOWINDOW CONTENT ON CLICK
   content = '<div><p>' + locations[i][2] + '</p><img src=" '+ locations[i][3]+'"></div>';
    google.maps.event.addListener(marker, 'click', (function(marker, i, content) {
      return function() {
        infowindow.setContent(content);
        infowindow.open(map, marker);
      };
    })(marker, i, content));
  }

  //RESTRICT THE AUTOCOMPLETE
  var options = {
    componentRestrictions: {country: 'hr'}
  };
  var input = document.getElementById("country");
  var autoComplete = new google.maps.places.Autocomplete(input, options);
};

//INITIALIZE THE MAP
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 44.4464391, lng: 14.936299},
    zoom: 8,
    styles: [
      {
        featureType: "water",
        stylers: [
          {color: "#1FCEC9"}
        ]
      }
    ]
  });

  ko.applyBindings(new ViewModel());
}
//<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
