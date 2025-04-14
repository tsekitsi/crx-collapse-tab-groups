import { setLatestTab, getPreviousGroupId, setPreviousGroupId, removeGroup } from './utils/storage.js';
import { collapseAllBut, openPreviousGroupsLatestTab, sleep } from './utils/tabs.js';

chrome.storage.local.clear();

chrome.tabGroups.onRemoved.addListener(async (group) => {
  await removeGroup(group.id);
  await openPreviousGroupsLatestTab();
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const activeTab = await chrome.tabs.get(activeInfo.tabId);
  const previousGroupId = await getPreviousGroupId();

  if ((activeTab.groupId !== previousGroupId) && activeTab.groupId > 0) {
    setPreviousGroupId(activeTab.groupId);
  }

  await sleep(100);
  setLatestTab(activeTab.groupId, activeTab.id);
  collapseAllBut(activeTab.groupId);
});

chrome.tabs.onRemoved.addListener(async () => await openPreviousGroupsLatestTab());
