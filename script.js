/* =========================
   GLOBAL CONSTANTS
========================= */
const MOBILE_BREAKPOINT = 900;
/* =========================
   STATS COUNTER — REPLAYS
========================= */
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const h3 = entry.target.querySelector("h3");
    if (!h3) return;

    const target = +h3.dataset.target;
    let rafId = null;

    if (entry.isIntersecting) {
      let count = 0;

      const tick = () => {
        count += Math.ceil(target / 40);
        h3.textContent = (count < target ? count : target) + "+";

        if (count < target) {
          rafId = requestAnimationFrame(tick);
        }
      };

      tick();
    } else {
      // reset when leaving viewport
      if (rafId) cancelAnimationFrame(rafId);
      h3.textContent = "0+";
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll(".stat-card").forEach(card =>
  statObserver.observe(card)
);

/* =========================
   GENERIC IN-VIEW OBSERVER
========================= */
const inViewObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    entry.target.classList.toggle("in-view", entry.isIntersecting);
  });
}, { threshold: 0.18 });

document.querySelectorAll(
  "section, h2, h3, p, .event-card, .stat-card, .team-card, .event-content, .lc-content, .connect-box"
).forEach(el => inViewObserver.observe(el));

/* =========================
   GLASS REVEAL
========================= */
const glassObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    entry.target.classList.toggle("active", entry.isIntersecting);
  });
}, { threshold: 0.2 });

document.querySelectorAll(".reveal-glass").forEach(el =>
  glassObserver.observe(el)
);

/* =========================
   FOOTER REVEAL
========================= */
const footer = document.querySelector(".reveal-footer");
if (footer) {
  const footerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      footer.classList.toggle("active", entry.isIntersecting);
    });
  }, { threshold: 0.2 });

  footerObserver.observe(footer);
}

/* =========================
   MEMORIES SCATTER GRID
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".memories-section");
  const grid = document.querySelector(".memories-grid");
  if (!section || !grid) return;

  const cards = [...grid.querySelectorAll(".memory-item")];

  // random CSS vars (ONE system only)
  cards.forEach((card, i) => {
    card.style.setProperty("--x", `${(Math.random() - 0.5) * 500}px`);
    card.style.setProperty("--y", `${(Math.random() - 0.5) * 400}px`);
    card.style.setProperty("--r", `${(Math.random() - 0.5) * 12}deg`);
    card.style.zIndex = i;
  });

  const memoryObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // mobile → no absolute stacking
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        grid.classList.add("mobile-wrap");
        return;
      }

      grid.classList.add("scattered");
      memoryObserver.unobserve(section); // run ONCE
    });
  }, { threshold: 0.25 });

  memoryObserver.observe(section);
});

/* =========================
   MOBILE NAV TOGGLE
========================= */
(() => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", e => {
    e.stopPropagation();
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  document.addEventListener("click", e => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  nav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
})();
