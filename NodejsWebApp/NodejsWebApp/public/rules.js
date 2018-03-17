// rules.js 
//
//
// ref for all clientside classes: 
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/References/Classes/extends 


/****************************************************
* RulesView 
* Creates all aspects of the Rules page, including drop-down
* menus and tables, populated by contents of DB 
*****************************************************/

class RulesView {

    // getBoundaries() 
    // Creates drop-down based on lockdown_boundaries table 
    getBoundaries() {
        var context;
        //On load of page, send get request to /view-features-disabled and return true if successful
        // Ref: Events Lecture - CS 290
        document.addEventListener("DOMContentLoaded", function (event) {

            var json_response;

            // Ref: Adapted from Asynchronous Requests Lecture - CS 290
            var req = new XMLHttpRequest();
            req.open('GET', event.currentTarget.location.origin + '/view-lockdown-boundary', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load', function () {

                console.log('Requesting information from lockdown_boundaries DB..');
                if (req.status >= 200 && req.status < 400) {
                    var result = JSON.parse(req.response);
                    console.log('getBoundaries() - call to /view-lockdown-boundary successful - retrieved: ' + result);

                    //for each row of json response,
                    //      create option elements for dropdown, assuming handlebars deals with <select> wrapper
                    // Ref: DOM Nodes, DOM Navigation Lecture - CS 290
                    //      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
                    var select = document.getElementById('boundary_name');
                    for (var object in result) {
                        var option = document.createElement('option');
                        option.textContent = result[object].name;
                        option.value = result[object].name;
                        select.appendChild(option);
                    }

                    return true
                }
                else {
                    return false
                }

            });
            req.send(null);
        });
    }


    // getFeatures() 
    // Creates drop-down based on features_disabled table 
    getFeatures() {
        var context;
        //On load of page, send get request to /view-features-disabled and return true if successful
        // Ref: Events Lecture - CS 290
        document.addEventListener("DOMContentLoaded", function (event) {

            var json_response;

            // Ref: Adapted from Asynchronous Requests Lecture - CS 290
            var req = new XMLHttpRequest();
            req.open('GET', event.currentTarget.location.origin + '/view-features-disabled', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load', function () {

                console.log('Requesting information from features_disabled DB..');
                if (req.status >= 200 && req.status < 400) {
                    var result = JSON.parse(req.response);
                    console.log('getFeatures() - call to /view-features-disabled successful - retrieved: ' + result);

                    //for each row of json response,
                    //      create option elements for dropdown, assuming handlebars deals with <select> wrapper
                    // Ref: DOM Nodes, DOM Navigation Lecture - CS 290
                    //      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
                    var select = document.getElementById('feature_to_disable');
                    for (var object in result) {
                        var option = document.createElement('option');
                        option.textContent = result[object].name;
                        option.value = result[object].name;
                        select.appendChild(option);
                    }
                    return true
                }
                else {
                    return false
                }

            });
            req.send(null);
        });
    }

    // getGroups() 
    // Creates drop-down based on groups table 
    getGroups() {
        var context;
        //On load of page, send get request to /view-group. Return true if successful
        // Ref: Events Lecture - CS 290
        document.addEventListener("DOMContentLoaded", function (event) {

            var json_response;

            // Ref: Adapted from Asynchronous Requests Lecture - CS 290
            var req = new XMLHttpRequest();
            req.open('GET', event.currentTarget.location.origin + '/view-group', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load', function () {

                console.log('Requesting information from groups DB..');
                if (req.status >= 200 && req.status < 400) {
                    var result = JSON.parse(req.response);
                    console.log('getGroups() - call to /view-group successful - retrieved ' + result);

                    //for each row of json response,
                    //      create option elements for dropdown, assuming handlebars deals with <select> wrapper
                    // Ref: DOM Nodes, DOM Navigation Lecture - CS 290
                    //      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
                    var select = document.getElementById('group_name');
                    for (var object in result) {
                        var option = document.createElement('option');
                        option.textContent = result[object].name;
                        option.value = result[object].name;
                        select.appendChild(option);
                    }
                    return true
                }
                else {
                    return false
                }

            });
            req.send(null);
        });
    }

    // getRules() 
    // Creates tbody DOM element based on rules table
    getRules() {
        var context;
        //On load of page, send get request to /view-employee and return json-response using event listener
        // Ref: Events Lecture - CS 290
        document.addEventListener("DOMContentLoaded", function (event) {

            var json_response;

            // Ref: Adapted from Asynchronous Requests Lecture - CS 290
            var req = new XMLHttpRequest();
            req.open('GET', event.currentTarget.location.origin + '/view-rule', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load', function () {

                console.log('Requesting information from DB..');
                if (req.status >= 200 && req.status < 400) {
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
                    document.getElementById('rules_table').appendChild(table)

                }
                else {
                    console.log("ERROR: " + req.statusText);

                }

            });
            req.send(null);
        });
    }

    // testGetRules() 
    // Ensures that a tbody element is created and appended to document
    // Checks number of tr elements against those returned by call to /view-rule endpoint
    testGetRules() {
        console.log('Testing getRules()');
        this.getRules();

        document.addEventListener("DOMContentLoaded", function (event) {

            var body = document.getElementsByTagName('tbody');
            var rows = document.getElementsByTagName('tr');

            var row_count = 0;

            var req = new XMLHttpRequest();
            req.open('GET', 'http://flip3.engr.oregonstate.edu:65351/view-rule', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.addEventListener('load', function () {

                if (req.status >= 200 && req.status < 400) {
                    var json_response = JSON.parse(req.response);
                    row_count = Object.keys(json_response).length;
                    console.log('Numer of rows: ' + row_count);

                    // Check for presence of a table, which should be by default
                    if (body.length != 1)
                        console.log('getRules tbody present - Failed');
                    else
                        console.log('getRules tbody present - Passed');
                    

                        // Decrement rows.length because thead is implicitly counted as tr
                    // Check number of built rows against number returned from GET call 
                    if (rows.length - 1 != row_count)
                        console.log('getRules expecting ' + row_count + ' tr elements, found ' + (rows.length - 1) + ' - Failed');
                    else
                        console.log('getRules expecting ' + row_count + ' tr elements, found ' + (rows.length - 1) + ' - Passed ');
                }
            });
            req.send(null);
        });

    }

    // testGetGroups() 
    // Tests the number of options listed vs. the number returned from /view-group
    testGetGroups() {
        console.log('Testing getGroups()');
        this.getGroups();

        document.addEventListener("DOMContentLoaded", function (event) {

            var options = group_name.children;

            var opt_count = 0;

            var req = new XMLHttpRequest();
            req.open('GET', 'http://flip3.engr.oregonstate.edu:65351/view-group', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.addEventListener('load', function () {

                if (req.status >= 200 && req.status < 400) {
                    var json_response = JSON.parse(req.response);
                    opt_count = Object.keys(json_response).length;
                    console.log('Numer of groups returned from GET: ' + opt_count);

                    // Check number of built options against number returned from GET call 
                    if (options.length != opt_count)
                        console.log('getGroups expecting ' + opt_count + ' child elements, found ' + options.length + ' - Failed');
                    else
                        console.log('getGroups expecting ' + opt_count + ' child elements, found ' + options.length + ' - Passed ');
                }
            });
            req.send(null);
        });

    }

    // testGetBoundaries()
    // Tests the number of boundaries listed vs. the number returned from /view-lockdown-boundary
    testGetBoundaries() {
        console.log('Testing getBoundaries()');
        this.getBoundaries();

        document.addEventListener("DOMContentLoaded", function (event) {

            // Number of boundaries inside populated dropdown
            var boundaries = boundary_name.children;

            // Will hold the number returned from GET call 
            var bound_count = 0;

            var req = new XMLHttpRequest();
            req.open('GET', 'http://flip3.engr.oregonstate.edu:65351/view-lockdown-boundary', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.addEventListener('load', function () {

                if (req.status >= 200 && req.status < 400) {
                    var json_response = JSON.parse(req.response);
                    bound_count = Object.keys(json_response).length;
                    console.log('Numer of boundaries returned from GET: ' + bound_count);

                    // Check number of built boundaries against number returned from GET call 
                    if (boundaries.length != bound_count)
                        console.log('getBoundaries expecting ' + bound_count + ' child elements, found ' + boundaries.length + ' - Failed');
                    else
                        console.log('getBoundaries expecting ' + bound_count + ' child elements, found ' + boundaries.length + ' - Passed ');
                }
            });
            req.send(null);
        });

    }

    // testGetFeatures()
    // Tests the number of boundaries listed vs. the number returned from /view-lockdown-boundary
    testGetFeatures() {
        console.log('Testing getFeatures()');
        this.getFeatures();

        document.addEventListener("DOMContentLoaded", function (event) {

            // Number of features inside populated dropdown
            var features = feature_to_disable.children;

            // Will hold the number returned from GET call 
            var feat_count = 0;

            var req = new XMLHttpRequest();
            req.open('GET', 'http://flip3.engr.oregonstate.edu:65351/view-features-disabled', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.addEventListener('load', function () {

                if (req.status >= 200 && req.status < 400) {
                    var json_response = JSON.parse(req.response);
                    feat_count = Object.keys(json_response).length;
                    console.log('Numer of features returned from GET: ' + feat_count);

                    // Check number of built features against number returned from GET call 
                    if (features.length != feat_count)
                        console.log('getFeatures expecting ' + feat_count + ' child elements, found ' + features.length + ' - Failed');
                    else
                        console.log('getFeatures expecting ' + feat_count + ' child elements, found ' + features.length + ' - Passed ');
                }
            });
            req.send(null);
        });

    }


    // testDropDowns() 
    // Ensures that all functions creating drop downs are effectively doing so 
    // and therefore a select object, named appropriately, is associated with option 
    // objects as expected
    testDropDowns(id) {

        console.log('Testing DropDowns');

        var toTest = '';

        // Test getBoundaries() 
        if (id == 'boundary_name') {
            toTest = 'getBoundaries()'; 
            this.testGetBoundaries();
        }

        // Test getGroups()
        else if (id == 'group_name') {
            toTest = 'getGroups()';
            this.testGetGroups(); 
        }

        // Test getFeatures()
        else if (id == 'feature_to_disable') {
            toTest = 'getFeatures()';
            this.testGetFeatures(); 
        }

        // Otherwise don't know what to test 
        else {
            console.log('unhandled'); 
            return false; 
        }
    }
}


// Create Dashboard 
// emitting Dashboard class for now as at this time seems like unnecessary encapsulation
var r = new RulesView();
r.testGetRules();
r.testDropDowns('boundary_name');
r.testDropDowns('group_name');
r.testDropDowns('feature_to_disable');


// Unit Tests -- to be run individually

//var r = new RulesView();
//r.testDropDowns('group_name');
//r.testDropDowns('feature_to_disable');
//r.testDropDowns('boundary_name');