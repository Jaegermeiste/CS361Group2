// EmployeeView.js 
//
// 

class EmployeeView extends View {

	constructor(){
		// don't know if need this yet
	}

	getEmployeeGroups(){
		
		// On load of page, send a get request to /view-employee and return the json_response
		// use event listener 
		//
		// Ref: Events Lecture - CS 290
		document.addEventListener('DOMContentLoaded', function(event){
			var json_response; 
		
			// Ref: Adapted from Asynchronous Requests Lecture - CS 290 
			var req = new XMLHttpRequest(); 
			req.open('GET', 'https://flip3.engr.oregonstate.edu:65431/view-employee', true); 
			req.setRequestHeader('Content-Type', 'application/json');
			req.addEventListener('load', function(){
				console.log("Handling Request.."); 
				if (req.status >= 200 && req.status < 400) { 
					json_response = JSON.parse(req.responseText); 
					console.log(json_response); 
					build_table(json_response); 		
				}
				else {
					console.log("ERROR: " + req.statusText); 
				}

			});
			req.send(null); 
			event.preventDefault(); 
		});  
	}
}  
