/** CS 361 - Software Engineering I - Group 2 **/
'use strict';

// These constants would be in a secure location, and username/password data and salts would be in the DB
const ADMIN_LOGIN = "admin";
const ADMIN_PASSWORD = "t0p$3cr3tPassw0rd!";
const ADMIN_SALT = "146FC88F77FB443FACF6FA5EF8B2EFD5";
const USER_LOGIN = "user";
const USER_PASSWORD = "password";
const USER_SALT = "46EEBB05FC084464B630885B163D72BB";
const PEPPER = "8D896F2647BA402681F88063004F4D9D";
const SESSION_KEY = "A7846BF329524CFE8BB08C9C6E7308BA";
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

//#include
var Express = require("express");
var Handlebars = require("express-handlebars").create({ defaultLayout: "loginMain" });
var BodyParser = require("body-parser");
/*var MySQL = require("./dbcon.js");*/
var Crypto = require('crypto');
var SecurePassword = require('secure-password');
var Session = require('express-session');
var Helmet = require('helmet');
var App = Express();

// Initialize password engine
var passwordEngine = SecurePassword({
    memlimit: SecurePassword.MEMLIMIT_DEFAULT,
    opslimit: SecurePassword.OPSLIMIT_DEFAULT
});

// Helmet protects us from getting hurt
App.use(Helmet());

// Standard Express/Handlebars boilerplate
App.engine("handlebars", Handlebars.engine);
App.set("view engine", "handlebars");
App.set("port", 1337);
App.use(BodyParser.urlencoded({ extended: true }));
App.use(BodyParser.json());
App.use(Express.static("public"));

// This defines the session cookie
App.use(Session({
    name: "sessionID",
    secret: SESSION_KEY,
    rolling: true,
    resave: false,
    saveUninitialized: false,
    cookie: { }
}));

// This is a driver function. This would return the result of a database query.
function Login_GetHashForUser(username) {
    var hashedPassword = Buffer.from('');

    // Switch username
    if (username === ADMIN_LOGIN) {
        var password = Buffer.from(PEPPER + ADMIN_SALT + ADMIN_PASSWORD);

        hashedPassword = passwordEngine.hashSync(password,
            function (err, hash) {
                if (err) {
                    console.log("Hashing error: " + err);
                    throw err;
                }

                hashedPassword = Buffer.from(hash);
            });
    }
    else if (username === USER_LOGIN) {
        var password = Buffer.from(PEPPER + USER_SALT + USER_PASSWORD);

        hashedPassword = passwordEngine.hashSync(password,
            function(err, hash) {
                if (err) {
                    console.log("Hashing error: " + err);
                    throw err;
                }

                hashedPassword = Buffer.from(hash);
            });
    } else {
        console.log("Login_GetHashForUser: Invalid username '" + username + "' not found in user database.");
    }

    return hashedPassword;
}

// This is a driver function. This would return the result of a database query.
function Login_GetSaltForUser(username) {
    var salt = "";

    // Switch username
    if (username === ADMIN_LOGIN) {
        salt = ADMIN_SALT;
    }
    else if (username === USER_LOGIN) {
        salt = USER_SALT;
    } else {
        console.log("Login_GetSaltForUser: Invalid username '" + username + "' not found in salt database.");
    }

    return salt;
}

// Attempt to authenticate user
function Login_Authenticate(username, password) {
    // Get password hash for username
    var validHash = Login_GetHashForUser(username);

    // Get Salt for Username
    var salt = Login_GetSaltForUser(username);

    // Pepper is constant for everyone. Build the combined string
    var passwordBuffer = Buffer.from(PEPPER + salt + password);

    // Authenticate
    if ((salt.length > 0) && (passwordBuffer.length > 0) && (validHash.length === SecurePassword.HASH_BYTES)) {
        var authenticationResult = passwordEngine.verifySync(passwordBuffer, validHash);

        if (authenticationResult === SecurePassword.VALID) {
            console.log("User '" + username + "' authenticated.");
            return true;
        }
    }
    console.log("Access Denied: User '" + username + "' rejected.");
    return false;
}

// Handle long-term sessions
function Login_RememberMe(req, remember) {
    req.session.rememberMe = false;
    if ((remember === true) || (remember === "true")) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;   // 30 days
        req.session.rememberMe = true;
        console.log("Persistent session cookie (30 Days).");
    } else {
        req.session.cookie.expires = false;                     // User-Agent Session Duration
        console.log("Temporary session cookie (until user-agent changes).");
    }
}

// Logout
function Login_Logout(req, res, next) {
    console.log("Logging out user: " + req.session.user);
    req.session.destroy();
}

// Display login page
function Login_Page(req, res, message, next) {
    var loginContext = {};

    loginContext.minPwLength = MIN_PASSWORD_LENGTH;
    loginContext.maxPwLength = MAX_PASSWORD_LENGTH;
    loginContext.pattern = ".{" + MIN_PASSWORD_LENGTH + "," + MAX_PASSWORD_LENGTH + "}";
    loginContext.message = "";

    if ((message) && (message.length > 0)) {
        loginContext.message = message.toString();
    }

    res.render('login', loginContext);
}

// Display home page
function Login_GoHome(req, res, next) {
    var context = {};

    context.user = req.session.user;
    context.rememberMe = "false";
    if (req.session.rememberMe === true) {
        context.rememberMe = "true";
    }
    context.sessionExpiration = req.session.cookie.expires;
    if (req.session.cookie.expires < Date.now()) {
        context.sessionExpiration = "When Browser Closes";
    }

    res.render('loginHome', context);
}

