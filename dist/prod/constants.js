
if (window.SCRIPTS_ENV === 'dev') {
  window.loadScript('http://localhost:3000/constants.js');
} else {
  // constants.js
  (() => {
  // src/constants.ts
  var SCRIPTS_LOADED_EVENT = "scriptsLoaded";
})();
}
