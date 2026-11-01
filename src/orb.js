/* AI mark: Space UI "Orb Bloop" (spaceui.one/r/components-orb-bloop), its WGSL shader ported to WebGL2.
   One shared GL context renders every .orb on the page into that orb's own 2D canvas, so ten orbs still cost one context.
   Rest = the bloop's "listen" breathing; .orb.think = its "think" state (five nodes + corner dots) while an answer streams.
   Only change from source: the thinking dots sit top-left (thought-bubble) rather than bottom-left. No WebGL2 → the CSS conic orb stays. Reduced motion → one still frame. */
(() => {
  const gl = document.createElement('canvas').getContext('webgl2', { alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: false });
  if (!gl) return;
  const VS = `#version 300 es
out vec2 vUv;
void main(){ vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2); vUv = vec2(p.x, 1.0 - p.y); gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }`;
  const FS = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 outColor;
uniform float time, micLevel, think, stateTs, wcStrength, noiseScale, colorSpeed, reactivity, halo;
uniform vec4 avgMag, cumulativeAudio;
uniform vec3 cMain, cLow, cMid, cHigh;
const float E = 2.71828182846, PI = 3.141592653589793, MAIN_R = 0.49;
float scaled(float a, float b, float x){ return clamp((x - a) / (b - a), 0.0, 1.0); }
float spring(float t, float d){ return 1.0 - exp(-E * 2.0 * t) * cos((1.0 - d) * 115.0 * t); }
float fixedSpring(float t, float d){ float s = mix(spring(t, d), 1.0, scaled(0.0, 1.0, t)); return s * (1.0 - t) + t; }
float silkySmooth(float t, float k){ return atan(k * sin((t - 0.5) * PI)) / atan(k) * 0.5 + 0.5; }
float opSmoothUnion(float d1, float d2, float k){ k = max(k, 1e-6); float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0); return mix(d2, d1, h) - k * h * (1.0 - h); }
vec4 permute(vec4 x){ return mod((x * 34.0 + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade3(vec3 t){ return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
float cnoise(vec3 P){
  vec3 Pi0 = mod(floor(P), 289.0), Pi1 = mod(floor(P) + 1.0, 289.0);
  vec3 Pf0 = fract(P), Pf1 = Pf0 - 1.0;
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x), iy = vec4(Pi0.yy, Pi1.yy);
  vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + vec4(Pi0.z)), ixy1 = permute(ixy + vec4(Pi1.z));
  vec4 gx0 = ixy0 / 7.0, gy0 = fract(floor(gx0) / 7.0) - 0.5; gx0 = fract(gx0);
  vec4 gz0 = 0.5 - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0, gy1 = fract(floor(gx1) / 7.0) - 0.5; gx1 = fract(gx1);
  vec4 gz1 = 0.5 - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x), g100 = vec3(gx0.y, gy0.y, gz0.y), g010 = vec3(gx0.z, gy0.z, gz0.z), g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x), g101 = vec3(gx1.y, gy1.y, gz1.y), g011 = vec3(gx1.z, gy1.z, gz1.z), g111 = vec3(gx1.w, gy1.w, gz1.w);
  vec4 n0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= n0.x; g010 *= n0.y; g100 *= n0.z; g110 *= n0.w;
  vec4 n1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= n1.x; g011 *= n1.y; g101 *= n1.z; g111 *= n1.w;
  vec4 nz = mix(
    vec4(dot(g000, Pf0), dot(g100, vec3(Pf1.x, Pf0.yz)), dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z)), dot(g110, vec3(Pf1.xy, Pf0.z))),
    vec4(dot(g001, vec3(Pf0.xy, Pf1.z)), dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z)), dot(g011, vec3(Pf0.x, Pf1.yz)), dot(g111, Pf1)),
    fade3(Pf0).z);
  vec2 nyz = mix(nz.xy, nz.zw, fade3(Pf0).y);
  return 2.2 * mix(nyz.x, nyz.y, fade3(Pf0).x);
}
float watercolorTex(vec2 uv, float z){ return cnoise(vec3(uv * noiseScale, z)) * 0.65 + cnoise(vec3(uv * noiseScale * 2.0 + vec2(5.2, 1.7), z + 1.1)) * 0.35; }
float texDisp(vec2 uv, float z, float m){ float r = watercolorTex(uv, z) * 0.5 + 0.5, g = watercolorTex(vec2(uv.x, 1.0 - uv.y), z + 2.3) * 0.5 + 0.5; return mix(r - 0.5, g - 0.5, m); }
float hash21(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 4.1414))) * 43758.5453); }
float noise2(vec2 p){ vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  float r = mix(mix(hash21(i), hash21(i + vec2(1, 0)), u.x), mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), u.x), u.y); return r * r; }
float fbm(vec2 x){ float v = 0.0, a = 0.5; mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 4; i++){ v += a * noise2(x); x = rot * x * 2.0 + vec2(100.0); a *= 0.5; } return v; }
vec3 burn(vec3 b, vec3 l, float o){ return max(b + l - 1.0, 0.0) * o + b * (1.0 - o); }
float listenDist(vec2 st, float dur, float t, float mic){
  float r = 0.38 + mic * 0.05 + (sin(t) * 0.5 + 0.5) * 0.03;
  r *= 1.0 - (1.0 - fixedSpring(scaled(0.0, 3.0, dur), 0.9)) * 0.25;
  return length(st) - r;
}
float thinkDist(vec2 st, float dur, float t){
  float r = 0.38 + (sin(t) * 0.5 + 0.5) * 0.03;
  r *= 1.0 - (1.0 - fixedSpring(scaled(0.0, 1.4, dur), 0.9)) * 0.25;
  float base = length(st) - r, deploy = smoothstep(0.35, 1.1, dur), d = 1000.0;
  float ring = MAIN_R * 0.45 * deploy - (sin(PI * 4.0 + t * 3.0 - silkySmooth(t / 4.0, 2.0) * PI) * 0.5 + 0.5) * MAIN_R * 0.1 * deploy;
  float nodeR = mix(r, MAIN_R * 0.5, deploy);
  for (int i = 0; i < 5; i++){ float a = -((float(i) + 0.5) / 5.0) * PI * 2.0 + t / 3.0; d = opSmoothUnion(d, length(st - vec2(cos(a), sin(a)) * ring) - nodeR, 0.035); }
  float dotR = 0.06 * smoothstep(0.5, 1.1, dur);
  if (dotR > 0.001){
    for (int i = 0; i < 5; i++){
      float da = ((float(i) + 0.5) / 5.0) * PI * 2.0;
      float ringR = (sin(PI * 4.0 + da * 2.0 + t * 0.4 * PI) * 0.5 + 0.5) * dotR * 0.3;
      d = opSmoothUnion(d, length(st - vec2(-MAIN_R, -MAIN_R) * 0.8 - vec2(cos(da + t), sin(da + t)) * ringR) - dotR * 0.8, 0.01);
    }
  }
  return mix(base, d, deploy);
}
vec3 watercolor(vec2 st){
  float t = time * 0.85 * colorSpeed; vec4 cum = cumulativeAudio, au = avgMag; float amp = clamp(wcStrength, 0.0, 1.0) * reactivity * (2.0 / 3.0);
  vec2 uv = st * (1.0 / 0.8) + 0.5; uv.y = 1.0 - uv.y;
  float nx = cnoise(vec3(uv + vec2(0.0, 74.8572), (t + cum.x * 0.05) * 0.3)), ny = cnoise(vec3(uv + vec2(203.91282, 10.0), (t + cum.z * 0.05) * 0.3));
  uv += vec2(nx * 2.0, ny) * 0.19 * amp;
  uv += (cnoise(vec3(uv * 18.0 + vec2(344.91282, 0.0), t * 0.3)) + cnoise(vec3(uv * 39.6 + vec2(723.937, 0.0), t * 0.4)) * 0.5) * 0.01 * amp;
  uv.y -= 0.09;
  float m = (sin(t + cum.w * 2.0) + 1.0) * 0.5;
  vec2 tu = uv; float tex0 = texDisp(tu, 0.0, m) * 0.08 * amp;
  tu += vec2(63.861 + cum.x * 0.05, 368.937); float tex1 = texDisp(tu, 0.0, m) * 0.08 * amp;
  tu += vec2(453.163 - cum.z * 0.1, 1649.808 + cum.y * 0.1); float tex3 = texDisp(tu, 0.0, m) * 0.08 * amp;
  uv += vec2(tex0);
  vec2 sn = uv * 1.25;
  vec2 q = vec2(fbm(sn * 0.5 + 0.075 * (t + cum.w * 0.175)), fbm(sn * 0.5 + 0.075 * (t + cum.x * 0.136)));
  vec2 r = vec2(fbm(sn + q + vec2(0.3, 9.2) + 0.15 * (t + cum.y * 0.234)), fbm(sn + q + vec2(8.3, 0.8) + 0.126 * (t + cum.z * 0.165)));
  float f = fbm(sn + r - q), full = pow((f + 0.6 * f * f + 0.7 * f + 0.5) * 0.5, 0.55);
  vec3 so = vec3(cum.x * 0.15, -cum.y * 0.5, cum.z * 1.5);
  vec2 u1 = uv + vec2((full - 0.5) * 1.2 + tex0, 0.025 + tex0);
  float s1 = noise2(u1 * 2.0 + vec2(sin(so.x * 0.25), t * 0.5 + so.x)) * 2.0;
  float a1 = pow(smoothstep(s1 - 1.8, s1 + 1.8, (u1.y - 0.5) * (5.0 - au.x * 0.05) + 0.5), 0.8);
  vec2 u2 = uv + vec2((full - 0.5) * 0.85 + tex1, 0.025 + tex1);
  float s2 = noise2(u2 * 4.0 + vec2(sin(so.y * 0.15) * 2.4 + 293.0, t + so.y * 0.5)) * 2.0;
  float a2 = pow(smoothstep(s2 - (0.9 + au.y * 0.4), s2 + (0.9 + au.y * 0.8), (u2.y - 0.6) * (5.0 - au.y * 0.75) + 0.5), 0.9);
  vec2 u3 = uv + vec2((full - 0.5) * 1.1 + tex3, tex3);
  float s3 = noise2(u3 * 6.0 + vec2(sin(so.z * 0.1) * 2.4 + 153.0, t * 1.2 + so.z * 0.8)) * 2.0;
  float a3 = smoothstep(s3 - 0.7, s3 + 0.7, (u3.y - 0.9) * 6.0 + 0.5);
  vec3 col = burn(cMain, cLow, 1.0 - a1);
  col = burn(col, mix(cMain, cMid, 1.0 - a2), a1);
  return mix(col, mix(cMain, cHigh, 1.0 - a3), a1 * a2);
}
void main(){
  vec2 st = vUv - 0.5;
  float dur = max(0.0, time - stateTs);
  float dist = think > 0.5 ? thinkDist(st, dur, time) : listenDist(st, dur, time, micLevel);
  float alpha = smoothstep(0.0075 / max(halo, 0.1), 0.0, dist);
  outColor = vec4(watercolor(st) * alpha, alpha);
}`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  let prog;
  try { prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog)); }
  catch (e) { console.warn('Orb Bloop: falling back to the CSS orb', e); return; }
  gl.useProgram(prog); gl.bindVertexArray(gl.createVertexArray());
  const U = {}; ['time', 'micLevel', 'think', 'stateTs', 'wcStrength', 'noiseScale', 'colorSpeed', 'reactivity', 'halo', 'avgMag', 'cumulativeAudio', 'cMain', 'cLow', 'cMid', 'cHigh'].forEach(n => U[n] = gl.getUniformLocation(prog, n));
  /* the bloop's own GREYSCALE palette, verbatim */
  const rgb = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16) / 255);
  /* Tuned to the client's AI Blob spec (glowIntensity/noiseScale/glints/halo/reactivity/colorSpeed/hoverTilt)
     since that React/shadcn component can't drop into this vanilla-JS static site and the shader above
     already is this project's AI blob — these constants carry the spec's numbers over to it. */
  const BLOB = { glowIntensity: 0.65, noiseScale: 4.6, glints: 1.37, halo: 0.96, reactivity: 3, colorSpeed: 1.44, hoverTilt: 2 };
  gl.uniform3fv(U.cMain, rgb('#D7D7D7')); gl.uniform3fv(U.cLow, rgb('#303030')); gl.uniform3fv(U.cMid, rgb('#989898'));
  gl.uniform3fv(U.cHigh, rgb('#FFFFFF').map(c => Math.min(1, c * BLOB.glints)));
  gl.uniform1f(U.wcStrength, BLOB.glowIntensity);
  gl.uniform1f(U.noiseScale, BLOB.noiseScale); gl.uniform1f(U.colorSpeed, BLOB.colorSpeed);
  gl.uniform1f(U.reactivity, BLOB.reactivity); gl.uniform1f(U.halo, BLOB.halo);

  const RM = matchMedia('(prefers-reduced-motion: reduce)'), T0 = performance.now(), ORBS = new WeakMap();
  let last = 0, prev = T0;
  function tick(now) {
    requestAnimationFrame(tick);
    if (document.hidden || now - last < (RM.matches ? 500 : 33)) return;
    last = now;
    const time = RM.matches ? 6 : (now - T0) / 1000, dt = Math.min(now - prev, 100) / 1000, dpr = Math.min(devicePixelRatio || 1, 2);
    prev = now;
    for (const el of document.querySelectorAll('.orb')) {
      const r = el.getBoundingClientRect();
      if (!r.width || r.bottom < 0 || r.top > innerHeight) continue;
      let o = ORBS.get(el);
      if (!o) { const c = document.createElement('canvas'); el.appendChild(c); el.classList.add('gl'); o = { c, x: c.getContext('2d'), think: false, at: RM.matches ? -10 : time, avg: [0, 0, 0, 0], cum: [0, 0, 0, 0] }; ORBS.set(el, o); }
      const think = el.classList.contains('think');
      if (think !== o.think) { o.think = think; o.at = RM.matches ? -10 : time; }
      /* the bloop's demo-mode audio, so it breathes without a microphone */
      const st = time - o.at; let mic, avg;
      if (think) { mic = 0.16 + (Math.sin(time * 3.6) * 0.5 + 0.5) * 0.26; avg = [mic, mic * 0.45, mic * 0.85, mic * 0.35]; }
      else { mic = 0.2 + (Math.sin(st * 3.0) * 0.5 + 0.5) * 0.35 + Math.sin(st * 8.2) * 0.15 + 0.15; mic *= 0.4; avg = [mic, mic * 0.65, mic * 0.85, mic * 0.45]; }
      for (let i = 0; i < 4; i++) { o.avg[i] += (avg[i] - o.avg[i]) * 0.55; o.cum[i] += o.avg[i] * 60 * dt * 0.25; }
      const px = Math.max(8, Math.round(r.width * dpr));
      if (o.c.width !== px) o.c.width = o.c.height = px;
      if (gl.canvas.width < px) gl.canvas.width = gl.canvas.height = px;
      gl.viewport(0, 0, px, px); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U.time, time); gl.uniform1f(U.micLevel, mic); gl.uniform1f(U.think, think ? 1 : 0); gl.uniform1f(U.stateTs, o.at);
      gl.uniform4fv(U.avgMag, o.avg); gl.uniform4fv(U.cumulativeAudio, o.cum);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      o.x.clearRect(0, 0, px, px); o.x.drawImage(gl.canvas, 0, gl.canvas.height - px, px, px, 0, 0, px, px);
    }
  }
  requestAnimationFrame(tick);
})();
