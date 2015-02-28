// TestShader.js

testVertexShader = 
[
  "varying vec3 vNormal;",
  "void main()",
  "{",
  "    vNormal = normal;",
  "    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);",
  "} "
].join("\n");

testFragmentShader = 
[
"varying vec3 vNormal;",
"void main() {",
"     vec3 light = vec3(0.5,0.2,1.0);",
"     light = normalize(light);",
"     float dProd = max(0.0, dot(vNormal, light));",
"     gl_FragColor = vec4(dProd, dProd, dProd, 1.0);",
"}"
].join("\n");


function CelShaderEngine(){

  this.testMaterial = new THREE.ShaderMaterial({
    vertexShader:   testVertexShader,
    fragmentShader: testFragmentShader
  });
  // this.testGeometry = new THREE.Geometry();
  // this.testTexture  = null;
  // this.testMesh = new THREE.Mesh();
};


