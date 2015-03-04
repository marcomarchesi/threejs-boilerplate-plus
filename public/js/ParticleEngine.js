/* Particle Engine
by Marco Marchesi
*/

function ParticleEngine(){

  this.material;
  this.particles;
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

    this.material = new THREE.PointCloudMaterial( {fog:true,transparent:true,opacity:0.1,map: THREE.ImageUtils.loadTexture('/textures/rain.png')} );
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
  if (this.enabled){
      for ( i = 0; i < scene.children.length; i ++ ) {
        var object = scene.children[ i ];
        if ( object instanceof THREE.PointCloud ) {
          object.rotation.y = dt/100 * Math.random() * ( i < 4 ? i + 1 : - ( i + 1 ) );
        }
    }
  }
};


  