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
  videos: EntityTable<
    Video,
    "id" // primary key "id" (for the typings only)
  >;
  folders: EntityTable<
    Folder,
    "id" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  videos: "++id, title, url, created_at, folder_id",
  folders: "++id, name, created_at", // primary key "id" (for the runtime!)
});

export type { Video, Folder };
export { db };
