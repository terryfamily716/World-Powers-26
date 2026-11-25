(function () {
  function redraw() {
    if (window.map && typeof window.map.invalidateSize === "function") {
      setTimeout(function () {
        window.map.invalidateSize();
      }, 100);
    }
  }

  function hookCard() {
    var card = document.getElementById("stats-card");
    if (!card) {
      setTimeout(hookCard, 500);
      return;
    }
    new MutationObserver(redraw).observe(card, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hookCard);
  } else {
    hookCard();
  }

  window.addEventListener("resize", redraw);
})();