(function () {
  const path = window.location.pathname;
  const file = (path.split('/').pop() || '').toLowerCase();
  if (!file.startsWith('box-') || !file.endsWith('.html') || file.includes('-print')) return;

  const pathMatch = path.match(/\/lezione(\d+)\//i);
  const fileMatch = file.match(/^box-(\d)\./i);
  const refMatch = (document.referrer || '').match(/lezione([1-9])\.html/i);
  const lesson = Number((pathMatch && pathMatch[1]) || (fileMatch && fileMatch[1]) || (refMatch && refMatch[1]) || 0);

  const lessonPage = lesson ? `../../lezione${lesson}.html` : '../../../didattica.html';
  const printFile = file.replace('.html', '-print.html');
  const target = printFile + '?autoprint=1&return=' + encodeURIComponent(lessonPage);

  const goBackToLesson = function () {
    if (window.opener && !window.opener.closed) {
      window.close();
      return;
    }
    window.location.href = lessonPage;
  };

  const closeLightbox = function () {
    const lb = document.getElementById('lightbox');
    if (lb) lb.remove();
  };

  const panel = document.createElement('div');
  panel.className = 'print-links-panel';

  const printBtn = document.createElement('a');
  printBtn.className = 'print-link print-link-single';
  printBtn.href = target;
  printBtn.textContent = 'Stampa questa scheda (A4)';
  printBtn.setAttribute('aria-label', 'Apri direttamente il dialogo di stampa della scheda corrente');
  panel.appendChild(printBtn);

  const backBtn = document.createElement('a');
  backBtn.className = 'back-top-link';
  backBtn.href = lessonPage;
  backBtn.textContent = '← Torna alla lezione';
  backBtn.setAttribute('aria-label', 'Torna al testo della lezione');
  backBtn.addEventListener('click', function (e) {
    e.preventDefault();
    goBackToLesson();
  });
  panel.appendChild(backBtn);

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(panel);

    document.querySelectorAll('.box-footer a').forEach(function (link) {
      if (link.classList.contains('box-footer-enhanced')) return;
      link.classList.add('box-footer-enhanced');
      link.setAttribute('href', lessonPage);
      link.removeAttribute('onclick');
      link.addEventListener('click', function (e) {
        e.preventDefault();
        goBackToLesson();
      });
    });

    // Swipe touch su tablet/mobile per i carousel (sinistra=avanti, destra=indietro)
    document.querySelectorAll('.carousel-container').forEach(function (container) {
      let startX = 0;
      let startY = 0;

      container.addEventListener('touchstart', function (e) {
        if (!e.touches || e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }, { passive: true });

      container.addEventListener('touchend', function (e) {
        if (!e.changedTouches || e.changedTouches.length !== 1) return;
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const dx = endX - startX;
        const dy = endY - startY;

        // Ignora movimenti brevi o prevalentemente verticali
        if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.2) return;

        const prevBtn = container.querySelector('.carousel-button.prev');
        const nextBtn = container.querySelector('.carousel-button.next');
        if (!prevBtn || !nextBtn || typeof window.moveSlide !== 'function') return;

        if (dx < 0) {
          window.moveSlide(nextBtn, 1);
        } else {
          window.moveSlide(prevBtn, -1);
        }
      }, { passive: true });
    });

    // Chiusura robusta lightbox: clic su sfondo o tasto ESC
    document.addEventListener('click', function (e) {
      const lb = document.getElementById('lightbox');
      if (!lb) return;
      if (e.target === lb || e.target.classList.contains('close')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    });
  });
})();
