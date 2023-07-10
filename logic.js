Papa.parse('state_data_merged_years.csv', {
    download: true,
    header: true,
    complete: function(results) {
      var data = results.data;
      // Access the data and continue with the next steps
    }
  });

  var stateData = {};

// Iterate over the parsed CSV data and populate the stateData object
data.forEach(function(row) {
  var stateName = row.State;
  var boundary = []; // Specify the boundary coordinates for each state

  // Add the boundary coordinates to the 'boundary' array for the state

  var births = parseInt(row.Number_of_Births); // Parse the tally of births as an integer

  // Store the data for the state
  stateData[stateName] = {
    boundary: boundary,
    births: births
  };
});

var stateLayerGroup = L.layerGroup().addTo(map);

for (var stateName in stateData) {
    var state = stateData[stateName];
  
    var birthIntensity = state.births / maximumBirths; // Calculate the intensity based on the maximum tally of births
  
    L.polygon(state.boundary, {
      fillColor: 'rgba(0, 0, 255, ' + birthIntensity + ')', // Blue color with intensity based on births
      fillOpacity: 0.6,
      color: 'black',
      weight: 1
    }).addTo(stateLayerGroup);
  }

