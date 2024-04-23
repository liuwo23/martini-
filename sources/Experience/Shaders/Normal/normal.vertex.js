export default `
uniform sampler2D tMatcap;

varying vec2 vUv;
varying vec3 vEye;
varying vec3 vNormal;

vec2 matcap(vec3 eye, vec3 normal) {
  vec3 reflected = reflect(eye, normal);
  float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
  return reflected.xy / m + 0.5;
}

void main() {
  vec2 mUv = matcap(vEye,vNormal);
  vec3 m1 = texture2D(tMatcap, mUv).rgb;

  gl_FragColor = vec4(m1, 1.0);
}`