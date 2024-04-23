export default `
varying vec2 vUv;
varying vec3 vEye;
varying vec3 vNormal;

void main(){
  vUv = uv;
  vEye = normalize((modelViewMatrix * vec4( position, 1.0 )).xyz);
  // vNormal = normalize(normalMatrix * normal);
  vNormal = normalize(normal);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`