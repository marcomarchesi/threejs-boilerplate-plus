/*
Copyright 2014 Lars Ivar Hatledal

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

   @modified by Pierfrancesco Soffritti
*/

THREE.DK2Controls = function(camera) {

  this.camera = camera;
  this.ws;
  this.sensorData;
  this.lastId = -1;

  this.moveForward = false;
  this.moveBackward = false;
  this.moveLeft = false;
  this.moveRight = false;
  this.moveUp = false;
  this.moveDown = false;
  
  this.controller = new THREE.Object3D();
  
  this.headPos = new THREE.Vector3();
  this.headQuat = new THREE.Quaternion();
  
  this.translationSpeed  = 5;
  
  this.wasd = {
    left: false,
    up: false,
    right: false,
    down: false
  };
  
  var that = this;
  var ws = new WebSocket("ws://localhost:8888/ws");
  ws.onopen = function () {
    console.log("### Connected ####");
  };

  ws.onmessage = function (evt) {
    var message = evt.data;
    try {
      that.sensorData = JSON.parse(message);
    } catch (err) {
      console.log(message);
    }
  };

  ws.onclose = function () {
    console.log("### Closed ####");
  };
  
  
  this.onKeyDown = function (event) {
    switch (event.keyCode) {
      
      case 87: /*W*/
        this.wasd.up = true;
        this.moveForward = true;
        break;

      case 83: /*S*/
        this.wasd.down = true;
        this.moveBackward = true;
        break;

      case 68: /*D*/
        this.wasd.right = true;
        break;

      case 65: /*A*/
          this.wasd.left = true;
          break;

      case 82: /*R*/
          this.moveUp = true; 
          break;

      case 70: /*F*/
          this.moveDown = true;
          break;

    }
  };
  
  // moveForward and moveBackward are used to move the pathCamera (see render method in index)
  this.onKeyUp = function (event) {
    switch (event.keyCode) {

      case 87: /*W*/
        this.wasd.up = false;
        this.moveForward = false;
        break;

      case 83: /*S*/
        this.wasd.down = false;
        this.moveBackward = false;
        break;

      case 68: /*D*/
        this.wasd.right = false;
        break;

      case 65: /*A*/
          this.wasd.left = false;
          break;

      case 82: /*R*/
          this.moveUp = false; 
          break;

      case 70: /*F*/
          this.moveDown = false;
          break;
    }
  };


  this.update = function(delta) {

    if (this.sensorData) {
      var id = this.sensorData[0];
      if (id > this.lastId) {
        this.headPos.set(this.sensorData[1]*10, this.sensorData[2]*10, this.sensorData[3]*10);
        this.headQuat.set(this.sensorData[4], this.sensorData[5], this.sensorData[6], this.sensorData[7]);
          
        this.camera.setRotationFromQuaternion(this.headQuat);
        this.controller.setRotationFromMatrix(this.camera.matrix);        
      }

      this.lastId = id;
    }
      
    // update position
    if (this.wasd.up)
      this.controller.translateZ(-this.translationSpeed * delta);

    if (this.wasd.down)
      this.controller.translateZ(this.translationSpeed * delta);

    if (this.wasd.right)
      this.controller.translateX(this.translationSpeed * delta);

    if (this.wasd.left)
      this.controller.translateX(-this.translationSpeed * delta);

    if (  this.moveUp)
      this.controller.translateY( this.translationSpeed * delta );
    if (this.moveDown)
      this.controller.translateY( - this.translationSpeed * delta );
    
    // update the position of the camera ONLY if pathEnabled == false. Otherwise the camare will follow the path.
    if(!pathEnabled) {
      this.camera.position.addVectors(this.controller.position, this.headPos);
    }

    if (this.camera.position.y < -10) {
        this.camera.position.y = -10;
      }

      if (ws) {
        if (ws.readyState === 1) {
          ws.send("get\n");
        }
      } 
  };
  
  window.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
  window.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );
  
  function bind( scope, fn ) {

    return function () {

      fn.apply( scope, arguments );

    };

  };
  
};