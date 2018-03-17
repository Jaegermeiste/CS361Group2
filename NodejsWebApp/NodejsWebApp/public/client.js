// client.js 
//
//
// ref for all clientside classes: 
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/References/Classes/extends 

class Dashboard {

    constructor() { 
        this.eView = new EmployeeView();
    }

    buildDashboard() {
        this.eView.getEmployeeGroups();
    }

    testBuildDashboard() {
        this.eView.testGetEmployeeGroups();
    }
}

/****************************************************
* EmployeeView 
* Currently only includes the getEmployeeGroups() function
* Creates a table DOM object based on contents of employee_groups table
*****************************************************/
class EmployeeView {

    // getEmployeeGroups() 
    // Creates a tbody DOM element based on employee_groups 
    getEmployeeGroups() {

        var context;
        //On load of page, send get request to /view-employee and return json-response using event listener
        // Ref: Events Lecture - CS 290
        document.addEventListener("DOMContentLoaded", function (event) {

            var json_response;

            // Send an asynchronous request
            // Ref: Adapted from Asynchronous Requests Lecture - CS 290
            var req = new XMLHttpRequest();
            req.open('GET', 'http://flip3.engr.oregonstate.edu:45698/view-employee', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load', function () {

                console.log('Requesting information from DB..');
                if (req.status >= 200 && req.status < 400) {
                    var json_response = JSON.parse(req.response);
                    console.log(json_response);


                    // for each row of json response,
                    // create td and tr elements to create table, assuming handlebars deals with header row
                    // Ref: DOM Nodes, DOM Navigation Lecture - CS 290
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

    // Test getEmployeeGroups
    // Ensures that a tbody object is in fact made and appended to document
    testGetEmployeeGroups() {
        console.log('Testing GetEmployeeGroups()');
        this.getEmployeeGroups();
        document.addEventListener("DOMContentLoaded", function (event) {

            var body = document.getElementsByTagName('tbody');
            var rows = document.getElementsByTagName('tr');

            var row_count = 0;

            var req = new XMLHttpRequest();
            req.open('GET', 'http://flip3.engr.oregonstate.edu:45698/view-employee', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.addEventListener('load', function () {

                if (req.status >= 200 && req.status < 400) {
                    var json_response = JSON.parse(req.response);
                    row_count = Object.keys(json_response).length;
                    console.log('Numer of rows: ' + row_count);

                    // Check for presence of a table, which should be by default
                    if (body.length != 1)
                        console.log('getEmployeeGroups tbody present - Fail');
                    else
                        console.log('getEmployeeGroups tbody present - Pass');
                    

                        // Decrement rows.length because thead is implicitly counted as tr
                    // Check number of built rows against number returned from GET call 
                    if (rows.length - 1 != row_count)
                        console.log('getEmployeeGroups expecting ' + row_count + ' tr elements, found ' + (rows.length - 1) + ' - Failed');
                    else
                        console.log('getEmployees expecting ' + row_count + ' tr elements, found ' + (rows.length - 1) + ' - Passed ');
                }
            });
            req.send(null);
        });

    }
}

// Create Dashboard 
//var d = new Dashboard();
//d.buildDashboard();


var e = new Dashboard(); 
e.testBuildDashboard();  

