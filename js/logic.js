
// Create the base layers
//-----------------------
// Satellite map tiles
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
// Light map tiles
var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

var baseMaps = {
  Light: light,
  Satellite: satellite,
}


// Query the earthquakes and create the markers
//---------------------------------------------

// Function to normalize the marker radius based on the earthquake magnitude
function markerSize(magn){
  return magn*5*10**4;
}

// var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"

var earthquakeMarkers = [];
var blabla = [];

d3.json(queryURL, function(response){  


  response.features.forEach(f =>{
    console.log(f.geometry.coordinates[0])
    console.log(f.geometry.coordinates[1])
    console.log([f.geometry.coordinates[0], f.geometry.coordinates[1]])
    console.log(f.properties.mag)
    console.log(f.properties.place)
    
    console.log(Date(f.properties.time))

    var d = new Date(f.properties.time);
    console.log(d.toDateString())

    console.log(d.getMonth()+"-"+d.getDate()+"-"+d.getFullYear()+", "+d.getHours()+"h"+d.getMinutes()+" (GMT)")

    earthquakeMarkers.push(
      L.circle( [f.geometry.coordinates[1], f.geometry.coordinates[0]], {
        stroke: false,
        fillOpacity: 0.75,
        color: "purple",
        color: "purple",
        radius: markerSize(f.properties.mag),
      }
      )
    );



  //   // L.circle( [f.geometry.coordinates[1], f.geometry.coordinates[0]], {
  //   //   stroke: false,
  //   //   fillOpacity: 0.75,
  //   //   color: "purple",
  //   //   color: "purple",
  //   //   radius: markerSize(f.properties.mag)
  //   // }
  //   // ).addTo(myMap)


  });

  var earthquakeLayer = L.layerGroup(earthquakeMarkers)


  var overlayMaps = {
    "Earthquakes": earthquakeLayer
  }
  
  
  // Creating map object
  var myMap = L.map("map-id", {
    center: [30, 0],
    zoom: 2,
    layers: [light, earthquakeLayer]
  });
  
  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap)


});




