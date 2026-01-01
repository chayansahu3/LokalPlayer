
import React from 'react';
import { useMusicStore } from '../store/useMusicStore';
import { PlayIcon, PauseIcon, SkipForwardIcon } from './Icons';

interface MiniPlayerProps {
  onExpand: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ onExpand }) => {
  const currentSong = useMusicStore(state => state.currentSong);
  const isPlaying = useMusicStore(state => state.isPlaying);
  const progress = useMusicStore(state => state.progress);
  const duration = useMusicStore(state => state.duration);
  const togglePlay = useMusicStore(state => state.togglePlay);
  const nextSong = useMusicStore(state => state.nextSong);

  if (!currentSong) return null;

  const getImageUrl = () => {
    const img = currentSong.image.find(i => i.quality === '150x150') || currentSong.image[0];
    return img?.link || img?.url || '';
  };

  const progressPercent = (progress / (duration || 1)) * 100;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40">
      <div 
        onClick={onExpand}
        className="glass rounded-3xl p-2.5 flex items-center shadow-2xl border border-white/10 cursor-pointer hover:bg-zinc-900/90 transition-all overflow-hidden group"
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-zinc-800/50">
            <div className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="w-12 h-12 rounded-2xl overflow-hidden mr-4 flex-shrink-0 shadow-lg">
          <img src={getImageUrl()} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold truncate pr-2 text-white" dangerouslySetInnerHTML={{ __html: currentSong.name }}></h4>
          <p className="text-[11px] text-zinc-400 font-medium truncate pr-2" dangerouslySetInnerHTML={{ __html: currentSong.primaryArtists }}></p>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="p-3 text-white hover:text-indigo-400 hover:bg-white/5 rounded-full transition-all"
          >
            {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextSong(); }}
            className="p-3 text-white hover:text-indigo-400 hover:bg-white/5 rounded-full transition-all"
          >
            <SkipForwardIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
