function GenerateParticle(){

  this.material;
  this.particles;

  this.geometry = new THREE.Geometry();

  for ( i = 0; i < 2000; i ++ ) {

    var vertex = new THREE.Vector3();
    vertex.x = Math.random() * 20 - 10;
    vertex.y = Math.random() * 20 - 10;
    vertex.z = Math.random() * 20 - 10;

    this.geometry.vertices.push( vertex );

  }

    this.color = 0xffffff;
    this.size  = Math.random()*0.05;

    this.material = new THREE.PointCloudMaterial( { size: this.size, color: this.color, fog:true} );
    this.particles = new THREE.PointCloud( this.geometry, this.material );

    this.particles.rotation.y = Math.PI;
    this.particles.rotation.y = Math.random() * 6;
    this.particles.rotation.z = Math.random() * 6;

    return this.particles;
};  

GenerateParticle.prototype.update = function(scene,dt){

      for ( i = 0; i < scene.children.length; i ++ ) {
        var object = scene.children[ i ];
        if ( object instanceof THREE.PointCloud ) {
          object.rotation.y = dt/100 * ( i < 4 ? i + 1 : - ( i + 1 ) );
        }
    }
};


  