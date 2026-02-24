uniform float uTime;
uniform sampler2D uPerlinTexture;
uniform vec2 uUvOffset; 
uniform vec2 uUvScale;    

varying vec2 vUv;

vec2 rotate2D(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  mat2 m = mat2(c, -s, s, c);
  return m * v;
}

void main() {
  vec3 newPosition = position;

  // Twist uses offset + scale
  vec2 twistUv = vec2(0.5, uv.y * 0.23 - uTime * 0.007) + uUvOffset * 0.35;
  twistUv *= uUvScale;
  float twistPerlin = texture(uPerlinTexture, twistUv).r;
  float angle = twistPerlin * 17.0;
  newPosition.xz = rotate2D(newPosition.xz, angle);

  // Wind also offset
  float windNoise = texture(
    uPerlinTexture,
    vec2(0.5 + uUvOffset.x * 0.6, uTime * 0.009 + uUvOffset.y * 0.2)
  ).r;

  float wind = 1.6 + windNoise * 2.2;
  vec2 windOffset = vec2(
    wind * pow(uv.y, 1.85) * 0.65,
    0.0
  );

  newPosition.xz += windOffset;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  vUv = uv;
}