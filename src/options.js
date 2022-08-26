(function () {
  function restoreOptions() {
    chrome.storage.sync.get("options", ({ options = {} }) => {
      document.getElementById("rules-enable").value = options.rulesEnable || "";
      document.getElementById("rules-disable").value = options.rulesDisable || "";
    });
  }

  function saveOptions() {
    let rulesEnable = document.getElementById("rules-enable").value;
    let rulesDisable = document.getElementById("rules-disable").value;

    chrome.storage.sync.set({ options: { rulesEnable, rulesDisable } }, () => {
      let saveSuccessElement = document.getElementById("save-success");
      saveSuccessElement.style.display = "";
      setTimeout(() => {
        saveSuccessElement.style.display = "none";
      }, 3000);
    });
  }

  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.getElementById("save").addEventListener("click", saveOptions);
})();
