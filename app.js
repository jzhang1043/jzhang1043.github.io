async function init() {
    // Read data from csv
    await d3.csv("https://flunky.github.io/cars2017.csv", d3.autoType).then(function(data) {
            
        // var svg = d3.select("svg")
        var svg = d3.select("#my_dataviz").append("svg")
                .attr("width", 1500)
                .attr("height", 620)
                .style('background-color', 'white')
                
        // Set local variables for margin, width, and height
        var margin = 60
        var width = 1500 - 2*margin
        var height = 620 - 2*margin
        
        // set x axis
        var xs = d3.scaleLog().domain([10,150]).range([0, width]); 
        svg.append("g")
            .attr("transform", "translate("+(margin)+","+(height+margin)+")")
            .call(d3.axisBottom(xs).tickValues([10,20,50,100]).tickFormat(d3.format("~s")))
        // set x-label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width/2 + 1.8*margin)
            .attr("y", height + 1.5*margin)
            .text("Average City MPG")

        // set y axis
        var ys = d3.scaleLog().domain([10,150]).range([height, 0]);
        svg.append("g")
            .attr("transform", "translate("+margin+","+(margin)+")")
            .call(d3.axisLeft(ys).tickValues([10,20,50,100]).tickFormat(d3.format("~s")))     
        // set y-label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", margin - 30)
            .attr("x", -height/2 + 30)
            .text("Average Hightway MPG")
        
        var Tooltip = d3.select("#my_dataviz").append("div").attr("class", "tooltip")
            .style("opacity", 0)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        const color = d3.scaleOrdinal().domain(["colorA", "colorB", "colorC" ]).range(d3.schemeSet2)
        
        const mousemove = function(event, d) {
            Tooltip
                .html(`${d.Make}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
            }

        const mouseover = function(event,d){       
            d3.select(this)         
                .style("fill", color(d.Fuel))
                .attr("r", 7)

            Tooltip
                .style("opacity", 1)
        }
        

        const mouseleave = function(event,d){
            d3.select(this)
                .transition()
                .duration(100)
                .style("fill", d => color(d.Fuel))
                .attr("r", 4 )
            
            Tooltip
                .style("opacity", 0)
            
        }            

        // set legend
        var keys = ["Gasoline", "Diesel", "Electricity"]
        svg.selectAll("mydots")
            .data(keys)
            .enter()
            .append("circle")
            .attr("cx", 100)
            .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 6)
            .style("fill", function(d){ return color(d)})
        svg.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
                .attr("x", 120)
                .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function(d){ return color(d)})
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
        
        // set dropdown menu
        var allGroup = ["All", "0", "4", "6", "8", "10", "12"]
        d3.select("#selectButton")
            .selectAll('myOptions')
            .data(allGroup)
            .enter()
            .append('option')
            .text(d => d) // text showed in the menu
            .attr("value", d => d) 

        

        // A function that update the chart
        function update(data, selectedGroup) {
            filteredData = data.filter(function(row) {
                if (selectedGroup == "All"){
                    return row;
                }
                else{
                    return row['EngineCylinders'] == selectedGroup;
                }
            });
            
            var dataFilter = filteredData.map(function(d){return {AverageCityMPG: d.AverageCityMPG, AverageHighwayMPG:d.AverageHighwayMPG, Fuel: d.Fuel, Make: d.Make} })
            
            svg.append("g").attr("transform", "translate("+margin+","+margin+")")
                .selectAll(".dot")
                .data(dataFilter)
                .enter()
                .append("circle")
                .attr("class", function (d) { return "dot " + d.Fuel} )
                    .attr("cx",function(d) {return xs(d.AverageCityMPG);})
                    .attr("cy",function(d) {return ys(d.AverageHighwayMPG);})
                    .attr("r", 4)
                    .style("fill", function (d) { return color(d.Fuel) } )
                    .on("mouseover", mouseover)
                    .on("mousemove", mousemove)
                    .on("mouseleave", mouseleave)
            
        }   

        // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function() {
            // recover the option that has been chosen
            let selectedOption = d3.select(this).property("value")
            d3.select('svg').selectAll(".dot")
                .remove();
            // run the updateChart function with this selected option
            if (selectedOption == 0) {
                d3.select("p")
                .html("For engine cylinder equals 0, all of them are eletrical cars. The Average city MPG and Average Highway MPG are relatively high comparing to other engine cylinders. ")
                .style('color', 'darkRed')
            } else if (selectedOption == 4) {
                d3.select("p")
                .html("For engine cylinder equals 4, most of them are gasoline cars, and a few of them are diesel cars. The Average city and Highway MPG are at the middle comparing to other engine cylinders.")
                .style('color', 'darkRed')
            } else if (selectedOption == 6) {
                d3.select("p")
                .html("For engine cylinder equals 6, it consists of gasoline and diesel cars, and a few of them are diesel cars. The Average city MPG and Average Highway MPG are lower than 0 or 4 engine cylinders.")
                .style('color', 'darkRed')
            } else if (selectedOption == 8) {
                d3.select("p")
                .html("For engine cylinder equals 8, all of them are gasoline cars. The Average city MPG and Average Highway MPG is significantly lower than 0, 4, 6 engine cylinder cars. ")
                .style('color', 'darkRed')
            } else if (selectedOption == 10) {
                d3.select("p")
                .html("For engine cylinder equals 10, all of them are gasoline cars. The Average city MPG and Average Highway MPG are very low. These cars are not recommended in terms of fuel economy. ")
                .style('color', 'darkRed')
            } else if (selectedOption == 12) {
                d3.select("p")
                .html("For engine cylinder equals 12, all of them are gasoline cars. The Average city MPG and Average Highway MPG are the lowest. These cars are not recommended in terms of fuel economy.")
                .style('color', 'darkRed')
            } else {
                d3.select("p")
                .html("Below is an overall scatter plot containing all engine cylinders.")
                .style('color', 'black')
            }
            update(data, selectedOption)
        })

        update(data, 'All')
    })
}

