// client.js 
//
//
// ref for all clientside classes: 
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/References/Classes/extends 

class RulesView {

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

    testGetRules() {
        this.getRules();
        var result = document.getElementsByTagName('tbody');

        if (result.length == 1) {
            console.log('getRules - Pass');
        }
        else {
            console.log('getRules - Fail');
        }
    }


}

// Create Dashboard 
var r = new RulesView();
r.getRules();
r.getBoundaries();
r.getFeatures();
r.getGroups();
