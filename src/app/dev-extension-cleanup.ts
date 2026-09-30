/**
 * Development only. Some browser extensions (e.g. Bitdefender's) stamp attributes such as
 * `bis_skin_checked` onto every element before React hydrates, which makes Next.js show a
 * hydration-mismatch overlay on every page. This removes exactly those attributes as they appear,
 * until shortly after load. Real hydration bugs are still reported: nothing else is touched.
 */
export const DEV_EXTENSION_CLEANUP_SCRIPT = `(function () {
  var NAMES = ["bis_skin_checked", "bis_register", "bis_use", "bis_size", "bis_id"];
  function clean(el) {
    if (!el || el.nodeType !== 1) return;
    for (var i = el.attributes.length - 1; i >= 0; i--) {
      var name = el.attributes[i].name;
      if (NAMES.indexOf(name) !== -1 || name.indexOf("__processed_") === 0) el.removeAttribute(name);
    }
  }
  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type === "attributes") clean(m.target);
      else for (var j = 0; j < m.addedNodes.length; j++) {
        var node = m.addedNodes[j];
        clean(node);
        if (node.querySelectorAll) node.querySelectorAll("*").forEach(clean);
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
  document.querySelectorAll("*").forEach(clean);
  // Hydration happens once, right after load; after that extra attributes are harmless.
  window.addEventListener("load", function () {
    setTimeout(function () { observer.disconnect(); }, 5000);
  });
})();`;
