(function () {
  window.addEventListener("beforeunload", function (event) {
    if (!window.$$lockTabIsLocked) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    event.returnValue = "[LockTab] Are you sure you want to exit?";
    return event.returnValue;
  }, true);
})();
