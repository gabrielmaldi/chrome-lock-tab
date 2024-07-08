chrome.action.onClicked.addListener((tab) => {
  let key = `tab_${tab.id}`;

  chrome.storage.local.get(key, ({ [key]: isLocked }) => {
    chrome.storage.sync.get("options", ({ options = {} }) => {
      setIsLocked(tab, !isLocked, options.showTabIcon);
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender) => {
  switch (request.message) {
    case "init":
      init(sender.tab, request.data);

      break;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.pinned) {
    chrome.storage.sync.get("options", ({ options = {} }) => {
      if (options.autoLockPinnedTabs === undefined || options.autoLockPinnedTabs) {
        setIsLocked(tab, true, options.showTabIcon);
      }
    });
  }
});

let currentColorScheme = "light";

function setIsLocked(tab, isLocked, showTabIcon) {
  let key = `tab_${tab.id}`;

  chrome.storage.local.set({ [key]: isLocked }, async () => {
    await chrome.tabs.sendMessage(tab.id, {
      message: "setIsLocked",
      data: {
        isLocked: isLocked,
        showTabIcon: showTabIcon === undefined ? true : !!showTabIcon,
      },
    });

    await chrome.action.setIcon({
      tabId: tab.id,
      path: `/images/${isLocked ? "locked" : "unlocked"}-${currentColorScheme}.png`,
    });
  });
}

function init(tab, data) {
  // We will be able to do this declaratively in manifest.json once the following issue gets resolved:
  // https://bugs.chromium.org/p/chromium/issues/detail?id=893175
  if (currentColorScheme !== data.colorScheme) {
    currentColorScheme = data.colorScheme;

    chrome.action.setIcon({
      path: `/images/unlocked-${currentColorScheme}.png`,
    });
  }

  chrome.storage.sync.get("options", ({ options = {} }) => {
    if (tab.pinned && (options.autoLockPinnedTabs === undefined || options.autoLockPinnedTabs)) {
      setIsLocked(tab, true, options.showTabIcon);
      return;
    }

    let rulesDisable = parseRules(options.rulesDisable);
    if (rulesDisable.some((rule) => new RegExp(rule, "i").test(tab.url))) {
      return;
    }

    let rulesEnable = parseRules(options.rulesEnable);
    if (rulesEnable.some((rule) => new RegExp(rule, "i").test(tab.url))) {
      setIsLocked(tab, true, options.showTabIcon);
    }
  });
}

function parseRules(rules) {
  return (
    rules
      ?.split("\n")
      ?.map((rule) => rule.trim())
      ?.filter((rule) => !!rule) || []
  );
}
