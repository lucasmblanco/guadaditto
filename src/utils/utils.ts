import type { db } from "../background/background";
import type { Folder } from "../models";

/**
 * @deprecated This function is deprecated and will be removed in future versions.
 */
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

export function isYoutubeVideoUrl(url: string): boolean {
  const youtubeVideoRegex =
    /^(https?:\/\/)?(www\.|m\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+(.*)?$/;
  return youtubeVideoRegex.test(url);
}

function getYoutubeVideoId(url: string): string | null {
  if (!isYoutubeVideoUrl(url)) return null;

  const regexWatch =
    /^(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:&.*)?$/;
  const matchWatch = url.match(regexWatch);
  if (matchWatch) return matchWatch[1];

  const regexShort =
    /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/;
  const matchShort = url.match(regexShort);
  if (matchShort) return matchShort[1];

  return null;
}

export function cleanYoutubeUrl(url: string): string {
  const videoId = getYoutubeVideoId(url);
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function isInPlaylist(url: string): boolean {
  return url.includes("&list=") || url.includes("?list=");
}

export function getPlaylistId(url: string): string | null {
  if (!isYoutubeVideoUrl(url)) return null;

  const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function getYoutubePlaylistLink(url: string): string | null {
  const playlistId = getPlaylistId(url);
  if (!playlistId) return null;

  return `https://www.youtube.com/playlist?list=${playlistId}`;
}
