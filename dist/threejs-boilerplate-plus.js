var express = require('express');
var chalk = require('chalk');
var fs = require('fs');
var app = express();
var port = 8080;

app.use(express.static(__dirname + '/public'));


app.listen(port);
console.log("listening port " + port);

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
});
