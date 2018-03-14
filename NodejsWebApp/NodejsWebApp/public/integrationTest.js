// integrationTest.js 
// Ref: Asynchronous Requests Lecture - CS 290

class integrationTest {

    testEmployee() {

        // view-employee
        var req = new XMLHttpRequest();
        req.open('GET', 'flip3.engr.oregonstate.edu:65351/view-employee', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',
            function () {
		        if (req.status >= 200 && req.status < 400) {  
		            var result = req.response;
		            var r, key;

		            if (result.length > 0) {
		        	    console.log('/view-employee: Result length > 0 - Passed');
       			    }
       		 	    else {
       		    	    console.log('/view-employee: Result length <= 0 - Failed');
       		 	    }
		            
		            console.log(result); 
       		 	    for (r in result) {
				        for (key in result[r]) {
				            if (key == 'groupName' || key == 'firstName' || key == 'lastName' || key == 'groupId') {
				                console.log('/view-employee: Result attribute is ' + key + ' - Passed');
				            }
				            else {
				                console.log('/view-employee: Result attribute is ' + key + ' - Failed');
				            }
				        }
            	   }
		        }
		        else {
			        console.log("ERROR: " + req.statusText); 
	   		    }
	        });
	    req.send(null); 


        // add-employee - happy path 
	    var req2 = new XMLHttpRequest();
	    req.open('GET', 'flip3.engr.oregonstate.edu:65351/view-employee', true);
	    req2.setRequestHeader('Content-Type', 'application/json');
	    var payload = {};
	    payload.body = {}; 
	    payload.body.first = 'Trevor'; 
	    payload.body.last = 'Worthey'; 
	    payload.body.group_selected = 'Group2'; 

	    req2.addEventListener('load', function(){
		    if (req2.status >= 200 && req2.status < 400) {
			    var result = req2.response
	            	    if (result.confirmation_msg == 'Successfully Added Employee') {
	                	    console.log('/add-employee: Trevor Worthey; Group: Group2 - Passed');
	            	    }
	            	    else {
	                	    console.log('/add-employee: Trevor Worthey; Group: Group2 - Failed');
	            	    }
	            }
	            else {
	            	    console.log("ERROR: " + req.statusText);

	            }
	    });
	    req2.send(payload);

            // add-employee - sad path 
	    var req3 = new XMLHttpRequest();
	    req.open('GET', 'flip3.engr.oregonstate.edu:65351/view-employee', true);
	    req3.setRequestHeader('Content-Type', 'application/json');
	    var payload = {};
	    payload.body = {};
	    payload.body.first = '';
	    payload.body.last = '';
	    payload.body.group_selected = '';

	    req3.addEventListener('load', function () {
		    if (req3.status >= 200 && req3.status < 400) {
	        	    var result = req3.response
	            	    if (result.confirmation_msg != 'Successfully Added Employee') {
	                	    console.log('/add-employee: Empty; Group: Empty - Passed');
	            	    }
	            	    else {
	                	    console.log('/add-employee: Empty; Group: Empty - Failed');

	            	    }
	            }
	            else {
	                console.log("ERROR: " + req.statusText);

	            }
	    });
	    req3.send(payload);


            // add-employee - sad path 
	    var req4 = new XMLHttpRequest();
	    req.open('GET', 'flip3.engr.oregonstate.edu:65351/view-employee', true);
	        req4.setRequestHeader('Content-Type', 'application/json');
	        var payload = {};
	        payload.body = {};
	        payload.body.first = 1234;
	        payload.body.last = 1234;
	        payload.body.group_selected = 1234;

	        req4.addEventListener('load', function () {
	            if (req4.status >= 200 && req4.status < 400) {
	                var result = req4.response
	                if (result.confirmation_msg != 'Successfully Added Employee') {
	                    console.log('/add-employee: 1234 1234; Group: 1234 - Passed');
	                }
	                else {
	                    console.log('/add-employee: 1234 1234; Group: 1234 - Failed');
	                }
	            }
	            else {
	                console.log("ERROR: " + req.statusText);

	            }
	        });
	        req4.send(payload);
        }

}

IT = new integrationTest();

//IT.testEmployeeFE();
IT.testEmployee();
