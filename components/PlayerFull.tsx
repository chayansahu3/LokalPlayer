
import React, { useState } from 'react';
import { useMusicStore } from '../store/useMusicStore';
import { 
  PlayIcon, 
  PauseIcon, 
  SkipBackIcon, 
  SkipForwardIcon, 
  ShuffleIcon, 
  RepeatIcon, 
  ChevronDownIcon,
  HeartIcon
} from './Icons';

interface PlayerFullProps {
  onClose: () => void;
}

const PlayerFull: React.FC<PlayerFullProps> = ({ onClose }) => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    nextSong, 
    prevSong, 
    isShuffle, 
    toggleShuffle, 
    repeatMode, 
    setRepeatMode,
    progress,
    duration,
    setProgress,
    volume,
    setVolume,
    toggleLike,
    likedSongs
  } = useMusicStore();

  const [showInfo, setShowInfo] = useState(false);

  if (!currentSong) return null;

  const isLiked = likedSongs.some(s => s.id === currentSong.id);

  const getImageUrl = () => {
    const img = currentSong.image.find(i => i.quality === '500x500') || currentSong.image[currentSong.image.length - 1];
    return img?.link || img?.url || '';
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const audio = document.querySelector('audio');
    if (audio) {
      audio.currentTime = val;
      setProgress(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  const handleDownload = () => {
    const highQuality = currentSong.downloadUrl.find(u => u.quality === '320kbps') || currentSong.downloadUrl[currentSong.downloadUrl.length - 1];
    const url = highQuality?.link || highQuality?.url;
    if (url) window.open(url, '_blank');
  };

  // Logic to handle Repeat Button click as a "Replay" action
  const handleRepeatClick = () => {
    let nextMode: 'off' | 'one' | 'all' = 'off';
    if (repeatMode === 'off') nextMode = 'all';
    else if (repeatMode === 'all') nextMode = 'one';
    else nextMode = 'off';
    
    setRepeatMode(nextMode);

    // If the user selects 'Repeat One', we also replay the song from the start
    // to give immediate feedback that 'Replay' is active.
    if (nextMode === 'one') {
      const audio = document.querySelector('audio');
      if (audio) {
        audio.currentTime = 0;
        setProgress(0);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 player-gradient flex flex-col p-8 animate-[slideUp_0.5s_cubic-bezier(0.32,0.72,0,1)] overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 mt-2">
        <button onClick={onClose} className="p-3 bg-zinc-900/50 backdrop-blur-xl border border-white/5 text-zinc-400 hover:text-white rounded-2xl transition-all active:scale-90">
          <ChevronDownIcon />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mb-1">Playing from</p>
          <p className="text-xs font-bold text-indigo-400 truncate max-w-[200px]" dangerouslySetInnerHTML={{ __html: currentSong.album.name }}></p>
        </div>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className={`p-3 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl transition-all ${showInfo ? 'text-indigo-400 border-indigo-500/30' : 'text-zinc-400 hover:text-white'}`}
        >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
      </div>

      {/* Info Overlay */}
      {showInfo && (
        <div className="absolute top-24 left-8 right-8 z-10 p-6 bg-zinc-900/95 backdrop-blur-2xl rounded-3xl border border-white/10 animate-fadeIn shadow-2xl">
          <h3 className="text-lg font-bold mb-4">Song Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">Artists</span> <span className="text-right ml-4" dangerouslySetInnerHTML={{ __html: currentSong.primaryArtists }}></span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Album</span> <span className="text-right ml-4" dangerouslySetInnerHTML={{ __html: currentSong.album.name }}></span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Year</span> <span>{currentSong.year}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Language</span> <span className="capitalize">{currentSong.language}</span></div>
          </div>
          <button 
            onClick={handleDownload}
            className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download High Quality
          </button>
        </div>
      )}

      {/* Album Art Container */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="relative w-full aspect-square max-w-[340px] rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(79,70,229,0.4)] mb-8 group">
          <img 
            src={getImageUrl()} 
            alt="" 
            className={`w-full h-full object-cover transition-all duration-[2s] ${isPlaying ? 'scale-105' : 'scale-100'}`} 
          />
          <div className={`absolute inset-0 bg-indigo-500/10 mix-blend-overlay transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}></div>
          
          {/* Heart/Like Action in Player View */}
          <button 
            onClick={() => toggleLike(currentSong)}
            className={`absolute bottom-6 right-6 p-4 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 active:scale-75 ${isLiked ? 'bg-indigo-600 text-white' : 'bg-black/40 text-white/70 hover:text-white'}`}
          >
            <HeartIcon className="w-6 h-6" filled={isLiked} />
          </button>
        </div>

        {/* Text Info */}
        <div className="text-center w-full px-2 mb-8">
          <h1 className="text-2xl font-extrabold mb-2 tracking-tight line-clamp-2" dangerouslySetInnerHTML={{ __html: currentSong.name }}></h1>
          <p className="text-zinc-400 text-base font-medium opacity-80" dangerouslySetInnerHTML={{ __html: currentSong.primaryArtists }}></p>
        </div>

        {/* Seek Bar */}
        <div className="w-full max-w-[360px] mb-8">
          <div className="relative h-1.5 w-full bg-zinc-800 rounded-full mb-3 overflow-hidden group/seek">
            <input 
              type="range"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={handleProgressChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)]"
              style={{ width: `${(progress / (duration || 1)) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-black text-zinc-500 tracking-tighter uppercase">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Bar */}
        <div className="w-full max-w-[200px] mb-10 flex items-center gap-3 group">
          <svg className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          <div className="relative flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="absolute top-0 left-0 h-full bg-indigo-400" style={{ width: `${volume * 100}%` }}></div>
          </div>
        </div>

        {/* Main Controls */}
        <div className="w-full max-w-[380px] flex items-center justify-between px-4 mb-6">
          <button 
            onClick={toggleShuffle}
            className={`p-3 rounded-2xl transition-all ${isShuffle ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <ShuffleIcon className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-6">
            <button onClick={prevSong} className="p-2 text-white hover:text-indigo-400 transition-all active:scale-75">
              <SkipBackIcon className="w-8 h-8" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-20 h-20 flex items-center justify-center bg-white text-black rounded-[2rem] shadow-2xl hover:bg-indigo-50 active:scale-90 transition-all duration-300 transform"
            >
              {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8 ml-1" />}
            </button>
            <button onClick={nextSong} className="p-2 text-white hover:text-indigo-400 transition-all active:scale-75">
              <SkipForwardIcon className="w-8 h-8" />
            </button>
          </div>

          <button 
            onClick={handleRepeatClick}
            className={`p-3 rounded-2xl transition-all ${repeatMode !== 'off' ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <div className="relative">
              <RepeatIcon className="w-5 h-5" />
              {repeatMode === 'one' && <span className="absolute -top-1 -right-1 text-[7px] font-black bg-indigo-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center border border-zinc-950">1</span>}
            </div>
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PlayerFull;
