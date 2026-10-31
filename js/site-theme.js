(() => {
  const root = document.documentElement;
  root.classList.add('header-fade', 'header-no-anim');

  async function loadSvg(el) {
    try {
      const res = await fetch(el.dataset.src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const doc = new DOMParser().parseFromString(await res.text(), 'image/svg+xml');
      const svg = doc.documentElement;
      const viewBox = svg.getAttribute('viewBox');
      if (doc.querySelector('parsererror') || !viewBox) throw new Error('Invalid SVG');

      el.setAttribute('viewBox', viewBox);
      el.setAttribute('fill', 'currentColor');
      el.replaceChildren(...[...svg.childNodes].map((node) => document.importNode(node, true)));
    } catch (error) {
      console.error('Failed to load SVG:', error);
    }
  }

  function init() {
    document.querySelectorAll('svg[data-src]').forEach(loadSvg);

    const nav = document.querySelector('#navigatie');
    if (!nav) return root.classList.remove('header-fade', 'header-no-anim');

    const update = () => nav.classList.toggle('header-visible', window.scrollY > window.innerHeight);

    window.addEventListener('scroll', update, { passive: true });
    update();

    // Enable transitions only after the first measurement.
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('header-no-anim')));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
