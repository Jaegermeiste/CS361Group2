// View.js 
//
//
//

class View {


	constructor(){
		// don't know if we need anything here 
	}

	function buildTable(json_response){
		console.log("Building Table"); 
		// for each row of json_response, 
		// 	create td and tr elements to create table, assuming handlebars deals with header row
		var table = document.createElement('tbody'); 	
		
		for (var row in json_response){
			tr = document.createElement('tr); 
				
			var td = document.createElement('td'); 
			td.textContent = row.groupName; 
			tr.appendChild(td); 
		
			var td1 = document.createElement('td'); 
			td1.textContent = row.groupId; 
			tr.appendChild(td1); 

			var td2 = document.createElement('td');
			td2.textContent = row.lastName; 
			tr.appendChild(td2); 
	
			var td3 = document.createElement('td'); 
			td3.textContent = row.firstName; 	
			tr.appendChild(td3); 
	
			table.appendChild(tr);  
		});   
	}
}	 
