async function init() {
    const data = await d3.csv("https://flunky.github.io/cars2017.csv", d3.autoType);

    var svg = d3.select("svg")
    var margin = 50
    var width = svg.attr("width") - 2*margin
    var height = svg.attr("height") - 2*margin

    var xs = d3.scaleLog().domain([10,150]).range([0, width]); 
    var ys = d3.scaleLog().domain([10,150]).range([height, 0]);


    svg.append("g").attr("transform", "translate("+margin+","+margin+")")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
            .attr("class", function (d) {return "dot " + d.Fuel;})
            .attr("cx",function(d) {return xs(d.AverageCityMPG);})
            .attr("cy",function(d) {return ys(d.AverageHighwayMPG);})
            .attr("r", function(d) {return 2+d.EngineCylinders;})
            .style("fill", function (d) {return color(d.Fuel);}) 
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight)

    // add y axis
    svg.append("g")
        .attr("transform", "translate("+margin+","+(margin)+")")
        .call(d3.axisLeft(ys).tickValues([10,20,50,100])
                .tickFormat(d3.format("~s")))
    // add x axis
    svg.append("g")
    .attr("transform", "translate("+(margin)+","+(height+margin)+")")
    .call(d3.axisBottom(xs).tickValues([10,20,50,100])
            .tickFormat(d3.format("~s")))
}

var color = d3.scaleOrdinal()
.domain(["setosa", "versicolor", "virginica" ])
.range([ "#440154ff", "#21908dff", "#fde725ff"])

var highlight = function(d){

    Fuel_type = d.Fuel

    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 3)

    d3.selectAll("." + Fuel_type)
      .transition()
      .duration(200)
      .style("fill", color(Fuel_type))
      .attr("r", 7)
}

var doNotHighlight = function(){
    d3.selectAll(".dot")
    .transition()
    .duration(200)
    .style("fill", "lightgrey")
    .attr("r", 5 )
}