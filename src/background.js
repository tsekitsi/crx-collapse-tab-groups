import { setLatestTabId, getPreviousGroupId, setPreviousGroupId, removeGroup } from './utils/storage.js';
import { collapseAllBut, openPreviousGroupsLatestTab } from './utils/tabs.js';

chrome.storage.local.clear();

chrome.tabGroups.onRemoved.addListener(async (group) => {
  await removeGroup(group.id);
  await openPreviousGroupsLatestTab();
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const activeTab = await chrome.tabs.get(activeInfo.tabId);
  const previousGroupId = await getPreviousGroupId();

  if ((activeTab.groupId !== previousGroupId) && activeTab.groupId > 0) {
    await setPreviousGroupId(activeTab.groupId);
  }

  await setLatestTabId(activeTab.groupId, activeTab.id);
  await collapseAllBut(activeTab.groupId);
});

chrome.tabs.onRemoved.addListener(async () => await openPreviousGroupsLatestTab());
