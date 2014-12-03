!function(){
filterInitation =function(){
    var filter = window.defs.append("svg:filter")
        .attr("id", "outerDropShadow")
        .attr("x", "-20%")
        .attr("y", "-20%")
        .attr("width", "140%")
        .attr("height", "140%");

    filter.append("svg:feOffset")
        .attr("result", "offOut")
        .attr("in", "SourceGraphic")
        .attr("dx", "1")
        .attr("dy", "1");

    filter.append("svg:feColorMatrix")
        .attr("result", "matrixOut")
        .attr("in", "offOut")
        .attr("type", "matrix")
        .attr("values", "1 0 0 0 0 0 0.1 0 0 0 0 0 0.1 0 0 0 0 0 .5 0");

    filter.append("svg:feGaussianBlur")
        .attr("result", "blurOut")
        .attr("in", "matrixOut")
        .attr("stdDeviation", "3");

    filter.append("svg:feBlend")
        .attr("in", "SourceGraphic")
        .attr("in2", "blurOut")
        .attr("mode", "normal");

}

testJSONProcess= function(){
      var nodes = treemap.nodes(window.root);

        var children = nodes.filter(function(d) {
            return !d.children;
        });
        var parents = nodes.filter(function(d) {
            return d.children;
        });

        // create parent cells
      	var parentCells = window.chart.selectAll("g.cell.parent")
            .data(parents, function(d) {
                return "p-" + d.id;
            });
        var parentEnterTransition = parentCells.enter()
            .append("g")
            .attr("class", "cell parent")
            .on("click", function(d) {
                zoom(d);
            });
        parentEnterTransition.append("rect")
            .attr("width", function(d) {
                return Math.max(0.01, d.dx);
            })
            .attr("height", headerHeight)
            .style("fill", headerColor);
   parentEnterTransition.append('foreignObject')
            .attr("class", "foreignObject")
            .append("xhtml:div");
           
        // update transition    
}
//inside d3.json
JsonProcess= function(){

       var nodes = treemap.nodes(window.root);

        var children = nodes.filter(function(d) {
            return !d.children;
        });
        var parents = nodes.filter(function(d) {
            return d.children;
        });

        // create parent cells
        var parentCells = window.chart.selectAll("g.cell.parent")
            .data(parents, function(d) {
                return "p-" + d.id;
            });
        var parentEnterTransition = parentCells.enter()
            .append("g")
            .attr("class", "cell parent")
            .on("click", function(d) {
                zoom(d);
            });
        parentEnterTransition.append("rect")
            .attr("width", function(d) {
                return Math.max(0.01, d.dx);
            })
            .attr("height", headerHeight)
            .style("fill", headerColor);
        parentEnterTransition.append('foreignObject')
            .attr("class", "foreignObject")
            .append("xhtml:div")
            .attr("class", "labelbody")
            .append("div")
            .attr("class", "label");
			
				// Tooltip
			var tooltip = d3.select("body")
				.append("div")
				.attr("class", "tooltip")
				.style("font", "Arial black;")
				.style("font-size", "11px")
				.style("margin", "8px")
				.style("padding", "5px")
				.style("border", "1px solid #000")
				.style("background-color", "rgba(255,255,255,1)")
				.style("position", "absolute")
				.style("z-index", "1001")
				.style("opacity", "0.8")
				.style("border-radius", "3px")
				.style("box-shadow", "5px 5px 5px #888")
				.style("visibility", "hidden");
				
        // update transition
        var parentUpdateTransition = parentCells.transition().duration(transitionDuration);
        parentUpdateTransition.select(".cell")
            .attr("transform", function(d) {
                return "translate(" + d.dx + "," + d.y + ")";
            });
        parentUpdateTransition.select("rect")
            .attr("width", function(d) {
                return Math.max(0.01, d.dx);
            })
            .attr("height", headerHeight)
            .style("fill", headerColor);
        parentUpdateTransition.select(".foreignObject")
            .attr("width", function(d) {
                return Math.max(0.01, d.dx);
            })
            .attr("height", headerHeight)
            .select(".labelbody .label")
            .text(function(d) {
                return d.name;
            });
        // remove transition
        parentCells.exit()
            .remove();

        // create children cells
        var childrenCells = window.chart.selectAll("g.cell.child")
            .data(children, function(d) {
                return "c-" + d.id;
            });
        // enter transition
        var childEnterTransition = childrenCells.enter()
            .append("g")
            .attr("class", "cell child")
            .on("click", function(d) {
                zoom(window.node === d.parent ? window.root : d.parent);
            })
            .on("mouseover", function(d,i) {
                this.parentNode.appendChild(this); // workaround for bringing elements to the front (ie z-index)
				console.log("d when mouseover",d);
                d3.select(this)
                    .attr("filter", "url(#outerDropShadow)")
                    .select(".background")
                    .style("stroke", "#000000");
					var prefix=d3.formatPrefix(1000);
					var content = "<b>" + d.Category + "</b><hr>"
			+ "Name: " + d.name + "<br>"
			+ "Description: " + d.Description + "<br>"
			+ "Size: " + formatValues(d.size,prefix) + "<br>"; 
		d3.select(".tooltip").style("visibility", "visible")
			.style("top", (d3.event.pageY-35)+"px")
			.style("left", d3.event.pageX+"px")
			.html(content);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("filter", "")
                    .select(".background")
                    .style("stroke", "#FFFFFF");
            });
        childEnterTransition.append("rect")
            .classed("background", true)
            .style("fill", function(d) {
                return color(d.parent.name);
            });
  childEnterTransition.append('foreignObject')
            .attr("class", "foreignObject")
            .attr("width", function(d) {
                return Math.max(0.01, d.dx);
            })
            .attr("height", function(d) {
                return Math.max(0.01, d.dy);
            })
            .append("xhtml:div")
            .attr("class", "labelbody")
            .append("div")
			.append("svg")
			.append("text")
            .attr("class", "label")
			.attr("y",15).each(window.insertLinebreaks);
		

        if (window.isIE) {
            childEnterTransition.selectAll(".foreignObject .labelbody .label")
                .style("display", "none");
        } else {
            childEnterTransition.selectAll(".foreignObject")
                .style("display", "none");
        }

        // update transition
        var childUpdateTransition = childrenCells.transition().duration(transitionDuration);
        childUpdateTransition.select(".cell")
            .attr("transform", function(d) {
                return "translate(" + d.x  + "," + d.y + ")";
            });
        childUpdateTransition.select("rect")
            .attr("width", function(d) {
                return Math.max(0.01, d.dx);
            })
            .attr("height", function(d) {
                return d.dy;
            })
            .style("fill", function(d) {
                return color(d.parent.name);
            });
        childUpdateTransition.select(".foreignObject")
            .attr("width", function(d) {
                return Math.max(0.01, d.dx);
            })
            .attr("height", function(d) {
                return Math.max(0.01, d.dy);
            })
            .select(".labelbody .label")
            .text(function(d) {
                return d.name;
            });
        // exit transition
        childrenCells.exit()
            .remove();

        d3.select("select").on("change", function() {
            console.log("select zoom(window.node)");
            treemap.value(this.value == "size" ? size : count)
                .nodes(window.root);
            zoom(window.node);
        });

        zoom(window.node);



}

formatValues=function(val,prefix) {
return ' '+d3.round(prefix.scale(val),2)+prefix.symbol;
}




//end



  function size(d) {
        return d.size;
    }


    function count(d) {
        return 1;
    }


    //and another one
    function textHeight(d) {
        var ky = chartHeight / d.dy;
        yscale.domain([d.y, d.y + d.dy]);
        return (ky * d.dy) / headerHeight;
    }


    function getRGBComponents (color) {
        var r = color.substring(1, 3);
        var g = color.substring(3, 5);
        var b = color.substring(5, 7);
        return {
            R: parseInt(r, 16),
            G: parseInt(g, 16),
            B: parseInt(b, 16)
        };
    }


    function idealTextColor (bgColor) {
        var nThreshold = 105;
        var components = getRGBComponents(bgColor);
        var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
        return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
    }


    function zoom(d) {
        this.treemap
            .padding([headerHeight/(window.chartHeight/d.dy), 0, 0, 0])
            .nodes(d);

        // moving the next two lines above treemap layout messes up padding of zoom result
        var kx = window.chartWidth  / d.dx;
        var ky = window.chartHeight / d.dy;
        var level = d;

        xscale.domain([d.x, d.x + d.dx]);
        yscale.domain([d.y, d.y + d.dy]);

        if (window.node != level) {
            if (window.isIE) {
                window.chart.selectAll(".cell.child .foreignObject .labelbody .label")
                    .style("display", "none");
            } else {
                window.chart.selectAll(".cell.child .foreignObject")
                    .style("display", "none");
            }
        }

        var zoomTransition = window.chart.selectAll("g.cell").transition().duration(transitionDuration)
            .attr("transform", function(d) {
                return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")";
            })
            .each("end", function(d, i) {
                if (!i && (level !== self.window.root)) {
                    window.chart.selectAll(".cell.child")
                        .filter(function(d) {
                            return d.parent === self.window.node; // only get the children for selected group
                        })
                        .selectAll(".foreignObject .labelbody div svg .label")
                        .style("fill", function(d) {
                            return idealTextColor(color(d.parent.name));
                        }).style({'font-size':'20px','x':'20px'})
						.selectAll("tspan").attr("x",'20').attr("dy",'20');

                    if (window.isIE) {
                        window.chart.selectAll(".cell.child")
                            .filter(function(d) {
                                return d.parent === self.window.node; // only get the children for selected group
                            })
                            .select(".foreignObject .labelbody .label")
                            .style("display", "")
                    } else {
                        window.chart.selectAll(".cell.child")
                            .filter(function(d) {
                                return d.parent === self.window.node; // only get the children for selected group
                            })
                            .select(".foreignObject")
                            .style("display", "")
                    }
                }
            });

        zoomTransition.select(".foreignObject")
            .attr("width", function(d) {
                return Math.max(0.01, kx * d.dx);
            })
            .attr("height", function(d) {
                return d.children ? headerHeight: Math.max(0.01, ky * d.dy);
            })
            .select(".labelbody .label").each(window.insertLinebreaks);

        // update the width/height of the rects
        zoomTransition.select("rect")
            .attr("width", function(d) {
                return Math.max(0.01, kx * d.dx);
            })
            .attr("height", function(d) {
                return d.children ? headerHeight : Math.max(0.01, ky * d.dy);
            })
            .style("fill", function(d) {
                return d.children ? headerColor : color(d.parent.name);
            });

        window.node = d;

        if (d3.event) {
            d3.event.stopPropagation();
        }
    }




}();