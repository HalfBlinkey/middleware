var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var crypto = require('crypto');

//this function uses crypto to incode our password
function hashPW(pwd){
  return crypto.createHash('sha256').update(pwd).
         digest('base64').toString();
}

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set options for our sessions
app.use(session({
  secret: 'TheSECRET',
  resave: false,
  saveUninitialized: true,
}));

app.get('/restricted', function(req, res){
  //if the req.session.user property exist send the user through
  if (req.session.user) {
    res.send('<h2>'+ req.session.success + '</h2>' +
             '<p>You have entered the restricted section<p><br>' +
             ' <a href="/logout">logout</a>');
  } else {
    //else redirect them to a login page
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
});

//logout route calls destroy() on the session to terminate
//authentication
app.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/login');
  });
});

//login route diplsays a basic login to get credentials
app.get('/login', function(req, res){
  var response = '<form method="POST">' +
    'Username: <input type="text" name="username"><br>' +
    'Password: <input type="password" name="password"><br>' +
    '<input type="submit" value="Submit"></form>';
  if(req.session.user){
    res.redirect('/restricted');
  }else if(req.session.error){
    response +='<h2>' + req.session.error + '<h2>';
  }
  res.type('html');
  res.send(response);
});

app.post('/login', function(req, res){
  var user = {name:req.body.username, password:hashPW("myPass")};
  if (user.password === hashPW(req.body.password.toString())) {
    req.session.regenerate(function(){
      req.session.user = user;
      req.session.success = 'Authenticated as ' + user.name;
      res.redirect('/restricted');
    });
  } else {
    req.session.regenerate(function(){
      req.session.error = 'Authentication failed.';
    });
    res.redirect('/login');
  }
});

app.listen(3000);
