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

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "openPopup") {
    chrome.storage.local.set(
      { videoUrl: message.url, videoTitle: message.title },
      () => {
        chrome.storage.local.set({ popupIsOpen: true });
        chrome.action.openPopup();
      },
    );
  } else if (message.action === "closePopup") {
    chrome.storage.local.set({ popupIsOpen: false });
  }
});

export { db };
