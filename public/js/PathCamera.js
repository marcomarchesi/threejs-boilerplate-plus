/* PathCamera.js
*/

function PathCamera(scene,camera){

  var SEGMENTS = 200;
  var RADIUS_SEGMENTS = 1;

  this.targetRotation = 0;

  this.binormal = new THREE.Vector3();
  this.normal = new THREE.Vector3();


  var sampleClosedSpline = new THREE.ClosedSplineCurve3( [
  new THREE.Vector3( -10, 0, 10 ),
  new THREE.Vector3( -5, 0, 5 ),
  new THREE.Vector3( 0, 0, 0 ),
  new THREE.Vector3( 5, 0, 5 ),
  new THREE.Vector3( 10, 0, 10 )
] );

  this.path = new THREE.TubeGeometry(sampleClosedSpline, SEGMENTS, 2, RADIUS_SEGMENTS, true); //true == closed curve
  this.pathMesh = new THREE.Mesh(this.path,
                new THREE.LineBasicMaterial( { color : 0xff0000 } ));
  this.animation = true;
  this.lookAhead = false;
  this.scale = 0.5;
  this.offset = 0;
  this.pathMesh.scale.set( this.scale, this.scale, this.scale );
  this.parent = new THREE.Object3D();
  this.parent.position.y = 1;
  this.parent.rotation.x = Math.PI;     //needed to right orientation
  this.scene = scene;
  this.scene.add(this.parent);
  this.parent.add(this.pathMesh);
  this.pathCamera = camera;
  this.parent.add( this.pathCamera );
 
};

PathCamera.prototype.update = function(){
      // Try Animate Camera Along Spline
      var time = Date.now();
      var looptime = 20 * 1000;
      var t = ( time % looptime ) / looptime;

      var pos = this.path.parameters.path.getPointAt( t );
      // console.log(pos);
      pos.multiplyScalar( this.scale );

      // interpolation
      var segments = this.path.tangents.length;
      var pickt = t * segments;
      var pick = Math.floor( pickt );
      var pickNext = ( pick + 1 ) % segments;

      this.binormal.subVectors( this.path.binormals[ pickNext ], this.path.binormals[ pick ] );
      this.binormal.multiplyScalar( pickt - pick ).add( this.path.binormals[ pick ] );


      var dir = this.path.parameters.path.getTangentAt( t );

      this.normal.copy( this.binormal ).cross( dir );
      // We move on a offset on its binormal
      pos.add( this.normal.clone().multiplyScalar( this.offset ) );

      this.pathCamera.position.copy( pos );
      // Camera Orientation 1 - default look at
      // pathCamera.lookAt( lookAt );

      // Using arclength for stablization in look ahead.
      var lookAt = this.path.parameters.path.getPointAt( ( t + 30 / this.path.parameters.path.getLength() ) % 1 ).multiplyScalar( this.scale );

      // Camera Orientation 2 - up orientation via normal
      if (!this.lookAhead)
        lookAt.copy( pos ).add( dir );
      this.pathCamera.matrix.lookAt(this.pathCamera.position, lookAt, this.normal);
      this.pathCamera.rotation.setFromRotationMatrix( this.pathCamera.matrix, this.pathCamera.rotation.order );
      this.parent.rotation.y += ( this.targetRotation - this.parent.rotation.y ) * 0.05;
};