import { getLatestTabId, getPreviousGroupId } from './storage.js';

/**
 * Collapses all groups except the one passed.
 * @param {number} groupId - The ID of the group to (keep) open.
 * @returns {Promise<void>}
 */
export async function collapseAllBut(groupId) {
  const groupIds = await getGroupIds();

  if (groupId > 0) await customGroupUpdate(groupId, { collapsed: false });

  Promise.all(groupIds.map((tbdGroupId) => {
    if (tbdGroupId !== groupId) {
      customGroupUpdate(tbdGroupId, { collapsed: true });
    }
  }));
}

/**
 * Lists the IDs of all the tab groups in the browser.
 * @returns {Promise<number[]>} Array of all group IDs.
 */
async function getGroupIds() {
  const groups = await chrome.tabGroups.query({});
  return groups.map(({ id }) => id);
}

/**
 * Sets the pervious group's latest active tab back to active.
 * @returns {Promise<void>}
 */
export async function openPreviousGroupsLatestTab() {
  const previousGroupId = await getPreviousGroupId();
  if (previousGroupId) {
    const previousGroupsLatestTabId = await getLatestTabId(previousGroupId);
    try {
      await chrome.tabs.get(previousGroupsLatestTabId);
    } catch {
      return; // If tab no longer exists, do nothing.
    }
    chrome.tabs.update(
      await getLatestTabId(previousGroupId),
      { active: true },
    );
  }
}

async function customGroupUpdate(tbdGroupId, options) {
  return new Promise((resolve) => {
    const tryUpdate = (attempt = 0) => {
      const maxRetries = 5;
      chrome.tabGroups.update(tbdGroupId, options)
        .then(resolve)
        .catch(() => {
          // console.log('attempt', attempt);
          if (attempt < maxRetries) {
            setTimeout(() => {
              tryUpdate(++attempt);
            }, 20);
          }
        });
    };
    tryUpdate();
  });
}
