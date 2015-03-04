/* PathCamera.js
*/

function PathCamera(camera,curve){

  var SEGMENTS = 200;
  var RADIUS_SEGMENTS = 1;

  this.isTweening = false;

  this.normal = new THREE.Vector3( 0, 1, 0 );


  this.path = new THREE.TubeGeometry(curve, SEGMENTS, 2, RADIUS_SEGMENTS, true); //true == closed curve
  this.pathMesh = new THREE.Mesh(this.path,
                new THREE.LineBasicMaterial( { color : 0xff0000 } ));
  this.lookAhead = false;
  this.scale = 1.0;
  this.offset = 0;
  this.parent = new THREE.Object3D();
  this.parent.position.y = 1;
  scene.add(this.parent);
  this.parent.add(this.pathMesh);
  this.pathCamera = camera;
  this.parent.add( this.pathCamera );

  this.update = function(t){
      // Try Animate Camera Along Spline

      var position = this.path.parameters.path.getPointAt( t );
      position.multiplyScalar( this.scale );

      // interpolation
      var segments = this.path.tangents.length;
      var pickt = t * segments;
      var pick = Math.floor( pickt );
      var pickNext = ( pick + 1 ) % segments;

      var direction = this.path.parameters.path.getTangentAt( t );

      this.normal = new THREE.Vector3( 0, 1, 0 );
      // We move on a offset on its binormal

      // console.log(position);
      // position.add( this.normal.clone().multiplyScalar( this.offset ) ); 
      // console.log(position);
      // console.log(position);
      // // this.pathCamera.position.copy( position );
      // console.log(position);
      // Camera Orientation 1 - default look at
      // pathCamera.lookAt( lookAt );

      // Using arclength for stablization in look ahead.
      var lookAt = this.path.parameters.path.getPointAt( ( t + 30 / this.path.parameters.path.getLength() ) % 1 ).multiplyScalar( this.scale );
      // Camera Orientation 2 - up orientation via normal
      if (!this.lookAhead)
        lookAt.copy( position ).add( direction );
      this.pathCamera.matrix.lookAt(this.pathCamera.position, lookAt, this.normal);
      this.pathCamera.rotation.setFromRotationMatrix( this.pathCamera.matrix, this.pathCamera.rotation.order );

    };

};



PathCamera.prototype.takeStepForward = function(start, end, time) {

        var pos = {x:start};
        var target = {x:end};

        var self = this;

        if (!self.isTweening) {
            var tween = new TWEEN.Tween(pos )
                    .to(target, time )
                    .easing(TWEEN.Easing.Linear.None)
                    .onStart( function() {
                        self.isTweening = true;
                    })
                    .onUpdate( function () {
                      var LOOP = 20;
                      var t = (pos.x % LOOP)/LOOP;
                      self.update(t);
                    } )
                    .onComplete(function() {

                        self.isTweening = false;
                    })
                    .start();
        }
};

