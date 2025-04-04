import type { db } from "../background/background";
import type { Folder } from "../models";

export function urlChecker(url: string): boolean {
  const youtubeRegex = /^https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]+$/;
  return youtubeRegex.test(url);
}

export function extractVideoTitle(pageTitle: string): string {
  const match = pageTitle.match(/^(?:\(\d+\) )?(.*?)(?: - YouTube)?$/);
  return match ? match[1] : pageTitle;
}

/**
 * @deprecated This function is deprecated and will be removed in future versions.
 */
export function selectFolder(
  currentFolder: Folder | null,
  folderSelected: { id: number | null; name: string },
  showFolders: boolean,
) {
  if (currentFolder === null) {
    folderSelected.id = null;
    folderSelected.name = "";
  } else {
    folderSelected.id = currentFolder.id;
    folderSelected.name = currentFolder.name;
  }
  showFolders = false;
}

export async function updateNotificationBadge(database: typeof db) {
  const videosQnty = await database.videos.count();

  if (videosQnty > 0) {
    chrome.action.setBadgeText({ text: videosQnty.toString() });
  } else {
    chrome.action.setBadgeText({ text: "" });
  }
}
