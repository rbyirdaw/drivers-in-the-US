
var filterSet ={};

function init() {
	
	filterSet = {
	  year: 1999,
	  male: true,
	  female: true,
	  ageGroups: {
		  "19_and_under": true,
		  "20_24": false,
		  "25_29": false,
		  "30_34": false,
		  "35_39": false,
		  "40_44": false,
		  "45_49": false,
		  "50_54": false,
		  "55_59": false,
		  "60_64": false,
		  "65_69": false,
		  "70_74": false,
		  "75_79": false,
		  "80_84": false,
		  "85_and_over": false
	  }  
	};
	
	$("input[name='yearSelect']").val(filterSet.year);
	$(".yearDisplay").html(filterSet.year);
	$("input[name='19_and_under']").prop("checked", true);
	
	//attach onchange listener to age group checkboxes
	$("input[type='checkbox']").on("change", function() {
		updateFilter(this);
	});

	
	
	$("input[name='sortOptions']")
		.on("change", function() {
			sortBars(this.value);
		});
		
	$("input[name='yearSelect']")
		.on("change", function() {
			filterSet.year = this.value;
			$(".yearDisplay").html(this.value);
			console.log(filterSet.year);
			
			execRequest(updatePlot);
		});	
	
	execRequest(initPlot);
	
}

//==============================================================================
function updateFilter(filter) {
	
	var ageGroupSel = undefined;
	
	if ( (filter.name === "male") || (filter.name === "female") ) {
		if (filter.checked) {
			filterSet[filter.name] = true;
		} else {
			filterSet[filter.name] = false;
		}
	} else if (filter.name === "select_all") {
		
		if (!filter.checked) {
			ageGroupSel = false;
			//Uncheck age groups that are currently checked
			for (ageGroup in filterSet.ageGroups) {
				if (filterSet.ageGroups[ageGroup] === true) {
					filterSet.ageGroups[ageGroup] = false;
					$("input[name='"+ageGroup+"']").prop("checked", false);
				}
			}
		} else {
			ageGroupSel = true;
			//Check age groups that are currently unchecked
			for (ageGroup in filterSet.ageGroups) {
				if (filterSet.ageGroups[ageGroup] === false) {
					filterSet.ageGroups[ageGroup] = true;
					$("input[name='"+ageGroup+"']").prop("checked", true);
				}
			}
		}		
	
	} else {
		if (filter.checked) {
			filterSet.ageGroups[filter.name] = true;
			ageGroupSel = true;
		} else {
			filterSet.ageGroups[filter.name] = false;		
		}
	}
	
	if (ageGroupSel === undefined) {
		ageGroupSel = false;
		var	ageGroupKeys = Object.keys(filterSet.ageGroups),
			i = 0;
		while ( !ageGroupSel && (i < ageGroupKeys.length) ) {
			if ( filterSet.ageGroups[ageGroupKeys[i]] === true ) {
				ageGroupSel = true;
			}
			i++;
		}		
	}
	
	var genderSel = ( filterSet.male || filterSet.female );

	console.log(filterSet);
		
	if (genderSel && ageGroupSel) {
		execRequest(updatePlot);
	} else {
		clearPlot();
	}
}

//==============================================================================
function execRequest(mCallback) {	
	
	var respData = undefined;
	var xhr = new XMLHttpRequest();
	
	xhr.onreadystatechange = function() {
		
		if ( (xhr.readyState === 4) && (xhr.status === 200) ) {
			
			var respType = xhr.getResponseHeader("Content-type");
			
			if (respType === "application/json") {
				/*
				document.getElementById("responseDiv").
					innerHTML = "";
				document.getElementById("responseDiv").
					innerHTML = xhr.responseText;	
				
				console.log(JSON.parse(xhr.responseText));				
				*/
				respData = JSON.parse(xhr.responseText);
				formattedData = procRespData(respData);
				mCallback(formattedData);				
				
				
			} else {
				alert("Received content-type is "+respType);
			}

		} //if readyState, status
	} //onreadystatechange
	
	//http required.
	xhr.open("POST", "http://347apps.com/US-drivers/user-request.php", true);
	//xhr.open("POST", "user-request.php", true);
	//Adding content-type creates an error (405)
	//xhr.setRequestHeader("Content-type", "application/json");		
	xhr.send(JSON.stringify(filterSet));
	
	

}//execRequest

//==============================================================================
function procRespData(respData) {
	/*
	 * AJAX request returns a 2 element object array with JSON objects, for 
	 * male and female driver data.
	 * D3 plot needs array of objects with x-axis field state, and y-axis field
	 * count.
	 */
	 
	 var formattedData = [];
	 var maleDriversData = 
		respData["maleDrivers"] == null ? [] : respData["maleDrivers"];
	 var femaleDriversData = 
		respData["femaleDrivers"] == null ? [] : respData["femaleDrivers"];
	 
	 var statesList = [];
	 var stateIndex = undefined;
	 
	 //Process Male driver data
	 for (i = 0; i < maleDriversData.length; i++ ) {
		 var tempTotalCount = 0;
		 for (countIndex = 0; 
			countIndex < maleDriversData[i].age_group_count.length;
			countIndex++ ) {
				tempTotalCount += (+maleDriversData[i].
					age_group_count[countIndex].count);
		}
		
		formattedData[i] = {
			state: maleDriversData[i].state,
			count: tempTotalCount,
			driversByGender: [
				{"gender": "male", "count": tempTotalCount}
			]
		}
		
		//if female driver data does not exist, set count to 0 here.
		if (femaleDriversData.length === 0) {
			formattedData[i].driversByGender.push(
				{"gender": "female", "count": 0}
			);
		}
		if (statesList.indexOf(maleDriversData[i].state) == -1)
			statesList.push(maleDriversData[i].state);
	 }
	 
	 
	 //Process female driver data
	 for (i = 0; i < femaleDriversData.length; i++ ) {
		 var tempTotalCount = 0;
		 for (countIndex = 0; 
			countIndex < femaleDriversData[i].age_group_count.length;
			countIndex++ ) {
				tempTotalCount += (+femaleDriversData[i].
					age_group_count[countIndex].count);
		}
		
		//Must check if state data exists already
		stateIndex = statesList.indexOf(femaleDriversData[i].state);
		if (stateIndex != -1) {
			formattedData[stateIndex].count += tempTotalCount;
			formattedData[stateIndex].driversByGender.push(
				{"gender": "female", "count": tempTotalCount}
			);
		} else {
			formattedData[i] = {
				state: femaleDriversData[i].state,
				count: tempTotalCount,
				driversByGender: [
					//if state is not already on the list, then it is because
					//data for male drivers does not exist - set to 0
					{"gender": "male", "count": 0},
					{"gender": "female", "count": tempTotalCount}
				]				
			}
		}
	 }
	 
	 
	 
	 return formattedData;
	 
	 
}
































