import Dexie, { type EntityTable } from "dexie";

interface Video {
  id: number;
  title: string;
  url: string;
  created_at: Date;
  folder_id: number | null;
}

interface Folder {
  id: number;
  name: string;
  created_at: Date;
}

const db = new Dexie("GuardadittoDatabase") as Dexie & {
  videos: EntityTable<Video, "id">;
  folders: EntityTable<Folder, "id">;
};

// Schema declaration:
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

export type { Video, Folder };
export { db };
