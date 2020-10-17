function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    console.log("firstSample")
    console.log(firstSample)
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });

}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    console.log("in_build_Metadata")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples_array = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filtered_samples = samples_array.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var first_sample = filtered_samples[0];

    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var wash_frequency = result.wfreq;
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = first_sample.otu_ids
    var otu_labels = first_sample.otu_labels
    var sample_values = first_sample.sample_values

    /*console.log("samples_array")
    console.log(samples_array)
    console.log("filtered_samples")
    console.log(filtered_samples)
    console.log("first_sample")
    console.log(first_sample)*/


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    console.log("hello hello hello")
    var yticks = otu_ids.map(function(id){
      return "OTU ".concat(id);
    });
    console.log(yticks.slice(0,10))

    // 8. Create the trace for the bar chart.
    var trace = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks.slice(0,10).reverse(),//["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      type: "bar",
      orientation: "h"
     }; 
    var barData = [trace];
      
  
    // 9. Create the layout for the bar chart. 
    var layout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      type: "indicator",
      height: 450,
      width: 450

     };
     var config = {responsive: true}
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, layout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      hovertemplate: '(%{x}, %{y})<br>'+'%{text}<extra> </extra>',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: 'Earth'
      }
    };
    var data = [bubbleData];
    

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: '<b>Bacteria Cultures per Sample</b>',
      type: "indicator",
      hovermode: "closest",
      xaxis: {
        title: {
          text: '<b>OTU ID</b>',
        },
      },
      showlegend: false,
      height: 450,
      width: 1150
    };
    var config = {responsive: true}

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', data, bubbleLayout);
    
    
    // Gauge Begins

    var gauge_data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wash_frequency,
        title: { text: '<b>Belly Button Washing Frequency</b> <br>'+"Scrubs per week" },
        type: "indicator",
        mode: "gauge+number",
        //delta: { reference: 380 },
        gauge: {
          axis: { range: [null, 10] },
          bar: {color: "black"},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ]
          
        }
      }
    ];
    
    var gauge_layout = { width: 450, height: 450};// margin: { t: 0, b: 0 } };
    
    Plotly.newPlot('gauge', gauge_data, gauge_layout);

    
  });
}

        

// python -m http.server 8000 --bind 127.0.0.2


