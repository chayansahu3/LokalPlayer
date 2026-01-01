
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Song, PlayerState } from '../types';

interface MusicStore extends PlayerState {
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  setPlaying: (isPlaying: boolean) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
  setQueue: (songs: Song[]) => void;
  toggleLike: (song: Song) => void;
  nextSong: () => void;
  prevSong: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'off' | 'one' | 'all') => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      currentSong: null,
      queue: [],
      likedSongs: [],
      isPlaying: false,
      isShuffle: false,
      repeatMode: 'off',
      volume: 1,
      progress: 0,
      duration: 0,

      setCurrentSong: (song) => set({ currentSong: song, isPlaying: true, progress: 0 }),
      
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      
      setPlaying: (isPlaying) => set({ isPlaying }),

      addToQueue: (song) => {
        const { queue } = get();
        if (!queue.find((s) => s.id === song.id)) {
          set({ queue: [...queue, song] });
        }
      },

      removeFromQueue: (songId) => set((state) => ({
        queue: state.queue.filter((s) => s.id !== songId)
      })),

      clearQueue: () => set({ queue: [] }),

      setQueue: (songs) => set({ queue: songs }),

      toggleLike: (song) => {
        const { likedSongs } = get();
        const isLiked = likedSongs.some((s) => s.id === song.id);
        if (isLiked) {
          set({ likedSongs: likedSongs.filter((s) => s.id !== song.id) });
        } else {
          set({ likedSongs: [...likedSongs, song] });
        }
      },

      nextSong: () => {
        const { queue, currentSong, isShuffle, repeatMode } = get();
        if (queue.length === 0) return;

        const currentIndex = currentSong ? queue.findIndex((s) => s.id === currentSong.id) : -1;
        
        // Handle repeat one separately in AudioEngine onEnded, 
        // but if manually clicked 'Next', we move forward
        let nextIndex = 0;
        if (isShuffle) {
          nextIndex = Math.floor(Math.random() * queue.length);
          if (nextIndex === currentIndex && queue.length > 1) {
             nextIndex = (nextIndex + 1) % queue.length;
          }
        } else {
          nextIndex = (currentIndex + 1) % queue.length;
          // If at the end and repeat is off, we might want to stop, but usually players loop the queue
          if (currentIndex === queue.length - 1 && repeatMode === 'off') {
            // Keep current or loop? We loop for better UX.
          }
        }
        
        set({ currentSong: queue[nextIndex], isPlaying: true, progress: 0 });
      },

      prevSong: () => {
        const { queue, currentSong, progress } = get();
        
        // Traditional music player logic: 
        // If the song has played for more than 3 seconds, clicking 'Previous' restarts the current song.
        if (progress > 3) {
          const audio = document.querySelector('audio');
          if (audio) {
            audio.currentTime = 0;
          }
          set({ progress: 0, isPlaying: true });
          return;
        }

        if (queue.length === 0) return;

        const currentIndex = currentSong ? queue.findIndex((s) => s.id === currentSong.id) : 0;
        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        
        set({ currentSong: queue[prevIndex], isPlaying: true, progress: 0 });
      },

      toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),

      setRepeatMode: (mode) => set({ repeatMode: mode }),

      setVolume: (volume) => set({ volume }),

      setProgress: (progress) => set({ progress }),

      setDuration: (duration) => set({ duration }),
    }),
    {
      name: 'music-storage',
      partialize: (state) => ({ 
        queue: state.queue, 
        likedSongs: state.likedSongs,
        volume: state.volume, 
        repeatMode: state.repeatMode, 
        isShuffle: state.isShuffle 
      }),
    }
  )
);
