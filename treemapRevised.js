function treeMapChart() {
	// configurable chart options
		
		var height = 700,
		width=700,	
		color=d3.scale.category20(),
		headerHeight=20,
		headerColor="#555555",
		transitionDuration= 500,
		labelHeight=100,
		labelWidth=200,
		prefix=d3.formatPrefix(1000);
		var formatValue={'Size':function(val) {return ' '+d3.round(prefix('Size').scale(val),2)+prefix('Size').symbol;}};
		var root={},
		treemap={},
		viewId="preview",
		insertLineBreakContent = function (d,formatValue,target) {
			var el = d3.select(target);
			var words = [];
			console.log("before insertLineBreakContent",d);
		  words.push(d.name);
		  if (typeof d.Description !='undefined') {
		  words.push(d.Description);
		  }
		   var contentSize=_.size(d.ContentInfo);
		   console.log("before contentSize",contentSize);
			if(contentSize > 0){_.each(d.ContentInfo,function(m,n) {
		  var j=n+1;
		  words.push(m.columnName+": "+formatValue[m.id](d['content#'+j]));
		  });}
		  console.log("before words",words);
			el.text('');
			
			for (var i = 0; i < words.length; i++) {
				var tspan = el.append('tspan').text(words[i]);
				if (i > 0)
					tspan.attr('x', 0).attr('dy', '15');
			}
		},
		insertToolTipContent=function(d,formatValue) {
			var header = "<b>"+d.name+"</b><hr>Description: "+d.Description+"<br>";
			   var contentSize=_.size(d.ContentInfo);
			   var contentList=[];
				if(contentSize > 0){_.each(d.ContentInfo,function(m,n) {
			  var j=n+1;
			  contentList.push(m.id+": "+ formatValue[m.id](d['content#'+j]));
			  
			  			  });}
			  var contentHTML = header+'<br>'+ contentList.join('</br><br>') +'</br';
			return contentHTML;
			};
		

	// derived chart options
	// Chart dimensions.
	
	
	// Various scales. These domains make assumptions of data, naturally.
	var xscale= d3.scale.linear().range([0,width]),
		yscale=d3.scale.linear().range([0,height]);
		
		
	// Add color brewer palette. (optional)

	function chart(selection) {
	
		// normally there is only one selection for a chart canvas
		// all data (as array) is passed to the chart to render streams
		selection.each(function(data) {
			console.info("init data:");
			console.info(data);			
					
			// Create the SVG container
			svg = d3.select("#"+viewId).append("svg")
				.attr("width", width)
				.attr("height", height);
			 treeChart = svg.append("svg:g");
			 defs = svg.append("defs");
			debugFn();
		filterInitation(defs);
		console.log("before root",JSON.stringify(root));
		JsonProcess(treemap,treeChart,root,height,width,headerHeight,headerColor,color,insertLineBreakContent,xscale,yscale,formatValue,transitionDuration,viewId,insertToolTipContent);
	
			});
			
	
}
	chart.height = function(value) {
		if (!arguments.length) return height;
		height = value;
		return chart;
	};
	
	chart.width = function(value) {
		if (!arguments.length) return width;
		width = value;
		return chart;
	};
	chart.labelWidth = function(value) {
		if (!arguments.length) return labelWidth;
		labelWidth = value;
		return chart;
	};
	chart.labelHeight = function(value) {
		if (!arguments.length) return labelHeight;
		labelHeight = value;
		return chart;
	};
	chart.color = function(value) {
	if (!arguments.length) return color;	
	color=value;
	return chart;
	};
	chart.headerHeight = function(value) {
	if (!arguments.length) return headerHeight;	
	headerHeight=value;
	return chart;
	};
	chart.headerColor = function(value) {
	if (!arguments.length) return headerColor;	
	headerColor=value;
	return chart;
	};
	chart.transitionDuration = function(value) {
	if (!arguments.length) return transitionDuration;	
	transitionDuration==value;
	return chart;
	};
	chart.insertLineBreakContent = function(value) {
	if (!arguments.length) return insertLineBreakContent;	
	insertLineBreakContent=value;
	return chart;
	};
		chart.prefix = function(value) {
	if (!arguments.length) return prefix;	
	prefix=value;
	return chart;
	};
	chart.formatValue= function(value) {
	if (!arguments.length) return formatValue;	
	formatValue=value;
	return chart;
	};
	chart.treemap= function(value) {
	if (!arguments.length) return treemap;	
	treemap=value;
	return chart;
	};
	chart.xscale= function(value) {
	if (!arguments.length) return xscale;	
	xscale=value;
	return chart;
	};
	chart.yscale= function(value) {
	if (!arguments.length) return yscale;	
	yscale=value;
	return chart;
	};
	chart.root= function(value) {
	if (!arguments.length) return root;	
	root=value;
	return chart;
	};
	chart.viewId= function(value) {
	if (!arguments.length) return viewId;	
	viewId=value;
	return chart;
	};
	chart.insertToolTipContent= function(value) {
	if (!arguments.length) return insertToolTipContent;	
	insertToolTipContent=value;
	return chart;
	};
	return chart;
	
	// temp varibale to store svg element color on mouse over
	var tempColor;
	
	


//--------------------------------------------------------------------------------------------
// Helper functions
//--------------------------------------------------------------------------------------------
	function mouseover(d, i,insertToolTipContent,target) {
	 /*this.parentNode.appendChild(this); // workaround for bringing elements to the front (ie z-index)
				    d3.select(this)
                    .attr("filter", "url(#outerDropShadow)")
                    .select(".background")
                    .style("stroke", "#000000");
					*/
					target.parentNode.appendChild(target); // workaround for bringing elements to the front (ie z-index)
				    d3.select(target)
                    .attr("filter", "url(#outerDropShadow)")
                    .select(".background")
                    .style("stroke", "#000000");
					var prefix=d3.formatPrefix(1000);
				/*	var content = "<b>" + d.Category + "</b><hr>"
			+ "Name: " + d.name + "<br>"
			+ "Description: " + d.Description + "<br>"
			+ "Size: " + formatValue(d.size,prefix) + "<br>"; */
			
			var contentHTML=insertToolTipContent(d,formatValue);
			d3.select(".tooltip_"+viewId).style("visibility", "visible")
			.style("top", (d3.event.pageY-35)+"px")
			.style("left", d3.event.pageX+"px")
			.html(contentHTML);
	}
	
	function mouseout() { // not used
	  d3.select(this)
                    .attr("filter", "")
                    .select(".background")
                    .style("stroke", "#FFFFFF");
			d3.select(".tooltip").style("visibility", "hidden");
	}
	//-end of treeMapChart
	    function zoom(d,treeChart,root,height,width,headerHeight,headerColor,color,insertLinebreaks,xscale,yscale,formatValue,transitionDuration,viewId) {
        this.treemap
            .padding([headerHeight/(height/d.dy), 0, 0, 0])
            .nodes(d);

        // moving the next two lines above treemap layout messes up padding of zoom result
        var kx = width  / d.dx;
        var ky = height / d.dy;
        var level = d;
        xscale.domain([d.x, d.x + d.dx]);
        yscale.domain([d.y, d.y + d.dy]);

        if (window['treemap_'+viewId].node != level) {
            if (window.isIE) {
                treeChart.selectAll(".cell.child .foreignObject .labelbody .label")
                    .style("display", "none");
            } else {
                treeChart.selectAll(".cell.child .foreignObject")
                    .style("display", "none");
            }
        }

        var zoomTransition = treeChart.selectAll("g.cell").transition().duration(transitionDuration)
            .attr("transform", function(d) {
                return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")";
            })
            .each("end", function(d, i) {
                if (!i && (level !== root)) {
                    treeChart.selectAll(".cell.child")
                        .filter(function(d) {
                            return _.isEqual(d.parent,window['treemap_'+viewId].node); // only get the children for selected group
                        })
                        .selectAll(".foreignObject .labelbody div svg .label")
                        .style("fill", function(d) {
						console.log("before d.parent.name",d.parent);
                            return idealTextColor(color(d.ColorBasis));
                        }).style({'font-size':'20px','x':'20px'})
						.selectAll("tspan").attr("x",'20').attr("dy",'20');

                    if (window.isIE) {
                        treeChart.selectAll(".cell.child")
                            .filter(function(d) {
                                return _.isEqual(d.parent,window['treemap_'+viewId].node); // only get the children for selected group
                            })
                            .select(".foreignObject .labelbody .label")
                            .style("display", "")
                    } else {
                        treeChart.selectAll(".cell.child")
                            .filter(function(d) {
							console.log("nodeR",window['treemap_'+viewId].node," dparent",d.parent);
							    return _.isEqual(d.parent,window['treemap_'+viewId].node); // only get the children for selected group
                            })
							
                            .select(".foreignObject")
                            .style("display", "")
                   }
				    console.log("before end in each");
                }
            });

        zoomTransition.select(".foreignObject")
            .attr("width", function(d) {
                return Math.max(0.01, kx * d.dx);
            })
            .attr("height", function(d) {
                return d.children ? headerHeight: Math.max(0.01, ky * d.dy);
            })
            .select(".labelbody .label").each(function(d){ var target=this;insertLineBreakContent(d,formatValue,target);});

        // update the width/height of the rects
        zoomTransition.select("rect")
            .attr("width", function(d) {
                return Math.max(0.01, kx * d.dx);
            })
            .attr("height", function(d) {
                return d.children ? headerHeight : Math.max(0.01, ky * d.dy);
            })
            .style("fill", function(d) {
                return d.children ? headerColor : color(d.ColorBasis);
            });
console.log("node declaration,d",d);
        window['treemap_'+viewId].node = _.clone(d);

        if (d3.event) {
            d3.event.stopPropagation();
        }
    }
function debugFn(){
filterInitation = function(defs){
    var filter = defs.append("svg:filter")
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

};
JsonProcess= function(treemap,treeChart,root,height,width,headerHeight,headerColor,color,insertLineBreakContent,xscale,yscale,formatValue,transitionDuration,viewId,insertToolTipContent){
		var nodes = treemap.nodes(root);
		
        var children = nodes.filter(function(d) {
            return !d.children;
        });
        var parents = nodes.filter(function(d) {
            return d.children;
        });
 window['treemap_'+viewId].node=_.clone(root);
 //window['treemap_'+viewId].node=_.clone(nodes);
 
        // create parent cells
        var parentCells = treeChart.selectAll("g.cell.parent")
            .data(parents, function(d) {
                return "p-" + d.id;
            });
        var parentEnterTransition = parentCells.enter()
            .append("g")
            .attr("class", "cell parent")
            .on("click", function(d) {
			this.treemap=treemap;
                zoom(d,treeChart,root,height,width,headerHeight,headerColor,color,insertLineBreakContent,xscale,yscale,formatValue,transitionDuration,viewId);
				//zoom1(d);
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
				.attr("class", "tooltip_"+viewId)
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
        var childrenCells = treeChart.selectAll("g.cell.child")
            .data(children, function(d) {
                return "c-" + d.id;
            });
        // enter transition
        var childEnterTransition = childrenCells.enter()
            .append("g")
            .attr("class", "cell child")
            .on("click", function(d) {
			console.log("current node",window['treemap_'+viewId].node);
			var m=(_.isEqual(window['treemap_'+viewId].node,d.parent) ? root : d.parent);
			this.treemap=treemap;
                zoom(m,treeChart,root,height,width,headerHeight,headerColor,color,insertLineBreakContent,xscale,yscale,formatValue,transitionDuration,viewId);
				//zoom1(m);
            })
            .on("mouseover", function (d,i) { var target=this;mouseover(d,i,insertToolTipContent,target);})
            .on("mouseout", function() {
                d3.select(this)
                    .attr("filter", "")
                    .select(".background")
                    .style("stroke", "#FFFFFF");
			d3.select(".tooltip_"+viewId).style("visibility", "hidden");
            });
        childEnterTransition.append("rect")
            .classed("background", true)
            .style("fill", function(d) {
                return color(d.ColorBasis);
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
			.append("svg").attr("height",labelHeight).attr("width",labelWidth)
			.append("text")
            .attr("class", "label")
			.attr("y",15).each(function(d){ var target=this;insertLineBreakContent(d,formatValue,target);});
		

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
                return color(d.ColorBasis);
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
            treemap.value(this.value == "size" ? size : count)
                .nodes(root);
				this.treemap=treemap;
           zoom(window['treemap_'+viewId].node,treeChart,root,height,width,headerHeight,headerColor,color,insertLineBreakContent,xscale,yscale,formatValue,transitionDuration,viewId);
			//zoom1(node);
        });
this.treemap=treemap;
  zoom(window['treemap_'+viewId].node,treeChart,root,height,width,headerHeight,headerColor,color,insertLineBreakContent,xscale,yscale,formatValue,transitionDuration,viewId);
		//zoom1(node);


};

}
	}
	
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


