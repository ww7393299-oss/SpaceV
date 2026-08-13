/* ============================================================
   spaceV — shared behavior
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.hamburger');
  const menu = document.querySelector('.mnav');
  if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('open'));

  /* ---- Wrap text for staggered scroll reveal ---- */
  document.querySelectorAll('[data-reveal="words"]').forEach((el) => {
    const text = el.textContent.trim();
    el.textContent = '';
    text.split(/\s+/).forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'reveal-word';
      span.textContent = word;
      span.style.transitionDelay = `${i * 45}ms`;
      el.appendChild(span);
      el.appendChild(document.createTextNode(' '));
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.reveal-word').forEach((w) => w.classList.add('in'));
          if (entry.target.classList.contains('reveal-line')) entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35, rootMargin: '0px 0px -8% 0px' }
  );
  document.querySelectorAll('[data-reveal="words"], .reveal-line').forEach((el) => io.observe(el));

  /* ---- Scroll-linked subtle tilt on 3D phones ---- */
  const phones = document.querySelectorAll('.phone3d[data-scroll-tilt]');
  if (phones.length) {
    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY;
        phones.forEach((p) => {
          const tilt = Math.sin(y / 400) * 8;
          p.style.setProperty('--tilt', `${tilt}deg`);
        });
      },
      { passive: true }
    );
  }

  /* ---- Auto-init the global space backdrop if present ---- */
  if (document.getElementById('space-bg')) initSpace('space-bg');
});

/* ============================================================
   GLOBAL SPACE BACKGROUND
   Fixed starfield with drifting stars + soft nebula glow,
   loops forever like ambient footage of drifting through space.
   ============================================================ */
function initSpace(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w, h, stars, nebulae, t = 0;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(90, Math.floor((w * h) / 6000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      depth: Math.random() * 0.6 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.4 + 0.05,
    }));
    nebulae = [
      { x: w * 0.2, y: h * 0.15, r: Math.max(w, h) * 0.5, c: 'rgba(41,151,255,0.10)' },
      { x: w * 0.85, y: h * 0.4, r: Math.max(w, h) * 0.4, c: 'rgba(143,179,255,0.08)' },
      { x: w * 0.5, y: h * 0.85, r: Math.max(w, h) * 0.45, c: 'rgba(0,102,204,0.08)' },
    ];
  }

  function step() {
    t += 1;
    ctx.clearRect(0, 0, w, h);

    nebulae.forEach((n) => {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, n.c);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });

    stars.forEach((s) => {
      s.y += s.speed * s.depth;
      if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
      const flicker = 0.55 + Math.sin(t * 0.02 + s.twinkle) * 0.45;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * s.depth * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${flicker * s.depth})`;
      ctx.fill();
    });

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  resize();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(step);
  } else {
    step();
  }
}

/* ============================================================
   UNDERWATER CAUSTIC BACKDROP
   Layered, distorted light bands drifting downward behind a
   phone, like sunlight rippling through water as you descend.
   ============================================================ */
function initCaustic(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w, h, t = 0;

  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function band(y, amp, freq, speed, color, width) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= w; x += 8) {
      const yy = y + Math.sin(x * freq + t * speed) * amp + Math.sin(x * freq * 2.3 + t * speed * 1.6) * amp * 0.4;
      ctx.lineTo(x, yy);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function step() {
    t += 1;
    ctx.clearRect(0, 0, w, h);

    /* deep water base tint */
    const base = ctx.createLinearGradient(0, 0, 0, h);
    base.addColorStop(0, 'rgba(4,20,32,0.55)');
    base.addColorStop(1, 'rgba(2,10,18,0.75)');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = 'lighter';
    const rows = Math.max(5, Math.floor(h / 30));
    for (let i = 0; i < rows; i++) {
      const y = ((i * 30 + (t * 0.6) % 30) % (h + 30)) - 15;
      band(y, 10, 0.02, 0.03, 'rgba(120,200,220,0.10)', 6);
    }
    /* brighter shafts of light */
    for (let i = 0; i < 3; i++) {
      band(h * (0.2 + i * 0.3), 22, 0.012, 0.02, 'rgba(180,230,255,0.14)', 14);
    }
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  resize();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(step);
  } else {
    step();
  }
}
