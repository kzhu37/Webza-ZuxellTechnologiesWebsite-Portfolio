// Later sanitized public reconstruction. This is not the untouched Spring 2026 client source. See docs/PUBLIC_SHOWCASE.md.
(() => {
  "use strict";

  const tabNames = new Set(["home", "about", "expertise", "services", "contact"]);
  const pages = [...document.querySelectorAll(".tab-page")];
  const tabControls = [...document.querySelectorAll("[data-tab]")];
  const navigationControls = [...document.querySelectorAll(".nav-links [data-tab], .mobile-menu [data-tab]")];
  const mobileMenu = document.getElementById("mobileMenu");
  const hamburgerButton = document.getElementById("hamburgerBtn");
  const mobileCloseButton = document.getElementById("mobileClose");
  const body = document.body;
  let lastMenuFocus = null;

  function routeFromHash() {
    const hash = window.location.hash.slice(1).toLowerCase();
    return tabNames.has(hash) ? hash : "home";
  }

  function closeMobileMenu({ restoreFocus = false } = {}) {
    if (!mobileMenu || !hamburgerButton) return;
    const wasOpen = mobileMenu.classList.contains("open");
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    hamburgerButton.setAttribute("aria-expanded", "false");
    hamburgerButton.setAttribute("aria-label", "Open navigation");
    body.classList.remove("menu-open");
    if (wasOpen && restoreFocus && lastMenuFocus instanceof HTMLElement) lastMenuFocus.focus();
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

  function showTab(tabName, { updateHistory = true, focusHeading = false } = {}) {
    if (!tabNames.has(tabName)) return;

    let activePage = null;
    pages.forEach((page) => {
      const active = page.id === `page-${tabName}`;
      page.classList.toggle("active", active);
      page.setAttribute("aria-hidden", String(!active));
      page.inert = !active;
      if (active) activePage = page;
    });

    navigationControls.forEach((control) => {
      const active = control.dataset.tab === tabName;
      control.classList.toggle("active", active && control.closest(".nav-links") !== null);
      if (active) control.setAttribute("aria-current", "page");
      else control.removeAttribute("aria-current");
    });

    closeMobileMenu();

    if (updateHistory) {
      const nextHash = `#${tabName}`;
      if (window.location.hash !== nextHash) window.history.pushState(null, "", nextHash);
    }

    window.scrollTo({ top: 0, behavior: "auto" });
    if (focusHeading && activePage) {
      activePage.querySelector("h1")?.focus({ preventScroll: true });
    }
  }

  tabControls.forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      const cameFromMobileMenu = control.closest(".mobile-menu") !== null;
      const keyboardActivation = event.detail === 0;
      showTab(control.dataset.tab, { focusHeading: cameFromMobileMenu || keyboardActivation });
    });
  });

  window.addEventListener("hashchange", () => showTab(routeFromHash(), { updateHistory: false }));

  hamburgerButton?.addEventListener("click", () => {
    if (mobileMenu?.classList.contains("open")) closeMobileMenu({ restoreFocus: true });
    else openMobileMenu();
  });

  mobileCloseButton?.addEventListener("click", () => closeMobileMenu({ restoreFocus: true }));

  document.addEventListener("keydown", (event) => {
    if (!mobileMenu?.classList.contains("open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMobileMenu({ restoreFocus: true });
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = [...mobileMenu.querySelectorAll("a[href], button:not([disabled])")];
    if (!focusable.length) return;
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
    if (window.innerWidth > 900) closeMobileMenu();
  }, { passive: true });

  const validationButton = document.getElementById("validateInquiry");
  const contactRegion = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  validationButton?.addEventListener("click", () => {
    const fields = [...contactRegion.querySelectorAll("input, select, textarea")];
    const invalid = fields.find((field) => !field.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      if (formStatus) formStatus.textContent = "Check the highlighted field before continuing.";
      return;
    }
    if (formStatus) formStatus.textContent = "Validation complete. No information was sent.";
  });

  const currentYear = document.getElementById("currentYear");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  showTab(routeFromHash(), { updateHistory: false });
})();
