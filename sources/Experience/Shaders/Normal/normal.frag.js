export default /* glsl */ `
// #define NORMAL
#define BOTTOM_COLOR vec3(0.137255,0.04,0.11765)
#define TOP_COLOR vec3(1.0, 1.0, 0.39216)

uniform float opacity;
uniform sampler2D tMatcap;

varying vec3 vViewPosition;
varying vec3 vPosition;

#include <packing>

vec3 normalToColor(vec3 normal) {
  // float height = normal.y * 0.5 + 0.5; // 将法线的 Y 分量映射到 0 到 1 的范围
  float height = normal.y;
  vec3 baseColor = mix(BOTTOM_COLOR, TOP_COLOR, height);

  return baseColor;
}

void main() {
  // vec3 fdx = dFdx( vViewPosition );
  // vec3 fdy = dFdy( vViewPosition );

  vec3 fdx = dFdx( vPosition );
  vec3 fdy = dFdy( vPosition );

  vec3 normal = normalize( cross( fdx, fdy ) );

  // 根据地形的高度和三角面的法线向量，将地形中的平坦区域不渲染
  if(normal.y > 0.8 && vPosition.y <0.01){
    discard;
  }

  vec3 baseColor = normalToColor(normal);

  // vec3 packNormalRGB = packNormalToRGB( normal );
  
  float heightZ = normal.z ;
  float heightY = normal.y ;
  float heightX = normal.x ;
  float height = 0.1*heightX + 0.2*heightZ + heightY * 0.7;

  vec3 texColor = texture2D(tMatcap, vec2(height,0.5)).rgb;


  gl_FragColor =vec4(pow(texColor,vec3(1./2.2)), 1.0);
  // gl_FragColor =vec4(texColor, 1.0);
}
`;