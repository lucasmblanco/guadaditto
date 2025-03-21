export function urlChecker(url: string): boolean {
  const youtubeRegex = /^https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]+$/;
  return youtubeRegex.test(url);
}

export function extractVideoTitle(pageTitle: string): string {
  const match = pageTitle.match(/^(?:\(\d+\) )?(.*?)(?: - YouTube)?$/);
  return match ? match[1] : pageTitle;
}

export function selectFolder(currentFolder, folderSelected, showFolders) {
  if (currentFolder === null) {
    folderSelected.id = null;
    folderSelected.name = "";
  } else {
    folderSelected.id = currentFolder.id;
    folderSelected.name = currentFolder.name;
  }
  showFolders = false;
}
