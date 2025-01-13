
if (window.SCRIPTS_ENV === 'dev') {
  window.loadScript('http://localhost:3000/global.js');
} else {
  // global.js
  (() => {
  // src/global.ts
  var _a;
  (_a = window.Webflow) == null ? void 0 : _a.push(() => {
  });
})();
}
