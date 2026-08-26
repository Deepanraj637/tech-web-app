/* ===========================
   script.js – TechNova Solutions
   Effects: page loader, particles, typing, scroll reveal,
            counter animation, navbar scroll, hamburger,
            active nav link, form validation
   =========================== */


// ─── Page Loader ─────────────────────────────────────────
(function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  window.addEventListener('load', function () {
    setTimeout(function () {
      loader.classList.add('hidden');
    }, 950);
  });
})();


// ─── Navbar Shadow on Scroll ─────────────────────────────
(function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();


// ─── Hamburger Menu ─────────────────────────────────────
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', function () {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();


// ─── Mark Active Nav Link ────────────────────────────────
(function markActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();


// ─── Hero Particle Canvas ────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 70;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Particle constructor
  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.r    = Math.random() * 2.2 + 0.6;
    this.vx   = (Math.random() - 0.5) * 0.5;
    this.vy   = (Math.random() - 0.5) * 0.5;
    this.alpha = Math.random() * 0.5 + 0.15;
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(6,182,212,' + this.alpha + ')';
    ctx.fill();
  };

  // Create particles
  for (var i = 0; i < COUNT; i++) {
    particles.push(new Particle());
  }

  // Connect nearby particles with lines
  function connectParticles() {
    var maxDist = 120;
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var dx   = particles[a].x - particles[b].x;
        var dy   = particles[a].y - particles[b].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255,255,255,' + (0.06 * (1 - dist / maxDist)) + ')';
          ctx.lineWidth   = 0.8;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    connectParticles();
    particles.forEach(function (p) { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();


// ─── Typing Effect (Hero Headline) ───────────────────────
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const lines = [
    'Building the Future',
    'Delivering Innovation',
    'Powering Your Growth'
  ];
  const suffix   = ' with Cutting-Edge Technology';
  let lineIndex  = 0;
  let charIndex  = 0;
  let deleting   = false;
  let pauseTimer = null;

  function type() {
    var fullText = lines[lineIndex] + suffix;

    if (!deleting) {
      charIndex++;
      el.textContent = fullText.slice(0, charIndex);

      if (charIndex === fullText.length) {
        deleting = true;
        pauseTimer = setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 55);

    } else {
      charIndex--;
      el.textContent = fullText.slice(0, charIndex);

      if (charIndex === 0) {
        deleting   = false;
        lineIndex  = (lineIndex + 1) % lines.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 28);
    }
  }

  // Small delay before starting so loader is gone first
  setTimeout(type, 1100);
})();


// ─── Scroll Reveal ───────────────────────────────────────
(function initScrollReveal() {
  var targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);   // animate once only
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(function (el) { observer.observe(el); });
})();


// ─── Counter Animation (Stats) ───────────────────────────
(function initCounters() {
  var counters = document.querySelectorAll('.stat-num, .num');
  if (!counters.length) return;

  function animateCount(el) {
    var raw    = el.textContent.trim();          // e.g. "500+"  "98%"  "14"
    var suffix = raw.replace(/[\d]/g, '');       // "+", "%", ""
    var target = parseInt(raw.replace(/\D/g, ''), 10);
    if (isNaN(target)) return;

    var start    = 0;
    var duration = 1800; // ms
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { observer.observe(el); });
})();


// ─── Contact Form Validation ─────────────────────────────
(function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var nameInput    = document.getElementById('name');
  var emailInput   = document.getElementById('email');
  var messageInput = document.getElementById('message');
  var nameError    = document.getElementById('nameError');
  var emailError   = document.getElementById('emailError');
  var messageError = document.getElementById('messageError');
  var successBanner = document.getElementById('successBanner');
  var submittedData = document.getElementById('submittedData');

  function isNotEmpty(v) { return v.trim().length > 0; }
  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

  function validateField(input, errorEl, message, testFn) {
    var valid = testFn(input.value);
    if (valid) {
      input.classList.remove('error');
      input.classList.add('success');
      errorEl.textContent = '';
      errorEl.classList.remove('show');
    } else {
      input.classList.remove('success');
      input.classList.add('error');
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
    return valid;
  }

  nameInput.addEventListener('blur', function () {
    validateField(nameInput, nameError, 'Full name is required.', isNotEmpty);
  });
  emailInput.addEventListener('blur', function () {
    if (!isNotEmpty(emailInput.value)) {
      validateField(emailInput, emailError, 'Email address is required.', isNotEmpty);
    } else {
      validateField(emailInput, emailError, 'Please enter a valid email address.', isValidEmail);
    }
  });
  messageInput.addEventListener('blur', function () {
    validateField(messageInput, messageError, 'Message cannot be empty.', isNotEmpty);
  });

  [nameInput, emailInput, messageInput].forEach(function (input) {
    input.addEventListener('input', function () {
      if (input.classList.contains('error')) {
        input.classList.remove('error');
        var errEl = document.getElementById(input.id + 'Error');
        if (errEl) { errEl.classList.remove('show'); errEl.textContent = ''; }
      }
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var nameValid    = validateField(nameInput,    nameError,    'Full name is required.',                isNotEmpty);
    var emailValid   = validateField(emailInput,   emailError,   'Please enter a valid email address.', isValidEmail);
    var messageValid = validateField(messageInput, messageError, 'Message cannot be empty.',              isNotEmpty);

    if (!nameValid || !emailValid || !messageValid) {
      var firstErr = form.querySelector('.error');
      if (firstErr) firstErr.focus();
      return;
    }

    var submittedName    = nameInput.value.trim();
    var submittedEmail   = emailInput.value.trim();
    var submittedMessage = messageInput.value.trim();

    successBanner.classList.add('show');

    document.getElementById('previewName').textContent    = submittedName;
    document.getElementById('previewEmail').textContent   = submittedEmail;
    document.getElementById('previewMessage').textContent = submittedMessage;
    document.getElementById('previewTime').textContent    = new Date().toLocaleString();
    submittedData.classList.add('show');

    successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });

    form.reset();
    [nameInput, emailInput, messageInput].forEach(function (input) {
      input.classList.remove('success', 'error');
    });

    setTimeout(function () {
      successBanner.classList.remove('show');
    }, 8000);
  });
})();
