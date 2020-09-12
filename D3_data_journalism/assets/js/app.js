
  var svgWidth = 960;
  var svgHeight = 600;

  var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`); 

// Import data from an external CSV file
  d3.csv("assets/data/data.csv").then(function(healthData) {
    // console.log(healthData) 
    // Step 1: Parse Data/Cast as numbers
        healthData.forEach(function(data) {
            data.state = +data.state
            data.abbr = data.abbr
            data.poverty = +data.poverty
            data.healthcare = +data.healthcare;
    
        // console.log("State:", data.state);
        console.log("State Abbr:", data.abbr);
        // console.log("Poverty:", data.poverty);
        // console.log("Healthcare:", data.healthcare);
    });    


 // Create scaling functions
    var xLinearScale = d3.scaleLinear()
        .domain([8,d3.max(healthData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)])
        .range([height, 0]);

// Create axis functions
    var BottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

// Add x-axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(BottomAxis);

 // Add y1-axis to the left side of the display
    chartGroup.append("g")   
        .call(leftAxis);

  // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "17")
    .attr("class", "stateCircle");
    
    chartGroup.append("g").selectAll("text")
        .data(healthData)
        .enter()
        .append("text")
        .text(function(d){return d.abbr})
        .attr("class", "stateText")
        .attr("x", (d) => xLinearScale(d.poverty))
        .attr("y", (d) => yLinearScale(d.healthcare))
              
//  Initialize tool tip
var toolTip = d3.tip()
  .attr("class", "d3-tip")
  .offset([0, 0])
  .html(function(d) {
    return (`${d.abbr}<br>% in poverty: ${d.poverty}<br>% Lacking Healthcare: ${d.healthcare}`);

  });
// Create tooltip in the chart
    svg.call(toolTip);

// Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d,this);
    })
      // onmouseout event
    .on("mouseout", function(d) {
      toolTip.hide(d);
    })
    // circlesGroup.on("mouseover", toolTip.show)
    // .on("mouseout", toolTip.hide);

    // return circlesGroup;
  // });

   // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lack of Healthcare (%)");  

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("axis-text", true)
    .text("In Poverty (%)");
  }).catch(function(error) {
  console.log(error);


});
