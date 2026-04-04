// ═══════════ LENS INTRO ═══════════
(function() {
  var intro = document.getElementById('lensIntro');
  if (!intro) return;
  var dismissed = false;

  function dismissIntro() {
    if (dismissed) return;
    dismissed = true;
    intro.classList.add('zoom-in');
    setTimeout(function() {
      document.body.classList.add('intro-done');
    }, 1100);
  }

  intro.addEventListener('click', dismissIntro);
  document.addEventListener('keydown', function(e) {
    if (!document.body.classList.contains('intro-done')) {
      dismissIntro();
    }
  });
})();

// ═══════════ TAB NAVIGATION ═══════════
function switchTab(tabName) {
  document.querySelectorAll('.tab-page').forEach(function(p) {
    p.classList.remove('active');
  });
  var target = document.getElementById('page-' + tabName);
  if (target) {
    target.classList.add('active');
    target.style.animation = 'none';
    target.offsetHeight;
    target.style.animation = '';
  }
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.remove('active');
    if (a.getAttribute('data-tab') === tabName) a.classList.add('active');
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
  setTimeout(checkReveal, 150);
}

document.querySelectorAll('[data-tab]').forEach(function(el) {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    var tab = el.getAttribute('data-tab');
    switchTab(tab);
    closeMobile();
  });
});

// ═══════════ MOBILE MENU ═══════════
var hamburgerBtn = document.getElementById('hamburgerBtn');
var mobileMenu = document.getElementById('mobileMenu');
var mobileCloseBtn = document.getElementById('mobileClose');

hamburgerBtn.addEventListener('click', function() {
  mobileMenu.classList.add('open');
});
mobileCloseBtn.addEventListener('click', function() {
  mobileMenu.classList.remove('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

// ═══════════ CONTACT FORM ═══════════
var submitBtn = document.getElementById('submitInquiry');
if (submitBtn) {
  submitBtn.addEventListener('click', function() {
    alert('Thank you for your inquiry! Our team will respond within one business day.');
  });
}

// ═══════════ SCROLL REVEAL ═══════════
function checkReveal() {
  var reveals = document.querySelectorAll('.reveal');
  var windowHeight = window.innerHeight;
  reveals.forEach(function(el) {
    var top = el.getBoundingClientRect().top;
    if (top < windowHeight - 60) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', checkReveal);
window.addEventListener('load', function() {
  setTimeout(checkReveal, 200);
});

// ═══════════ NAVBAR SCROLL EFFECT ═══════════
(function() {
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) {
      navbar.style.padding = '2px 0';
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.02) inset';
    } else {
      navbar.style.padding = '6px 0';
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.02) inset';
    }
  });
})();

// ═══════════ GLOBAL MOUSE GLOW ═══════════
(function() {
  var glow = document.getElementById('mouseGlow');
  if (!glow) return;

  document.addEventListener('mousemove', function(e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

// ═══════════ ROTATING WORD ═══════════
(function() {
  var words = ['Innovation', 'Excellence', 'Victory', 'Success', 'Performance', 'The Future'];
  var index = 0;
  var el = document.getElementById('rotatingWord');
  if (!el) return;

  setInterval(function() {
    // Slide out
    el.style.animation = 'wordSlideOut 0.5s ease-in forwards';
    setTimeout(function() {
      index = (index + 1) % words.length;
      el.textContent = words[index];
      el.style.animation = 'wordSlideIn 0.5s ease-out forwards';
    }, 500);
  }, 4000);
})();

// ═══════════ ANIMATED STAT COUNTERS ═══════════
(function() {
  var counted = false;

  function animateCounters() {
    if (counted) return;
    var stats = document.querySelectorAll('[data-count]');
    if (!stats.length) return;

    var first = stats[0].getBoundingClientRect().top;
    if (first > window.innerHeight - 100) return;

    counted = true;
    stats.forEach(function(el) {
      var target = parseInt(el.getAttribute('data-count'));
      var suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
      var duration = 1800;
      var start = performance.now();

      function tick(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(eased * target);
        el.innerHTML = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  window.addEventListener('scroll', animateCounters);
  window.addEventListener('load', function() {
    setTimeout(animateCounters, 500);
  });
})();

// ═══════════ CARD TILT EFFECT ═══════════
(function() {
  var cards = document.querySelectorAll('.expertise-card, .value-card, .pricing-card');

  cards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -3;
      var rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });
})();

// ═══════════ PARALLAX FLOAT CARDS ═══════════
(function() {
  var floatCards = document.querySelectorAll('.hero-float-card, .hero-float-card-2');
  if (!floatCards.length) return;

  window.addEventListener('scroll', function() {
    var st = window.scrollY;
    floatCards.forEach(function(card, i) {
      var speed = i === 0 ? 0.15 : 0.1;
      card.style.transform = 'translateY(' + (st * speed * -1) + 'px)';
    });
  });
})();

// ═══════════ SCROLL PROGRESS BAR ═══════════
(function() {
  var bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', function() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      bar.style.width = (scrollTop / docHeight * 100) + '%';
    }
  });
})();

// ═══════════ STAGGERED REVEAL FOR GRID CHILDREN ═══════════
(function() {
  var grids = document.querySelectorAll('.expertise-grid, .reviews-grid, .team-grid, .values-grid, .timeline-items, .services-layout');
  grids.forEach(function(grid) {
    var children = grid.children;
    for (var i = 0; i < children.length; i++) {
      children[i].style.transitionDelay = (i * 0.08) + 's';
    }
  });
})();

// ═══════════ TYPING CURSOR ON TAGLINE ═══════════
(function() {
  var tagline = document.querySelector('.lens-tagline');
  if (!tagline) return;
  tagline.style.borderRight = '2px solid rgba(130,175,235,0.5)';
  tagline.style.animation = 'taglineFade 2s ease-out 0.5s both';

  // Remove cursor after fade in completes
  setTimeout(function() {
    tagline.style.borderRight = 'none';
  }, 3500);
})();
