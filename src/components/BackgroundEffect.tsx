"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./BackgroundEffect.module.css";

type EffectType = "rain" | "stars" | "seascape" | "saturn";

export default function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [effect, setEffect] = useState<EffectType>("rain");

  useEffect(() => {
    document.documentElement.dataset.effect = effect;

    return () => {
      delete document.documentElement.dataset.effect;
    };
  }, [effect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    const vertexSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const rainSceneFragmentSource = `
      precision highp float;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform float uIntensity;

      #define S(a, b, t) smoothstep(a, b, t)
      vec3 N13(float p) {
        vec3 p3 = fract(vec3(p) * vec3(.1031,.11369,.13787));
        p3 += dot(p3, p3.yzx + 19.19);
        return fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
      }
      float N(float t) { return fract(sin(t*12345.564)*7658.76); }
      float Saw(float b, float t) { return S(0., b, t)*S(1., b, t); }
      vec2 DropLayer2(vec2 uv, float t) {
        vec2 UV = uv;
        uv.y += t*.75;
        vec2 a = vec2(6., 1.);
        vec2 grid = a*2.;
        vec2 id = floor(uv*grid);
        float colShift = N(id.x);
        uv.y += colShift;
        id = floor(uv*grid);
        vec3 n = N13(id.x*35.2+id.y*2376.1);
        vec2 st = fract(uv*grid)-vec2(.5, 0);
        float x = n.x-.5;
        float y = UV.y*20.;
        float wiggle = sin(y+sin(y));
        x += wiggle*(.5-abs(x))*(n.z-.5);
        x *= .7;
        float ti = fract(t+n.z);
        y = (Saw(.85, ti)-.5)*.9+.5;
        vec2 p = vec2(x, y);
        float d = length((st-p)*a.yx);
        float mainDrop = S(.4, .0, d);
        float r = sqrt(S(1., y, st.y));
        float cd = abs(st.x-x);
        float trail = S(.23*r, .15*r*r, cd);
        float trailFront = S(-.02, .02, st.y-y);
        trail *= trailFront*r*r;
        y = UV.y;
        float trail2 = S(.2*r, .0, cd);
        float droplets = max(0., (sin(y*(1.-y)*120.)-st.y))*trail2*trailFront*n.z;
        y = fract(y*10.)+(st.y-.5);
        float dd = length(st-vec2(x, y));
        droplets = S(.3, 0., dd);
        float m = mainDrop+droplets*r*trailFront;
        return vec2(m, trail);
      }
      float StaticDrops(vec2 uv, float t) {
        uv *= 40.;
        vec2 id = floor(uv);
        uv = fract(uv)-.5;
        vec3 n = N13(id.x*107.45+id.y*3543.654);
        vec2 p = (n.xy-.5)*.7;
        float d = length(uv-p);
        float fade = Saw(.025, fract(t+n.z));
        float c = S(.3, 0., d)*fract(n.z*10.)*fade;
        return c;
      }
      vec2 Drops(vec2 uv, float t, float l0, float l1, float l2) {
        float s = StaticDrops(uv, t)*l0;
        vec2 m1 = DropLayer2(uv, t)*l1;
        vec2 m2 = DropLayer2(uv*1.85, t)*l2;
        float c = s+m1.x+m2.x;
        c = S(.3, 1., c);
        return vec2(c, max(m1.y*l0, m2.y*l1));
      }
      vec4 rainDrops(vec2 fragCoord) {
        vec2 uv = (fragCoord.xy-.5*uResolution.xy) / uResolution.y;
        float T = uTime + 2.0;
        float t = T*.2;
        float rainAmount = clamp(.72*uIntensity, 0., 1.25);
        float staticDrops = S(-.5, 1., rainAmount)*2.;
        float layer1 = S(.25, .75, rainAmount);
        float layer2 = S(.0, .5, rainAmount);
        vec2 c = Drops(uv, t, staticDrops, layer1, layer2);
        vec2 e = vec2(.001, 0.);
        float cx = Drops(uv+e, t, staticDrops, layer1, layer2).x;
        float cy = Drops(uv+e.yx, t, staticDrops, layer1, layer2).x;
        vec2 n = vec2(cx-c.x, cy-c.x);
        return vec4(c, n);
      }
      vec3 cityScene(vec2 uv) {
        vec2 p = uv*2.-1.;
        p.x *= uResolution.x / max(uResolution.y, 1.);
        vec3 col = mix(vec3(.004, .009, .014), vec3(.016, .07, .095), S(.02, .88, uv.y));
        float amberBand = exp(-pow((uv.y-.53)*23., 2.));
        float amberCore = exp(-pow((uv.y-.53)*70., 2.));
        col += vec3(1., .34, .055)*amberBand*.95 + vec3(1., .74, .24)*amberCore*.62;
        float blueBand = exp(-pow((uv.y-.34)*8., 2.)) + exp(-pow((uv.y-.74)*8., 2.));
        col += vec3(.035, .25, .43)*blueBand*(.34+.66*sin(uv.x*42.+uTime*.12)*.5+.33);
        for (float i=0.; i<26.; i+=1.) {
          vec2 h = vec2(N(i*13.21), N(i*47.13));
          vec2 center = vec2(h.x, mix(.12, .88, h.y));
          float size = mix(.014, .055, N(i*77.7));
          vec2 q = (uv-center)/vec2(size, size*.58);
          float glow = exp(-dot(q,q));
          vec3 light = mix(vec3(.10,.55,1.), vec3(1.,.36,.08), step(.58, N(i*19.2)));
          col += light*glow*.42;
        }
        float vignette = 1.-dot(p*.58, p*.58);
        return col*clamp(vignette, .12, 1.);
      }
      vec3 blurredScene(vec2 uv, float blur) {
        vec2 radius = vec2(blur*.0017);
        vec3 col = cityScene(uv)*.28;
        col += cityScene(uv + radius*vec2(1.,0.))*.12;
        col += cityScene(uv - radius*vec2(1.,0.))*.12;
        col += cityScene(uv + radius*vec2(0.,1.))*.12;
        col += cityScene(uv - radius*vec2(0.,1.))*.12;
        col += cityScene(uv + radius*vec2(.8,.8))*.12;
        col += cityScene(uv - radius*vec2(.8,.8))*.12;
        return col;
      }
      void main() {
        vec2 UV = gl_FragCoord.xy/uResolution.xy;
        vec4 drop = rainDrops(gl_FragCoord.xy);
        vec2 c = drop.xy;
        vec2 n = drop.zw;
        float rainAmount = clamp(.72*uIntensity, 0., 1.25);
        float maxBlur = mix(3., 6., rainAmount);
        float minBlur = 2.;
        float focus = mix(maxBlur-c.y, minBlur, S(.1, .2, c.x));
        vec3 col = blurredScene(UV+n*1.85, focus);
        float t = (uTime+3.)*.5;
        float colFade = sin(t*.2)*.5+.5;
        col *= mix(vec3(1.), vec3(.8, .9, 1.3), colFade);
        float lightning = sin(t*sin(t*10.));
        lightning *= pow(max(0., sin(t+sin(t))), 10.);
        col *= 1.+lightning*.12;
        vec2 v = UV-.5;
        col *= 1.-dot(v, v);
        col += vec3(.7,.94,1.)*pow(c.x, 6.)*.08;
        gl_FragColor = vec4(col, 1.);
      }
    `;

    const starNestFragmentSource = `
      precision highp float;
      uniform vec2 uResolution;
      uniform float uTime;

      #define iterations 17
      #define formuparam 0.53
      #define volsteps 20
      #define stepsize 0.1
      #define zoom 0.800
      #define tile 0.850
      #define speed 0.010
      #define brightness 0.0015
      #define darkmatter 0.300
      #define distfading 0.730
      #define saturation 0.850

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy - 0.5;
        uv.y *= uResolution.y / uResolution.x;
        vec3 dir = vec3(uv * zoom, 1.0);
        float time = uTime * speed + 0.25;

        float a1 = 0.5;
        float a2 = 0.8;
        mat2 rot1 = mat2(cos(a1), sin(a1), -sin(a1), cos(a1));
        mat2 rot2 = mat2(cos(a2), sin(a2), -sin(a2), cos(a2));
        dir.xz *= rot1;
        dir.xy *= rot2;
        vec3 from = vec3(1.0, 0.5, 0.5);
        from += vec3(time * 2.0, time, -2.0);
        from.xz *= rot1;
        from.xy *= rot2;

        float s = 0.1;
        float fade = 1.0;
        vec3 v = vec3(0.0);
        for (int r = 0; r < volsteps; r++) {
          vec3 p = from + s * dir * 0.5;
          p = abs(vec3(tile) - mod(p, vec3(tile * 2.0)));
          float pa, a = pa = 0.0;
          for (int i = 0; i < iterations; i++) {
            p = abs(p) / dot(p, p) - formuparam;
            a += abs(length(p) - pa);
            pa = length(p);
          }
          float dm = max(0.0, darkmatter - a * a * 0.001);
          a *= a * a;
          if (r > 6) fade *= 1.0 - dm;
          v += fade;
          v += vec3(s, s * s, s * s * s * s) * a * brightness * fade;
          fade *= distfading;
          s += stepsize;
        }
        v = mix(vec3(length(v)), v, saturation);
        gl_FragColor = vec4(v * 0.01, 1.0);
      }
    `;

    const seascapeFragmentSource = `
      precision highp float;
      uniform vec2 uResolution;
      uniform float uTime;

      #define PI 3.141592654

      mat2 m2 = mat2(1.6, 1.2, -1.2, 1.6);

      float hash(float n) { return fract(sin(n) * 43758.5453); }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float n = i.x + i.y * 57.0;
        return mix(
          mix(hash(n), hash(n + 1.0), f.x),
          mix(hash(n + 57.0), hash(n + 58.0), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float f = 0.0;
        f += 0.5000 * noise(p); p = m2 * p;
        f += 0.2500 * noise(p); p = m2 * p;
        f += 0.1250 * noise(p); p = m2 * p;
        f += 0.0625 * noise(p);
        return f / 0.9375;
      }

      // Sea octave - smooth noise-based wave
      float sea_octave(vec2 uv, float choppy) {
        uv += noise(uv);
        vec2 wv = 1.0 - abs(sin(uv));
        vec2 swv = abs(cos(uv));
        wv = mix(wv, swv, wv);
        return pow(1.0 - pow(wv.x * wv.y, 0.65), choppy);
      }

      float sea(vec2 p, float t) {
        float freq = 0.16;
        float amp = 0.6;
        float choppy = 4.0;
        vec2 uv = p;
        float d = 0.0;
        float h = 0.0;
        for (int i = 0; i < 5; i++) {
          d = sea_octave((uv + t) * freq, choppy);
          d += sea_octave((uv - t) * freq, choppy);
          h += d * amp;
          uv *= m2;
          freq *= 1.9;
          amp *= 0.22;
          choppy = mix(choppy, 1.0, 0.2);
        }
        return h;
      }

      // Map function for ray marching
      float map(vec3 p, float t) {
        return p.y - sea(p.xz, t);
      }

      // Map with detail for normals
      float map_detailed(vec3 p, float t) {
        return p.y - sea(p.xz, t);
      }

      vec3 getNormal(vec3 p, float t) {
        vec3 n;
        n.y = map_detailed(p, t);
        n.x = map_detailed(vec3(p.x + 0.01, p.y, p.z), t) - n.y;
        n.z = map_detailed(vec3(p.x, p.y, p.z + 0.01), t) - n.y;
        n.y = 0.01;
        return normalize(n);
      }

      float diffuse(vec3 n, vec3 l, float p) {
        return pow(dot(n, l) * 0.4 + 0.6, p);
      }

      float specular(vec3 n, vec3 l, vec3 e, float s) {
        float nrm = (s + 8.0) / (PI * 8.0);
        return pow(max(dot(reflect(e, n), l), 0.0), s) * nrm;
      }

      vec3 getSkyColor(vec3 e) {
        e.y = max(e.y, 0.0);
        vec3 ret;
        ret.x = pow(1.0 - e.y, 2.0);
        ret.y = 1.0 - e.y;
        ret.z = 0.6 + (1.0 - e.y) * 0.4;
        return ret;
      }

      vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, float dist) {
        float fresnel = clamp(1.0 - dot(n, -eye), 0.0, 1.0);
        fresnel = pow(fresnel, 3.0) * 0.5;

        vec3 reflected = getSkyColor(reflect(eye, n));
        vec3 refracted = vec3(0.0, 0.06, 0.12) + diffuse(n, l, 80.0) * vec3(0.05, 0.15, 0.25) * 0.12;

        refracted += specular(n, l, eye, 60.0) * vec3(0.8, 0.9, 1.0);
        refracted += specular(n, l, eye, 30.0) * vec3(0.5, 0.6, 0.7) * 0.5;

        vec3 col = mix(refracted, reflected, fresnel);

        float atten = max(1.0 - dist * 0.004, 0.0);
        col += vec3(0.0, 0.08, 0.15) * (p.y - sea(p.xz, uTime)) * 0.4 * atten;

        return col;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        float aspect = uResolution.x / uResolution.y;
        vec2 p = (uv * 2.0 - 1.0) * vec2(aspect, 1.0);

        float time = uTime * 0.3;

        // Camera
        vec3 ang = vec3(0.0, 0.15, 0.0);
        vec3 ori = vec3(0.0, 3.5, 5.0);
        vec3 dir = normalize(vec3(p.xy, -1.5));

        // Ray march to sea
        vec3 p3 = ori + dir * 3.0;
        float dist = 0.0;
        float h = 0.0;
        float dh = 0.0;

        for (int i = 0; i < 80; i++) {
          h = map(p3, time);
          if (h < 0.01 || dist > 80.0) break;
          dist += h;
          p3 = ori + dir * dist;
        }

        vec3 lightDir = normalize(vec3(0.0, 1.0, 0.8));

        vec3 col = vec3(0.0);

        if (dist < 80.0) {
          vec3 n = getNormal(p3, time);
          col = getSeaColor(p3, n, lightDir, dir, dist);

          // Horizon fog
          col = mix(col, getSkyColor(dir), 1.0 - exp(-dist * dist * 0.0001));
        } else {
          col = getSkyColor(dir);
        }

        // Sun
        float sunDot = max(dot(dir, lightDir), 0.0);
        col += vec3(1.0, 0.9, 0.7) * pow(sunDot, 8.0) * 0.3;
        col += vec3(1.0, 0.85, 0.6) * pow(sunDot, 32.0) * 0.5;

        // Tone mapping
        col = pow(col, vec3(0.4545));
        col = clamp(col, 0.0, 1.0);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const saturnFragmentSource = `
      precision highp float;
      uniform vec2 uResolution;
      uniform float uTime;

      #define PI 3.141592654
      #define TAU (2.0*PI)
      #define RESOLUTION uResolution

      // HSV to RGB (WTFPL, sam hocevar)
      const vec4 hsv2rgb_K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 hsv2rgb(vec3 c) {
        vec3 p = abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www);
        return c.z * mix(hsv2rgb_K.xxx, clamp(p - hsv2rgb_K.xxx, 0.0, 1.0), c.y);
      }
      #define HSV2RGB(c) (c.z * mix(hsv2rgb_K.xxx, clamp(abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www) - hsv2rgb_K.xxx, 0.0, 1.0), c.y))

      // Sphere intersection (MIT, Inigo Quilez)
      vec2 raySphere2(vec3 ro, vec3 rd, vec4 sph) {
        vec3 oc = ro - sph.xyz;
        float b = dot(oc, rd);
        float c = dot(oc, oc) - sph.w*sph.w;
        float h = b*b - c;
        if(h < 0.0) return vec2(-1.0);
        h = sqrt(h);
        return vec2(-b - h, -b + h);
      }

      // tanh approximation (Claude Brezinski)
      float tanh_approx(float x) {
        float x2 = x*x;
        return clamp(x*(27.0 + x2)/(27.0+9.0*x2), -1.0, 1.0);
      }

      // Plane intersection (MIT, Inigo Quilez)
      float rayPlane(vec3 ro, vec3 rd, vec4 p) {
        return -(dot(ro,p.xyz)+p.w)/dot(rd,p.xyz);
      }

      const float far = 1E5;
      const vec3 sunDir = normalize(vec3(2.5, -2.0, 10.0));
      const float planetRadius = 425.0;
      const vec3 planetCenter = vec3(0.0, -1.05*planetRadius, 0.0);
      const vec4 planetDim = vec4(planetCenter, planetRadius);
      const vec4 surfaceDim = vec4(planetCenter, 0.95*planetRadius);
      const vec3 ringNor = normalize(vec3(-3.2, 1.0, 1.75));
      const vec4 ringDim = vec4(ringNor, -dot(ringNor, planetCenter));

      vec3 skyColor(vec3 ro, vec3 rd) {
        const vec3 sunCol = HSV2RGB(vec3(0.066, 0.66, 0.000025));
        float sf = 1.001 - dot(rd, sunDir);
        sf *= sf;
        vec3 col = vec3(0.0);
        col += sunCol / sf;
        return col;
      }

      vec3 skyPass(vec3 col, inout float hit, vec3 ro, vec3 rd) {
        if (far > hit) {
          return col;
        }
        hit = 1E5;
        col += skyColor(ro, rd);
        return col;
      }

      vec3 planetPass(vec3 col, inout float hit, vec3 ro, vec3 rd) {
        vec2 pi = raySphere2(ro, rd, planetDim);
        if (pi.x == -1.0) {
          return col;
        }
        if (pi.x > hit) {
          return col;
        }
        hit = pi.x;

        vec3 pos = ro + rd * pi.x;
        vec3 nor = normalize(pos - planetDim.xyz);
        float fre = 1.0 + dot(rd, nor);
        fre *= fre;
        vec3 refl = reflect(rd, nor);
        float rr = mix(1.0, 0.7, tanh_approx(0.0025*(pi.y - pi.x)));
        vec3 refr = refract(rd, nor, rr);

        vec2 pri = raySphere2(pos, refr, planetDim);
        vec2 sri = raySphere2(pos, refr, surfaceDim);
        vec3 rpos = pos + refr * pri.y;
        vec3 rnor = normalize(rpos - planetDim.xyz);
        vec3 rrefr = refract(refr, -rnor, rr);

        vec3 pcol = vec3(0.0);
        vec3 prefl = skyColor(pos, refl);
        vec3 prefr = skyColor(pos, rrefr);
        prefr = pow((prefr), vec3(1.25, 1.0, 0.75));
        pcol += prefl * fre;
        pcol += prefr * (1.0 - tanh_approx(0.004*(sri.y - sri.x)));

        float pt = tanh_approx(0.025*(pi.y - pi.x));
        col = mix(col, pcol, pt);
        return col;
      }

      vec3 ringsPass(vec3 col, inout float hit, vec3 ro, vec3 rd) {
        float pt = rayPlane(ro, rd, ringDim);
        if (pt < 0.0) {
          return col;
        }
        if (pt > hit) {
          return col;
        }

        vec3 pos = ro + rd * pt;
        vec3 nor = ringDim.xyz;
        vec2 sri = raySphere2(pos, sunDir, planetDim);
        vec3 spos = pos + sunDir * sri.x;
        vec3 snor = normalize(spos - planetDim.xyz);
        float sfre = 1.0 + dot(sunDir, snor);

        float r = length(pos - planetCenter);
        float rr = 1.0 * r;
        float ri0 = sin(.5 * rr);
        float ri1 = sin(.2 * rr);
        float ri2 = sin(.12 * rr);
        float ri3 = sin(.033 * rr - 2.0);
        float ri = smoothstep(-0.95, 0.75, ri0 * ri1 * ri2);
        ri = 0.5 * ri + 0.2 * ri3;
        ri *= 1.75;
        float sf = sri.x < 0.0 ? 1.0 : mix(0.05, 1.0, smoothstep(0.5, 1.0, sfre));
        float rdif = max(dot(nor, sunDir), 0.0);
        rdif = sqrt(rdif);
        vec3 rcol = hsv2rgb(vec3(0.066, 0.85 + 0.1 * ri0 * ri1, ri)) * sf * rdif;
        rcol *= smoothstep(550.0, 560.0, r) * smoothstep(860.0, 850.0, r);
        col += rcol;
        return col;
      }

      // Single-pass glow approximation of dblur
      vec3 glowApprox(vec3 col) {
        vec3 bright = max(col - vec3(0.02), vec3(0.0));
        return col + bright * bright * 3.0;
      }

      // ACES tone mapping (Matt Taylor)
      vec3 aces_approx(vec3 v) {
        v = max(v, 0.0);
        v *= 0.6;
        float a = 2.51;
        float b = 0.03;
        float c = 2.43;
        float d = 0.59;
        float e = 0.14;
        return clamp((v*(a*v+b))/(v*(c*v+d)+e), 0.0, 1.0);
      }

      vec3 render(vec3 ro, vec3 rd) {
        vec3 col = vec3(0.0);
        float hit = far;
        col = skyPass(col, hit, ro, rd);
        col = planetPass(col, hit, ro, rd);
        col = ringsPass(col, hit, ro, rd);
        return col;
      }

      void main() {
        vec2 q = gl_FragCoord.xy / uResolution.xy;
        vec2 p = -1.0 + 2.0 * q;
        p.x *= uResolution.x / uResolution.y;

        const vec3 ro = vec3(0.0, 0.0, -1000.0);
        const vec3 la = vec3(0.0, 0.0, 0.0);
        const vec3 up = normalize(vec3(0.0, 1.0, 0.0));

        vec3 ww = normalize(la - ro);
        vec3 uu = normalize(cross(up, ww));
        vec3 vv = cross(ww, uu);
        const float fov = 4.0;
        vec3 rd = normalize(-p.x * uu + p.y * vv + fov * ww);

        vec3 col = render(ro, rd);

        // Post-processing (bufferB + image combined)
        col -= 0.005 * vec3(2.0, 1.0, 0.0);
        col = aces_approx(col);
        col = glowApprox(col);
        col = sqrt(col);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    let program: WebGLProgram | null = null;
    const start = performance.now();
    const rainIntensity = 1.08;

    function compileShader(glContext: WebGLRenderingContext, type: number, source: string) {
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error("Shader compile error:", glContext.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }

    function createProgram(glContext: WebGLRenderingContext, fragmentSource: string) {
      const vertex = compileShader(glContext, glContext.VERTEX_SHADER, vertexSource);
      const fragment = compileShader(glContext, glContext.FRAGMENT_SHADER, fragmentSource);
      if (!vertex || !fragment) return null;
      const prog = glContext.createProgram();
      if (!prog) return null;
      glContext.attachShader(prog, vertex);
      glContext.attachShader(prog, fragment);
      glContext.linkProgram(prog);
      if (!glContext.getProgramParameter(prog, glContext.LINK_STATUS)) {
        console.error("Program link error:", glContext.getProgramInfoLog(prog));
        return null;
      }
      glContext.useProgram(prog);
      const buffer = glContext.createBuffer();
      glContext.bindBuffer(glContext.ARRAY_BUFFER, buffer);
      glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), glContext.STATIC_DRAW);
      const position = glContext.getAttribLocation(prog, "aPosition");
      glContext.enableVertexAttribArray(position);
      glContext.vertexAttribPointer(position, 2, glContext.FLOAT, false, 0, 0);
      return prog;
    }

    function resize() {
      const c = canvas;
      if (!c || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      c.style.width = window.innerWidth + "px";
      c.style.height = window.innerHeight + "px";
      gl.viewport(0, 0, c.width, c.height);
    }

    function getFragmentSource(): string {
      switch (effect) {
        case "rain": return rainSceneFragmentSource;
        case "stars": return starNestFragmentSource;
        case "seascape": return seascapeFragmentSource;
        case "saturn": return saturnFragmentSource;
      }
    }

    function render(now: number) {
      if (!gl || !canvas) return;

      if (program) {
        gl.deleteProgram(program);
        program = null;
      }

      const fragmentSource = getFragmentSource();
      program = createProgram(gl, fragmentSource);

      if (!program) {
        requestAnimationFrame(render);
        return;
      }

      resize();
      gl.useProgram(program);
      gl.uniform2f(gl.getUniformLocation(program, "uResolution"), canvas.width, canvas.height);
      gl.uniform1f(gl.getUniformLocation(program, "uTime"), (now - start) / 1000);

      if (effect === "rain") {
        gl.uniform1f(gl.getUniformLocation(program, "uIntensity"), rainIntensity);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }

    resize();
    requestAnimationFrame(render);

    window.addEventListener("resize", resize);

    return () => {
      if (program) gl.deleteProgram(program);
    };
  }, [effect]);

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.grain} />
      <button
        className={styles.toggleBtn}
        onClick={() => setEffect(e => e === "rain" ? "stars" : e === "stars" ? "seascape" : e === "seascape" ? "saturn" : "rain")}
        aria-label="Switch background scene"
      >
        {effect === "rain" ? "Stars" : effect === "stars" ? "Seascape" : effect === "seascape" ? "Saturn" : "Rain"}
      </button>
    </>
  );
}
