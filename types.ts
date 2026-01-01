
export interface Image {
  quality: string;
  link?: string;
  url?: string;
}

export interface DownloadUrl {
  quality: string;
  link?: string;
  url?: string;
}

export interface Album {
  id: string;
  name: string;
  url: string;
}

export interface Song {
  id: string;
  name: string;
  type: string;
  album: Album;
  year: string;
  duration: string | number;
  primaryArtists: string;
  image: Image[];
  downloadUrl: DownloadUrl[];
  language: string;
}

export interface SearchResponse {
  status: string;
  data: {
    results: Song[];
    total: number;
    start: number;
  };
}

export interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  likedSongs: Song[];
  isPlaying: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'one' | 'all';
  volume: number;
  progress: number;
  duration: number;
}
