// Villa Guelfi — menu, photo galleries, map and cookie consent.

// ---------- Header: transparent over the cover photo, white after scrolling
const header = document.querySelector("[data-header]");
const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// ---------- Mobile menu
const burger = document.querySelector("[data-burger]");
const nav = document.querySelector("[data-nav]");
const setMenu = (open) => {
  header.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
};
burger.addEventListener("click", () => setMenu(!header.classList.contains("is-open")));
nav.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));

// ---------- Photo galleries
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImg = lightbox.querySelector("[data-lightbox-img]");
let active = null; // gallery currently shown in the lightbox

const galleries = [...document.querySelectorAll("[data-gallery]")].map((root) => {
  const main = root.querySelector("[data-main]");
  const mainLink = root.querySelector("[data-main-link]");
  const thumbs = [...root.querySelectorAll("[data-thumb]")];
  const g = { index: 0, count: thumbs.length };

  g.show = (i) => {
    g.index = (i + g.count) % g.count;
    const t = thumbs[g.index];
    main.src = t.href;
    main.alt = t.querySelector("img").alt;
    mainLink.href = t.href;
    thumbs.forEach((el, n) => (n === g.index ? el.setAttribute("aria-current", "true") : el.removeAttribute("aria-current")));
    if (active === g) lightboxImg.src = t.href;
    // warm up the next photo so arrows feel instant
    new Image().src = thumbs[(g.index + 1) % g.count].href;
  };

  thumbs.forEach((t, i) =>
    t.addEventListener("click", (e) => {
      e.preventDefault();
      g.show(i);
    })
  );
  root.querySelector("[data-prev]").addEventListener("click", () => g.show(g.index - 1));
  root.querySelector("[data-next]").addEventListener("click", () => g.show(g.index + 1));
  mainLink.addEventListener("click", (e) => {
    e.preventDefault();
    active = g;
    lightboxImg.src = mainLink.href;
    lightboxImg.alt = main.alt;
    lightbox.showModal();
  });

  // swipe on phones
  let startX = null;
  root.querySelector(".gallery__main").addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  root.querySelector(".gallery__main").addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) g.show(g.index + (dx < 0 ? 1 : -1));
    startX = null;
  });
  return g;
});

lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", () => active && active.show(active.index - 1));
lightbox.querySelector("[data-lightbox-next]").addEventListener("click", () => active && active.show(active.index + 1));
lightbox.querySelector("[data-lightbox-close]").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => e.target === lightbox && lightbox.close());
lightbox.addEventListener("close", () => (active = null));
document.addEventListener("keydown", (e) => {
  if (!active) return;
  if (e.key === "ArrowLeft") active.show(active.index - 1);
  if (e.key === "ArrowRight") active.show(active.index + 1);
});

// ---------- Cookie consent, Google Analytics and the Google map
const CONSENT_KEY = "vg-cookies";
const readConsent = () => {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
};
const saveConsent = (v) => {
  try {
    localStorage.setItem(CONSENT_KEY, v);
  } catch {}
};

function loadAnalytics() {
  const id = document.documentElement.dataset.ga;
  if (!id || window.gtag) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
  document.head.append(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id);
}

function loadMap() {
  const box = document.querySelector("[data-map]");
  if (!box || box.querySelector("iframe")) return;
  const f = document.createElement("iframe");
  f.src = box.dataset.map;
  f.title = box.dataset.mapTitle;
  f.loading = "lazy";
  f.allowFullscreen = true;
  f.referrerPolicy = "no-referrer-when-downgrade";
  box.replaceChildren(f);
  box.classList.add("is-loaded");
}

const banner = document.querySelector("[data-cookies]");
const consent = readConsent();
if (consent === "yes") {
  loadAnalytics();
  loadMap();
} else if (consent !== "no") {
  banner.hidden = false;
}
banner.querySelector("[data-cookies-accept]").addEventListener("click", () => {
  saveConsent("yes");
  banner.hidden = true;
  loadAnalytics();
  loadMap();
});
banner.querySelector("[data-cookies-decline]").addEventListener("click", () => {
  saveConsent("no");
  banner.hidden = true;
});
// "Change cookie settings" button on the privacy page.
document.querySelector("[data-cookies-reset]")?.addEventListener("click", () => {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {}
  banner.hidden = false;
});
// The map can always be opened by hand, whatever the cookie choice.
document.querySelector("[data-map-show]")?.addEventListener("click", loadMap);
