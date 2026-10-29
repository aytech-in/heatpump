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
