/**
 * Retrieves values from app local storage.
 * @param {string[]} keys - The keys to get values for.
 * @returns {Promise<Record<string, unknown>>} Values from app local storage.
 */
async function getStorage(keys) {
  return chrome.storage.local.get(keys);
}

/**
 * Sets values in app local storage.
 * @param {Record<string, unknown>} items - The key-value pairs to set.
 * @returns {Promise<void>}
 */
async function setStorage(items) {
  return chrome.storage.local.set(items);
}

/**
 * Removes items from app local storage.
 * @param {string[]} keys - The keys to remove from app local storage.
 * @returns {Promise<void>}
 */
async function removeStorage(keys) {
  return chrome.storage.local.remove(keys);
}

/**
 * Retrieves the ID of the latest active tab in group.
 * @param {number} groupId - The ID of the group for which to get latest active tab.
 * @returns {Promise<number>} The ID of the latest active tab in group.
 */
export async function getLatestTab(groupId) {
  const result = await getStorage([groupId.toString()]);
  return result[groupId.toString()];
}

/**
 * Sets the latest active tab for a group.
 * @param {number} groupId - The ID of the group for which to set latest active tab.
 * @param {number} tabId - The ID of the latest active tab in the group.
 * @returns {Promise<void>}
 */
export async function setLatestTab(groupId, tabId) {
  setStorage({ [groupId]: tabId });
}

/**
 * Retrieves previousGroupId from app local storage.
 * @returns {Promise<number>} The ID of the previous group.
 */
export async function getPreviousGroupId() {
  const result = await getStorage(['previousGroupId']);
  return result['previousGroupId'];
}

/**
 * Sets previousGroupId in app local storage.
 * @param {*} groupId - The ID of the previous group.
 * @returns {Promise<void>}
 */
export async function setPreviousGroupId(groupId) {
  setStorage({ previousGroupId: groupId });
}

/**
 * Removes group info from app local storage.
 * @param {number} groupId - The ID of the group for which to remove info from app local storage.
 * @returns {Promise<void>}
 */
export async function removeGroup(groupId) {
  removeStorage([groupId.toString()]);
}
