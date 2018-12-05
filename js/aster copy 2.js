

 var dataset;
 var strUser = "DEU";

 d3.json('../data/top10.json', function(data) {
    dataset = data.filter(function(d) { return d.country == "DEU" });

     console.log(dataset);
     d3.select('#AsterChart')
         .datum(dataset) // bind data to the div
         .call(donutChart()); // draw chart in div

//donutChart()
 });




 function donutChart() {
     var width = 500,
         height = 300,
         margin = { top: 10, right: 10, bottom: 10, left: 10 },
         colour = d3.scaleOrdinal(d3.schemeCategory20c), // colour scheme
        // compare data by
         padAngle = 0.04, // effectively dictates the gap between slices
         
         cornerRadius =1; // sets how rounded the corners are on each slice
 
     function chart(selection) {

      
         


         selection.each(function(data) {
             // generate chart

             // ===========================================================================================
             // Set up constructors for making donut. See https://github.com/d3/d3-shape/blob/master/README.md
             var radius = Math.min(width, height) / 2;

             // creates a new pie generator
             var pie = d3.pie()
                 .value(function(d) { return d.Total; })
                 .sort(null);


             // contructs and arc generator. This will be used for the donut. The difference between outer and inner
             // radius will dictate the thickness of the donut
             var arc = d3.arc()
                 .outerRadius(radius * 0.8)
                 .innerRadius(radius * 0.6)
                 .cornerRadius(cornerRadius)
                 .padAngle(padAngle);

             // ===========================================================================================

             // ===========================================================================================
             // append the svg object to the selection
             var svg = selection.append('svg')
                 .attr('width', width + margin.left + margin.right)
                 .attr('height', height + margin.top + margin.bottom)
                 .append('g')
                 .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
             // ===========================================================================================

             // ===========================================================================================
             // g elements to keep elements within svg modular
             svg.append('g').attr('class', 'slices');
             svg.append('g').attr('class', 'labelName');
             svg.append('g').attr('class', 'lines');
             // ===========================================================================================

             // ===========================================================================================
             // add and colour the donut slices
             var path = svg.select('.slices')
                 .datum(data).selectAll('path')
                 .data(pie)
                 .enter().append('path')
                 .attr('fill', function(d) { return colour(d.Pos); })
                 .attr('d', arc);
             // ===========================================================================================

             // ===========================================================================================


             // ===========================================================================================
             // add tooltip to mouse events on slices and labels
             d3.selectAll('.labelName text, .slices path').call(toolTip);
             // ===========================================================================================

             // ===========================================================================================
             // Functions

             // calculates the angle for the middle of a slice
             function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

             // function that creates and adds the tool tip to a selected element
             function toolTip(selection) {

                 // add tooltip (svg circle element) when mouse enters label or slice
                 selection.on('mouseenter', function(data) {

                     svg.append('text')
                         .attr('class', 'toolCircle')
                         .attr('dy', 0) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                         .html(toolTipHTML(data)) // add text to the circle.
                         .style('font-size', '1em')
                         .style('text-anchor', 'middle'); // centres text in tooltip

                     svg.append('circle')
                         .attr('class', 'toolCircle')
                         .attr('r', radius * 0.55) // radius of tooltip circle
                         .style('fill', colour(data.data['Pos'])) // colour based on category mouse is over
                         .style('fill-opacity', 0.35);

                 });

                 // remove the tooltip when mouse leaves the slice/label
                 selection.on('mouseout', function() {
                     d3.selectAll('.toolCircle').remove();
                 });
             }

             // function to create the HTML string for the tool tip. Loops through each key in data object
             // and returns the html sring key: value
             function toolTipHTML(data) {

                 var tip = '',
                     i = 0;

                 for (var key in data.data) {

                     // if value is a number, format it as a percentage
                     // var value = (!isNaN(parseFloat(data.data[key]))) ? percentFormat(data.data[key]) : data.data[key];

                     var value


                     if (key == "Pos" || key == "artist" || key == "title") {
                         value = data.data[key];
                          if (i === 0) tip += '<tspan x="0">'  + value + '</tspan>';
                         else tip += '<tspan x="0" dy="1.2em">' + value + '</tspan>';

                     }

                    
                         i++;


                     // leave off 'dy' attr for first tspan so the 'dy' attr on text element works. The 'dy' attr on
                     // tspan effectively imitates a line break.

                 }

                 return tip;
             }
             // ===========================================================================================

         });
     }

     return chart;
 }