// Test harness
App.get('/logintest', function (req, res, next) {
    var context = {};
    context.row = [];
    var result = "";

    console.log("Login Test");

    // Get Username admin
    result = Login_GetHashForUser(ADMIN_LOGIN);
    if (result.length > 0) {
        context.row.push({ "name": "Get username 'admin", "status": "Passed" });
    } else {
        context.row.push({ "name": "Get username 'admin'", "status": "Failed" });
    }

    // Get Username user
    result = Login_GetHashForUser(USER_LOGIN);
    if (result.length > 0) {
        context.row.push({ "name": "Get username 'user'", "status": "Passed" });
    } else {
        context.row.push({ "name": "Get username 'user'", "status": "Failed" });
    }

    // Get Username banana
    result = Login_GetHashForUser("banana");
    if (result.length > 0) {
        context.row.push({ "name": "No username 'banana'", "status": "Failed" });
    } else {
        context.row.push({ "name": "No username 'banana'", "status": "Passed" });
    }

    // Get salt admin
    result = Login_GetSaltForUser(ADMIN_LOGIN);
    if (result.length > 0) {
        context.row.push({ "name": "Get salt 'admin", "status": "Passed" });
    } else {
        context.row.push({ "name": "Get salt 'admin'", "status": "Failed" });
    }

    // Get salt user
    result = Login_GetSaltForUser(USER_LOGIN);
    if (result.length > 0) {
        context.row.push({ "name": "Get salt 'user", "status": "Passed" });
    } else {
        context.row.push({ "name": "Get salt 'user'", "status": "Failed" });
    }

    // Get salt banana
    result = Login_GetSaltForUser("banana");
    if (result.length > 0) {
        context.row.push({ "name": "No salt 'banana", "status": "Failed" });
    } else {
        context.row.push({ "name": "No salt 'banana'", "status": "Passed" });
    }

    // Login user admin
    result = Login_Authenticate(ADMIN_LOGIN, ADMIN_PASSWORD);
    if (result) {
        context.row.push({ "name": "Login_Page user 'admin", "status": "Passed" });
    } else {
        context.row.push({ "name": "Login_Page user 'admin'", "status": "Failed" });
    }

    // Login user user
    result = Login_Authenticate(USER_LOGIN, USER_PASSWORD);
    if (result) {
        context.row.push({ "name": "Login_Page user 'user", "status": "Passed" });
    } else {
        context.row.push({ "name": "Login_Page user 'user'", "status": "Failed" });
    }

    // Deny user banana
    result = Login_Authenticate("banana", "limeC0c0nut");
    if (result) {
        context.row.push({ "name": "Deny user 'banana", "status": "Failed" });
    } else {
        context.row.push({ "name": "Deny user 'banana'", "status": "Passed" });
    }

    // Test user-agent session cookie
    req.session.user = "test";
    Login_RememberMe(req, false);
    if ((req.session.rememberMe === false) && ((req.session.cookie.expires === false) || (req.session.cookie.expires < Date.now()))) {
        context.row.push({ "name": "Browser Session Cookie", "status": "Passed" });
    } else {
        context.row.push({ "name": "Browser Session Cookie", "status": "Failed" });
    }

    // Test 30 day session cookie
    Login_RememberMe(req, true);
    if ((req.session.rememberMe === true) && (req.session.cookie.expires > Date.now())) {
        context.row.push({ "name": "30 Day Session Cookie", "status": "Passed" });
    } else {
        context.row.push({ "name": "30 Day Session Cookie", "status": "Failed" });
    }

    // Logout test
    Login_Logout(req);
    if (req.session) {
        context.row.push({ "name": "Logout", "status": "Failed" });
    } else {
        context.row.push({ "name": "Logout", "status": "Passed" });
    }

    res.render('loginTest', context);
});

// Handle get requests
App.get('/', function (req, res, next) {
    //If there is no session, go to the login page.
    if (!req.session.user) {
        console.log("GET: No active session. Redirect to login screen.");
        Login_Page(req, res);
        return;
    }

    Login_GoHome(req, res);
});

// Handle post requests
App.post('/', function (req, res, next) {
    if (req.body["Login"]) {
        if (!req.body.username || !req.body.password) {
            // Bad uername or password
            req.session.destroy();
            console.log("Missing username or password. Redirect to login screen.");
            Login_Page(req, res, "Bad username or password.");
            return;
        }
        else {
            // Try authentication
            console.log("Attempting authentication.");
            if (Login_Authenticate(req.body.username, req.body.password)) {
                // 80's hacker movie: I'm in!
                console.log("Authentication succeeded.");
                req.session.user = req.body.username;

                // Handle rememberMe (this is hard-coded to on in the HTML per customer requirement, but support both modes properly anyway)
                Login_RememberMe(req, req.body.rememberMe);
            } else {
                console.log("Authentication failed.");
                Login_Page(req, res, "Access Denied.");
                return;
            }
        }
    }

    //If there is no session, go to the login page.
    if (!req.session.user) {
        console.log("POST: No active session. Redirect to login screen.");
        Login_Page(req, res);
        return;
    }

    if (req.body['Logout']) {
        Login_Logout(req);
        Login_Page(req, res, "Logged out successfully.");
        return;
    }

    Login_GoHome(req, res);
});

App.use(function (req, res) {
    res.status = (404);
    res.render("404");
});

App.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type("plain/text");
    res.status(500);
    res.render("500");
});

var Server = App.listen(App.get("port"), function () {
    console.log("Express started on " + Server.address().address + ":" + Server.address().port);
});