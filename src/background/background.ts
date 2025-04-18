import Dexie, { type EntityTable } from "dexie";
import type { Video, Folder } from "../models";
import { initializeBadge } from "../utils/utils";

const db = new Dexie("GuardadittoDatabase") as Dexie & {
  videos: EntityTable<Video, "id">;
  folders: EntityTable<Folder, "id">;
};

db.version(1).stores({
  videos: "++id, title, url, created_at, folder_id",
  folders: "++id, name, created_at",
});

db.version(2)
  .stores({
    videos:
      "++id, title, url, created_at, folder_id, playlist_url, has_been_viewed",
  })
  .upgrade((tx) => {
    return tx
      .table("videos")
      .toCollection()
      .modify((video) => {
        video.playlist_url = null;
        video.has_been_viewed = false;
      });
  });

db.version(3).stores({
  videos:
    "++id, title, &url, created_at, folder_id, playlist_url, has_been_viewed",
});

db.folders.hook("deleting", async (primKey, folder, transaction) => {
  await transaction.table("videos").where("folder_id").equals(primKey).delete();
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "openPopup") {
    chrome.storage.local.set(
      { videoUrl: message.url, videoTitle: message.title },
      /* 

      Previous implementation, creates an error when the user try to open the popup again after closing it by clicking anywhere in the page.
      The error: the user needs to click the button two times because "popupIsOpen" is never set to false.
      I try using onDestroy (on App.svelte) and onSuspend (on background.ts) but it doesn't work.
      
       () => {
         chrome.storage.local.set({ popupIsOpen: true });
        chrome.action.openPopup();
       },
      */
    );
    chrome.action.openPopup().catch(() => {});
  }

  /* 

  Part of previous implementation.

   else if (message.action === "closePopup") {
     chrome.storage.local.set({ popupIsOpen: false });
   }
  */
});

chrome.runtime.onInstalled.addListener(async function () {
  await initializeBadge(db);
});

chrome.runtime.onStartup.addListener(async function () {
  await initializeBadge(db);
});

export { db };
