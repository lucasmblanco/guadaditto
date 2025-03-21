import Dexie, { type EntityTable } from "dexie";
import type { Video, Folder } from "../models";

const db = new Dexie("GuardadittoDatabase") as Dexie & {
  videos: EntityTable<Video, "id">;
  folders: EntityTable<Folder, "id">;
};

db.version(1).stores({
  videos: "++id, title, url, created_at, folder_id",
  folders: "++id, name, created_at",
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openPopup") {
    chrome.storage.local.set(
      { videoUrl: message.url, videoTitle: message.title },
      () => {
        chrome.action.openPopup();
      },
    );
  }
});

export { db };
