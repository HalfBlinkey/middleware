//a commonly usesd middlesware available in express is static, it allows you
//to serve static files directly from disk to client and supports js, css,
//images, and html files
var express = require('express');
var app = express();

//use the files absolute path to reference it in this module
app.use(express.static('./static'));
app.listen(3000);
