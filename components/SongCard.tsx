
import React from 'react';
import { Song } from '../types';
import { useMusicStore } from '../store/useMusicStore';
import { PlayIcon, HeartIcon } from './Icons';

interface SongCardProps {
  song: Song;
  collection?: Song[]; // Optional collection the song belongs to
  onPlay?: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, collection, onPlay }) => {
  const { setCurrentSong, setQueue, currentSong, toggleLike, likedSongs } = useMusicStore();
  
  const getImageUrl = () => {
    const img = song.image.find(i => i.quality === '500x500') || song.image[song.image.length - 1];
    return img?.link || img?.url || '';
  };

  const isActive = currentSong?.id === song.id;
  const isLiked = likedSongs.some(s => s.id === song.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If a collection is provided, set it as the new queue
    if (collection && collection.length > 0) {
      setQueue(collection);
    }
    setCurrentSong(song);
    if (onPlay) onPlay();
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(song);
  };

  return (
    <div 
      onClick={handlePlay}
      className={`group relative flex flex-col p-3 rounded-[2rem] transition-all duration-500 cursor-pointer ${isActive ? 'bg-zinc-900 shadow-xl' : 'bg-transparent hover:bg-zinc-900/50'}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-[1.75rem] mb-4 shadow-xl card-shadow">
        <img 
          src={getImageUrl()} 
          alt={song.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500?text=No+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="bg-indigo-600 p-4 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
            <PlayIcon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {/* Like Button on Card */}
        <button 
          onClick={handleLike}
          className={`absolute top-3 left-3 p-2.5 rounded-2xl backdrop-blur-md border border-white/10 transition-all duration-300 opacity-0 group-hover:opacity-100 ${isLiked ? 'bg-indigo-500 text-white opacity-100' : 'bg-black/20 text-white hover:bg-black/40'}`}
        >
          <HeartIcon className="w-4 h-4" filled={isLiked} />
        </button>

        {isActive && (
          <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-white/10">
             <div className="flex gap-1 items-end h-3 px-0.5">
                <div className="w-1 bg-indigo-400 rounded-full animate-[bounce_0.8s_infinite_0.1s]"></div>
                <div className="w-1 bg-indigo-400 rounded-full animate-[bounce_0.8s_infinite_0.3s]"></div>
                <div className="w-1 bg-indigo-400 rounded-full animate-[bounce_0.8s_infinite_0.5s]"></div>
             </div>
          </div>
        )}
      </div>
      <div className="px-1">
        <h3 className="text-sm font-bold truncate leading-tight mb-1 tracking-tight" dangerouslySetInnerHTML={{ __html: song.name }}></h3>
        <p className="text-[11px] font-medium text-zinc-500 truncate" dangerouslySetInnerHTML={{ __html: song.primaryArtists }}></p>
      </div>
    </div>
  );
};

export default SongCard;
