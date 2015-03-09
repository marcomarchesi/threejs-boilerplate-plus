/**
* PathCamera.js
* @author Marco Marchesi
*
*/

function PathCamera(camera,curve){

  var SEGMENTS = 200;
  var RADIUS_SEGMENTS = 1;

  this.normal = new THREE.Vector3( 0, 1, 0 );
  this.binormal = new THREE.Vector3(0,0,0);
  this.path = new THREE.TubeGeometry(curve, SEGMENTS, 2, RADIUS_SEGMENTS, true); //true == closed curve
  this.lookAhead = false;
  this.scale = 1.0;
  this.offset = 0;
  this.parent = new THREE.Object3D();
  scene.add(this.parent);
  this.pathCamera = camera;
  this.parent.add( this.pathCamera );


  this.update = function(step,side){
      // Try Animate Camera Along Spline
      var LOOP = 1000;
      var t = (step % LOOP)/LOOP;

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

      // var side = new  THREE.Vector3();
      // side.crossVectors(direction,position);
      // console.log(side);

      position.add( this.normal.clone().multiplyScalar( this.offset ) ); 

      this.pathCamera.position.copy( position );

      // Camera Orientation 1 - default look at
      // pathCamera.lookAt( lookAt );

      // console.log(this.parent.position);

      // Using arclength for stablization in look ahead.
      var lookAt = this.path.parameters.path.getPointAt( ( t + 30 / this.path.parameters.path.getLength() ) % 1 ).multiplyScalar( this.scale );
      // Camera Orientation 2 - up orientation via normal
      if (!this.lookAhead)
        lookAt.copy( position ).add( direction );

      
      this.pathCamera.matrix.lookAt(this.pathCamera.position, lookAt, this.normal);
      this.pathCamera.rotation.setFromRotationMatrix( this.pathCamera.matrix, this.pathCamera.rotation.order );

    };


    //start configuration
    this.update(0);

};

PathCamera.prototype.takeStep = function(start, end, time) {

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

                      self.update(pos.x);
                    } )
                    .onComplete(function() {
                      //TODO
                    })
                    .start();
};

