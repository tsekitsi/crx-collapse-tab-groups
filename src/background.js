import { setLatestTab, getPreviousGroupId, setPreviousGroupId, removeGroup } from './utils/storage.js';
import { collapseAllBut, openPreviousGroupsLatestTab } from './utils/tabs.js';

chrome.storage.local.clear();

chrome.tabGroups.onRemoved.addListener(async (group) => {
  await removeGroup(group.id);
  await openPreviousGroupsLatestTab();
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // console.log('1');
  const activeTab = await chrome.tabs.get(activeInfo.tabId);
  // console.log('2');
  const previousGroupId = await getPreviousGroupId();
  // console.log('3');

  if ((activeTab.groupId !== previousGroupId) && activeTab.groupId > 0) {
    await setPreviousGroupId(activeTab.groupId);
    // console.log('4');
  }

  await setLatestTab(activeTab.groupId, activeTab.id);
  // console.log('5');
  await collapseAllBut(activeTab.groupId);
  // console.log('6');
});

chrome.tabs.onRemoved.addListener(async () => await openPreviousGroupsLatestTab());
