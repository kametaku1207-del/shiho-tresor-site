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

  /* スライダー: images/video-1.mp4 〜 video-3.mp4 を置くと、動画のスライドが自動で追加される */
  var track = document.getElementById('track'), dots = document.getElementById('dots');
  function slideLeft(s) { return s.offsetLeft - track.offsetLeft; }
  function update() {
    var slides = track.querySelectorAll('.slide'), idx = 0, best = 1e9;
    slides.forEach(function (s, i) { var d = Math.abs(slideLeft(s) - track.scrollLeft); if (d < best) { best = d; idx = i; } });
    [].forEach.call(dots.children, function (d, i) { d.classList.toggle('on', i === idx); });
  }
  function setupSlider() {
    dots.innerHTML = '';
    track.querySelectorAll('.slide').forEach(function (s) {
      var d = document.createElement('i');
      d.addEventListener('click', function () { track.scrollTo({ left: slideLeft(s), behavior: 'smooth' }); });
      dots.appendChild(d);
    });
    update();
  }
  track.addEventListener('scroll', function () { window.requestAnimationFrame(update); });
  document.getElementById('prev').addEventListener('click', function () { track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' }); });
  document.getElementById('next').addEventListener('click', function () { track.scrollBy({ left: track.clientWidth, behavior: 'smooth' }); });
  var vids = ['images/video-1.mp4', 'images/video-2.mp4', 'images/video-3.mp4'], pending = vids.length;
  vids.forEach(function (src, i) {
    fetch(src, { method: 'HEAD' }).then(function (r) {
      if (r.ok && /video/.test(r.headers.get('content-type') || '')) {
        var f = document.createElement('figure'); f.className = 'slide';
        f.innerHTML = '<video src="' + src + '" controls muted playsinline preload="metadata"></video>';
        track.insertBefore(f, track.children[Math.min(1 + i, track.children.length)] || null);
      }
    }).catch(function () {}).then(function () { if (--pending === 0) setupSlider(); });
  });
})();
