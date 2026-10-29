// Leistung der Wärmepumpe umschalten (8 kW / 16 kW)
document.querySelectorAll('[data-product="wp"]').forEach(function (card) {
  var buttons = card.querySelectorAll('[data-size]');

  function select(size) {
    buttons.forEach(function (b) {
      b.setAttribute('aria-checked', String(b.dataset.size === size));
      b.tabIndex = b.dataset.size === size ? 0 : -1;
    });
    card.querySelectorAll('[data-size-img]').forEach(function (el) { el.hidden = el.dataset.sizeImg !== size; });
    card.querySelectorAll('[data-size-specs]').forEach(function (el) { el.hidden = el.dataset.sizeSpecs !== size; });
    // Das 16-kW-Angebot ist auf eBay nicht mehr online, daher nur beim 8-kW-Gerät verlinken
    card.querySelectorAll('[data-size-link]').forEach(function (el) { el.hidden = el.dataset.sizeLink !== size; });
  }

  buttons.forEach(function (b, i) {
    b.addEventListener('click', function () { select(b.dataset.size); });
    b.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var next = buttons[(i + (e.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length];
      select(next.dataset.size);
      next.focus();
    });
  });

  select('8');
});

// ---------- Bildergalerien ----------
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lightbox = document.querySelector('.lightbox');
  var galleries = [];

  function Gallery(root) {
    var track = root.querySelector('.gal-track');
    var prev = root.querySelector('.gal-prev');
    var next = root.querySelector('.gal-next');
    var dotsBox = root.querySelector('.gal-dots');
    var count = root.querySelector('.gal-count');
    var self = { root: root, index: 0 };

    self.slides = function () {
      return Array.prototype.filter.call(track.querySelectorAll('.slide'), function (s) { return !s.classList.contains('failed'); });
    };

    self.go = function (i, instant) {
      var slides = self.slides();
      if (!slides.length) return;
      i = Math.max(0, Math.min(i, slides.length - 1));
      track.scrollTo({ left: slides[i].offsetLeft, behavior: instant || reduce ? 'auto' : 'smooth' });
      self.update(i);
    };

    self.update = function (i) {
      var slides = self.slides();
      self.index = i;
      prev.disabled = i <= 0;
      next.disabled = i >= slides.length - 1;
      count.textContent = (i + 1) + ' / ' + slides.length;
      Array.prototype.forEach.call(dotsBox.children, function (d, k) { d.classList.toggle('on', k === i); });
    };

    self.rebuild = function () {
      var slides = self.slides();
      root.classList.toggle('single', slides.length <= 1);
      root.classList.toggle('no-photo', slides.length === 0);
      dotsBox.innerHTML = '';
      slides.forEach(function () { dotsBox.appendChild(document.createElement('span')); });
      slides.forEach(function (s, k) {
        var img = s.querySelector('img');
        img.alt = img.alt.replace(/Foto \d+ von \d+/, 'Foto ' + (k + 1) + ' von ' + slides.length);
      });
      self.update(Math.min(self.index, Math.max(slides.length - 1, 0)));
    };

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        if (!track.clientWidth) return;
        var i = Math.round(track.scrollLeft / track.clientWidth);
        if (i !== self.index) self.update(i);
      });
    }, { passive: true });

    prev.addEventListener('click', function () { self.go(self.index - 1); });
    next.addEventListener('click', function () { self.go(self.index + 1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); self.go(self.index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); self.go(self.index + 1); }
      if (e.key === 'Enter') { e.preventDefault(); openLightbox(self); }
    });
    track.addEventListener('click', function (e) { if (e.target.closest('.slide')) openLightbox(self); });
    root.querySelector('.gal-zoom').addEventListener('click', function () { openLightbox(self); });

    self.rebuild();
    return self;
  }

  document.querySelectorAll('[data-gallery]').forEach(function (el) { galleries.push(Gallery(el)); });

  // Fotos, die nachträglich nicht laden, entfernen
  document.addEventListener('gallery:failed', function (e) {
    galleries.forEach(function (g) { if (g.root.contains(e.detail)) g.rebuild(); });
  });

  // Galerie beim Umschalten 8/16 kW auf das erste Foto zurücksetzen
  document.querySelectorAll('[data-size]').forEach(function (b) {
    b.addEventListener('click', function () {
      galleries.forEach(function (g) { if (!g.root.hidden) { g.rebuild(); g.go(0, true); } });
    });
  });

  // ---------- Großansicht ----------
  if (!lightbox || typeof lightbox.showModal !== 'function') return;
  var lbTrack = lightbox.querySelector('.lb-track');
  var lbCount = lightbox.querySelector('.lb-count');
  var lbPrev = lightbox.querySelector('.lb-prev');
  var lbNext = lightbox.querySelector('.lb-next');
  var lbIndex = 0, lbTotal = 0, lbOwner = null;

  function lbUpdate(i) {
    lbIndex = i;
    lbCount.textContent = (i + 1) + ' / ' + lbTotal;
    lbPrev.disabled = i <= 0;
    lbNext.disabled = i >= lbTotal - 1;
    lbPrev.hidden = lbNext.hidden = lbTotal <= 1;
    lbCount.hidden = lbTotal <= 1;
  }
  function lbGo(i, instant) {
    i = Math.max(0, Math.min(i, lbTotal - 1));
    lbTrack.scrollTo({ left: i * lbTrack.clientWidth, behavior: instant || reduce ? 'auto' : 'smooth' });
    lbUpdate(i);
  }

  function openLightbox(g) {
    var slides = g.slides();
    if (!slides.length) return;
    lbOwner = g;
    lbTotal = slides.length;
    lbTrack.innerHTML = '';
    slides.forEach(function (s) {
      var src = s.querySelector('img');
      var fig = document.createElement('figure');
      var img = document.createElement('img');
      img.src = src.currentSrc || src.src;
      img.alt = src.alt;
      fig.appendChild(img);
      lbTrack.appendChild(fig);
    });
    lightbox.showModal();
    document.documentElement.style.overflow = 'hidden';
    lbGo(g.index, true);
    lbTrack.focus();
  }

  var lbTick = false;
  lbTrack.addEventListener('scroll', function () {
    if (lbTick) return;
    lbTick = true;
    requestAnimationFrame(function () {
      lbTick = false;
      var i = Math.round(lbTrack.scrollLeft / lbTrack.clientWidth);
      if (i !== lbIndex) lbUpdate(i);
    });
  }, { passive: true });

  lbPrev.addEventListener('click', function () { lbGo(lbIndex - 1); });
  lbNext.addEventListener('click', function () { lbGo(lbIndex + 1); });
  lightbox.querySelector('.lb-close').addEventListener('click', function () { lightbox.close(); });
  lightbox.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); lbGo(lbIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); lbGo(lbIndex + 1); }
  });
  // Klick auf den hellen Rand neben dem Foto schließt
  lbTrack.addEventListener('click', function (e) { if (e.target.tagName === 'FIGURE') lightbox.close(); });
  lightbox.addEventListener('close', function () {
    document.documentElement.style.overflow = '';
    if (lbOwner) lbOwner.go(lbIndex, true);
  });
})();
