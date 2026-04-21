/* ════════════════════════════════════════════════════════
   Publishers Clearing House – Registration Form Scripts
   script.js
════════════════════════════════════════════════════════ */

/* ── 1. Floating Money Background ─────────────────────── */
(function () {
  const canvas = document.getElementById('money-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, bills = [];
  const COUNT = 28;

  // Classic dollar-bill green tones
  const greens = ['#2d6a4f', '#40916c', '#52b788', '#1b4332', '#74c69d'];

  /* Resize canvas to fill the viewport */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* Helper – rounded rectangle path */
  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y,     x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r,  y + h);
    c.quadraticCurveTo(x,     y + h, x,          y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y,         x + r,       y);
    c.closePath();
  }

  /* Draw a single simplified dollar-bill shape */
  function drawBill(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle * Math.PI / 180);

    const w = b.w, h = b.h;

    // Drop shadow
    ctx.shadowColor = 'rgba(0,0,0,.3)';
    ctx.shadowBlur  = 6;

    // Bill body
    ctx.fillStyle = b.color;
    roundRect(ctx, -w / 2, -h / 2, w, h, 4);
    ctx.fill();

    // Inner border
    ctx.shadowBlur  = 0;
    ctx.strokeStyle = 'rgba(255,255,255,.25)';
    ctx.lineWidth   = 1;
    roundRect(ctx, -w / 2 + 3, -h / 2 + 3, w - 6, h - 6, 2);
    ctx.stroke();

    // Dollar symbol
    ctx.fillStyle    = 'rgba(255,255,255,.55)';
    ctx.font         = `bold ${h * 0.55}px Georgia, serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, 0);

    ctx.restore();
  }

  /* Create a fresh bill object */
  function spawnBill(randomY) {
    const w = 56 + Math.random() * 40;
    return {
      x    : Math.random() * W,
      y    : randomY ? Math.random() * H : -40,
      w    : w,
      h    : w * 0.44,
      angle: -20 + Math.random() * 40,
      spin : (0.3 + Math.random() * 0.4) * (Math.random() > 0.5 ? 1 : -1),
      vy   : 0.45 + Math.random() * 0.7,
      vx   : (Math.random() - 0.5) * 0.4,
      alpha: 0.18 + Math.random() * 0.2,
      color: greens[Math.floor(Math.random() * greens.length)],
    };
  }

  /* Seed the initial set of bills */
  function initBills() {
    bills = [];
    for (let i = 0; i < COUNT; i++) {
      bills.push(spawnBill(true));
    }
  }

  /* Animation loop */
  function animate() {
    ctx.clearRect(0, 0, W, H);

    bills.forEach((b, i) => {
      b.y     += b.vy;
      b.x     += b.vx;
      b.angle += b.spin;

      ctx.globalAlpha = b.alpha;
      drawBill(b);
      ctx.globalAlpha = 1;

      // Recycle bill once it drifts off the bottom
      if (b.y > H + 60) {
        bills[i] = spawnBill(false);
      }
    });

    requestAnimationFrame(animate);
  }

  // Init
  resize();
  initBills();
  animate();
  window.addEventListener('resize', () => { resize(); initBills(); });
})();


/* ── 2. Form Validation ────────────────────────────────── */
(function () {

  const form    = document.getElementById('reg-form');
  const summary = document.getElementById('form-error-summary');
  const fields  = ['fullname', 'address', 'zipcode', 'phone', 'email'];

  if (!form) return;

  /* ── Real-time error clearing ── */
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearError(id));
  });

  document.querySelectorAll('input[name="Payment Method"]').forEach(r =>
    r.addEventListener('change', () => clearError('payment'))
  );

  document.getElementById('terms').addEventListener('change', () =>
    clearError('terms')
  );

  /* ── Helpers ── */
  function showError(id, msg) {
    const errEl = document.getElementById('err-' + id);
    if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); }
    const inputEl = document.getElementById(id);
    if (inputEl) inputEl.classList.add('error-field');
  }

  function clearError(id) {
    const errEl = document.getElementById('err-' + id);
    if (errEl) errEl.classList.remove('visible');
    const inputEl = document.getElementById(id);
    if (inputEl) inputEl.classList.remove('error-field');
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidZip(value) {
    return /^\d{4,10}$/.test(value.replace(/\s/g, ''));
  }

  function isValidPhone(value) {
    // At least 7 digits after stripping common formatting chars
    return value.replace(/[\s\-().+]/g, '').length >= 7;
  }

  /* ── Submit handler ── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    summary.classList.remove('visible');

    // Full Name
    const name = document.getElementById('fullname').value.trim();
    if (!name || name.length < 3) {
      showError('fullname', 'Please enter your full name (at least 3 characters).');
      isValid = false;
    }

    // Home Address
    const addr = document.getElementById('address').value.trim();
    if (!addr) {
      showError('address', 'Please enter your home address.');
      isValid = false;
    }

    // ZIP Code
    const zip = document.getElementById('zipcode').value.trim();
    if (!zip || !isValidZip(zip)) {
      showError('zipcode', 'Enter a valid ZIP / postal code.');
      isValid = false;
    }

    // Phone Number
    const phone = document.getElementById('phone').value.trim();
    if (!phone || !isValidPhone(phone)) {
      showError('phone', 'Enter a valid phone number.');
      isValid = false;
    }

    // Email Address
    const email = document.getElementById('email').value.trim();
    if (!email || !isValidEmail(email)) {
      showError('email', 'Enter a valid email address (e.g. name@domain.com).');
      isValid = false;
    }

    // Payment Method
    const payment = form.querySelector('input[name="Payment Method"]:checked');
    if (!payment) {
      showError('payment', 'Please select a payment method.');
      isValid = false;
    }

    // Terms & Conditions
    const terms = document.getElementById('terms').checked;
    if (!terms) {
      showError('terms', 'You must confirm the agreement before submitting.');
      isValid = false;
    }

    // If any validation failed — show summary and scroll to it
    if (!isValid) {
      summary.classList.add('visible');
      summary.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // All valid: send the submission to FormSubmit.
    const submitButton = form.querySelector('.submit-btn');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
    }
    form.submit();
  });

})();
