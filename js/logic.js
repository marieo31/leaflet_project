
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

function colorScale(magn){
  // I didn't find any easy, existing way to use colormaps!!?????
  // so I ended up creating 5 colors only
  if (magn>6){
    var c = "#FF3333";
  } else if(magn>5){
    var c = "#FF6633";
  } else if (magn>4){
    var c = "#FF9933";
  } else if (magn>3){
    var c = "#FFCC33";
  } else {
    var c = "#FFFF33";
  }
  return c
}


var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"
// var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"

var earthquakeMarkers = [];

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
    var earthquakeDate = d.getMonth()+"-"+d.getDate()+"-"+d.getFullYear()+", "+d.getHours()+"h"+d.getMinutes()+" (GMT)";

    console.log(d.getMonth()+"-"+d.getDate()+"-"+d.getFullYear()+", "+d.getHours()+"h"+d.getMinutes()+" (GMT)")

    console.log(colorScale(f.properties.mag))
    earthquakeMarkers.push(
      L.circle( [f.geometry.coordinates[1], f.geometry.coordinates[0]], {
        stroke: true,
        weight: 1,
        fillOpacity: 0.75,
        color: "gray",
        fillColor: colorScale(+f.properties.mag), // "#FFFF33",
        radius: markerSize(+f.properties.mag),
      }
      ).bindPopup("<p>"+f.properties.place+"</p><hr><p>"+earthquakeDate+"</p>")
    );

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