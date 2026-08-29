/* =========================================================================
   REAL GOES VIRAL — Immersive effects engine
   Lenis smooth scroll + GSAP ScrollTrigger, bridged.

   Every effect is progressive enhancement:
   - prefers-reduced-motion  → nothing runs, content stays visible
   - coarse pointers (touch) → only cheap opacity effects, no transforms
     (mobile GPU budget is tight on this site, see global.css notes)
   - no JS                   → no initial hidden states are set from CSS here
   ========================================================================= */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse =
  window.matchMedia('(hover: none)').matches ||
  window.matchMedia('(pointer: coarse)').matches;

export function initImmersive(): void {
  if (prefersReduced) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis + GSAP bridge ---------- */
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anchor links scroll through Lenis
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener(
      'click',
      (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        e.stopPropagation();
        lenis.scrollTo(target as HTMLElement, { offset: -60 });
      },
      true
    );
  });

  /* ---------- Scroll progress bar ---------- */
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      bar.style.transform = `scaleX(${self.progress})`;
    },
  });

  /* ---------- Marquee reacts to scroll velocity ---------- */
  // The base CSS keyframe animation is replaced by a ticker-driven position:
  // speed and direction follow the Lenis scroll velocity, so the wordmark
  // accelerates while you scroll and reverses when you scroll back up.
  const marqueeTrack = document.querySelector<HTMLElement>('.marquee-track');
  if (marqueeTrack && !coarse) {
    marqueeTrack.classList.add('is-js');
    const BASE_PCT_PER_S = 50 / 30; // same pace as the original 30s CSS loop
    let pos = 0;
    let timeScale = 1;
    let targetScale = 1;
    let dir = 1;

    lenis.on('scroll', (e: { velocity: number }) => {
      const v = e.velocity;
      if (Math.abs(v) > 0.4) dir = v > 0 ? 1 : -1;
      targetScale = dir * (1 + Math.min(Math.abs(v) * 0.09, 3.2));
    });

    gsap.ticker.add((_t, deltaMS) => {
      // Ease back toward cruise speed when scrolling stops
      targetScale += (dir - targetScale) * 0.03;
      timeScale += (targetScale - timeScale) * 0.1;
      pos -= BASE_PCT_PER_S * (deltaMS / 1000) * timeScale;
      pos = gsap.utils.wrap(-50, 0, pos);
      gsap.set(marqueeTrack, { xPercent: pos });
    });
  }

  /* ---------- Hero multi-layer parallax exit ---------- */
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (hero && !coarse) {
    const layer = (sel: string, vars: gsap.TweenVars) => {
      const el = hero.querySelector(sel);
      if (!el) return;
      gsap.to(el, {
        ...vars,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.4,
        },
      });
    };
    layer('[data-hero-meta]', { y: -60, autoAlpha: 0.15 });
    layer('[data-hero-title]', { yPercent: 24, scale: 0.97 });
    layer('[data-hero-bottom]', { y: 90, autoAlpha: 0.1 });
  }

  /* ---------- Hero 3D: la parola si moltiplica nello spazio ---------- */
  // Eco della headline che si propagano in profondità (condivisione a catena),
  // palcoscenico che ruota seguendo il mouse, drift 3D continuo quando fermo.
  const viralStack = document.querySelector<HTMLElement>('[data-viral-stack]');
  const viralFloat = document.querySelector<HTMLElement>('[data-viral-float]');
  if (viralStack && viralFloat && hero) {
    const echoes = gsap.utils.toArray<HTMLElement>('[data-viral-echo]');
    // Ordine di propagazione: dal fronte verso il fondo
    echoes.sort((a, b) => (a.className > b.className ? 1 : -1));

    if (coarse) {
      // Touch: niente rotazioni per-frame, solo la catena che appare
      gsap.from(echoes, {
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        delay: 1.7,
        ease: 'power2.out',
      });
    } else {
      // Base tilt (specchia il transform CSS, così GSAP parte da valori noti)
      const BASE_RX = 7;
      const BASE_RY = -8;
      // rotation: 0 azzera il residuo 2D della decomposizione del matrix CSS
      gsap.set(viralStack, { rotation: 0, rotationX: BASE_RX, rotationY: BASE_RY });

      // Le eco si propagano all'indietro dopo il reveal della parola
      gsap.from(echoes, {
        z: 0,
        opacity: 0,
        duration: 1.0,
        stagger: 0.09,
        delay: 1.9,
        ease: 'power2.out',
      });

      // Drift 3D continuo (sul wrapper interno: non litiga col mouse)
      gsap.to(viralFloat, {
        rotationY: 3.5,
        rotationX: -2.5,
        duration: 7,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 3.2,
      });

      // Il palcoscenico segue il mouse (attorno al tilt di base)
      const rxTo = gsap.quickTo(viralStack, 'rotationX', { duration: 0.9, ease: 'power3.out' });
      const ryTo = gsap.quickTo(viralStack, 'rotationY', { duration: 0.9, ease: 'power3.out' });
      hero.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = hero.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rxTo(BASE_RX + -py * 9);
        ryTo(BASE_RY + px * 14);
      });
      hero.addEventListener('mouseleave', () => {
        rxTo(BASE_RX);
        ryTo(BASE_RY);
      });
    }

    // Le keyword della definizione si evidenziano in sequenza
    const kws = gsap.utils.toArray<HTMLElement>('.hero-def-text .kw');
    if (kws.length) {
      gsap.fromTo(
        kws,
        { backgroundSize: '0% 0.45em' },
        {
          backgroundSize: '100% 0.45em',
          duration: 0.55,
          stagger: 0.3,
          delay: 2.5,
          ease: 'power2.out',
        }
      );
    }
  }

  /* ---------- Generic parallax drift: [data-parallax="0.2"] ---------- */
  if (!coarse) {
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const depth = parseFloat(el.dataset.parallax || '0');
      if (!depth) return;
      const travel = depth * 160; // px of total drift across the traverse
      gsap.fromTo(
        el,
        { y: travel / 2 },
        {
          y: -travel / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        }
      );
    });
  }

  /* ---------- Scrub text: words light up while you read ---------- */
  // Splits .scrub-text into word spans (whitespace preserved as text nodes,
  // so `whitespace-pre-line` paragraphs keep their line breaks).
  document.querySelectorAll<HTMLElement>('.scrub-text').forEach((el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    let n: Node | null;
    while ((n = walker.nextNode())) {
      if (((n as Text).textContent || '').trim()) nodes.push(n as Text);
    }
    const words: HTMLElement[] = [];
    nodes.forEach((node) => {
      const parts = (node.textContent || '').split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement('span');
          span.className = 'sw';
          span.textContent = part;
          frag.appendChild(span);
          words.push(span);
        }
      });
      node.parentNode?.replaceChild(frag, node);
    });
    if (!words.length) return;
    gsap.fromTo(
      words,
      { opacity: 0.16 },
      {
        opacity: 1,
        stagger: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          end: 'top 38%',
          scrub: 0.5,
        },
      }
    );
  });

  /* ---------- Portfolio dots: blossom-in entrance ---------- */
  // Animates clip-path + opacity only — never transform — so it can't fight
  // the CSS hover scale transition on .pf-card.
  const pfCards = gsap.utils.toArray<HTMLElement>('#portfolio-grid .pf-card');
  if (pfCards.length) {
    gsap.set(pfCards, { opacity: 0, clipPath: 'circle(12% at 50% 50%)' });
    gsap.to(pfCards, {
      opacity: 1,
      clipPath: 'circle(75% at 50% 50%)',
      duration: coarse ? 0.5 : 0.8,
      ease: 'power3.out',
      stagger: { each: 0.045, from: 'random' },
      scrollTrigger: {
        trigger: '#portfolio-grid',
        start: 'top 82%',
        once: true,
      },
      onComplete: () => gsap.set(pfCards, { clearProps: 'clipPath,opacity' }),
    });
  }

  /* ---------- Team cards: cinematic clip reveal ---------- */
  const teamGrid = document.querySelector<HTMLElement>('[data-team-grid]');
  if (teamGrid) {
    const cards = Array.from(teamGrid.children) as HTMLElement[];
    if (coarse) {
      gsap.set(cards, { opacity: 0 });
      gsap.to(cards, {
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: { trigger: teamGrid, start: 'top 82%', once: true },
      });
    } else {
      gsap.set(cards, { clipPath: 'inset(100% 0% 0% 0%)', y: 48 });
      gsap.to(cards, {
        clipPath: 'inset(0% 0% 0% 0%)',
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: teamGrid, start: 'top 80%', once: true },
        onComplete: () => gsap.set(cards, { clearProps: 'clipPath,transform' }),
      });
    }
  }

  /* ---------- CTA section: glow blob drifts with scroll ---------- */
  const cta = document.querySelector<HTMLElement>('.cta-section');
  if (cta && !coarse) {
    gsap.fromTo(
      cta,
      { '--glow-y': '-14%' },
      {
        '--glow-y': '16%',
        ease: 'none',
        scrollTrigger: {
          trigger: cta,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      }
    );
  }

  /* ---------- Magnetic buttons (all pill buttons) ---------- */
  if (!coarse) {
    const magneticSel =
      '.btn-primary, .btn-outline, .btn-pill, .btn-ghost, .btn-rainbow, .btn-viral, .magnetic-btn';
    document.querySelectorAll<HTMLElement>(magneticSel).forEach((btn) => {
      // .is-magnetic drops `transform` from the CSS transition list so the
      // per-frame GSAP updates aren't re-eased (rubber-band lag) by CSS.
      btn.classList.add('is-magnetic');
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
      btn.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        xTo((e.clientX - rect.left - rect.width / 2) * 0.25);
        yTo((e.clientY - rect.top - rect.height / 2) * 0.35);
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1.1, 0.4)' });
      });
    });
  }

  /* ---------- Button label roll (text flips up on hover) ---------- */
  if (!coarse) {
    const rollSel = '.btn-primary, .btn-outline, .btn-pill, .btn-ghost, .btn-viral, .btn-rainbow-inner';
    document.querySelectorAll<HTMLElement>(rollSel).forEach((el) => {
      const host = el.classList.contains('btn-rainbow-inner')
        ? el.closest('.btn-rainbow') || el
        : el;
      const textNode = Array.from(el.childNodes).find(
        (nd) => nd.nodeType === Node.TEXT_NODE && (nd.textContent || '').trim()
      );
      if (!textNode) return;
      const label = (textNode.textContent || '').trim();
      const roll = document.createElement('span');
      roll.className = 'roll';
      roll.innerHTML =
        `<span class="roll-a">${''}</span><span class="roll-b" aria-hidden="true"></span>`;
      (roll.children[0] as HTMLElement).textContent = label;
      (roll.children[1] as HTMLElement).textContent = label;
      el.replaceChild(roll, textNode);
      host.classList.add('btn-fx');
    });
  }

  /* ---------- 3D tilt + glare on [data-tilt] cards ---------- */
  if (!coarse) {
    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
      const glare = document.createElement('span');
      glare.className = 'tilt-glare';
      glare.setAttribute('aria-hidden', 'true');
      card.appendChild(glare);

      const rxTo = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power2.out' });
      const ryTo = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power2.out' });
      gsap.set(card, { transformPerspective: 800 });

      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rxTo(-py * 10);
        ryTo(px * 12);
        glare.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
        glare.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
        glare.style.opacity = '1';
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.9,
          ease: 'elastic.out(1, 0.45)',
        });
        glare.style.opacity = '0';
      });
    });
  }
}
