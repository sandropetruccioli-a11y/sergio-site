(function () {
  const toc = document.querySelector('.toc');
  const header = document.querySelector('.service-header');
  if (!toc || !header) return;

  // Tablet/phone in verticale: usa drawer; in orizzontale lascia TOC fisso.
  const drawerMq = window.matchMedia('(max-width: 1024px) and (orientation: portrait), (max-width: 760px)');

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'toc-toggle';
  toggle.setAttribute('aria-controls', 'toc-nav');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.textContent = 'Contenuti';

  toc.id = toc.id || 'toc-nav';
  header.appendChild(toggle);

  const overlay = document.createElement('button');
  overlay.type = 'button';
  overlay.className = 'toc-overlay';
  overlay.setAttribute('aria-label', 'Chiudi indice contenuti');
  document.body.appendChild(overlay);

  const backLink = toc.querySelector('a[href="../didattica.html"]');
  if (backLink) {
    backLink.classList.add('toc-back-link');
    const li = backLink.closest('li');
    if (li) {
      li.classList.add('toc-back-item');
      const boxes = toc.querySelector('.toc-boxes');
      if (boxes && boxes.parentNode) {
        boxes.parentNode.insertBefore(li, boxes.nextSibling);
      }
    }
  }

  const isDrawerMode = function () {
    const portraitTablet = window.innerWidth <= 1024 && window.innerHeight > window.innerWidth;
    return drawerMq.matches || portraitTablet;
  };

  const setOpen = function (open) {
    if (!isDrawerMode()) {
      document.body.classList.remove('toc-open');
      toggle.setAttribute('aria-expanded', 'false');
      return;
    }
    document.body.classList.toggle('toc-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  toggle.addEventListener('click', function () {
    setOpen(!document.body.classList.contains('toc-open'));
  });

  overlay.addEventListener('click', function () {
    setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  toc.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      setOpen(false);
    });
  });

  drawerMq.addEventListener('change', function () {
    setOpen(false);
  });
})();
