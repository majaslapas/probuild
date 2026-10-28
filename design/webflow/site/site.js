// ProBuild Group site script (Webflow site footer). Replaces the canvas state logic.
(function () {
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // The site is in Latvian; until Site settings set the language, tell browsers and screen readers here.
  if (!/^lv/i.test(document.documentElement.lang)) document.documentElement.lang = 'lv';

  // Intro on the first page of a visit (site-head.js decides; styles in the site head). Any click, key or
  // scroll skips it. whenIntroDone() holds back motion that would otherwise play unseen behind it.
  var introWaiting = [];
  var whenIntroDone = function (fn) { if (introWaiting) introWaiting.push(fn); else fn(); };
  (function () {
    var root = document.documentElement;
    var finish = function () { var fns = introWaiting; introWaiting = null; fns.forEach(function (fn) { fn(); }); };
    if (!root.classList.contains('pb-intro-wait')) return finish();
    // Slow page (it would cover a page already read) or a background tab (nobody would see it): no intro.
    if (performance.now() > 2500 || document.hidden) { root.classList.remove('pb-intro-wait'); return finish(); }
    var el = document.createElement('div'), bars = document.createElement('div'), logo = document.querySelector('.navbar_logo');
    el.className = 'pb-intro'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="pb-intro_bg"></div>';
    bars.className = 'pb-intro_bars';
    el.appendChild(bars);
    var addBar = function (i) {
      var b = document.createElement('div');
      b.className = 'pb-intro_bar'; b.style.setProperty('--i', i);
      return bars.appendChild(b);
    };
    document.body.appendChild(el);
    var w = addBar(0).offsetWidth || 72, n = Math.ceil(window.innerWidth / (1.5 * w)) + 1; // bar, half-bar gap, bar… edge to edge
    for (var i = 1; i < n; i++) addBar(i);
    if (logo) {
      var img = document.createElement('img');
      img.className = 'pb-intro_logo'; img.alt = ''; img.src = logo.currentSrc || logo.src;
      el.appendChild(img);
    }
    root.classList.add('pb-intro-on');
    var t0 = performance.now(), kinds = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    var off = function () { kinds.forEach(function (k) { window.removeEventListener(k, skip, true); }); };
    var skip = function () { off(); if (performance.now() - t0 < 2000) el.classList.add('is-skip'); }; // not once it fades out
    kinds.forEach(function (k) { window.addEventListener(k, skip, { capture: true, passive: true }); });
    var done = function () {
      if (!el.parentNode) return;
      off(); el.remove(); root.classList.remove('pb-intro-wait', 'pb-intro-on');
      finish();
    };
    el.addEventListener('animationend', function (e) { if (e.target === el) done(); });
    setTimeout(done, 4000); // in case animationend never comes
  })();

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

  // Services list buttons (data-service = service name): services the price calculator knows
  // open it at their works, the others open its plain request form (calculator/README.md).
  // The calculator's code runs after this script (page code), so this waits for the DOM.
  var bindServices = function () {
    $$('[data-service]').forEach(function (b) {
      var inCalc = window.pbCalc && window.pbCalc.has(b.dataset.service);
      b.textContent = inCalc ? 'Aprēķināt un pieteikties' : 'Pieteikties šim pakalpojumam';
      b.addEventListener('click', function (e) {
        // pbc-off: the calculator stopped (see the page head); the link then goes to the forms.
        if (!window.pbCalc || document.documentElement.classList.contains('pbc-off')) return;
        e.preventDefault();
        e.stopPropagation(); // Webflow's own #anchor scrolling would run as well
        var name = b.dataset.service;
        if (!(inCalc && window.pbCalc.show(name))) window.pbCalc.request(name);
      });
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindServices);
  else bindServices();

  // Service pages: the calculator button opens the calculator at this service's works.
  if (/^\/pakalpojums\//.test(location.pathname)) {
    var svcName = document.querySelector('h1');
    $$('a[href="/pakalpojumi#kalkulators"]').forEach(function (a) {
      if (svcName) a.setAttribute('href', '/pakalpojumi?pakalpojums=' + encodeURIComponent(svcName.textContent.trim()) + '#kalkulators');
    });
  }

  // CMS request forms: the hidden [data-product-name] input carries the page's item name (h1).
  $$('[data-product-name]').forEach(function (i) {
    var h = document.querySelector('h1');
    i.value = h ? h.textContent.trim() : document.title;
  });

  // Webflow's spam check (Cloudflare Turnstile) keeps a form's send button disabled until it has a token
  // and says nothing when the check fails (script blocked, strict privacy settings, a browser driven by a
  // tool), so the button just does nothing. A line under the button says "checking" while it runs; on
  // failure it says why and offers a retry and the phone and e-mail.
  if (document.querySelector('[data-turnstile-sitekey]')) {
    var tel = $$('a[href^="tel:"]').filter(function (a) { return /^\+?[\d ]+$/.test(a.textContent.trim()); })[0] || document.querySelector('a[href^="tel:"]');
    var mail = document.querySelector('a[href^="mailto:"]');
    var contact = function (a, isTel) {
      var l = document.createElement('a');
      l.href = a.getAttribute('href');
      l.textContent = isTel && /^\+?[\d ]+$/.test(a.textContent.trim()) ? a.textContent.trim() : l.href.replace(/^\w+:/, '');
      return l;
    };
    $$('.w-form form').forEach(function (form, k) {
      var wrap = form.closest('.w-form'), btn = form.querySelector('[type="submit"]');
      if (!btn) return;
      var note = document.createElement('p'), seen = 0, until = 0, shown = '';
      note.className = 'form_check'; note.id = 'form-check-' + k; note.hidden = true;
      btn.insertAdjacentElement('afterend', note);
      var token = function () { return form.querySelector('[name="cf-turnstile-response"]'); };
      var retry = function () {
        var t = token();
        until = Date.now() + 20000;
        try { window.turnstile.reset(t.id.replace(/_response$/, '')); } catch (e) { until = 0; }
        update();
        setTimeout(update, 20100);
      };
      function update() {
        var t = token(), now = Date.now(), state = '';
        if (btn.disabled && !(t && t.value)) {
          var waiting = wrap.classList.contains('w-form-loading') || now < until;
          state = waiting && !(seen && now - seen > 20000 && now >= until) ? 'wait' : 'fail';
        }
        wrap.classList.toggle('is-check-failed', state === 'fail');
        if (state === shown) return;
        shown = state;
        note.setAttribute('aria-live', state === 'fail' ? 'polite' : 'off'); // read out failures only
        note.hidden = !state;
        note.classList.toggle('is-error', state === 'fail');
        note.textContent = '';
        if (state === 'wait') note.textContent = 'Notiek drošības pārbaude, poga būs pieejama pēc brīža…';
        if (state === 'fail') {
          var canRetry = window.turnstile && t;
          note.appendChild(document.createTextNode(canRetry
            ? 'Drošības pārbaude neizdevās, tāpēc pieteikumu nevar nosūtīt. '
            : 'Drošības pārbaudi neizdevās ielādēt (to var bloķēt pārlūka paplašinājums), tāpēc pieteikumu nevar nosūtīt. '));
          if (canRetry) {
            var b = document.createElement('button');
            b.type = 'button'; b.className = 'form_check-retry'; b.textContent = 'Mēģināt vēlreiz';
            b.addEventListener('click', retry);
            note.appendChild(b);
            note.appendChild(document.createTextNode(' '));
          }
          var parts = [];
          if (tel) parts.push(['zvaniet ', contact(tel, true)]);
          if (mail) parts.push(['rakstiet ', contact(mail)]);
          parts.forEach(function (p, i) {
            note.appendChild(document.createTextNode((i ? ' vai ' : 'Vai ') + p[0]));
            note.appendChild(p[1]);
          });
          if (parts.length) note.appendChild(document.createTextNode('.'));
        }
        if (state) btn.setAttribute('aria-describedby', note.id); else btn.removeAttribute('aria-describedby');
      }
      // During a retry Webflow touches the button only to enable it (passed) or disable it again (failed).
      new MutationObserver(function () { if (until && btn.disabled) until = 0; update(); })
        .observe(btn, { attributes: true, attributeFilter: ['disabled'] });
      new MutationObserver(update).observe(wrap, { attributes: true, attributeFilter: ['class'] });
      new MutationObserver(update).observe(form, { childList: true, subtree: true });
      // A check that never answers (script never loads) counts as failed 20 s after the form is in view.
      if ('IntersectionObserver' in window) {
        var seenIo = new IntersectionObserver(function (en) {
          if (!en[0].isIntersecting) return;
          seenIo.disconnect(); seen = Date.now(); setTimeout(update, 20100);
        });
        seenIo.observe(form);
      }
      update();
    });
  }

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
      '.project-gallery_list figure', '.rental-product_accordion', '.footer_grid > *', '.services-process_step',
      '.prices-factors_item', '.prices-faq_item', '.prices-cta_content > *'
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
      if (el.closest('.home-hero_component, .navbar_component, .pbc')) return;
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
      whenIntroDone(function () { countIo.observe(el); });
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
