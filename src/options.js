(function () {
  function updateTheme() {
    let colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.querySelector("html").setAttribute("data-bs-theme", colorMode);
  }

  function restoreOptions() {
    chrome.storage.sync.get("options", ({ options = {} }) => {
      document.getElementById("show-tab-icon").checked = options.showTabIcon === undefined ? true : !!options.showTabIcon;
      document.getElementById("auto-lock-pinned-tabs").checked = options.showTabIcon === undefined ? true : !!options.autoLockPinnedTabs;
      document.getElementById("rules-enable").value = options.rulesEnable || "";
      document.getElementById("rules-disable").value = options.rulesDisable || "";
    });
  }

  function saveOptions() {
    let showTabIcon = !!document.getElementById("show-tab-icon").checked;
    let autoLockPinnedTabs = !!document.getElementById("auto-lock-pinned-tabs").checked;
    let rulesEnable = document.getElementById("rules-enable").value;
    let rulesDisable = document.getElementById("rules-disable").value;

    chrome.storage.sync.set({ options: {
      showTabIcon,
      autoLockPinnedTabs,
      rulesEnable,
      rulesDisable
    }}, () => {
      let saveSuccessElement = document.getElementById("save-success");
      saveSuccessElement.style.display = "";
      setTimeout(() => {
        saveSuccessElement.style.display = "none";
      }, 3000);
    });
  }

  updateTheme();
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateTheme);

  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.getElementById("save").addEventListener("click", saveOptions);
})();
