(function () {
  const titlePrefix = "🔒\u200E ";
  const minLoadTimeMillis = 500;

  let loadedTime = Date.now();
  let isLocked = false;
  let titleObserver = null;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.message) {
      case "setIsLocked":
        isLocked = request.data.isLocked;

        // Some pages like Google Meet change their title on load, which can result in visual
        // weirdness if we also try to change it too early, so we wait a bit to avoid this.
        if (Date.now() - loadedTime < minLoadTimeMillis) {
          setTimeout(() => {
            setTitle(request.data.showTabIcon);
          }, minLoadTimeMillis);
        } else {
          setTitle(request.data.showTabIcon);
        }

        break;
    }

    sendResponse();
  });

  chrome.runtime.sendMessage({
    message: "init",
    data: {
      colorScheme: window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light",
    },
  });

  window.addEventListener(
    "beforeunload",
    (event) => {
      if (!isLocked) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      event.returnValue = "[LockTab] Are you sure you want to exit?";
      return event.returnValue;
    },
    true
  );

  function setTitle(showTabIcon) {
    if (isLocked) {
      if (!showTabIcon) {
        return;
      }

      if (!document.title.startsWith(titlePrefix)) {
        document.title = titlePrefix + document.title.replace(titlePrefix, "");
      }

      if (!titleObserver && typeof MutationObserver !== "undefined") {
        let titleElement = document.querySelector("head > title");
        if (titleElement) {
          titleObserver = new MutationObserver((mutations) => {
            if (!document.title.startsWith(titlePrefix)) {
              document.title = titlePrefix + document.title.replace(titlePrefix, "");
            }
          });

          titleObserver.observe(titleElement, {
            subtree: true,
            childList: true,
          });
        }
      }
    } else {
      if (document.title.includes(titlePrefix)) {
        document.title = document.title.replace(titlePrefix, "");
      }

      if (titleObserver) {
        titleObserver.disconnect();
        titleObserver = null;
      }
    }
  }
})();
