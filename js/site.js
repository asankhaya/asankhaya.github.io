// Open any collapsed <details> that contains the linked anchor, then scroll to it.
(function () {
  function reveal() {
    var id = decodeURIComponent(location.hash.slice(1));
    var el = id && document.getElementById(id);
    if (!el) return;
    for (var d = el.closest('details'); d; d = d.parentElement.closest('details')) d.open = true;
    el.scrollIntoView();
  }
  window.addEventListener('hashchange', reveal);
  document.addEventListener('DOMContentLoaded', reveal);
})();
