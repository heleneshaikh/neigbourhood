//MODEL
var locations = [
  [44.8798398, 15.60908, "Plitvice Jezera"],
  [43.8437695, 16.3016561, "Krka National Park"],
  [43.3252778, 17.046978, "Biokovo"],
  [43.270625, 16.6340962, "Bol"],
  [43.5279424, 16.2414168, "Trogir"]
];

var map;

var ViewModel = function () {
  var marker;
  for (var i = 0; i < locations.length; i++) {
    console.log(locations[i][1]);
    marker = new google.maps.Marker({
      position: {lat: locations[i][0], lng: locations[i][1]},
      map: map,
      icon: {
        url: ('images/flower.svg'),
        scaledSize: new google.maps.Size(45, 45)
      },
      animation: google.maps.Animation.DROP,
    });

  }
  //restrict autocomplete to Croatia
  var options= {
    componentRestrictions: {country: 'hr'}
  };
  var input = document.getElementById("country");
  var autoComplete = new google.maps.places.Autocomplete(input, options);

};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 44.4464391, lng: 14.936299},
    zoom: 8,
    styles: [
      {
        featureType: "water",
        stylers : [
          {color: "#1FCEC9"}
        ]
      }
    ]
  });

  ko.applyBindings(new ViewModel());
}
