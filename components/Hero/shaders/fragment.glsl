uniform float uTime;
uniform sampler2D uPerlinTexture;
uniform vec2 uUvOffset;   
uniform vec2 uUvScale;    

uniform float uStrength;

varying vec2 vUv;

void main() {
  vec2 smokeUv = vUv * uUvScale + uUvOffset;
  smokeUv.x *= 0.88;
  smokeUv.y *= 0.42;
  smokeUv.y -= uTime * 0.021;

  float smoke = texture(uPerlinTexture, smokeUv).r;
  smoke = smoothstep(0.16, 1.0, smoke);

  smoke *= smoothstep(0.0, 0.32, vUv.x);    
  smoke *= smoothstep(1.0, 0.65, vUv.x);     
  smoke *= smoothstep(0.0, 0.28, vUv.y);    
  smoke *= smoothstep(1.0, 0.52, vUv.y);     

  vec3 smokeColor = vec3(0.09, 0.09, 0.105);     
  float fireIntensity = pow(1.0 - vUv.y, 4.1) * 0.26;   
  vec3 fireTint = vec3(0.96, 0.32, 0.09);

  vec3 finalColor = mix(smokeColor, fireTint, fireIntensity);

 gl_FragColor = vec4(finalColor, smoke * 0.41 * uStrength);  

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}