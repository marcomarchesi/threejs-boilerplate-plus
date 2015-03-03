/* threejs-boilerplate-plus
*/

// var libovr = require("node-ovrsdk");

var express = require('express');
var chalk = require('chalk');
var fs = require('fs');
var app = express();
var port = 8080;

app.use(express.static(__dirname + '/public')).listen(port);


// libovr.ovr_Initialize();
// var hmd = libovr.ovrHmd_Create(0);
// var desc = new libovr.ovrHmdDesc;
// libovr.ovrHmd_GetDesc(hmd, desc.ref());
// libovr.ovrHmd_StartSensor(hmd, ovrSensorCap_Orientation, ovrSensorCap_Orientation);

// setInterval(function() {
//     var ss = libovr.ovrHmd_GetSensorState(hmd, libovr.ovr_GetTimeInSeconds());
//     var pose = ss.Predicted.Pose.Orientation;
//     console.log(pose.x);
// }, 10);


// app.listen(port);
console.log("listening port " + port);

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
});
