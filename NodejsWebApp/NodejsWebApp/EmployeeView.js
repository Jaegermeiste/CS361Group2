// EmployeeView.js 
//
//

View = require("./View.js"); 

class EmployeeView extends View {

	constructor(){
		// don't know if need this yet
	}

	getEmployeeGroups(){
		
		// On load of page, send a get request to /select-group and return the json_response
		// use event listener 
		//
		

		// Save server's response   
		var json_response;
		return json_response;

	}

	driver(){ 
		// Add to DOM based on json_response from getEmployeeGroups
		buildTable(getEmployeeGroups()); 
	}	

}  
