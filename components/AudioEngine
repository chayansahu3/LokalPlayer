
import React, { useEffect, useRef } from 'react';
import { useMusicStore } from '../store/useMusicStore';

const AudioEngine: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Use selectors to prevent unnecessary re-renders of the AudioEngine component itself
  const currentSong = useMusicStore(state => state.currentSong);
  const isPlaying = useMusicStore(state => state.isPlaying);
  const volume = useMusicStore(state => state.volume);
  const repeatMode = useMusicStore(state => state.repeatMode);
  const setProgress = useMusicStore(state => state.setProgress);
  const setDuration = useMusicStore(state => state.setDuration);
  const nextSong = useMusicStore(state => state.nextSong);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentSong) {
      audio.pause();
      return;
    }

    // Resilient URL extraction for different API versions (link vs url)
    const getBestUrl = () => {
      const urls = currentSong.downloadUrl;
      if (!urls || urls.length === 0) return '';
      
      const highQuality = urls.find(u => u.quality === '320kbps') || urls[urls.length - 1];
      return highQuality?.link || highQuality?.url || '';
    };

    const streamUrl = getBestUrl();

    // Only update src if it has actually changed
    if (audio.src !== streamUrl) {
      audio.pause();
      audio.src = streamUrl;
      audio.load();
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // The "AbortError" occurs when play() is interrupted by a load() or pause()
          // This is common in rapid UI interactions and can be safely ignored.
          if (error.name !== 'AbortError') {
            console.error("Playback error:", error);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      nextSong();
    }
  };

  return (
    <audio
      ref={audioRef}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onEnded={handleEnded}
      hidden
    />
  );
};

export default AudioEngine;
