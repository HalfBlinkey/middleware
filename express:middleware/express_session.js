var express = require('express');

//require the middleware the cookie seesion
//the cookie-parser parses cookies form the request and stores and them in
//req.cookies property
//the optional secret parameter you can pass internally signs the cookie for
//recognition
var cookieParser = require('cookie-parser');

//cookie-session uses cookie-parser so you need to add the latter to
//your applicaion first
var cookieSession = require('cookie-session');
var app = express();
app.use(cookieParser());

app.use(cookieSession({secret: 'MAGICALEXPRESSKEY'}));

//when the session has been implemented its stored in an object called
//req.seesion
app.get('/library', function(req, res) {
  console.log(req.cookies);
  if(req.session.restricted) {
    res.send('You have been in the restricted section ' +
             req.session.restrictedCount + ' times.');
  }else {
    res.send('Welcome to the library.');
  }
});


app.get('/restricted', function(req, res) {
  //the session property is property thats been added on to our request object
  //via the cookies that we've instantiated for use in our express routes
  //we'll set its restricted value to true to bounce unwanted user back to our
  //homepage and add or increment the restrictedCount object
  }
  req.session.restricted = true;
  if(!req.session.restrictedCount){
    req.session.restrictedCount = 1;
  } else {
    req.session.restrictedCount += 1;
  }
  res.redirect('/library');
});
app.listen(80);
