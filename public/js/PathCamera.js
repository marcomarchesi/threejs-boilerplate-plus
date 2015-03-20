/**
* PathCamera.js
* @author Marco Marchesi
*
*/

function PathCamera(camera, curve) {

  var SEGMENTS = 200;
  var RADIUS_SEGMENTS = 1;

  this.normal = new THREE.Vector3( 0, 1, 0 );

  this.path = new THREE.TubeGeometry(curve, SEGMENTS, 2, RADIUS_SEGMENTS, true); //true == closed curve
  this.startPoint = curve.points[0];
  this.pathMesh = new THREE.Mesh(this.path, new THREE.LineBasicMaterial( { color : 0xff0000 } ));
  this.lookAhead = false;
  this.scale = 1.0;
  this.offset = 0;
  this.parent = new THREE.Object3D();
  this.parent.position.y = 1;
  scene.add(this.parent);
  this.parent.add(this.pathMesh);
  this.pathCamera = camera;
  this.pathCamera.position = this.startPoint;
  this.parent.add( this.pathCamera );

  this.update = function(step, oculusEnabled) {
      // Try Animate Camera Along Spline
      var LOOP = 1000;
      var t = (step % LOOP)/LOOP;
      //console.log(t);

      var position = this.path.parameters.path.getPointAt( t );
      //console.log(position);
      position.multiplyScalar( this.scale );

      // interpolation
      var segments = this.path.tangents.length;
      var pickt = t * segments;
      var pick = Math.floor( pickt );
      var pickNext = ( pick + 1 ) % segments;

      var direction = this.path.parameters.path.getTangentAt( t );

      this.normal = new THREE.Vector3( 0, 1, 0 );
      // We move on a offset on its binormal

      position.add( this.normal.clone().multiplyScalar( this.offset ) ); 
      this.pathCamera.position.copy( position );
      // Camera Orientation 1 - default look at
      // pathCamera.lookAt( lookAt );

      // Using arclength for stablization in look ahead.
      var lookAt = this.path.parameters.path.getPointAt( ( t + 30 / this.path.parameters.path.getLength() ) % 1 ).multiplyScalar( this.scale );
      // Camera Orientation 2 - up orientation via normal
      if (!this.lookAhead)
        lookAt.copy( position ).add( direction );

      // if oculusEnabled we don't have to do that beacuse the oculus controls (DK2Controls) will the the camere where to look at.
      if(!oculusEnabled) {
        this.pathCamera.matrix.lookAt(this.pathCamera.position, lookAt, this.normal);
        this.pathCamera.rotation.setFromRotationMatrix( this.pathCamera.matrix, this.pathCamera.rotation.order );
      }

    };

};

PathCamera.prototype.takeStep = function(start, end, time, oculusEnabled) {

        if(!pause) {

          var pos = {x:start};
          var target = {x:end};

          var self = this;

              var tween = new TWEEN.Tween(pos )
                      .to(target, time )
                      .easing(TWEEN.Easing.Circular.Out)
                      .onStart( function() {
                        //TODO
                      })
                      .onUpdate( function () {

                        self.update(pos.x, oculusEnabled);
                      } )
                      .onComplete(function() {
                        //TODO
                      })
                      .start();
        }
};