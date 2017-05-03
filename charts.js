var resultsArray = [];
	// Temporary hardcoded result array.
	// [["Alexfrost",53.8,55.1,61.1,66.5],
	// ["CaptMeat",66.0,72.4,61.4,81.3],
	// ["Cinder",71.8,73.7,57.5,83.1],
	// ["Doughboy",76.9,84.0,76.0,84.4],
	// ["Gatysh",50.6,65.4,75.5,68.6],
	// ["Ike",64.7,63.5,64.6,75.2],
	// ["Jam Jar",76.9,74.4,69.7,85.1],
	// ["Kobe",51.3,55.8,46.6,53.7],
	// ["Nano",66.0,44.9,44.0,65.0],
	// ["Necronome",76.9,69.9,74.0,82.2],
	// ["RB",37.2,43.6,45.8,48.9],
	// ["Rive",78.2,77.6,68.6,93.0],
	// ["RoxSocks",51.3,62.2,58.5,60.8],
	// ["Sonokido",69.9,69.9,60.3,75.7],
	// ["Spineberg",87.8,74.4,81.4,94.5],
	// ["Teeos",62.8,62.8,70.0,65.1],
	// ["Trogtor",53.2,50.0,45.2,44.9]
	// ];

var spData = null;

function doData(json){
	spData = json.feed.entry;
}

function readData(){
	var data = spData;
	var rowData = [];
	var tableData = [];
	
	for(var i = 0 ; i < data.length ; i++){
		var cell = data[i]["gs$cell"];
		var val = cell["$t"];
		if(cell.col == 1 && rowData.length != 0) {
			tableData.push(rowData);
			rowData = [];
		}
		
		if(val){
		rowData.push(val);}
	}
	
	tableData.filter(Boolean);
	
	return tableData;	
}

	// Array column counter.
var sortColumn = 0;

function getArrayAvg(){
var i;
var col = 1;
var avg = [];

for(col ; col < 5 ; col++){
	var sum = 0;
	
	for(i = 0 ; i < resultsArray.length ; i++){
		sum += parseFloat(resultsArray[i][col]);
	}	
	avg[col-1] = (sum / i).toFixed(1);
}
	return avg;
}

function getArrayMed(){
	var i;
	var col = 1;
	var med = [];
	
	for(col ; col < 5 ; col++){
		var values = [];
		
		for(i = 0 ; i < resultsArray.length ; i++){
			values[i] = parseFloat(resultsArray[i][col]);
			}
		
		values.sort(sortFunction);
		
		var half = Math.floor(resultsArray.length/2);
		
		if(values.length % 2){
			med[col-1] = (values[half]).toFixed(1);
		}else{
			med[col-1] = ((values[half+1] + values[half]) / 2.0).toFixed(1);
		}
	}
	return med;
}

function getLabel(val, axis){
	var ary = new Array();
	
	if(axis === 1) { ary = ["Communist","Socialist","Social","Centrist","Market","Capitalist","Laissez-Faire"];} else
		if(axis === 2) { ary = ["Cosmopolitan","Internationalist","Peaceful","Balanced","Patriotic","Nationalist","Chauvinist"];} else
		if(axis === 3) { ary = ["Anarchist","Libertarian","Liberal","Moderate","Statist","Authoritarian","Totalitarian"];} else
		if(axis === 4) { ary = ["Revolutionary","Very Progressive","Progressive","Neutral","Traditional","Very Traditional","Reactionary"];}
	
	if (val > 100) { return "" } else
        if (val > 90) { return ary[0] } else
        if (val > 75) { return ary[1] } else
        if (val > 60) { return ary[2] } else
        if (val >= 40) { return ary[3] } else
        if (val >= 25) { return ary[4] } else
        if (val >= 10) { return ary[5] } else
        if (val >= 0) { return ary[6] } else
        	{return ""}

}

function generateSummary(){
	//var avgRes = getArrayAvg();
	//var medRes = getArrayMed();
	
	sortColumn+=1;
	
}

function generateChart(cat, col){

	// Set classes for left and right sides of each bar.
	var leftVal, rightVal;
	
	switch(cat){
		case "econ":
			leftVal = "equality";
			rightVal = "wealth";
			break;
		case "dipl":
			leftVal = "might";
			rightVal = "peace";
			break;
		case "govt":
			leftVal = "liberty";
			rightVal = "authority";
			break;
		case "soci":
			leftVal = "tradition";
			rightVal = "progress";
			break;
		default:
			break;
	}

	for(var i in resultsArray){
		// Create label based on recorded value and current axis.
		var tooltip = getLabel(resultsArray[i][col],col);
		
		var leftBarResult, rightBarResult;
		
																	// Accounts for the different arrangements in recorded values in 8values data. 
		if(col === 2 || col === 4){									// Even numbered columns use recorded value on the right side of the chart.
			leftBarResult = (100-resultsArray[i][col]).toFixed(1);	// Odd numbered columns then use recorded values on the left.
			rightBarResult = resultsArray[i][col];
		}else{
			leftBarResult = resultsArray[i][col];
			rightBarResult = (100-resultsArray[i][col]).toFixed(1);
		}
	
		// Create nametag and bar wrapper.
		var newBar = document.createElement('div');
		newBar.id = resultsArray[i][0].replace(/\s/g, '') + "-" + cat;						// If the nametag contains whitespace, remove it to make the div id less of a headache.
		newBar.className = "axis";
		newBar.innerHTML = ('<p class="nametag">' + resultsArray[i][0] + '</p>');			// Leave whitespace in for the visible names, though.
		document.getElementById(cat).appendChild(newBar);
		
		// Create and adjust both sides of the bar.
		var innerBarLeft = document.createElement('div');
		innerBarLeft.id = resultsArray[i][0].replace(/\s/g, '') + "-bar-" + leftVal;
		innerBarLeft.className = "bar " + leftVal;
		innerBarLeft.style.width = (leftBarResult + "%");
		innerBarLeft.title = tooltip;
		innerBarLeft.innerHTML = (leftBarResult + "%");
		document.getElementById(newBar.id).appendChild(innerBarLeft);
		
		var innerBarRight = document.createElement('div');
		innerBarRight.id = resultsArray[i][0].replace(/\s/g, '') + "-bar-" + rightVal;
		innerBarRight.className = "bar " + rightVal;
		innerBarRight.style.width = (rightBarResult + "%");
		innerBarRight.title = tooltip;
		innerBarRight.innerHTML = (rightBarResult + "%");
		document.getElementById(newBar.id).appendChild(innerBarRight);
		
		}
		
		// Lazy, hacky iteration through columns.
		sortColumn+=1;
}

function sortFunction(a, b) {
    if (a[sortColumn] === b[sortColumn]) {
        return 0;
    }
    else {
        return (a[sortColumn] < b[sortColumn]) ? -1 : 1;
    }
}

function openChart(evt, cat){
    var i, tabcontent, tablinks;

    // Hide everything that we don't need.
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show what we do need.
    document.getElementById(cat).style.display = "block";
    evt.currentTarget.className += " active";
}

$(document).ready(function () {

	resultsArray = readData();

	resultsArray.sort(sortFunction);
	generateSummary();

	resultsArray.sort(sortFunction);
	generateChart("econ", 1);
	
	resultsArray.sort(sortFunction);
	generateChart("dipl", 2);
	
	resultsArray.sort(sortFunction);
	generateChart("govt", 3);
	
	resultsArray.sort(sortFunction);
	generateChart("soci", 4);
  });