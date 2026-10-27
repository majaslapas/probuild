// ProBuild Group site script (Webflow site footer). Replaces the canvas state logic.
(function () {
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Webflow fills empty placeholders with "Example Text"; the design has none there.
  $$('input[placeholder], textarea[placeholder]').forEach(function (i) {
    if (/^example text$/i.test(i.getAttribute('placeholder'))) i.removeAttribute('placeholder');
  });

  // Radio buttons publish name="radio-N"; group them by their Group Name (data-name)
  // and select the first choice of a group that has none selected.
  var radioGroups = {};
  $$('input[type="radio"][data-name]').forEach(function (r) {
    r.name = r.dataset.name;
    (radioGroups[r.name] = radioGroups[r.name] || []).push(r);
  });
  Object.keys(radioGroups).forEach(function (g) {
    if (!radioGroups[g].some(function (r) { return r.checked; })) radioGroups[g][0].checked = true;
  });

  // CMS cards: Collection List links carry data-cms-base + data-cms-slug (bound to the item
  // slug); the static href is the listing page, used only if this script does not run.
  $$('a[data-cms-slug]').forEach(function (a) {
    if (a.dataset.cmsSlug) a.setAttribute('href', (a.dataset.cmsBase || '/') + a.dataset.cmsSlug);
  });

  // Services accordion: [data-accordion-trigger] opens its .services-list_item (one at a time).
  var accItems = $$('[data-accordion-trigger]').map(function (t) { return t.closest('.services-list_item'); });
  function setOpen(item, on) {
    item.classList.toggle('is-open', on);
    item.querySelector('[data-accordion-trigger]').setAttribute('aria-expanded', on ? 'true' : 'false');
    var label = item.querySelector('.services-list_more-text');
    if (label) label.textContent = on ? 'Aizvērt' : 'Skatīt cenas';
  }
  accItems.forEach(function (item, i) {
    setOpen(item, i === 0);
    item.querySelector('[data-accordion-trigger]').addEventListener('click', function () {
      var on = !item.classList.contains('is-open');
      accItems.forEach(function (o) { setOpen(o, o === item && on); });
    });
  });

  // Cost calculator (.calc_panel): work type [data-calc-option] with data-min/max/note (€/m²),
  // area stepper [data-calc-step] + range [data-calc-range], mode toggle [data-calc-toggle]
  // between the two forms [data-calc-mode]. Hidden [data-calc-field] inputs carry the estimate.
  var panel = document.querySelector('.calc_panel');
  if (panel) {
    var calc = { i: 0, area: 120 };
    var opts = $$('[data-calc-option]', panel);
    var range = panel.querySelector('[data-calc-range]');
    var fmt = function (n) { return new Intl.NumberFormat('lv-LV').format(n); };
    var clamp = function (v) { return Math.max(10, Math.min(400, v)); };
    var put = function (sel, v) { var e = panel.querySelector(sel); if (e) e.textContent = v; };
    var field = function (k, v) { var e = panel.querySelector('[data-calc-field="' + k + '"]'); if (e) e.value = v; };
    var render = function () {
      var o = opts[calc.i];
      opts.forEach(function (b, j) {
        b.classList.toggle('is-active', j === calc.i);
        b.setAttribute('aria-pressed', j === calc.i ? 'true' : 'false');
      });
      var total = fmt(o.dataset.min * calc.area) + ' – ' + fmt(o.dataset.max * calc.area) + ' €';
      put('[data-calc-area]', calc.area + ' m²');
      put('[data-calc-total]', total);
      put('[data-calc-note]', o.dataset.note);
      if (range) range.value = calc.area;
      field('type', o.textContent.trim());
      field('total', total);
    };
    opts.forEach(function (b, j) { b.addEventListener('click', function () { calc.i = j; render(); }); });
    $$('[data-calc-step]', panel).forEach(function (b) {
      b.addEventListener('click', function () { calc.area = clamp(calc.area + Number(b.dataset.calcStep)); render(); });
    });
    if (range) range.addEventListener('input', function () { calc.area = clamp(Number(range.value)); render(); });
    var toggles = $$('[data-calc-toggle]', panel);
    var setMode = function (m) {
      toggles.forEach(function (t) {
        var on = t.dataset.calcToggle === m;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      $$('[data-calc-mode]', panel).forEach(function (f) {
        (f.closest('.w-form') || f).style.display = f.dataset.calcMode === m ? 'block' : 'none';
      });
    };
    toggles.forEach(function (t) { t.addEventListener('click', function () { setMode(t.dataset.calcToggle); }); });
    // "Aprēķināt / Pieteikties" buttons in the services list: data-calc-apply = Kalkulatora veids
    // (empty → request form with the service preselected), data-service = service name.
    $$('[data-service]').forEach(function (b) {
      var n = b.getAttribute('data-calc-apply');
      var inCalc = n !== null && n !== '' && opts[Number(n)];
      b.textContent = inCalc ? 'Aprēķināt un pieteikties' : 'Pieteikties šim pakalpojumam';
      b.addEventListener('click', function () {
        if (inCalc) { calc.i = Number(n); render(); setMode('calc'); return; }
        setMode('form');
        var sel = panel.querySelector('select');
        if (sel) sel.value = b.dataset.service;
      });
    });
    render();
    setMode('calc');
  }

  // CMS request forms: the hidden [data-product-name] input carries the page's item name (h1).
  $$('[data-product-name]').forEach(function (i) {
    var h = document.querySelector('h1');
    i.value = h ? h.textContent.trim() : document.title;
  });

  // Rich text galleries (Bilžu galerija): every <figure> with an image is a gallery item.
  var figsIn = function (sel) {
    return $$(sel + ' figure').filter(function (f) { return f.querySelector('img'); });
  };
  var asButton = function (el, label, fn) {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', label);
    el.addEventListener('click', fn);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
    });
  };

  // Rental product: the first spec section starts open (Webflow drops the open attribute).
  var firstSection = document.querySelector('.rental-product_accordion');
  if (firstSection) firstSection.open = true;

  // Rental product: thumbnails swap the main image.
  var mainImg = document.querySelector('.rental-product_main-image');
  var thumbs = figsIn('.rental-product_thumbs');
  if (mainImg && thumbs.length) {
    thumbs.forEach(function (f, i) {
      var img = f.querySelector('img');
      asButton(f, 'Rādīt bildi ' + (i + 1), function () {
        mainImg.removeAttribute('srcset');
        mainImg.src = img.getAttribute('src');
        mainImg.alt = img.alt || mainImg.alt;
        thumbs.forEach(function (o) { o.classList.toggle('is-active', o === f); });
      });
    });
    thumbs[0].classList.add('is-active');
  }

  // Project: photo lightbox over the gallery, video lightbox from the YouTube field.
  var lbs = {};
  $$('[data-lightbox]').forEach(function (l) { lbs[l.dataset.lightbox] = l; });
  var lastFocus = null;
  var openLb = function (l) {
    lastFocus = document.activeElement;
    l.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    var c = l.querySelector('[data-lightbox-close]');
    if (c) c.focus();
  };
  var closeLb = function () {
    var was = Object.keys(lbs).some(function (k) { return lbs[k].classList.contains('is-open'); });
    Object.keys(lbs).forEach(function (k) { lbs[k].classList.remove('is-open'); });
    var v = lbs.video && lbs.video.querySelector('iframe');
    if (v) v.src = v.src; // stop playback
    document.body.style.overflow = '';
    if (was && lastFocus) lastFocus.focus();
  };
  $$('[data-lightbox-close]').forEach(function (b) { b.addEventListener('click', closeLb); });
  Object.keys(lbs).forEach(function (k) {
    lbs[k].addEventListener('click', function (e) { if (e.target === lbs[k]) closeLb(); });
  });
  var playBtn = document.querySelector('[data-video-open]');
  if (playBtn && lbs.video && lbs.video.querySelector('iframe')) {
    playBtn.addEventListener('click', function () { openLb(lbs.video); });
  }
  var photos = figsIn('.project-gallery_list');
  var cur = 0;
  var showPhoto = function (i) {
    cur = (i + photos.length) % photos.length;
    var img = photos[cur].querySelector('img');
    var big = lbs.photo.querySelector('.lightbox_image'); // Image elements drop data attributes
    big.removeAttribute('srcset');
    big.src = img.getAttribute('src');
    big.alt = img.alt || '';
    lbs.photo.querySelector('[data-lightbox-count]').textContent = (cur + 1) + ' / ' + photos.length;
  };
  if (lbs.photo && photos.length) {
    photos.forEach(function (f, i) {
      asButton(f, 'Atvērt bildi ' + (i + 1), function () { showPhoto(i); openLb(lbs.photo); });
    });
    if (photos.length > 4) {
      var rest = photos.length - 4;
      var more = document.createElement('span');
      more.className = 'project-gallery_more';
      more.textContent = '+' + rest + (rest % 10 === 1 && rest % 100 !== 11 ? ' bilde' : ' bildes');
      photos[3].appendChild(more);
    }
    var prev = lbs.photo.querySelector('[data-lightbox-prev]');
    var next = lbs.photo.querySelector('[data-lightbox-next]');
    if (prev) prev.addEventListener('click', function () { showPhoto(cur - 1); });
    if (next) next.addEventListener('click', function () { showPhoto(cur + 1); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLb();
    if (lbs.photo && lbs.photo.classList.contains('is-open')) {
      if (e.key === 'ArrowLeft') showPhoto(cur - 1);
      if (e.key === 'ArrowRight') showPhoto(cur + 1);
    }
  });

  // The importer turns <button> into <a> without href: make those keyboard operable.
  $$('a[type="button"], a[data-filter-group]').forEach(function (a) {
    if (!a.hasAttribute('href')) a.setAttribute('tabindex', '0');
    if (!a.getAttribute('role')) a.setAttribute('role', 'button');
    a.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); a.click(); }
    });
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  // Filter tabs: [data-filter-group][data-filter] tabs, [data-filter-list] Collection List,
  // items carry data-filter-value (CMS slug), counts [data-filter-count].
  var groups = {};
  $$('[data-filter-group]').forEach(function (t) { (groups[t.dataset.filterGroup] = groups[t.dataset.filterGroup] || []).push(t); });
  Object.keys(groups).forEach(function (g) {
    var tabs = groups[g];
    var items = [];
    $$('[data-filter-list="' + g + '"]').forEach(function (l) { items = items.concat($$('[data-filter-value]', l)); });
    tabs.forEach(function (t) {
      var c = t.querySelector('[data-filter-count]');
      if (c) c.textContent = t.dataset.filter === 'all' ? items.length
        : items.filter(function (i) { return i.dataset.filterValue === t.dataset.filter; }).length;
      t.addEventListener('click', function () {
        tabs.forEach(function (o) {
          var on = o === t;
          o.classList.toggle('is-active', on);
          o.setAttribute(o.getAttribute('role') === 'tab' ? 'aria-selected' : 'aria-pressed', on ? 'true' : 'false');
        });
        items.forEach(function (i) {
          i.style.display = t.dataset.filter === 'all' || i.dataset.filterValue === t.dataset.filter ? '' : 'none';
        });
      });
    });
  });

  // Motion. Brand pattern: .pattern-bars elements (two bars, built and styled in the Designer) slide up
  // from their edge when they come into view; with data-bars-scrub they follow the scroll instead.
  (function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var vh = function () { return window.innerHeight || document.documentElement.clientHeight; };
    if (reduce || !('IntersectionObserver' in window)) return;
    var bars = $$('.pattern-bars');
    bars.forEach(function (el) {
      if (el.hasAttribute('data-bars-scrub')) { el.classList.add('is-scrub'); return; }
      var r = el.getBoundingClientRect();
      if (r.top < vh() && r.bottom > 0) el.classList.add('is-in'); // on screen at load: shown as is
    });
    document.documentElement.classList.add('pb-motion');

    // Reveals: whatever enters the screen together rises in, staggered left to right, top to bottom.
    var targets = [
      'main section h2', '.home-services_item', '.home-about_collage', '.home-about_value', '.rental-card',
      '.home-reviews_card', '.home-cta_wrapper-3 > *', '.benefits_item', '.benefits_photo', '.services-reviews_card',
      '.contacts_card', '.services-list_cms-item', '.rental-list_item', '.portfolio-list_item', '.about-story_block',
      '.about-stats_item', '.about-values_item', '.about-values_image', '.about-team_item', '.about-partners_logo',
      '.about-cta_panel', '.contact-partners img', '.project-header_image-wrapper', 'main section aside',
      '.project-gallery_list figure', '.rental-product_accordion', '.footer_grid > *'
    ].join(',');
    var io = new IntersectionObserver(function (entries) {
      var hits = entries.filter(function (e) { return e.isIntersecting; }).map(function (e) { return e.target; });
      hits.sort(function (a, b) {
        var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        return Math.abs(ra.top - rb.top) > 24 ? ra.top - rb.top : ra.left - rb.left;
      });
      hits.forEach(function (el, k) {
        el.style.setProperty('--pb-d', Math.min(k, 7) * 0.07 + 's');
        el.classList.add('is-in');
        io.unobserve(el);
        el.addEventListener('transitionend', function done(e) {
          if (e.target !== el || e.propertyName !== 'transform') return;
          el.removeEventListener('transitionend', done);
          el.removeAttribute('data-pb-reveal'); el.classList.remove('is-in'); el.style.removeProperty('--pb-d');
        });
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$(targets).forEach(function (el) {
      if (el.closest('.home-hero_component, .navbar_component')) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh() * 0.92 && r.bottom > 0) return; // already on screen: never hide it
      el.setAttribute('data-pb-reveal', '');
      io.observe(el);
    });

    // Pattern bars rise when they come into view; scrub bars follow the scroll position.
    var barIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); barIo.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    var scrub = bars.filter(function (el) { return el.classList.contains('is-scrub'); });
    bars.forEach(function (el) { if (!el.classList.contains('is-scrub') && !el.classList.contains('is-in')) barIo.observe(el); });

    // Counters: whole numbers (with an optional +) count up the first time they are seen.
    var countIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        countIo.unobserve(e.target);
        var el = e.target, end = +el.dataset.pbCount, suffix = el.dataset.pbSuffix || '', t0 = null;
        el.style.minWidth = el.getBoundingClientRect().width + 'px';
        (function step(ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min(1, (ts - t0) / 1400), v = Math.round(end * (1 - Math.pow(1 - p, 4)));
          el.textContent = v + suffix;
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    $$('.home-hero_stat-number, .home-about_badge-number, .about-stats_number, .about-hero_badge strong, .contact_stat strong, .benefits_big').forEach(function (el) {
      var m = el.textContent.trim().match(/^(\d{1,4})(\+?)$/);
      if (!m || el.children.length) return;
      el.dataset.pbCount = m[1]; el.dataset.pbSuffix = m[2];
      el.classList.add('pb-count');
      countIo.observe(el);
    });

    // Scroll: hero and call-to-action photos drift slower than the page; scrub bars follow the scroll.
    var drift = $$('.home-hero_background-image, .home-cta_background-image, .about-stats_image, .about-cta_bg');
    var ticking = false;
    function frame() {
      ticking = false;
      var h = vh();
      drift.forEach(function (img) {
        var box = (img.closest('section') || img.parentNode).getBoundingClientRect();
        if (box.bottom < 0 || box.top > h) return;
        var c = (box.top + box.height / 2 - h / 2) / (h + box.height);
        img.style.translate = '0 ' + (c * -12).toFixed(2) + '%';
      });
      scrub.forEach(function (el) {
        var r = el.getBoundingClientRect(), p = (h - r.bottom) / (h * 0.4);
        $$('.pattern-bars_bar', el).forEach(function (b, i) {
          var t = Math.max(0, Math.min(1, (p - i * 0.35) / 0.65));
          b.style.translate = '0 ' + ((1 - t) * 101).toFixed(1) + '%';
        });
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    drift.forEach(function (img) { img.style.scale = '1.14'; });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    frame();

    // Filter tabs: the items left in view rise back in after a filter change.
    document.addEventListener('click', function (e) {
      if (!e.target.closest('[data-filter-group]')) return;
      setTimeout(function () {
        var shown = $$('[data-filter-value]').filter(function (i) {
          if (i.style.display === 'none') return false;
          var r = i.getBoundingClientRect(); return r.top < vh() && r.bottom > 0;
        });
        shown.forEach(function (i, k) {
          if (i.animate) i.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
            { duration: 500, delay: Math.min(k, 7) * 50, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' });
        });
      }, 0);
    });
  })();
})();
