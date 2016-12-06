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
        url: ('images/Flower.svg'),
        scaledSize: new google.maps.Size(45, 45)
      }
    });
  }
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 44.2302337, lng: 15.8964747},
    zoom: 8
  });

  ko.applyBindings(new ViewModel());
}
