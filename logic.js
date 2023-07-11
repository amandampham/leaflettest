d3.json('us-states.json')
  .then(data => {
    var states = data;

    var map = new L.Map('map');
    map.setView(new L.LatLng(39.5, -98.35), 3); // Adjust the center and zoom level to include Alaska

    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    var geojsonMarkerOptions = {
      radius: 4,
      fillColor: "rgba(255,100,100,0.1)",
      color: "rgba(255,100,100,0.7)",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    //START COPY
    // Create the GeoJSON layer for eighth grade or less
    var eighth_grade_or_less = new L.GeoJSON(null, {
      pointToLayer: function (latlng) {
        return new L.CircleMarker(latlng, geojsonMarkerOptions);
      },
      onEachFeature: function (feature, layer) {
        var state = feature.properties.NAME;
        console.log('State:', state);
        
        d3.csv('state_data_merged_years.csv').then(function(data) {
          var educationData = data.find(function(d) {
            return d.State === state && d.Education_Level_of_Mother === "8th grade or less";
          });
         
          if (educationData) {
            var birthsByEducationLevel = +educationData.Number_of_Births;
            var colorScale = d3.scaleLinear()
              .domain([0, birthsByEducationLevel])
              .range(['blue', 'red']); // Specify the desired color range

            layer.setStyle({
              fillColor: colorScale(birthsByEducationLevel),
              fillOpacity: 0.6,
              color: 'black',
              weight: 1
            });
            layer.bindPopup(feature.properties.NAME + "<br>Number of Births: " + birthsByEducationLevel);
          }
        });
      }
    });

    // Iterate through states array and add each state's geojson data to the geojsonLayer
    states.features.forEach(function(state) {
        eighth_grade_or_less.addData(state); //CHANGE VARIABLE NAME FOR GRADE
    });
//END COPY PER EDUCATION



    // Create the GeoJSON layer for ninth grade with no diploma
    var ninth_no_diploma = new L.GeoJSON(null, {
        pointToLayer: function (latlng) {
          return new L.CircleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: function (feature, layer) {
          var state = feature.properties.NAME;
          console.log('State:', state);
          
          d3.csv('state_data_merged_years.csv').then(function(data) {
            var educationData = data.find(function(d) {
              return d.State === state && d.Education_Level_Code === "2";
            });
           
            if (educationData) {
              var birthsByEducationLevel = +educationData.Number_of_Births;
              var colorScale = d3.scaleLinear()
                .domain([0, birthsByEducationLevel])
                .range(['blue', 'red']); // Specify the desired color range
  
              layer.setStyle({
                fillColor: colorScale(birthsByEducationLevel),
                fillOpacity: 0.6,
                color: 'black',
                weight: 1
              });
              layer.bindPopup(feature.properties.NAME + "<br>Number of Births: " + birthsByEducationLevel);
            }
          });
        }
      });

      // Iterate through states array and add each state's geojson data to the geojsonLayer
      states.features.forEach(function(state) {
        ninth_no_diploma.addData(state); //CHANGE VARIABLE NAME FOR GRADE
      });

       //START COPY
    // Create the GeoJSON layer for associates or less
    var associates = new L.GeoJSON(null, {
        pointToLayer: function (latlng) {
          return new L.CircleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: function (feature, layer) {
          var state = feature.properties.NAME;
          console.log('State:', state);
          
          d3.csv('state_data_merged_years.csv').then(function(data) {
            var educationData = data.find(function(d) {
              return d.State === state && d.Education_Level_Code === 5;
            });
           
            if (educationData) {
              var birthsByEducationLevel = +educationData.Number_of_Births;
              var colorScale = d3.scaleLinear()
                .domain([0, birthsByEducationLevel])
                .range(['blue', 'red']); // Specify the desired color range
  
              layer.setStyle({
                fillColor: colorScale(birthsByEducationLevel),
                fillOpacity: 0.6,
                color: 'black',
                weight: 1
              });
              layer.bindPopup(feature.properties.NAME + "<br>Number of Births: " + birthsByEducationLevel);
            }
          });
        }
      });
  
      // Iterate through states array and add each state's geojson data to the geojsonLayer
      states.features.forEach(function(state) {
          associates.addData(state); //CHANGE VARIABLE NAME FOR GRADE
      });
  //END COPY PER EDUCATION


    // Legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');
      var grades = [0, 100000, 500000, 1000000, 2500000, 10000000];
      var labels = [];

      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
    };

    legend.addTo(map);
    
    // Function to get color based on value
    function getColor(d) {
      return d > 10000000 ? '#ec1515' :
             d > 2500000 ? '#d56016' :
             d > 1000000 ? '#d5a216' :
             d > 500000 ? '#ccd516' :
             d > 100000 ? '#cfd642' :
             '#d0d570';
    }

    // Create a layer group to hold both GeoJSON layers
    //For any new layer, add here
    var layerGroup = L.layerGroup([eighth_grade_or_less, ninth_no_diploma, associates]);

    // Add the layer group to the toggle control
    //AND ADD NEW LAYER HERE
    var overlayMaps = {
      "8th Grade or Less": eighth_grade_or_less,
      "9th through 12th with no diploma": ninth_no_diploma,
      "Associate's": associates
    };
    L.control.layers(null, overlayMaps, { title: 'Education Level of Mother', collapsed: false }).addTo(map);

    // Add the layer group to the map
    layerGroup.addTo(map);
  })
  .catch(error => {
    console.log('Error:', error);
  });
