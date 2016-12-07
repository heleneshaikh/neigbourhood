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
    content = '<div><p>' + locations[i][2] + '</p><img src=" ' + locations[i][3] + '"></div>';
    google.maps.event.addListener(marker, 'click', (function (marker, i, content) {
      return function () {
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

  //ZOOM

  document.getElementById("zoom").addEventListener("click", function () {
    zoomToArea();
  });

  function zoomToArea() {
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById("country").value;
    if (address == '') {
      console.log("you must enter an address");
    } else {
      geocoder.geocode({
          address: address,
          componentRestrictions: {country: "croatia"}
        },
        function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            map.setZoom(10);
          } else {
            console.log("location not found");
          }
        })
    }
  }
};

//INITIALIZE THE MAP
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 44.288834, lng: 17.0725821},
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
