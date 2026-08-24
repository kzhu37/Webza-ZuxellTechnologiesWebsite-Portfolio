(() => {
  "use strict";

  const body = document.body;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const tabNames = new Set(["home", "about", "expertise", "services", "reviews", "contact"]);
  const tabPages = [...document.querySelectorAll(".tab-page")];
  const tabControls = [...document.querySelectorAll("[data-tab]")];
  const navigationControls = [...document.querySelectorAll(".nav-links [data-tab], .mobile-menu [data-tab]")];
  const navbar = document.getElementById("navbar");
  const mobileMenu = document.getElementById("mobileMenu");
  const hamburgerButton = document.getElementById("hamburgerBtn");
  const mobileCloseButton = document.getElementById("mobileClose");
  const scrollProgress = document.getElementById("scrollProgress");
  const intro = document.getElementById("lensIntro");
  let lastMenuFocus = null;

  function getRouteFromHash() {
    const hash = window.location.hash.slice(1).toLowerCase();
    if (hash === "founder") return { tab: "about", section: "founder" };
    return { tab: tabNames.has(hash) ? hash : "home", section: null };
  }

  function closeMobileMenu({ restoreFocus = false } = {}) {
    if (!mobileMenu || !hamburgerButton) return;
    const wasOpen = mobileMenu.classList.contains("open");
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    hamburgerButton.setAttribute("aria-expanded", "false");
    hamburgerButton.setAttribute("aria-label", "Open navigation");
    body.classList.remove("menu-open");
    if (wasOpen && restoreFocus && lastMenuFocus) lastMenuFocus.focus();
  }

  function openMobileMenu() {
    if (!mobileMenu || !hamburgerButton) return;
    lastMenuFocus = document.activeElement;
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    hamburgerButton.setAttribute("aria-expanded", "true");
    hamburgerButton.setAttribute("aria-label", "Close navigation");
    body.classList.add("menu-open");
    mobileCloseButton?.focus();
  }

  function checkReveal() {
    const revealLine = window.innerHeight - 60;
    document.querySelectorAll(".tab-page.active .reveal:not(.visible)").forEach((element) => {
      if (element.getBoundingClientRect().top < revealLine) element.classList.add("visible");
    });
  }

  function switchTab(tabName, options = {}) {
    const { updateHistory = true, section = null, restoreScroll = false } = options;
    if (!tabNames.has(tabName)) return;

    tabPages.forEach((page) => {
      const isActive = page.id === `page-${tabName}`;
      page.classList.toggle("active", isActive);
      page.setAttribute("aria-hidden", String(!isActive));
      page.inert = !isActive;
    });

    navigationControls.forEach((control) => {
      const isActive = control.dataset.tab === tabName;
      control.classList.toggle("active", isActive && control.closest(".nav-links") !== null);
      if (isActive) control.setAttribute("aria-current", "page");
      else control.removeAttribute("aria-current");
    });

    closeMobileMenu();

    if (updateHistory) {
      const nextHash = section ? `#${section}` : `#${tabName}`;
      if (window.location.hash !== nextHash) window.history.pushState(null, "", nextHash);
    }

    window.requestAnimationFrame(() => {
      if (section) {
        document.getElementById(section)?.scrollIntoView({
          behavior: prefersReducedMotion.matches ? "auto" : "smooth",
          block: "start",
        });
      } else if (!restoreScroll) {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      checkReveal();
      updateScrollEffects();
    });
  }

  tabControls.forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      switchTab(control.dataset.tab, { section: control.dataset.section || null });
    });
  });

  window.addEventListener("hashchange", () => {
    const route = getRouteFromHash();
    switchTab(route.tab, { updateHistory: false, section: route.section });
  });

  hamburgerButton?.addEventListener("click", () => {
    if (mobileMenu?.classList.contains("open")) closeMobileMenu({ restoreFocus: true });
    else openMobileMenu();
  });
  mobileCloseButton?.addEventListener("click", () => closeMobileMenu({ restoreFocus: true }));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu?.classList.contains("open")) {
      event.preventDefault();
      closeMobileMenu({ restoreFocus: true });
      return;
    }

    if (event.key !== "Tab" || !mobileMenu?.classList.contains("open")) return;
    const focusable = [...mobileMenu.querySelectorAll("a[href], button:not([disabled])")];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMobileMenu();
  }, { passive: true });

  // The intro appears once per browser session and never traps reduced-motion users.
  if (intro) {
    let dismissed = false;
    let autoDismissTimer;

    const completeIntro = () => {
      body.classList.add("intro-done");
      intro.setAttribute("aria-hidden", "true");
      intro.setAttribute("tabindex", "-1");
      try {
        window.sessionStorage.setItem("zuxell-intro-seen", "true");
      } catch {
        // The intro still works when storage is unavailable.
      }
      if (document.activeElement === intro) {
        document.getElementById("main-content")?.focus({ preventScroll: true });
      }
      const route = getRouteFromHash();
      if (route.section) {
        window.requestAnimationFrame(() => document.getElementById(route.section)?.scrollIntoView());
      }
      checkReveal();
    };

    const dismissIntro = () => {
      if (dismissed) return;
      dismissed = true;
      window.clearTimeout(autoDismissTimer);
      if (prefersReducedMotion.matches) {
        completeIntro();
        return;
      }
      intro.classList.add("zoom-in");
      window.setTimeout(completeIntro, 1050);
    };

    let introSeen = false;
    try {
      introSeen = window.sessionStorage.getItem("zuxell-intro-seen") === "true";
    } catch {
      introSeen = false;
    }

    if (introSeen || prefersReducedMotion.matches) {
      dismissed = true;
      completeIntro();
    } else {
      intro.addEventListener("click", dismissIntro);
      intro.addEventListener("keydown", (event) => {
        if (["Enter", " ", "Escape"].includes(event.key)) {
          event.preventDefault();
          dismissIntro();
        }
      });
      intro.focus({ preventScroll: true });
      autoDismissTimer = window.setTimeout(dismissIntro, 6500);
    }
  } else {
    body.classList.add("intro-done");
  }

  // Reveal content efficiently, including panels that become visible after tab changes.
  if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -50px", threshold: 0.05 });
    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
  }

  // Animate statistics only when the home-page statistic block is actually visible.
  const statsSection = document.querySelector(".stats");
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;
    document.querySelectorAll("[data-count]").forEach((element) => {
      const target = Number.parseInt(element.dataset.count, 10);
      const suffix = element.querySelector("span")?.outerHTML || "";
      if (prefersReducedMotion.matches) {
        element.innerHTML = `${target}${suffix}`;
        return;
      }
      const start = performance.now();
      const duration = 1500;
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.innerHTML = `${Math.round(eased * target)}${suffix}`;
        if (progress < 1) window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    });
  }

  if (statsSection && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        animateCounters();
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    counterObserver.observe(statsSection);
  } else if (statsSection) {
    animateCounters();
  }

  // Consolidate scroll effects into one animation frame per paint.
  const floatCards = [...document.querySelectorAll(".hero-float-card, .hero-float-card-2")];
  let scrollFramePending = false;

  function updateScrollEffects() {
    const scrollTop = window.scrollY;
    navbar?.classList.toggle("scrolled", scrollTop > 80);

    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? Math.min(scrollTop / scrollableHeight, 1) : 0;
    scrollProgress?.style.setProperty("--scroll-progress", String(progress));

    if (!prefersReducedMotion.matches) {
      floatCards.forEach((card, index) => {
        const speed = index === 0 ? 0.12 : 0.08;
        card.style.setProperty("--parallax-y", `${scrollTop * speed * -1}px`);
      });
    }
    checkReveal();
    scrollFramePending = false;
  }

  window.addEventListener("scroll", () => {
    if (scrollFramePending) return;
    scrollFramePending = true;
    window.requestAnimationFrame(updateScrollEffects);
  }, { passive: true });

  // Keep the ambient glow transform-only to avoid layout work on every pointer move.
  const mouseGlow = document.getElementById("mouseGlow");
  let pointerFramePending = false;
  let pointerX = -600;
  let pointerY = -600;
  if (mouseGlow && hasFinePointer.matches && !prefersReducedMotion.matches) {
    document.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (pointerFramePending) return;
      pointerFramePending = true;
      window.requestAnimationFrame(() => {
        mouseGlow.style.setProperty("--mouse-x", `${pointerX}px`);
        mouseGlow.style.setProperty("--mouse-y", `${pointerY}px`);
        pointerFramePending = false;
      });
    }, { passive: true });
  }

  // Rotate the hero word only while the document is visible.
  const rotatingWord = document.getElementById("rotatingWord");
  const rotatingWords = ["Innovation", "Excellence", "Performance", "Success", "the Future"];
  let rotatingIndex = 0;
  let rotatingTimer;

  function scheduleWordRotation() {
    window.clearTimeout(rotatingTimer);
    if (!rotatingWord || prefersReducedMotion.matches || document.hidden) return;
    rotatingTimer = window.setTimeout(() => {
      rotatingWord.style.animation = "wordSlideOut 0.45s ease-in forwards";
      window.setTimeout(() => {
        rotatingIndex = (rotatingIndex + 1) % rotatingWords.length;
        rotatingWord.textContent = rotatingWords[rotatingIndex];
        rotatingWord.style.animation = "wordSlideIn 0.45s ease-out forwards";
        scheduleWordRotation();
      }, 450);
    }, 3600);
  }
  document.addEventListener("visibilitychange", scheduleWordRotation);
  scheduleWordRotation();

  // Subtle pointer tilt remains desktop-only and never interferes with touch scrolling.
  if (hasFinePointer.matches && !prefersReducedMotion.matches) {
    document.querySelectorAll(".expertise-card, .value-card, .pricing-card").forEach((card) => {
      let tiltFramePending = false;
      let latestEvent;
      card.addEventListener("pointermove", (event) => {
        latestEvent = event;
        if (tiltFramePending) return;
        tiltFramePending = true;
        window.requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const rotateX = (((latestEvent.clientY - rect.top) / rect.height) - 0.5) * -6;
          const rotateY = (((latestEvent.clientX - rect.left) / rect.width) - 0.5) * 6;
          card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
          tiltFramePending = false;
        });
      }, { passive: true });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  document.querySelectorAll(".expertise-grid, .reviews-grid, .team-grid, .values-grid, .timeline-items, .services-layout").forEach((grid) => {
    [...grid.children].forEach((child, index) => {
      child.style.transitionDelay = prefersReducedMotion.matches ? "0s" : `${index * 0.06}s`;
    });
  });

  const tagline = document.querySelector(".lens-tagline");
  if (tagline && !prefersReducedMotion.matches) {
    tagline.style.borderRight = "2px solid rgba(130,175,235,0.5)";
    window.setTimeout(() => { tagline.style.borderRight = "none"; }, 3200);
  }

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const formData = new FormData(contactForm);
    const name = `${formData.get("First name")} ${formData.get("Last name")}`.trim();
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    const message = [...formData.entries()]
      .map(([label, value]) => `${label}: ${value || "Not provided"}`)
      .join("\n");
    if (formStatus) formStatus.textContent = "Opening your email application...";
    window.location.href = `mailto:info@zuxelltech.com?subject=${subject}&body=${encodeURIComponent(message)}`;
  });

  document.querySelectorAll("svg").forEach((icon) => {
    if (!icon.hasAttribute("aria-label") && !icon.querySelector("title")) {
      icon.setAttribute("aria-hidden", "true");
      icon.setAttribute("focusable", "false");
    }
  });

  const currentYear = document.getElementById("currentYear");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  const initialRoute = getRouteFromHash();
  switchTab(initialRoute.tab, { updateHistory: false, section: initialRoute.section });
  updateScrollEffects();
})();
