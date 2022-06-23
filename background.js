chrome.action.onClicked.addListener(tab => {
  let key = `tab_${tab.id}`;

  chrome.storage.local.get(key, ({ [key]: isLocked }) => {
    isLocked = !isLocked;

    chrome.storage.local.set({ [key]: isLocked }, async () => {
      await chrome.scripting.executeScript({
        injectImmediately: true,
        target: { tabId: tab.id },
        args: [isLocked],
        function: (isLocked) => {
          if (isLocked) {
            if (!window.$$lockTabListener) {
              window.$$lockTabListener = (event) => {
                event.preventDefault();
                return event.returnValue = "[LockTab] Are you sure you want to exit?";
              };

              window.addEventListener("beforeunload", window.$$lockTabListener);
            }
          } else {
            if (window.$$lockTabListener) {
              window.removeEventListener("beforeunload", window.$$lockTabListener);
              delete window.$$lockTabListener;
            }
          }
        },
      });

      chrome.action.setIcon({
        tabId: tab.id,
        path: `images/${isLocked ? "locked" : "unlocked"}.png`,
      });
    });
  });
});
