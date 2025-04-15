import type { Dexie, EntityTable } from "dexie";
import type { Video, Folder } from "../models";

export interface SelectedFolder {
  id: number | null;
  name: string;
}

export type GuardadittoDB = Dexie & {
  videos: EntityTable<Video, "id">;
  folders: EntityTable<Folder, "id">;
};
