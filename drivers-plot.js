
var _vis = {};

//==============================================================================
function initPlot(defData) {
	_vis = {
		paddingTop: 0,

		margin: {top: 20, right: 20, bottom: 120, left: 80},
		width: 960,
		height: 500,
		
		svg: undefined,
		x0Scale: undefined,
		x1Scale: undefined,
		yScale: undefined,
		xAxis: undefined,
		yAxis: undefined,
		
		//Data being displayed - default is 2014
		data: undefined,
		//Complete data
		dataMaster: [],
		
		colorList: d3.scale.ordinal()
						.range(["#f8d584", "#9dc89d"]),
						
						
		barGroupNames: ["male","female"],
		
		transDuration: 1000,
		barTransDelayFactor: 25,
		textTransDelayFactor: 50,
	};
	
	//Adjust width, height
	_vis.width = _vis.width - _vis.margin.left - _vis.margin.right;
	_vis.height = _vis.height - _vis.margin.top - _vis.margin.bottom;
	
	
	_vis.data = defData;
	
	//Build chart
	createSVG();
	//Top of plot has padding that depends on the largest data point
	calcPaddingTop();
	setupScales();
	createDefPlot();
	createAxes();		
	

}
//==============================================================================
function createSVG() {
				
	//Insert svg before range input
	_vis.svg = d3.select(".svg_holder")
				.append("svg")		
				.attr("width",_vis.width + _vis.margin.left + 
					_vis.margin.right)
				.attr("height",_vis.height + _vis.margin.top + 
					_vis.margin.bottom)
				.append("g")
					.attr("transform", "translate(" + _vis.margin.left + 
						"," + _vis.margin.top + ")");
	
}
//==============================================================================
function setupScales() {
	_vis.x0Scale = d3.scale.ordinal()
			.domain(_vis.data.map( function(d) { return d.state; } ))
			.rangeRoundBands([0, _vis.width], 0.05);
	_vis.x1Scale = d3.scale.ordinal()
			.domain(_vis.barGroupNames)
			.rangeRoundBands([0, _vis.x0Scale.rangeBand()]);
	
	_vis.yScale = d3.scale.linear()
			.domain([0, d3.max(_vis.data, function(d) {				
					return d3.max(d.driversByGender, function(dSub) {
						return dSub.count;
					} );
				}) + _vis.paddingTop			
			])
			.range([_vis.height, 0]);
	
}

//==============================================================================
function createAxes() {
	_vis.xAxis = d3.svg.axis()
			.scale(_vis.x0Scale)
			.orient("bottom");			
			
	_vis.yAxis = d3.svg.axis()
			.scale(_vis.yScale)
			.orient("left")
			.ticks(15, "s");

			
	_vis.svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + _vis.height + ")")
			.call(_vis.xAxis)
			.selectAll("text")
				.attr("x", -10)
				.attr("y", 0)
				.attr("transform", "rotate(-45)")
				.style("text-anchor", "end");
	
	
	_vis.svg.append("g")
			.attr("class", "y axis")
			.call(_vis.yAxis)
			.append("text")
				.attr("x", "-150")
				.attr("y", "-60")
				.attr("text-anchor","end")
				.attr("transform", "rotate(-90)")								
				.text("Number of Drivers")				
				//.attr("fill","black")
				//.attr("font-size","36px");				
	
}

//==============================================================================
function createDefPlot() {			

	
	_vis.svg.selectAll(".barGroup")
		.data(_vis.data)
		.enter()
		.append("g")
		.attr("class", "barGroup")
		.attr("transform", function(d) {
			return "translate(" + _vis.x0Scale(d.state) + ", 0)";
		});		

	_vis.svg.selectAll(".barGroup")
			.selectAll("rect")
			.data(function(d) {
				return d.driversByGender;
			})
			.enter()
			.append("rect")
				.attr("x", function(d) { return _vis.x1Scale(d.gender); })
				.attr("width", _vis.x1Scale.rangeBand())
				.attr("y", function(d) { return _vis.yScale(d.count); })
				.attr("height", function(d) { 
					return _vis.height - _vis.yScale(d.count); 
				})
				.style("fill", function(d) { return _vis.colorList(d.gender); });
				//.style("stroke", function(d) { return _vis.colorList(d.gender);})
	

	//Add legends
	_vis.svg.selectAll(".legend")
			.data(_vis.barGroupNames)
			.enter()
			.append("g")
			.attr("class", "legend")
			.attr("transform", function(data, index) {
				return "translate(0, " + index * 20 + ")";
			});
		
	_vis.svg.selectAll(".legend")
			.append("rect")
			.attr("x", _vis.width - 135)
			.attr("width", 10)
			.attr("height", 10)
			.style("fill", _vis.colorList);
			
	_vis.svg.selectAll(".legend")
			.append("text")
			.attr("x", _vis.width - 120)
			.attr("y", 9)
			.attr("text-anchor", "start")
			.text( function (d) {
				return d;
			});
	
	//Attach mouse event listeners
	attachListeners();
}

