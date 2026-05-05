/* Alphabet Soup hero canvas — extracted from kalunleung.ca
   Initializes against #alphabet-soup-canvas (full-bleed inside .soup-hero).
   Fades canvas opacity as user scrolls past the hero.
*/
(function () {
  let animationFrameId = null;
  let cleanupFunctions = [];

  function initAlphabetSoup() {
    const canvas = document.getElementById('alphabet-soup-canvas');
    if (!canvas) return;

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    cleanupFunctions.forEach((fn) => fn());
    cleanupFunctions = [];

    const ctx = canvas.getContext('2d');
    const customCursor = document.getElementById('custom-cursor');

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resizeCanvas();
    const onResize = () => resizeCanvas();
    window.addEventListener('resize', onResize);
    cleanupFunctions.push(() => window.removeEventListener('resize', onResize));

    function getAccent() {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      return v || 'rgb(203, 41, 65)';
    }

    function drawGrid() {
      const dotSpacing = 22;
      const dotSize = 1.4;
      const fadeDistance = 100;
      const accent = getAccent();
      ctx.save();
      for (let x = dotSpacing; x < canvas.width; x += dotSpacing) {
        for (let y = dotSpacing; y < canvas.height; y += dotSpacing) {
          const minD = Math.min(x, canvas.width - x, y, canvas.height - y);
          let alpha = 0.13;
          if (minD < fadeDistance) alpha = 0.13 * (minD / fadeDistance);
          ctx.fillStyle = accent;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    const symbols = ['梁','家','綸','▁','▄','▉','▇','▙','▞','▦','◍','▰','◗','☗'];

    const particles = [];
    const permanentParticles = [];
    const MAX_PARTICLES = 300;
    const MAX_PERMANENT = 500;

    let mouseX = 0, mouseY = 0, lastMouseX = 0, lastMouseY = 0, mouseSpeed = 0;
    let isPaintMode = false, isEraseMode = false;

    function getMousePos(e) {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function getEdgeFadeFactor(x, y) {
      const fd = 80;
      const m = Math.min(x, canvas.width - x, y, canvas.height - y);
      return m < fd ? m / fd : 1.0;
    }

    class Particle {
      constructor(x, y, size, symbol) {
        this.x = x; this.y = y; this.size = size; this.symbol = symbol;
        this.alpha = 1.0;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.fadeRate = 0.008 + Math.random() * 0.005;
      }
      update() { this.x += this.vx; this.y += this.vy; this.alpha -= this.fadeRate; }
      draw() {
        const ef = getEdgeFadeFactor(this.x, this.y);
        ctx.save();
        ctx.globalAlpha = this.alpha * ef;
        ctx.fillStyle = getAccent();
        ctx.font = `${this.size}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, this.x, this.y);
        ctx.restore();
      }
      isDead() { return this.alpha <= 0; }
    }

    class PermanentParticle {
      constructor(x, y, size, symbol) {
        this.x = x; this.y = y; this.size = size; this.symbol = symbol;
        this.rotation = 0; this.vx = 0; this.vy = 0;
        this.rotationVelocity = 0; this.friction = 0.92;
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.rotation += this.rotationVelocity;
        this.vx *= this.friction; this.vy *= this.friction; this.rotationVelocity *= this.friction;
        const m = 50;
        if (this.x < m) this.x = m;
        if (this.x > canvas.width - m) this.x = canvas.width - m;
        if (this.y < m) this.y = m;
        if (this.y > canvas.height - m) this.y = canvas.height - m;
      }
      applyForce(fx, fy, t) { this.vx += fx; this.vy += fy; this.rotationVelocity += t; }
      draw() {
        const ef = getEdgeFadeFactor(this.x, this.y);
        ctx.save();
        ctx.globalAlpha = ef;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = getAccent();
        ctx.font = `${this.size}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, 0, 0);
        ctx.restore();
      }
      distanceTo(x, y) { return Math.hypot(this.x - x, this.y - y); }
    }

    function createParticles(x, y, speed) {
      const ef = getEdgeFadeFactor(x, y);
      if (ef < 0.5) return;
      const baseSize = 20;
      const sm = Math.min(speed / 10, 5);
      const size = baseSize + sm * 25;
      const probability = (0.35 + speed / 150) * ef;
      if (Math.random() < probability) {
        if (particles.length >= MAX_PARTICLES) particles.shift();
        const ox = (Math.random() - 0.5) * 10;
        const oy = (Math.random() - 0.5) * 10;
        const sym = symbols[Math.floor(Math.random() * symbols.length)];
        particles.push(new Particle(x + ox, y + oy, size, sym));
      }
    }
    function createPermanentParticle(x, y, speed) {
      const ef = getEdgeFadeFactor(x, y);
      if (ef < 0.3) return;
      const baseSize = 20;
      const sm = Math.min(speed / 10, 5);
      const size = baseSize + sm * 25;
      const probability = (0.35 + speed / 150) * ef;
      if (Math.random() < probability) {
        if (permanentParticles.length >= MAX_PERMANENT) permanentParticles.shift();
        const ox = (Math.random() - 0.5) * 10;
        const oy = (Math.random() - 0.5) * 10;
        const sym = symbols[Math.floor(Math.random() * symbols.length)];
        permanentParticles.push(new PermanentParticle(x + ox, y + oy, size, sym));
      }
    }
    function eraseNearby(x, y) {
      const r = 40;
      for (let i = permanentParticles.length - 1; i >= 0; i--) {
        if (permanentParticles[i].distanceTo(x, y) < r) permanentParticles.splice(i, 1);
      }
    }
    function pushParticles(x, y, speed) {
      const pr = 100, ps = 0.5, rs = 0.02;
      for (const p of permanentParticles) {
        const d = p.distanceTo(x, y);
        if (d < pr && d > 0) {
          const dx = p.x - x, dy = p.y - y, ang = Math.atan2(dy, dx);
          const f = (1 - d / pr) * ps * (speed * 0.1 + 0.5);
          const fx = Math.cos(ang) * f, fy = Math.sin(ang) * f;
          const pa = ang + Math.PI / 2;
          const rd = Math.cos(pa) * (lastMouseX - x) + Math.sin(pa) * (lastMouseY - y);
          const torque = rd * rs * (1 - d / pr) * (speed * 0.01 + 0.5);
          p.applyForce(fx, fy, torque);
        }
      }
    }

    function updateCursor(cx, cy) {
      if (customCursor) { customCursor.style.left = cx + 'px'; customCursor.style.top = cy + 'px'; }
    }
    function setCursorMode(mode) {
      if (customCursor) customCursor.className = 'active ' + mode + '-mode';
    }

    const onMove = (e) => {
      const p = getMousePos(e);
      lastMouseX = mouseX; lastMouseY = mouseY;
      mouseX = p.x; mouseY = p.y;
      updateCursor(e.clientX, e.clientY);
      mouseSpeed = Math.hypot(mouseX - lastMouseX, mouseY - lastMouseY);
      if (isEraseMode) eraseNearby(mouseX, mouseY);
      else if (isPaintMode) createPermanentParticle(mouseX, mouseY, mouseSpeed);
      else { createParticles(mouseX, mouseY, mouseSpeed); pushParticles(mouseX, mouseY, mouseSpeed); }
    };
    const onDown = (e) => {
      const p = getMousePos(e);
      mouseX = p.x; mouseY = p.y;
      if (!isEraseMode) {
        isPaintMode = !isPaintMode;
        setCursorMode(isPaintMode ? 'paint' : 'push');
        if (isPaintMode) createPermanentParticle(mouseX, mouseY, 0);
      }
    };
    const onLeave = () => { customCursor && customCursor.classList.remove('active'); };
    const onEnter = (e) => { if (customCursor) { customCursor.classList.add('active'); updateCursor(e.clientX, e.clientY); } };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseenter', onEnter);
    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mouseleave', onLeave);
    cleanupFunctions.push(() => {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseenter', onEnter);
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mouseleave', onLeave);
    });

    // touch
    let touchHoldTimer = null, isTouchPainting = false;
    const onTouchMove = (e) => {
      e.preventDefault();
      const t = e.touches[0]; const p = getMousePos(t);
      lastMouseX = mouseX; lastMouseY = mouseY;
      mouseX = p.x; mouseY = p.y;
      mouseSpeed = Math.hypot(mouseX - lastMouseX, mouseY - lastMouseY);
      if (isTouchPainting) createPermanentParticle(mouseX, mouseY, mouseSpeed);
      else { createParticles(mouseX, mouseY, mouseSpeed); pushParticles(mouseX, mouseY, mouseSpeed); }
    };
    const onTouchStart = (e) => {
      e.preventDefault();
      const t = e.touches[0]; const p = getMousePos(t);
      mouseX = p.x; mouseY = p.y;
      touchHoldTimer = setTimeout(() => {
        isTouchPainting = true;
        if (navigator.vibrate) navigator.vibrate(50);
        createPermanentParticle(mouseX, mouseY, 0);
      }, 300);
    };
    const onTouchEnd = (e) => {
      e.preventDefault();
      if (touchHoldTimer) { clearTimeout(touchHoldTimer); touchHoldTimer = null; }
      isTouchPainting = false;
    };
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchcancel', onTouchEnd);
    cleanupFunctions.push(() => {
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
      if (touchHoldTimer) clearTimeout(touchHoldTimer);
    });

    const onKeyDown = (e) => {
      if (e.code === 'Space' && document.activeElement === document.body) {
        e.preventDefault(); isEraseMode = true; setCursorMode('erase');
      }
    };
    const onKeyUp = (e) => {
      if (e.code === 'Space') { isEraseMode = false; setCursorMode(isPaintMode ? 'paint' : 'push'); }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    cleanupFunctions.push(() => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      for (const p of permanentParticles) { p.update(); p.draw(); }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]; p.update();
        if (p.isDead()) particles.splice(i, 1);
        else p.draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    const instructions = document.getElementById('alphabet-soup-instructions');
    let interacted = false;
    const fadeIns = () => { if (!interacted) { interacted = true; instructions && instructions.classList.add('faded'); } };
    canvas.addEventListener('mousedown', fadeIns, { once: true });
    canvas.addEventListener('touchstart', fadeIns, { once: true });

    // Hero scroll fade
    const hero = document.querySelector('.soup-hero');
    if (hero) {
      const onScroll = () => {
        const rect = hero.getBoundingClientRect();
        const h = window.innerHeight;
        // start fading when hero bottom reaches 50% viewport, fully out when bottom hits top
        const startY = h * 0.5;
        const endY = 0;
        let opacity = 1;
        if (rect.bottom < startY) {
          opacity = Math.max(0, (rect.bottom - endY) / (startY - endY));
        }
        canvas.style.opacity = opacity.toString();
        if (opacity < 0.05) canvas.style.pointerEvents = 'none';
        else canvas.style.pointerEvents = 'auto';
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      cleanupFunctions.push(() => window.removeEventListener('scroll', onScroll));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAlphabetSoup);
  } else {
    initAlphabetSoup();
  }
  window.__initAlphabetSoup = initAlphabetSoup;
})();
