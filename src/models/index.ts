interface Video {
  id?: number;
  title: string;
  url: string;
  created_at: Date;
  folder_id: number | null;
  playlist_url: string | null;
  has_been_viewed: boolean;
}

interface Folder {
  id: number;
  name: string;
  created_at: Date;
}

export type { Video, Folder };
