// Intro: plays on the first page of a visit only (sessionStorage), never with reduced motion.
// From the first paint the page stays black (html.pb-intro-wait::before) until site.js builds the intro.
// Add ?intro to any URL to see it again.
(function () {
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!/[?&]intro\b/.test(location.search) && sessionStorage.getItem('pb-intro')) return;
    sessionStorage.setItem('pb-intro', '1');
    document.documentElement.classList.add('pb-intro-wait');
  } catch (e) {} // storage blocked: no intro
})();
