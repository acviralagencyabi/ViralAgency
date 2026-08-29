import { useEffect, useRef, type RefObject } from 'react';

const BASE = import.meta.env.BASE_URL || '/';
const HI = { dir: `${BASE}nova-frames/hi/`, count: 97 };
const LO = { dir: `${BASE}nova-frames/lo/`, count: 48 };
const POSTER = `${LO.dir}f_001.webp`;

interface ScrollVideoProps {
  /** Element whose scroll range drives the scrub. Falls back to the whole page. */
  targetRef?: RefObject<HTMLElement | null>;
}

/**
 * Scroll-scrubbed background rendered from a PRE-EXTRACTED image sequence
 * (self-hosted WebP frames in /public/nova-frames). There is NO video decoding
 * at runtime — the canvas simply cross-fades between the two preloaded frames
 * bracketing the scroll position, so motion is perfectly fluid and starts
 * essentially instantly (the first tiny frames load in a few hundred ms, and a
 * server-rendered <img> shows frame 1 immediately). Nothing ever plays on its
 * own; the animation only advances with the scroll.
 */
export default function ScrollVideo({ targetRef }: ScrollVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedRef = useRef(0);
  const countRef = useRef(0);

  // ---- Progressive image preload (binary-subdivision order) ----
  useEffect(() => {
    let cancelled = false;
    // Small viewport → the light set (fewer, smaller frames): reliable across
    // devices where `pointer: coarse` alone can be flaky.
    const useLo =
      window.innerWidth < 820 ||
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(pointer: coarse)').matches;
    const set = useLo ? LO : HI;
    const N = set.count;
    countRef.current = N;
    framesRef.current = new Array(N).fill(null);
    const url = (i: number) => `${set.dir}f_${String(i + 1).padStart(3, '0')}.webp`;

    // Request order: 0, N-1, middle, quarters … so the whole timeline is
    // covered coarsely almost immediately, then refines.
    const order: number[] = [];
    const seen = new Set<number>();
    const push = (i: number) => {
      if (i >= 0 && i < N && !seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    };
    push(0);
    push(N - 1);
    let level: [number, number][] = [[0, N - 1]];
    while (order.length < N && level.length) {
      const next: [number, number][] = [];
      for (const [a, b] of level) {
        const m = (a + b) >> 1;
        push(m);
        next.push([a, m], [m, b]);
      }
      level = next;
    }
    for (let i = 0; i < N; i++) push(i);

    const imgs: HTMLImageElement[] = [];
    order.forEach((i) => {
      const img = new Image();
      img.decoding = 'async';
      const done = () => {
        if (cancelled) return;
        if (!framesRef.current[i]) {
          framesRef.current[i] = img;
          loadedRef.current++;
        }
      };
      img.src = url(i);
      if (img.decode) {
        img.decode().then(done).catch(() => {
          if (img.complete && img.naturalWidth) done();
          else img.addEventListener('load', done, { once: true });
        });
      } else {
        img.addEventListener('load', done, { once: true });
      }
      imgs.push(img);
    });

    return () => {
      cancelled = true;
      imgs.forEach((im) => {
        im.onload = null;
        im.src = '';
      });
      framesRef.current = [];
      loadedRef.current = 0;
    };
  }, []);

  // ---- Render loop ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let smoothed = 0;
    let lastTime = performance.now();
    let shown = false;
    let lastIdx = -1;
    let lastLoaded = -1;

    // Cached scroll geometry — no layout reads inside the loop
    let rangeTop = 0;
    let range = 1;
    const measure = () => {
      const el = targetRef?.current;
      if (el) {
        let top = 0;
        let node: HTMLElement | null = el;
        while (node) {
          top += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        rangeTop = top;
        range = Math.max(1, el.offsetHeight - window.innerHeight);
      } else {
        rangeTop = 0;
        range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      }
    };

    const resizeCanvas = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      lastIdx = -1; // force redraw at the new resolution
    };
    const onResize = () => {
      resizeCanvas();
      measure();
    };
    resizeCanvas();
    measure();
    window.addEventListener('resize', onResize);

    let ro: ResizeObserver | null = null;
    if (targetRef?.current && 'ResizeObserver' in window) {
      ro = new ResizeObserver(measure);
      ro.observe(targetRef.current);
    }
    window.addEventListener('load', measure);

    const drawCover = (img: HTMLImageElement, alpha: number) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || 1280;
      const ih = img.naturalHeight || 720;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    // Nearest already-loaded frame to index i (so something always draws while
    // the sequence is still filling in).
    const nearest = (i: number): HTMLImageElement | null => {
      const frames = framesRef.current;
      const N = countRef.current;
      if (frames[i]) return frames[i];
      for (let d = 1; d < N; d++) {
        if (frames[i - d]) return frames[i - d]!;
        if (frames[i + d]) return frames[i + d]!;
      }
      return null;
    };

    const tick = (now: number) => {
      const dt = Math.min(100, now - lastTime);
      lastTime = now;

      const targetP = Math.min(1, Math.max(0, (window.scrollY - rangeTop) / range));
      smoothed += (targetP - smoothed) * (1 - Math.exp(-dt / 140));

      const N = countRef.current;
      if (N >= 2 && loadedRef.current >= 1) {
        const idx = smoothed * (N - 1);
        // Redraw on perceptible move, or when a new frame finished loading
        // (so late frames refine the image).
        if (Math.abs(idx - lastIdx) > 0.002 || loadedRef.current !== lastLoaded) {
          lastIdx = idx;
          lastLoaded = loadedRef.current;
          const i0 = Math.floor(idx);
          const i1 = Math.min(N - 1, i0 + 1);
          const frac = idx - i0;
          const f0 = nearest(i0);
          const f1 = nearest(i1);
          if (f0) {
            if (!shown) {
              shown = true;
              canvas.style.opacity = '1';
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawCover(f0, 1);
            if (f1 && f1 !== f0 && frac > 0.001) drawCover(f1, frac);
            ctx.globalAlpha = 1;
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', measure);
      ro?.disconnect();
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
      {/* Server-rendered first frame → an instant background before hydration. */}
      <img
        src={POSTER}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300"
      />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
