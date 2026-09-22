<script lang="ts">
  import { onMount } from 'svelte';
  import { readTheme, watchTheme, colorToRgb01, type ThemeColors } from './theme';

  let canvas: HTMLCanvasElement;

  // Оригинальный VERTEX шейдер (передаем uv во фрагментный)
  const VERT = `
    attribute vec2 p;
    varying vec2 v_uv;
    void main() {
      v_uv = p * 0.5 + 0.5;
      gl_Position = vec4(p, 0.0, 1.0);
    }
  `;

  // ПОЛНОСТЬЮ ОРИГИНАЛЬНЫЙ FRAGMENT шейдер (с fbm и hash на dot)
  const FRAG = `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    //u_res удален, так как мы используем varying v_uv
    uniform vec3 u_bg, u_primary, u_accent, u_muted;

    float hash(vec2 p){
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i),                 hash(i + vec2(1.,0.)), u.x),
                 mix(hash(i + vec2(0.,1.)),   hash(i + vec2(1.,1.)), u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0.5 * noise(p);
      v += 0.25 * noise(p * 2.0);
      return v;
    }

    void main(){
      vec2 uv = v_uv; // Используем предрассчитанный varying uv
      vec2 p  = uv * 3.0;
      float t = u_time * 0.12;

      float n = fbm(p + t * 0.5);
      float m = fbm(p * 1.4 - t);

      vec3 col = mix(u_bg, u_primary, smoothstep(0.30, 0.80, n) * 0.65);
      col = mix(col, u_accent, smoothstep(0.50, 0.92, m) * 0.45);

      float veil = noise(p * 0.7 + t * 0.3);
      col = mix(col, u_muted, smoothstep(0.55, 1.0, veil) * 0.25);

      vec2 v = uv - 0.5;
      col *= 1.0 - dot(v, v) * 0.5;
      col = mix(u_bg, col, 0.80);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function createShader(gl: WebGLRenderingContext, type: number, src: string) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  onMount(() => {
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    }) as WebGLRenderingContext | null;

    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
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
      gl.STATIC_DRAW
    );

    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = {
      // u_res больше не нужен в шейдере
      time: gl.getUniformLocation(prog, 'u_time'),
      bg: gl.getUniformLocation(prog, 'u_bg'),
      p: gl.getUniformLocation(prog, 'u_primary'),
      a: gl.getUniformLocation(prog, 'u_accent'),
      m: gl.getUniformLocation(prog, 'u_muted'),
    };

    function pushTheme(t: ThemeColors) {
      const [br, bg, bb] = colorToRgb01(t.bg);
      const [pr, pg, pb] = colorToRgb01(t.primary);
      const [ar, ag, ab] = colorToRgb01(t.muted);
      const [mr, mg, mb] = colorToRgb01(t.border);
      gl.uniform3f(U.bg, br, bg, bb);
      gl.uniform3f(U.p, pr, pg, pb);
      gl.uniform3f(U.a, ar, ag, ab);
      gl.uniform3f(U.m, mr, mg, mb);
    }

    const SCALE = 0.35;
    const DPR_CAP = 1.5;
    const TARGET_DT = 1000 / 24; // 24 FPS

    pushTheme(readTheme());

    let raf = 0;
    let running = false;
    let last = 0;
    let visible = true;
    const start = performance.now();

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP) * SCALE;
      const w = Math.max(1, (canvas.clientWidth * dpr) | 0);
      const h = Math.max(1, (canvas.clientHeight * dpr) | 0);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        // gl.uniform2f(U.res, w, h); // Больше не нужно
      }
    }

    function renderFrame() {
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function frame(t: number) {
      raf = requestAnimationFrame(frame);
      if (t - last < TARGET_DT) return;
      last = t;

      gl.uniform1f(U.time, (t - start) / 1000);
      renderFrame();
    }

    function startRender() {
      if (running || !visible) return;
      running = true;
      resize();
      raf = requestAnimationFrame(frame);
    }

    function stopRender() {
      running = false;
      cancelAnimationFrame(raf);
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Оптимизация JS: используем ResizeObserver на сам canvas
    const ro = new ResizeObserver(() => {
      resize();
      if (!running) renderFrame();
    });
    ro.observe(canvas);

    if (reduced) {
      resize();
      renderFrame();
    } else {
      startRender();
    }

    const onVis = () => {
      if (document.hidden) stopRender();
      else if (!reduced) startRender();
      else {
        resize();
        renderFrame();
      }
    };
    document.addEventListener('visibilitychange', onVis);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (!visible) stopRender();
        else if (!reduced) startRender();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const unwatch = watchTheme((c) => {
      pushTheme(c);
      if (!running) renderFrame();
    });

    return () => {
      stopRender();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      unwatch();

      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (buf) gl.deleteBuffer(buf);

      // Важная оптимизация: принудительное закрытие контекста GPU при уничтожении компонента
      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) loseContext.loseContext();
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
  }
</style>