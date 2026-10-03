(() => {
  const pages = [...document.querySelectorAll('.page')];
  const progress = document.querySelector('.progress');
  const nextButton = document.querySelector('.nav');
  let current = 0;
  let touchStartX = 0;

  const dots = pages.map((page, index) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to page ${index + 1}`);
    dot.addEventListener('click', () => show(index));
    progress.append(dot);
    return dot;
  });

  function show(index) {
    current = (index + pages.length) % pages.length;
    pages.forEach((page, i) => {
      const active = i === current;
      page.classList.toggle('active', active);
      page.setAttribute('aria-hidden', String(!active));
      page.inert = !active;
      if (active) page.scrollTop = 0;
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      if (i === current) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    });
    progress.setAttribute('aria-label', `Page ${current + 1} of ${pages.length}`);
    const isLastPage = current === pages.length - 1;
    nextButton.innerHTML = isLastPage ? '&lt; restart &gt;' : 'next &gt;&gt;';
    nextButton.setAttribute('aria-label', isLastPage ? 'Restart the birthday story' : 'Go to next page');
  }

  nextButton.addEventListener('click', () => show(current === pages.length - 1 ? 0 : current + 1));
  window.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight' || event.key === ' ') {
      if (event.target instanceof HTMLButtonElement && event.key === ' ') return;
      event.preventDefault();
      show(current + 1);
    } else if (event.key === 'ArrowLeft') {
      show(current - 1);
    }
  });

  const story = document.querySelector('.story');
  story.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  story.addEventListener('touchend', event => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 65) show(current + (distance < 0 ? 1 : -1));
  }, { passive: true });

  show(0);
})();
