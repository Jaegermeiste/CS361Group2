// integrationTest-rule.js 
// Ref: Asynchronous Requests Lecture - CS 290

class ruleIntegrationTest {

    // Test viewing rules and client-to-server communication
    testViewRule() {

        var req = new XMLHttpRequest();
        req.open('GET', 'http://flip3.engr.oregonstate.edu:65351/view-rule', true);        
        req.setRequestHeader('Content-Type', 'application/json');

        req.addEventListener('load',
            function () {
                if (req.status >= 200 && req.status < 400) {
                    console.log('/view-rule: OK status - Passed')
                    var result = JSON.parse(req.response);
                    var r, key;
                    if (result.length > 0) {
                        console.log('/view-rule: Result length > 0 - Passed');
                    }
                    else {
                        console.log('/view-rule: Result length <= 0 - Failed');
                    }


                    for (r in result) {
                        for (key in result[r]) {
                            if (key == 'rule' || key == 'lockdown boundary' || key == 'group' || key == 'feature disabled') {
                                console.log('/view-rule: Result attribute is ' + key + ' - Passed');
                            }
                            else {
                                console.log('/view-rule: Result attribute is ' + key + ' - Failed');
                            }
                        }
                    }
                }
                else {
                    console.log("ERROR: " + req.statusText);
                }
            });
        req.send(null);

    }

    // Test adding a rule to the DB
    testAddRule() {
     
        var req = new XMLHttpRequest();
        req.open('POST', 'http://flip3.engr.oregonstate.edu:65351/add-rule', true);
        req.setRequestHeader('Content-Type', 'application/json');

        // add-rule - happy path 
        var payload = {};
        payload.body = {};
        payload.body.rule_name = 'IntTestRule1';
        payload.body.group_name = 'Red';
        payload.body.boundary_name = 'South Campus';
        payload.body.feature_to_disable = 'WiFi';

        req.addEventListener('load', function () {
            if (req.status >= 200 && req.status < 400) {
                console.log('/add-rule: OK status - Passed');
                if (document.getElementById('msg') != 'Successfully Added Rule ' + payload.body.rule_name) {
                    console.log('/add-rule: Happy Path - Rule: IntTestRule1; Group: Red; Boundary: South Campus; Feature: WiFi - Passed');
                }
                else {
                    console.log('/add-rule: Happy Path - Rule: IntTestRule1; Group: Red; Boundary: South Campus; Feature: WiFi - Failed');
                }
            }
            else {
                console.log("ERROR: " + req.statusText);
            }
        });
        req.send(payload);

      // add-employee - sad path 
        var req2 = new XMLHttpRequest();
        req2.open('POST', 'http://flip3.engr.oregonstate.edu:65351/add-rule', true);
        req2.setRequestHeader('Content-Type', 'application/json');
        var payload3 = {};
        payload3.body = {};
        payload.body.rule_name = '';
        payload.body.group_name = '';
        payload.body.boundary_name = '';
        payload.body.feature_to_disable = '';

        req2.addEventListener('load', function () {
            if (req2.status >= 200 && req2.status < 400) {
                console.log('/add-employee: OK status - Passed');
                if (document.getElementById('msg') != 'Successfully Added Rule ' + payload.body.rule_name) {
                    console.log('/add-rule: Sad Path - Empty Payload Contents - Passed');
                }
                else {
                    console.log('/add-rule: Sad Path - Empty Payload Contents - Failed - Requires more strict requirements on addition');
                }
            }
            else {
                console.log("ERROR: " + req2.statusText);
            }
        });
        req2.send(payload3);

    }

    testViewGroups() {
        var req = new XMLHttpRequest();
        req.open('GET', 'http://flip3.engr.oregonstate.edu:65351/view-group', true);        
        req.setRequestHeader('Content-Type', 'application/json');

        req.addEventListener('load',
            function () {
                if (req.status >= 200 && req.status < 400) {
                    console.log('/view-group: OK status - Passed');
                    var result = JSON.parse(req.response);
                    var r, key;
                    if (result.length > 0) {
                        console.log('/view-group: Result length > 0 - Passed');
                    }
                    else {
                        console.log('/view-group: Result length <= 0 - Failed');
                    }


                    for (r in result) {
                        for (key in result[r]) {
                            if (key == 'name') {
                                console.log('/view-group: Result attribute is ' + key + ' - Passed');
                            }
                            else {
                                console.log('/view-group: Result attribute is ' + key + ' - Failed');
                            }
                        }
                    }
                }
                else {
                    console.log("ERROR: " + req.statusText);
                }
            });
        req.send(null);
    }

    testViewBoundaries() {

        var req = new XMLHttpRequest();
        req.open('GET', 'http://flip3.engr.oregonstate.edu:65351/view-lockdown-boundary', true);        
        req.setRequestHeader('Content-Type', 'application/json');

        req.addEventListener('load',
            function () {
                if (req.status >= 200 && req.status < 400) {
                    console.log('/view-group: OK status - Passed');
                    var result = JSON.parse(req.response);
                    var r, key;
                    if (result.length > 0) {
                        console.log('/view-lockdown-boundary: Result length > 0 - Passed');
                    }
                    else {
                        console.log('/view-lockdown-boundary: Result length <= 0 - Failed');
                    }


                    for (r in result) {
                        for (key in result[r]) {
                            if (key == 'name') {
                                console.log('/view-lockdown-boundary: Result attribute is ' + key + ' - Passed');
                            }
                            else {
                                console.log('/view-lockdown-boundary: Result attribute is ' + key + ' - Failed');
                            }
                        }
                    }
                }
                else {
                    console.log("ERROR: " + req.statusText);
                }
            });
        req.send(null);

    }

    testViewFeatures() {

        var req = new XMLHttpRequest();
        req.open('GET', 'http://flip3.engr.oregonstate.edu:65351/view-features-disabled', true);        
        req.setRequestHeader('Content-Type', 'application/json');

        req.addEventListener('load',
            function () {
                if (req.status >= 200 && req.status < 400) {
                    console.log('/view-group: OK status - Passed');
                    var result = JSON.parse(req.response);
                    var r, key;
                    if (result.length > 0) {
                        console.log('/view-features-disabled: Result length > 0 - Passed');
                    }
                    else {
                        console.log('/view-features-disabled: Result length <= 0 - Failed');
                    }


                    for (r in result) {
                        for (key in result[r]) {
                            if (key == 'name') {
                                console.log('/view-features-disabled: Result attribute is ' + key + ' - Passed');
                            }
                            else {
                                console.log('/view-features-disabled: Result attribute is ' + key + ' - Failed');
                            }
                        }
                    }
                }
                else {
                    console.log("ERROR: " + req.statusText);
                }
            });
        req.send(null);


    }

    // Test employee-related endpoints
    // Ensure that communication between client and server side is accurate 
    executeTestSuite() {
        this.testViewRule();
        this.testAddRule();
        this.testViewGroups();
        this.testViewBoundaries();
        this.testViewFeatures();
    }
}

IT = new ruleIntegrationTest();
IT.executeTestSuite();
