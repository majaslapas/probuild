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
})();
