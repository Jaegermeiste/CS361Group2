// client.js 
//
//
// ref for all clientside classes: 
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/References/Classes/extends 

class Dashboard {
 
        constructor(){
        	this.eView = new EmployeeView();
        }

        buildDashboard() {
                this.eView.getEmployeeGroups();
        }

	testBuildDashboard() {
		dash = this.buildDashboard();
		 
	
	}
}


class EmployeeView {

	getEmployeeGroups(){
		var context; 
		//On load of page, send get request to /view-employee and return json-response using event listener
		// Ref: Events Lecture - CS 290
		document.addEventListener("DOMContentLoaded", function(event){

			var json_response; 
			
			// Ref: Adapted from Asynchronous Requests Lecture - CS 290
			
			var req = new XMLHttpRequest(); 
			req.open('GET', 'http://flip3.engr.oregonstate.edu:65351/view-employee', true); 
			req.setRequestHeader('Content-Type', 'application/json'); 
			req.addEventListener('load', function(){
			
				console.log('Requesting information from DB..'); 
				if (req.status >= 200 && req.status < 400){
					var json_response = JSON.parse(req.response);
					console.log(json_response); 
				
					 
		       		        //for each row of json response,
                  			//      create td and tr elements to create table, assuming handlebars deals with header row
                  			// Ref: DOM Nodes, DOM Navigation Lecture - CS 290
                  			//
                  			var table = document.createElement('tbody');
					  		 
					for (var object in json_response) {
						var tr = document.createElement('tr'); 
						for (var key in json_response[object]) {					
				             		var td1 = document.createElement('td');
                         	 			td1.textContent = json_response[object][key];
                         	 			tr.appendChild(td1);
 						}
			                       			
                          			table.appendChild(tr);
					}
					
				    	// Reference: https://stackoverflow.com/questions/2980830/javascript-getelementbyname-doesnt-work
					document.getElementById('employee_table').appendChild(table)
					
				}	 
				else {
					console.log("ERROR: " + req.statusText);
					  
				}
		
			}); 
			req.send(null); 
		}); 
	}	

	testGetEmployeeGroups() {
		this.getEmployeeGroups(); 
		var result = document.getElementsByTagName('tbody');
		 		
		if ( result.length == 1 ) {
			console.log('getEmployeeGroups - Pass'); 
		}	  
	 	else {
			console.log('getEmployeeGroups - Fail');  
		}
	}


}

// Create Dashboard 
var d = new Dashboard(); 
d.buildDashboard(); 

// var e = new EmployeeView(); 
// e.testGetEmployeeGroups();  


