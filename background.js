chrome.action.onClicked.addListener(tab => {
  let key = `tab_${tab.id}`;

  chrome.storage.local.get(key, ({ [key]: isLocked }) => {
    isLocked = !isLocked;

    chrome.storage.local.set({ [key]: isLocked }, async () => {
      await chrome.tabs.sendMessage(tab.id, {
        message: "setIsLocked",
        value: isLocked,
      });

      await chrome.action.setIcon({
        tabId: tab.id,
        path: `images/${isLocked ? "locked" : "unlocked"}.png`,
      });
    });
  });
});
