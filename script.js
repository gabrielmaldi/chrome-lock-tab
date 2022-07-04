(function () {
  let isLocked = false;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.message) {
      case "setIsLocked":
        isLocked = request.value;
        break;
    }

    sendResponse();
  });

  window.addEventListener("beforeunload", function (event) {
    if (!isLocked) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    event.returnValue = "[LockTab] Are you sure you want to exit?";
    return event.returnValue;
  }, true);
})();