//==============================================================================
function attachListeners() {
	
	_vis.svg.selectAll(".barGroup")
			.on("mouseover", function(d, index) {
			//Get this bar's x/y values, then augment for the tooltip
			//Modified x position of tooltip so that it is a bit to the
			//right of the bar
			var xPosition = _vis.x0Scale(d.state),
			    yPosition = _vis.yScale(d3.max(d.driversByGender, 
				function(dSub) {
					return dSub.count;
				} )
			) - 20;
			
			//For states at the end, shift xPosition to the left to avoid cutoff
			var currStateList = _vis.data.map( function(d) { return d.state; });
			if ( 
				(currStateList[45] === d.state) ||
				(currStateList[46] === d.state) ||				
				(currStateList[47] === d.state) ||
				(currStateList[48] === d.state) ||
				(currStateList[49] === d.state) ||
				(currStateList[50] === d.state)				
			){
				xPosition -= 90;
			}
			_vis.svg.append("text")
					.attr("x", xPosition)
					.attr("y", yPosition)
					.attr("id", "svg-tooltip-main")

					.append("tspan")
					.attr("x", xPosition)
					.attr("y", yPosition - 15)
					.attr("id", "svg-tooltip-state")
				    .text(d.state)
					
					.append("tspan")
					.attr("x", xPosition)
					.attr("y", yPosition)
					.attr("id", "svg-tooltip-count")	
					.text("Male drivers: "+d.driversByGender[0].count)
					.append("tspan")
					.attr("x", xPosition)
					.attr("y", yPosition + 12)
					.attr("id", "svg-tooltip-count")
					.text("Female drivers: "+d.driversByGender[1].count);					
					
				
					
		})
		.on("mouseout", function() {
			d3.select("#svg-tooltip-main").remove();
		})
	   .on("click", function() {				   
		   //default ordering is by state
			sortBars("state");
			//so reset radio-group as well
			d3.select("input[value='state']")
				.property("checked",true);

	   });	
	
}
//==============================================================================
function sortBars(sortOrder) {

	if (sortOrder === "state") {
		_vis.data.sort(function(a, b) {
			return d3.ascending(a.state, b.state);
		});
	}
	else if (sortOrder === "ascending") {
		_vis.data.sort(function(a, b) {
			return d3.ascending(a.count, b.count);	
		});
	}
	else if (sortOrder === "descending") {
		_vis.data.sort(function(a, b) {
			return d3.descending(a.count, b.count);	
		});
	}	
	
		
		
	_vis.x0Scale.domain(_vis.data.map( function(d) { return d.state; } ));
					
	_vis.svg.select(".x.axis")
		.transition()
		.duration(_vis.transDuration)	
		.call(_vis.xAxis)
		.delay(function(d, i) {
				   return i * _vis.textTransDelayFactor;
				}).		
		selectAll("text")
			.attr("x", -10)
			.attr("y", 0)
			.attr("transform", "rotate(-45)")		
			.style("text-anchor", "end");		
		
		
	_vis.svg.selectAll(".barGroup")
		.transition()
	    .delay(function(d, i) {
	 	   return i * _vis.barTransDelayFactor;
	    })
		.duration(_vis.transDuration)
		.attr("transform", function(d) {
			return "translate(" + _vis.x0Scale(d.state) + ", 0)";
		});
	
			
}

//==============================================================================
function clearPlot() {
	
	_vis.data = [];
	
	//Update y values
	_vis.svg.selectAll(".barGroup")
		.selectAll("rect")
			.data(function(d) {
				return d.driversByGender;
			})
			.transition()
			.duration(_vis.transDuration)
			
			.attr("y", function(d) { return _vis.yScale(0); })
			.attr("height", function(d) { 
				return _vis.height - _vis.yScale(0); 
			});		
	
}
//==============================================================================

function updatePlot(updatedData) {
	

	_vis.data = updatedData;
	
	//Recalculate paddingTop based on new data
	calcPaddingTop();
	
	_vis.x0Scale.domain(_vis.data.map( function(d) { return d.state; } ));
					
	_vis.svg.select(".x.axis")
		.transition()
		.duration(_vis.transDuration)
		.call(_vis.xAxis)
		.delay(function(d, i) {
				   return i * _vis.textTransDelayFactor;
				})
		.selectAll("text")
			.attr("x", -10)
			.attr("y", 0)
			.attr("transform", "rotate(-45)")
			.style("text-anchor", "end");	
			

	_vis.yScale.domain([0, d3.max(_vis.data, function(d) {				
					return d3.max(d.driversByGender, function(dSub) {
						return dSub.count;
					} );
				}) + _vis.paddingTop			
			]);

			
	//Update y axis along with its padding on data change - do transition
	_vis.svg.select(".y.axis")
		.transition()
		.duration(_vis.transDuration)	
		.call(_vis.yAxis);

	//Update data attribute using new data
	_vis.svg.selectAll(".barGroup")
		.data(_vis.data);
	
	//Update x position 
	_vis.svg.selectAll(".barGroup")
		.transition()
	    .delay(function(d, i) {
	 	   return i * _vis.barTransDelayFactor;
	    })
		.duration(_vis.transDuration)
		.attr("transform", function(d) {
			return "translate(" + _vis.x0Scale(d.state) + ", 0)";
		});		


	//Update y values
	_vis.svg.selectAll(".barGroup")
		.selectAll("rect")
			.data(function(d) {
				return d.driversByGender;
			})
			.transition()
			.duration(_vis.transDuration)
			
			.attr("y", function(d) { return _vis.yScale(d.count); })
			.attr("height", function(d) { 
				return _vis.height - _vis.yScale(d.count); 
			});		

	//Reset radio-group as well
	d3.select("input[value='state']")
		.property("checked",true);			

}

//==============================================================================
function calcPaddingTop() {
	
	_vis.paddingTop = Math.floor(
		d3.max(_vis.data, function(d) { 
			return d.count;
		}) / 10
	);
}

//==============================================================================
function incomeStrToNum(incomeStr) {
	return +incomeStr.replace(',','');
	
}
