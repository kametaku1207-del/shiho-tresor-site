(function () {
  /* メニュー(スマホ) */
  var b = document.getElementById('mbtn'), n = document.getElementById('nav');
  b.addEventListener('click', function () {
    var o = n.classList.toggle('open');
    b.setAttribute('aria-expanded', o ? 'true' : 'false');
  });
  n.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { n.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); }
  });

  /* ふわっと表示 */
  var els = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .15 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  /* 写真があれば、枠の仮ラベルを消す(images/ に写真を置くだけで反映) */
  document.querySelectorAll('.ph[data-img]').forEach(function (el) {
    var im = new Image();
    im.onload = function () { el.classList.add('on'); };
    im.src = el.getAttribute('data-img');
  });

  /* LINEボタンのクリックを記録(Googleアナリティクスを入れたときに使える) */
  document.querySelectorAll('[data-cta]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.gtag) window.gtag('event', 'line_click', { place: a.getAttribute('data-cta') });
    });
  });
})();
