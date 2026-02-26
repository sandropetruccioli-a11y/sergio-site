(function () {
  const path = window.location.pathname.replace(/\/+$/, '');
  const lessonMatch = path.match(/(?:^|\/)lezione(\d+)(?:\.html)?$/i);
  if (!lessonMatch) return;

  const lesson = Number(lessonMatch[1]);
  if (!lesson || lesson < 1 || lesson > 9) return;

  const toc = document.querySelector('.toc');
  if (!toc) return;

  const sourceText =
    'Fonte: Lezione ' + lesson +
    ' tratta da S. Petruccioli, Nove lezioni di architettura, edizione digitale ad accesso libero. ' +
    'Per usi didattici e di studio; citare sempre la fonte.';

  const ensureLessonPrintSource = function () {
    if (document.querySelector('.lesson-print-source')) return;
    const source = document.createElement('p');
    source.className = 'lesson-print-source';
    source.textContent = sourceText;
    const content = document.getElementById('content') || document.body;
    content.appendChild(source);
  };

  const bundleMap = {
    1: 'box/lezione1/Schede%20lezione1.pdf',
    2: 'box/lezione2/box-2.1_7-print.html?autoprint=1&return=../../lezione2.html',
    3: 'box/lezione3/box-3.1_5-print.html?autoprint=1&return=../../lezione3.html',
    4: 'box/lezione4/box-4.1_5-print.html?autoprint=1&return=../../lezione4.html',
    5: 'box/lezione5/box-5.1_5-print.html?autoprint=1&return=../../lezione5.html',
    6: 'box/lezione6/box-6.1_6-print.html?autoprint=1&return=../../lezione6.html',
    7: 'box/lezione7/box-7.1_6-print.html?autoprint=1&return=../../lezione7.html',
    8: 'box/lezione8/box-8.1_5-print.html?autoprint=1&return=../../lezione8.html',
    9: 'box/lezione9/box-9.1_4-print.html?autoprint=1&return=../../lezione9.html'
  };

  const openBundleAfterLessonPrint = function (url) {
    // Apertura immediata dentro il gesto utente: evita blocco popup.
    window.open(url, '_blank', 'noopener');

    // Poi stampa la lezione corrente con fonte.
    ensureLessonPrintSource();
    setTimeout(function () {
      window.print();
    }, 120);
  };

  const panel = document.createElement('div');
  panel.className = 'lesson-print-panel';

  const section = document.createElement('li');
  section.className = 'toc-section';
  section.textContent = 'Stampa';

  const printLessonLi = document.createElement('li');
  const printLessonBtn = document.createElement('a');
  printLessonBtn.href = '#';
  printLessonBtn.className = 'lesson-print-link';
  printLessonBtn.textContent = 'Salva questa lezione in PDF';
  printLessonBtn.addEventListener('click', function (e) {
    e.preventDefault();
    ensureLessonPrintSource();
    window.print();
  });
  printLessonLi.appendChild(printLessonBtn);

  const printAllLi = document.createElement('li');
  const printAllBtn = document.createElement('a');
  printAllBtn.href = '#';
  printAllBtn.className = 'lesson-print-link lesson-print-link-all';
  printAllBtn.textContent = 'Scarica PDF schede complete';
  printAllBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const bundleUrl = bundleMap[lesson];
    if (!bundleUrl) {
      ensureLessonPrintSource();
      window.print();
      return;
    }
    openBundleAfterLessonPrint(bundleUrl);
  });
  printAllLi.appendChild(printAllBtn);

  panel.appendChild(section);
  panel.appendChild(printLessonLi);
  panel.appendChild(printAllLi);

  const backItem = toc.querySelector('a[href="../didattica.html"]')?.closest('li');
  if (backItem) {
    backItem.parentNode.insertBefore(panel, backItem);
  } else {
    toc.querySelector('ul')?.appendChild(panel);
  }
})();
