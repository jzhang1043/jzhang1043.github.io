async function init() {
    const data = await d3.csv("https://flunky.github.io/cars2017.csv", d3.autoType);

    var svg = d3.select("svg")
    var margin = 50
    var width = svg.attr("width") - 2*margin
    var height = svg.attr("height") - 2*margin

    var xs = d3.scaleLog().domain([10,150]).range([0, width]); 
    var ys = d3.scaleLog().domain([10,150]).range([height, 0]);

    svg.append("g").attr("transform", "translate("+margin+","+margin+")")
        .selectAll()
        .data(data)
        .enter()
        .append("circle")
            .attr("cx",function(d) {return xs(d.AverageCityMPG);})
            .attr("cy",function(d) {return ys(d.AverageHighwayMPG);})
            .attr("r", function(d) {return 2+d.EngineCylinders;})     
    svg.append("g")
        .attr("transform", "translate("+margin+","+(margin)+")")
        .call(d3.axisLeft(ys).tickValues([10,20,50,100])
                .tickFormat(d3.format("~s")))
        svg.append("g")
        .attr("transform", "translate("+(margin)+","+(height+margin)+")")
        .call(d3.axisBottom(xs).tickValues([10,20,50,100])
                .tickFormat(d3.format("~s")))
}