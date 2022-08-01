(function () {
  const titlePrefix = "🔒 ";

  let isLocked = false;
  let titleObserver = null;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.message) {
      case "setIsLocked":
        isLocked = request.value;
        setTitle();

        break;
    }

    sendResponse();
  });

  window.addEventListener("beforeunload", (event) => {
    if (!isLocked) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    event.returnValue = "[LockTab] Are you sure you want to exit?";
    return event.returnValue;
  }, true);

  function setTitle() {
    if (isLocked) {
      if (!document.title.startsWith(titlePrefix)) {
        document.title = titlePrefix + document.title;
      }

      if (!titleObserver) {
        let titleElement = document.querySelector("head > title");
        if (titleElement) {
          titleObserver = new MutationObserver((mutations) => {
            if (!document.title.startsWith(titlePrefix)) {
              document.title = titlePrefix + document.title;
            }
          });

          titleObserver.observe(titleElement, {
            subtree: true,
            childList: true,
          });
        }
      }
    } else {
      if (document.title.startsWith(titlePrefix)) {
        document.title = document.title.substring(titlePrefix.length);
      }

      if (titleObserver) {
        titleObserver.disconnect();
        titleObserver = null;
      }
    }
  }
})();
