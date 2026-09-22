<script lang="ts">
  import { onMount } from 'svelte';
  import {
    readTheme,
    watchTheme,
    colorToRgb01,
    type ThemeColors,
  } from './theme';

  let canvas: HTMLCanvasElement;

  const VERT = `
    attribute vec2 p;
    void main() { gl_Position = vec4(p, 0.0, 1.0); }
  `;

  const FRAG = `
    precision highp float;
    uniform vec2  u_res;
    uniform float u_time;
    uniform float u_dark;          // 0 = light, 1 = dark
    uniform vec3  u_bg;            // базовый фон
    uniform vec3  u_primary;       // акцент
    uniform vec3  u_accent;        // второй акцент
    uniform vec3  u_muted;         // третий

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 3; i++) {
        v += a * noise(p);
        p *= 2.0; a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res.xy;
      vec2 p  = uv * 3.0;
      float t = u_time * 0.15;

      float n = fbm(p + t * 0.5);
      float m = fbm(p * 1.5 - t);

      float strength = mix(0.55, 1.0, u_dark);

      vec3 col = mix(u_bg, u_primary, smoothstep(0.3, 0.7, n) * strength);
      col = mix(col, u_accent, smoothstep(0.5, 0.9, m) * strength);
      col = mix(col, u_muted,  smoothstep(0.6, 0.95, fbm(p * 0.7)) * 0.35 * strength);

      // виньетка
      vec2 v = uv - 0.5;
      col *= 1.0 - dot(v, v) * 0.8;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function createShader(
    gl: WebGLRenderingContext,
    type: number,
    src: string,
  ): WebGLShader | null {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  onMount(() => {
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'default',
    }) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      return;
    }

    const prog = gl.createProgram();
    if (!prog) {
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uDark = gl.getUniformLocation(prog, 'u_dark');
    const uBg = gl.getUniformLocation(prog, 'u_bg');
    const uPrimary = gl.getUniformLocation(prog, 'u_primary');
    const uAccent = gl.getUniformLocation(prog, 'u_accent');
    const uMuted = gl.getUniformLocation(prog, 'u_muted');

    let theme: ThemeColors = readTheme();

    function pushTheme() {
      const [br, bgc, bb] = colorToRgb01(theme.bg);
      const [pr, pg, pb] = colorToRgb01(theme.primary);
      const [ar, ag, ab] = colorToRgb01(theme.muted);
      const [mr, mg, mb] = colorToRgb01(theme.border);
      gl.uniform1f(uDark, theme.isDark ? 1 : 0);
      gl.uniform3f(uBg, br, bgc, bb);
      gl.uniform3f(uPrimary, pr, pg, pb);
      gl.uniform3f(uAccent, ar, ag, ab);
      gl.uniform3f(uMuted, mr, mg, mb);
    }
    pushTheme();

    // рендерим в пониженном разрешении — шум всё равно «мягкий»
    const RES_SCALE = 0.6;

    let raf = 0;
    let running = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    running = !reduced.matches;

    const start = performance.now();

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * RES_SCALE;
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    }

    function render(t: number) {
      resize();
      gl.uniform1f(uTime, (t - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (running) raf = requestAnimationFrame(render);
    }

    if (running) {
      raf = requestAnimationFrame(render);
    } else {
      resize();
      render(performance.now());
    }

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (reduced.matches) {
        resize();
        render(performance.now());
      } else {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    const unwatch = watchTheme((c) => {
      theme = c;
      pushTheme();
      if (!running) {
        resize();
        render(performance.now());
      }
    });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      unwatch();
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (buf) gl.deleteBuffer(buf);
    };
  });
</script>

<canvas bind:this={canvas} class="bg"></canvas>

<style>
  .bg {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    display: block;
    pointer-events: none;
    /* canvas низкого разрешения растянется — сглаживание делает браузер */
    image-rendering: auto;
  }
</style>