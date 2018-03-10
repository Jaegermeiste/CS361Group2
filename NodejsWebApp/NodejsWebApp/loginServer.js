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
function GetHashForUser(username) {
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
        console.log("GetHashForUser: Invalid username or username not found in database.");
    }

    return hashedPassword;
}

// This is a driver function. This would return the result of a database query.
function GetSaltForUser(username) {
    var salt = "";

    // Switch username
    if (username === ADMIN_LOGIN) {
        salt = ADMIN_SALT;
    }
    else if (username === USER_LOGIN) {
        salt = USER_SALT;
    } else {
        console.log("GetSaltForUser: Invalid username or username not found in database.");
    }

    return salt;
}

// Attempt to authenticate user
function Authenticate(username, password) {
    // Get password hash for username
    var validHash = GetHashForUser(username);

    // Get Salt for Username
    var salt = GetSaltForUser(username);

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

// Display login page
function Login(req, res, message, next) {
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
function GoHome(req, res, next) {
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

// Handle get requests
App.get('/', function (req, res, next) {
    //If there is no session, go to the login page.
    if (!req.session.user) {
        console.log("GET: No active session. Redirect to login screen.");
        Login(req, res);
        return;
    }

    GoHome(req, res);
});

// Handle post requests
App.post('/', function (req, res, next) {
    if (req.body["Login"]) {
        if (!req.body.username || !req.body.password) {
            // Bad uername or password
            req.session.destroy();
            console.log("Missing username or password. Redirect to login screen.");
            Login(req, res, "Bad username or password.");
            return;
        }
        else {
            // Try authentication
            console.log("Attempting authentication.");
            if (Authenticate(req.body.username, req.body.password)) {
                // 80's hacker movie: I'm in!
                console.log("Authentication succeeded.");
                req.session.user = req.body.username;

                // Handle rememberMe (this is hard-coded to on in the HTML per customer requirement, but support both modes properly anyway)
                req.session.rememberMe = false;
                if (req.body.rememberMe === "true") {
                    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;   // 30 days
                    req.session.rememberMe = true;
                    console.log("Persistent session cookie (30 Days).");
                } else {
                    req.session.cookie.expires = false;                     // User-Agent Session Duration
                    console.log("Temporary session cookie (until user-agent changes).");
                }
            } else {
                console.log("Authentication failed.");
                Login(req, res, "Access Denied.");
                return;
            }
        }
    }

    //If there is no session, go to the login page.
    if (!req.session.user) {
        console.log("POST: No active session. Redirect to login screen.");
        Login(req, res);
        return;
    }

    if (req.body['Logout']) {
        console.log("Logging out user: " + req.session.user);
        req.session.destroy();
        Login(req, res, "Logged out successfully.");
        return;
    }

    GoHome(req, res);
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