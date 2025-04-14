import { getLatestTab, getPreviousGroupId } from './storage.js';

/**
 * Collapses all groups except the one passed.
 * @param {number} groupId - The ID of the group to (keep) open.
 * @returns {Promise<void>}
 */
export async function collapseAllBut(groupId) {
  if (groupId > 0) chrome.tabGroups.update(groupId, { collapsed: false });

  const groupIds = await getGroupIds();
  groupIds.forEach((tbdGroupId) => {
    if (tbdGroupId !== groupId) {
      chrome.tabGroups.update(tbdGroupId, { collapsed: true });
    }
  });
}

/**
 * Lists the IDs of all the tab groups in the browser.
 * @returns {number[]} Array of all group IDs.
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
    chrome.tabs.update(
      await getLatestTab(previousGroupId),
      { active: true }
    );
  }
}

/**
 * Sleep.
 * @param {number} ms - Duration of sleep in milliseconds.
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
