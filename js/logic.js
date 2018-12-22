
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
  // return magn*5*10**4;
  return magn*5;
}

// Function to define the color of the circles
function colorScale(d) {
  return d > 6 ? '#FF3333' :
         d > 5  ? '#FF6633' :
         d > 4  ? '#FF9933' :
         d > 3  ? '#FFCC33' :
         d > 2   ? '#FFFF33' :
         d > 1   ? '#ffff00' :
                    '#bfff00';
}


var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"
// var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"


var earthquakeMarkers = [];
var plateMarkers = [];
var legendGroup = [];

d3.json(queryURL, function(error, response){  
  if (error) throw error;

  response.features.forEach(f =>{

    // Create a date string for the popup
    var d = new Date(f.properties.time);
    var earthquakeDate = d.getMonth()+"-"+d.getDate()+"-"+d.getFullYear()+", "+d.getHours()+"h"+d.getMinutes()+" (GMT)";

    // define each earthquake marker
    earthquakeMarkers.push(
      L.circleMarker( [f.geometry.coordinates[1], f.geometry.coordinates[0]], {
        stroke: true,
        weight: 1,
        fillOpacity: 0.75,
        color: "gray",
        fillColor: colorScale(+f.properties.mag), // "#FFFF33",
        radius: markerSize(+f.properties.mag),
      }
      ).bindPopup("<p>"+f.properties.place+"</p>\
                  <p>"+earthquakeDate+"</p>\
                  <p>Magn. "+f.properties.mag+"</p>")
    );

  });

  var earthquakeLayer = L.layerGroup(earthquakeMarkers)



  // Query the second url to get the plates infos
  //--------------------------------------------
  urlPlates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"
  d3.json(urlPlates, function(error, response){  
    if (error) throw error;

    // looping on the different plates to build the geoJson objects
    response.features.forEach(p =>{
      plateMarkers.push(
        L.geoJson(response, {
          style:{
            color:"blue",
            weigth:1,
            fill: false,
          }
        })
      )
    });

    var plateLayer = L.layerGroup(plateMarkers)

    // Create the legend
    //------------------
    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5, 6],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colorScale(grades[i] + 0.5) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    

  // Building the layers and maps
  //-----------------------------
    var overlayMaps = {
      "Tectonic plates": plateLayer,
      "Earthquakes": earthquakeLayer,      
    }
    
    // Creating map object
    var myMap = L.map("map-id", {
      center: [30, -80],
      zoom: 3,
      layers: [light, plateLayer, earthquakeLayer]
    });
      
    // Create a layer control
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap)

    // Add the legend
    legend.addTo(myMap);

  });
});
