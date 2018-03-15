// integrationTest.js 
// Ref: Asynchronous Requests Lecture - CS 290

class integrationTest {

    // Test employee-related endpoints
    // Ensure that communication between client and server side is accurate 
    testEmployee() {

        // view-employee
        var req = new XMLHttpRequest();
        req.open('GET', 'http://flip3.engr.oregonstate.edu:65351/view-employee', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',
            function () {
                if (req.status >= 200 && req.status < 400) {
                    console.log('/view-employee: OK status - Passed')
                    var result = JSON.parse(req.response);
                    var r, key;
                    if (result.length > 0) {
                        console.log('/view-employee: Result length > 0 - Passed');
                    }
                    else {
                        console.log('/view-employee: Result length <= 0 - Failed');
                    }

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
        req2.open('POST', 'http://flip3.engr.oregonstate.edu:65351/add-employee', true);
        req2.setRequestHeader('Content-Type', 'application/json');
        var payload2 = {};
        payload2.body = {};
        payload2.body.first = 'George';
        payload2.body.last = 'Costanza';
        payload2.body.group_selected = 'Yellow';

        req2.addEventListener('load', function () {
            if (req2.status >= 200 && req2.status < 400) {
                console.log('/add-employee: OK status - Passed');
                if (document.getElementById('msg') != 'Succesfully Added Employee George Costanza to Yellow') {
                    console.log('/add-employee: Happy Path - George Costanza; Group: Yellow - Passed');
                }
                else {
                    console.log('/add-employee: Happy Path - George Costanza; Group: Yellow - Failed');
                }
            }
            else {
                console.log("ERROR: " + req2.statusText);
            }
        });
        req2.send(payload2);

        // add-employee - sad path 
        var req3 = new XMLHttpRequest();
        req3.open('POST', 'http://flip3.engr.oregonstate.edu:65351/add-employee', true);
        req3.setRequestHeader('Content-Type', 'application/json');
        var payload3 = {};
        payload3.body = {};
        payload3.body.first = '';
        payload3.body.last = '';
        payload3.body.group_selected = '';

        req3.addEventListener('load', function () {
            if (req3.status >= 200 && req3.status < 400) {
                console.log('/add-employee: OK status - Passed');
                if (document.getElementById('msg') != 'Successfully Added Employee to ') {
                    console.log('/add-employee: Sad Path - Empty Emloyee, Empty Group - Passed');
                }
                else {
                    console.log('/add-employee: Sad Path - Empty Employee, Empty Group - Failed - Requires more strict requirements on addition');
                }
            }
            else {
                console.log("ERROR: " + req3.statusText);
            }
        });
        req3.send(payload3);


        // add-group - happy path 
        var req4 = new XMLHttpRequest();
        req4.open('POST', 'http://flip3.engr.oregonstate.edu:65351/add-group', true);
        req4.setRequestHeader('Content-Type', 'application/json');
        var payload4 = {};
        payload4.body = {};
        payload4.body.group_name = 'testgroup';

        req4.addEventListener('load', function () {
            if (req4.status >= 200 && req4.status < 400) {
		console.log('/add-group: OK status - Passed');   
                if (document.getElementById('msg') != 'Successfully Added Group testgroup') {
                    console.log('/add-group: Happy Path - testgroup - Passed');
                }
                else {
                    console.log('/add-group: Happy Path - testgroup - Failed');
                }
            }
            else {
                console.log("ERROR: " + req4.statusText);

            }
        });
        req4.send(payload4);


        // add-group - sad path 
        var req5 = new XMLHttpRequest();
        req5.open('POST', 'http://flip3.engr.oregonstate.edu:65351/add-group', true);
        req5.setRequestHeader('Content-Type', 'application/json');
        var payload5 = {};
        payload5.body = {};
        payload5.body.group_name = 'Yellow';

        req5.addEventListener('load', function () {
            if (req5.status >= 200 && req5.status < 400) {
		console.log('/add-group: OK status - Passed'); 
                if (document.getElementById('msg') != 'Successfully Added Group Yellow') {
                    console.log('/add-group: Sad Path - Yellow - Failed - Need more strict requirements on unique keys');
                }
                else {
                    console.log('/add-group: Sad Path - Yellow - Passed');
                }
            }
            else {
                console.log("ERROR: " + req5.statusText);
            }
        });
        req5.send(payload5);
    }
}

IT = new integrationTest();
IT.testEmployee();
