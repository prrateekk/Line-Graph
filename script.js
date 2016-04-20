var min_val = 1000000,
    max_val = 0;
var min_date, max_date;
var data = [];
var vilg = 'V1';

var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatDate = d3.time.format("%d-%b-%y");
var bisectDate = d3.bisector(function(d) {
    return d.date;
}).left;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var focus = svg.append("g")
    .style("display", "none");

d3.json('data.json', function(info) {
    data = [];

    function type(d) {
        d.date = formatDate.parse(d.date);
        d.val = +d.val;
        return d;
    }

    var flag = 0;
    var m = formatDate.parse(document.getElementById('stdate').value);
    var m1 = formatDate.parse(document.getElementById('endate').value);
    min_date = max_date = m;
    for (var i = 0; i < info.length; i++) {
        if (info[i].village == vilg) {
            for (var j = 0; j < info[i].data.length; j++) {
            	flag = 1;
                var x = type(info[i].data[j]);
                if (x.date > m && x.date<m1) {
                    data.push(x);
                    if (x.val < min_val) min_val = x.val;
                    if (x.val > max_val) max_val = x.val;
                    if (x.date < min_date) min_date = x.date;
                    if (x.date > max_date) max_date = x.date;
                }
            }
        }
    }
    if (flag==0){
	    window.alert('Entry not Present!\nPresent Entries - V1,V2...V19');
    }
    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    function xscale(d) {
        return ((d - min_date) / (max_date - min_date)) * width;
    }

    function yscale(d) {
        return (1 - ((d - min_val) / (max_val - min_val))) * height;
    }

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .innerTickSize(-height)
        .outerTickSize(0)
        .tickPadding(10);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding(10);


    var startline = d3.svg.line()
        .x(function(d) {
            return xscale(d.date);
        })
        .y(function(d) {
            return yscale(min_val);
        });

    var endline = d3.svg.line()
        .x(function(d) {
            return xscale(d.date);
        })
        .y(function(d) {
            return yscale(d.val);
        });


    x.domain([min_date, max_date]);
    y.domain([min_val, max_val]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Data");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", startline(data))
        .transition()
        .duration(1000)
        .attr("d", endline(data));
    // append the x line
    focus.append("line")
        .attr("class", "x")
        .style("stroke", "#3d3d29")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("y1", 0)
        .attr("y2", height);
    // append the y line
    focus.append("line")
        .attr("class", "y")
        .style("stroke", "#3d3d29")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("x1", width)
        .attr("x2", width);
    // append the circle at the intersection
    focus.append("circle")
        .attr("class", "y")
        .style("fill", "none")
        .style("stroke", "#3d3d29")
        .attr("r", 4);
    // place the value at the intersection
    focus.append("text")
        .attr("class", "y1")
        .style("stroke", "none")
        .style("stroke-width", "0.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "-.3em");
    focus.append("text")
        .attr("class", "y2")
        .attr("dx", 8)
        .attr("dy", "-.3em");
    // place the date at the intersection
    focus.append("text")
        .attr("class", "y3")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "1em");

    focus.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em");

    // append the rectangle to capture mouse
    svg.append("rect")
        .attr("class", "rc")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() {
            focus.style("display", null);
        })
        .on("mouseout", function() {
            focus.style("display", "none");
        })
        .on("mousemove", mousemove);

    function mousemove() {

        var xd = d3.scale.linear()
            .domain([0, width])
            .range([min_date, max_date]);

        var x0 = xd(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        //console.log(x0);
        //console.log(x(data[i].date));
        //console.log(yscale(data[i]));
        focus.select("circle.y")
            .attr("transform",
                "translate(" + xscale(d.date) + "," +
                yscale(d.val) + ")");
        focus.select("text.y1")
            .attr("transform",
                "translate(" + xscale(d) + "," +
                yscale(d.val) + ")")
            .text(d.val);
        focus.select("text.y2")
            .attr("transform",
                "translate(" + xscale(d.date) + "," +
                yscale(d.val) + ")")
            .text(d.val);
        focus.select("text.y3")
            .attr("transform",
                "translate(" + xscale(d.date) + "," +
                yscale(d.val) + ")")
            .text(formatDate(d.date));
        focus.select("text.y4")
            .attr("transform",
                "translate(" + xscale(d.date) + "," +
                yscale(d.val) + ")")
            .text(formatDate(d.date));
        focus.select(".x")
            .attr("transform",
                "translate(" + xscale(d.date) + "," +
                yscale(d.val) + ")")
            .attr("y2", height - y(d.val));
        focus.select(".y")
            .attr("transform",
                "translate(" + width * -1 + "," +
                yscale(d.val) + ")")
            .attr("x2", width + width);
    }

});

function update() {
    data = [];
    vilg = document.getElementById('vil').value
    d3.json('data.json', function(info) {

        function type(d) {
            d.date = formatDate.parse(d.date);
            d.val = +d.val;
            return d;
        }

    	var m = formatDate.parse(document.getElementById('stdate').value);
    	var m1 = formatDate.parse(document.getElementById('endate').value);
        min_val = 1000000;
        max_val = 0;
        min_date = max_date = m;
        var flag = 0;
        for (var i = 0; i < info.length; i++) {
            if (info[i].village == vilg) {
                for (var j = 0; j < info[i].data.length; j++) {
                	flag = 1;
                    var x = type(info[i].data[j]);
                    if (x.date > m && x.date<m1) {
                        data.push(x);
                        if (x.val < min_val) min_val = x.val;
                        if (x.val > max_val) max_val = x.val;
                        if (x.date < min_date) min_date = x.date;
                        if (x.date > max_date) max_date = x.date;
                    }
                }
            }
        }
	    if (flag==0){
	    	window.alert('Entry not Present!\nPresent Entries - V1,V2...V19');
	    }

        function xscale(d) {
            return ((d - min_date) / (max_date - min_date)) * width;
        }

        function yscale(d) {
            return (1 - ((d - min_val) / (max_val - min_val))) * height;
        }

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .innerTickSize(-height)
            .outerTickSize(0)
            .tickPadding(10);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .innerTickSize(-width)
            .outerTickSize(0)
            .tickPadding(10);

        var startline = d3.svg.line()
            .x(function(d) {
                return xscale(d.date);
            })
            .y(function(d) {
                return yscale(min_val);
            });

        var endline = d3.svg.line()
            .x(function(d) {
                return xscale(d.date);
            })
            .y(function(d) {
                return yscale(d.val);
            });


        x.domain([min_date, max_date]);
        y.domain([min_val, max_val]);

        // Select the section we want to apply our changes to
        var svg = d3.select("body").transition();

        // Make the changes
        svg.select(".line") // change the line
            .duration(750)
            .attr("d", endline(data))
            .transition();
        svg.select(".x.axis") // change the x axis
            .duration(750)
            .call(xAxis);
        svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);

    });

}