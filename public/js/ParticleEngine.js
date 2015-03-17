/* 
* Particle Engine
* @author Marco Marchesi
*
*/

function ParticleEngine(){

  this.material;
  this.particles;
  this.texture;
  this.enabled = false;

  this.geometry = new THREE.Geometry();

  for ( i = 0; i < 300; i ++ ) {

    var vertex = new THREE.Vector3();
    vertex.x = Math.random() * 20 - 10;
    vertex.y = Math.random() * 20 - 10;
    vertex.z = Math.random() * 20 - 10;

    this.geometry.vertices.push( vertex );

  }

    this.color = 0xaaaaaa;
    this.size  = Math.random()*0.05;
    var img = THREE.ImageUtils.loadTexture('textures/rain.png');
    

    // var textureImage = new Image();
    // textureImage.src = '/textures/rain.png';

    //  var imgWidth = imgHeight = 32;
    //  var mapCanvas = document.createElement( 'canvas' );
    //  mapCanvas.width = mapCanvas.height = 32;

    //  this.texture = new THREE.Texture( mapCanvas );

    //  textureImage.onload = function() {

    //      // document.body.appendChild( mapCanvas );
    //      var ctx = mapCanvas.getContext( '2d' );
    //      ctx.rotate( Math.PI / 2 );
    //      ctx.drawImage( textureImage, 0, 0, imgWidth, imgHeight );

    //      texture.needsUpdate = true;
    // }

    this.material = new THREE.PointCloudMaterial( {fog:true,transparent:true,opacity:0.1,map: img} );
    this.particles = new THREE.PointCloud( this.geometry, this.material );

    this.particles.rotation.y = Math.random() * 6;
    this.particles.rotation.z = Math.random() * 6;
  
};

ParticleEngine.prototype.start = function(){
  this.enabled = true;
  scene.add(this.particles);
};

ParticleEngine.prototype.stop = function(){
  this.enabled = false;
};

ParticleEngine.prototype.update = function(dt){

  this.particles.rotation.y += Math.PI/10;
  if (this.enabled){
      for ( i = 0; i < scene.children.length; i ++ ) {
        var object = scene.children[ i ];
        if ( object instanceof THREE.PointCloud ) {
          object.rotation.y = dt/100 * Math.random() * ( i < 4 ? i + 1 : - ( i + 1 ) );
        }
    }
  }
};
  