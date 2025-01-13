
// global.js
if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/global.js');
} else {
  (() => {
  // src/global.ts
  var _a;
  (_a = window.Webflow) == null ? void 0 : _a.push(() => {
  });
})();
}
