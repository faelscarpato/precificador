async function enableOpenOnActionClick() {
  if (!chrome.sidePanel?.setPanelBehavior) {
    return;
  }

  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
}

chrome.runtime.onInstalled.addListener(() => {
  enableOpenOnActionClick().catch(() => {});
});

chrome.runtime.onStartup.addListener(() => {
  enableOpenOnActionClick().catch(() => {});
});
