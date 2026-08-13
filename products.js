const PRODUCTS = [
  {
    id: 'nova-pro',
    name: 'spaceV Nova Pro',
    tagline: 'Built for the distance.',
    price: 1099,
    tile: 'dark',
    accent: '#8fb3ff',
    finishes: ['#3a3f47', '#c9a97e', '#5b6b5e', '#1d1d1f'],
    storage: [
      { label: '256GB', delta: 0 },
      { label: '512GB', delta: 120 },
      { label: '1TB', delta: 320 },
    ],
    specs: ['6.9" ProMotion display', 'Titanium frame', '5-day battery', '120x hybrid zoom'],
  },
  {
    id: 'nova',
    name: 'spaceV Nova',
    tagline: "Everything you need. Nothing you don't.",
    price: 799,
    tile: 'light',
    accent: '#0066cc',
    finishes: ['#e3e6ea', '#0066cc', '#1d1d1f', '#c9a97e'],
    storage: [
      { label: '128GB', delta: 0 },
      { label: '256GB', delta: 80 },
      { label: '512GB', delta: 220 },
    ],
    specs: ['6.3" OLED display', 'Aluminum frame', '2-day battery', '3x optical zoom'],
  },
  {
    id: 'aero',
    name: 'spaceV Aero',
    tagline: 'Impossibly thin. Improbably tough.',
    price: 949,
    tile: 'dark',
    accent: '#2997ff',
    finishes: ['#7a7a7a', '#1d1d1f', '#e3e6ea'],
    storage: [
      { label: '256GB', delta: 0 },
      { label: '512GB', delta: 100 },
    ],
    specs: ['6.5" LTPO display', 'Aerospace alloy', '3-day battery', '48MP main sensor'],
  },
  {
    id: 'aero-mini',
    name: 'spaceV Aero Mini',
    tagline: 'Small size. Full size ideas.',
    price: 649,
    tile: 'light',
    accent: '#0066cc',
    finishes: ['#c9a97e', '#e3e6ea', '#1d1d1f'],
    storage: [
      { label: '128GB', delta: 0 },
      { label: '256GB', delta: 60 },
    ],
    specs: ['5.4" OLED display', 'One-hand design', '2-day battery', '2x optical zoom'],
  },
  {
    id: 'zenith',
    name: 'spaceV Zenith',
    tagline: 'The idea of a phone, reconsidered.',
    price: 1399,
    tile: 'dark',
    accent: '#8fb3ff',
    finishes: ['#1d1d1f', '#c9a97e'],
    storage: [
      { label: '512GB', delta: 0 },
      { label: '1TB', delta: 250 },
    ],
    specs: ['Folding 7.8" canvas', 'Ceramic shield hinge', '2-day battery', 'Studio-grade camera'],
  },
];

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
}

/* Builds the .phone3d markup used across pages */
function phoneMarkup(accent, opts = {}) {
  const spinClass = opts.slow ? 'phone3d spin-slow' : 'phone3d';
  const tiltAttr = opts.tilt ? 'data-scroll-tilt' : '';
  return `
    <div class="phone-stage">
      <div class="${spinClass}" style="--accent:${accent}" ${tiltAttr}>
        <div class="face front"></div>
        <div class="face back"><div class="cam"><span></span><span></span><span></span><span></span></div></div>
        <div class="edge right"></div>
        <div class="edge left"></div>
      </div>
    </div>`;
}

/* Mounts a phone into `containerId`, wrapped in an underwater-caustic
   backdrop canvas that animates independently of the global starfield. */
function mountPhone(containerId, accent, opts = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const causticId = containerId + '-caustic';
  el.innerHTML = `
    <div class="phone-water">
      <canvas id="${causticId}" class="caustic-canvas"></canvas>
      ${phoneMarkup(accent, opts)}
    </div>`;
  initCaustic(causticId);
}
