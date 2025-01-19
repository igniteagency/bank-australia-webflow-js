
// constants.js
if (window.SCRIPTS_ENV === 'dev') {
  window.loadLocalScript('http://localhost:3000/constants.js');
} else {
  (() => {
  // src/constants.ts
  var SCRIPTS_LOADED_EVENT = "scriptsLoaded";
  var LOCAL_SCRIPT_URL = "http://localhost:3000/";
})();
}
