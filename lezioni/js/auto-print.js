(function () {
  const path = window.location.pathname;
  const file = (path.split('/').pop() || '').toLowerCase();
  const lessonFromPath = path.match(/\/lezione(\d+)\//i);
  const lessonFromFile = file.match(/^box-(\d+)\./i);
  const lesson = Number((lessonFromPath && lessonFromPath[1]) || (lessonFromFile && lessonFromFile[1]) || 0);

  const singleScheda = file.match(/^box-(\d+\.\d+)-print\.html$/i);
  const multiSchede = file.match(/^box-(\d+)\.\d+_\d+-print\.html$/i);

  const sourceText = (function () {
    if (singleScheda) {
      return (
        'Fonte: Scheda ' + singleScheda[1] +
        ' da S. Petruccioli, Nove lezioni di architettura, edizione digitale ad accesso libero. ' +
        'Uso didattico e di studio; citare sempre la fonte.'
      );
    }
    if (multiSchede && lesson) {
      return (
        'Fonte: Schede della Lezione ' + lesson +
        ' da S. Petruccioli, Nove lezioni di architettura, edizione digitale ad accesso libero. ' +
        'Uso didattico e di studio; citare sempre la fonte.'
      );
    }
    if (lesson) {
      return (
        'Fonte: Materiali della Lezione ' + lesson +
        ' da S. Petruccioli, Nove lezioni di architettura, edizione digitale ad accesso libero. ' +
        'Uso didattico e di studio; citare sempre la fonte.'
      );
    }
    return (
      'Fonte: S. Petruccioli, Nove lezioni di architettura, edizione digitale ad accesso libero. ' +
      'Uso didattico e di studio; citare sempre la fonte.'
    );
  })();

  const ensurePrintSource = function () {
    if (document.querySelector('.print-source')) return;
    const container = document.querySelector('.box-container') || document.body;
    const source = document.createElement('p');
    source.className = 'print-source';
    source.textContent = sourceText;
    container.appendChild(source);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensurePrintSource);
  } else {
    ensurePrintSource();
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('autoprint') !== '1') return;

  const inferredReturn = lesson ? `../../lezione${lesson}.html` : null;
  const returnTo = params.get('return') || '';
  const safeReturn = /^(?:\.\.\/){2}lezione[1-9]\.html$/i.test(returnTo)
    ? returnTo
    : inferredReturn;

  let navigated = false;
  const goBack = function () {
    if (!safeReturn || navigated) return;
    navigated = true;
    window.location.href = safeReturn;
  };

  window.addEventListener('load', function () {
    ensurePrintSource();
    setTimeout(function () {
      window.print();
    }, 120);
  });

  window.addEventListener('afterprint', goBack);
  window.addEventListener('focus', function () {
    setTimeout(goBack, 250);
  });
})();
