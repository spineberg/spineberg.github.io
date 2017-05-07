var resultsArray = [];
var avgResult = [];
var medResult = [];
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

for(col ; col < 5 ; col++){
	var sum = 0;
	
	for(i = 0 ; i < resultsArray.length ; i++){
		sum += parseFloat(resultsArray[i][col]);
	}	
	avgResult[col-1] = (sum / i).toFixed(1);
}
}

function getLabel(val, axis){
	var labelArray = new Array();
	
	if(axis === 1) { labelArray = ["Communist","Socialist","Social","Centrist","Market","Capitalist","Laissez-Faire"];} else
		if(axis === 2) { labelArray = ["Cosmopolitan","Internationalist","Peaceful","Balanced","Patriotic","Nationalist","Chauvinist"];} else
		if(axis === 3) { labelArray = ["Anarchist","Libertarian","Liberal","Moderate","Statist","Authoritarian","Totalitarian"];} else
		if(axis === 4) { labelArray = ["Revolutionary","Very Progressive","Progressive","Neutral","Traditional","Very Traditional","Reactionary"];}
	
	if (val > 100) { return "" } else
        if (val > 90) { return labelArray[0] } else
        if (val > 75) { return labelArray[1] } else
        if (val > 60) { return labelArray[2] } else
        if (val >= 40) { return labelArray[3] } else
        if (val >= 25) { return labelArray[4] } else
        if (val >= 10) { return labelArray[5] } else
        if (val >= 0) { return labelArray[6] } else
        	{return ""}

}

    function setIndexBarValue(name, value) {
        innerel = document.getElementById(name)
        outerel = document.getElementById("index-bar-" + name)
        outerel.style.width = (value + "%")
        innerel.innerHTML = (value + "%")
        if (value < 10) {
            innerel.style.visibility = "hidden"
        }else{
			innerel.style.visibility = "visible";
		}
    }

function generateIndex(){
	
	indexDiv = document.getElementById("index-menu");
	
	for (var i in resultsArray){
		var newIndexButton = document.createElement('div');
		newIndexButton.id = resultsArray[i][0].replace(/\s/g, '') + "-index";	
		newIndexButton.innerHTML = ('<button class="indexlinks" onclick="openResult(event, ' + i + ')">' + resultsArray[i][0] + '</button>');
		indexDiv.appendChild(newIndexButton);
	}
	sortColumn+=1;	
}

function openResult(evt, row){
		var nametag = document.getElementById("index-nametag");
	
	    indexlinks = document.getElementsByClassName("indexlinks");
    for (i = 0; i < indexlinks.length; i++) {
        indexlinks[i].className = indexlinks[i].className.replace(" active", "");
    }
    
	var indexResArray = [];
	var n = 0;
	
	if(row >= 0){
		indexResArray = resultsArray[row];
		nametag.innerHTML = "Results for " + resultsArray[row][0]
	}else if(row == -1){
		n-=1;
		indexResArray = avgResult;
		nametag.innerHTML = "Average Result";
	}else if(row == -2){
		n-=1;
		indexResArray = medResult;
		nametag.innerHTML = "Median Result";
	}
	
	var equality =	(indexResArray[n+1]);
	var wealth = 	((100-indexResArray[n+1]).toFixed(1));
	var peace =		(indexResArray[n+2]);
	var might =		((100-indexResArray[n+2]).toFixed(1));
	var liberty =	(indexResArray[n+3]);
	var authority =	((100-indexResArray[n+3]).toFixed(1));
	var progress =	(indexResArray[n+4]);
	var tradition =	((100-indexResArray[n+4]).toFixed(1));
	
	setIndexBarValue("equality", equality);
    setIndexBarValue("wealth", 	wealth);
    setIndexBarValue("peace", peace);
    setIndexBarValue("might", might);
    setIndexBarValue("liberty", liberty);
    setIndexBarValue("authority", authority);
    setIndexBarValue("progress", progress);
    setIndexBarValue("tradition", tradition);
    
    document.getElementById("econ-label").innerHTML = getLabel(equality, 1);
    document.getElementById("dipl-label").innerHTML = getLabel(peace, 2);
	document.getElementById("govt-label").innerHTML = getLabel(liberty, 3);
	document.getElementById("soci-label").innerHTML = getLabel(progress, 4);
	
	ideology = "";
    ideodist = Infinity;
    for (var i = 0; i < ideologies.length; i++) {
        dist = 0;
        dist += Math.pow(Math.abs(ideologies[i].stats.econ - equality), 2);
        dist += Math.pow(Math.abs(ideologies[i].stats.govt - liberty), 2);
        dist += Math.pow(Math.abs(ideologies[i].stats.dipl - peace), 1.73856063);
        dist += Math.pow(Math.abs(ideologies[i].stats.scty - progress), 1.73856063);
        if (dist < ideodist) {
            ideology = ideologies[i].name;
            ideodist = dist;
        }
    }
    document.getElementById("ideology-label").innerHTML = ideology;
    evt.currentTarget.className += " active";
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
		var tooltipText = getLabel(resultsArray[i][col],col);
		
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
		var tooltipElement = document.createElement('span');
		
		tooltipElement.className = "tooltiptext";
		tooltipElement.innerHTML = tooltipText;
		
		newBar.id = resultsArray[i][0].replace(/\s/g, '') + "-" + cat;						// If the nametag contains whitespace, remove it to make the div id less of a headache.
		newBar.className = "axis";
		newBar.innerHTML = ('<p class="nametag">' + resultsArray[i][0] + '</p>');			// Leave whitespace in for the visible names, though.
		document.getElementById(cat).appendChild(newBar);
		
		// Create and adjust both sides of the bar.
		var innerBarLeft = document.createElement('div');
		innerBarLeft.id = resultsArray[i][0].replace(/\s/g, '') + "-bar-" + leftVal;
		innerBarLeft.className = "bar " + leftVal;
		innerBarLeft.style.width = (leftBarResult + "%");
		innerBarLeft.innerHTML = (leftBarResult + "%");
		document.getElementById(newBar.id).appendChild(innerBarLeft);
		
		var innerBarRight = document.createElement('div');
		innerBarRight.id = resultsArray[i][0].replace(/\s/g, '') + "-bar-" + rightVal;
		innerBarRight.className = "bar " + rightVal;
		innerBarRight.style.width = (rightBarResult + "%");
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

	//  	First sort alphabetically
	resultsArray.sort(sortFunction);
	getArrayAvg();
	//getArrayMed();
	generateIndex();

	resultsArray.sort(sortFunction);
	generateChart("econ", 1);
	
	resultsArray.sort(sortFunction);
	generateChart("dipl", 2);
	
	resultsArray.sort(sortFunction);
	generateChart("govt", 3);
	
	resultsArray.sort(sortFunction);
	generateChart("soci", 4);
	
	sortColumn = 0;
	resultsArray.sort(sortFunction);
	
  });
