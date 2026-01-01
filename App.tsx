
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useMusicStore } from './store/useMusicStore';
import { saavnApi } from './services/saavnApi';
import { Song } from './types';
import { HomeIcon, SearchIcon, QueueIcon, HeartIcon } from './components/Icons';
import SearchBar from './components/SearchBar';
import SongCard from './components/SongCard';
import MiniPlayer from './components/MiniPlayer';
import PlayerFull from './components/PlayerFull';
import AudioEngine from './components/AudioEngine';

enum Screen {
  Home,
  Explore,
  Liked,
  Queue
}

const EXPLORE_GENRES = [
  { name: 'Bollywood', query: 'Bollywood Top Hits', color: 'from-orange-500 to-red-600' },
  { name: 'Pop', query: 'International Pop', color: 'from-blue-500 to-indigo-600' },
  { name: 'Lo-fi', query: 'Lofi Hip Hop', color: 'from-purple-500 to-pink-600' },
  { name: 'Gym', query: 'Workout Motivation', color: 'from-emerald-500 to-teal-600' },
  { name: 'Party', query: 'Dance Party', color: 'from-yellow-500 to-orange-600' },
  { name: 'Chill', query: 'Chill Vibes', color: 'from-cyan-500 to-blue-600' },
];

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Home);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredSongs, setFeaturedSongs] = useState<Song[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // High-performance selectors for Zustand
  const queue = useMusicStore(state => state.queue);
  const currentSongId = useMusicStore(state => state.currentSong?.id);
  const likedSongs = useMusicStore(state => state.likedSongs);
  const removeFromQueue = useMusicStore(state => state.removeFromQueue);
  const clearQueue = useMusicStore(state => state.clearQueue);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featured, trending] = await Promise.all([
          saavnApi.searchSongs("International Pop Hits"),
          saavnApi.searchSongs("Top Trending")
        ]);
        setFeaturedSongs(featured.data.results);
        setTrendingSongs(trending.data.results);
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    };
    loadData();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setSearchResults([]);
      setSearchQuery("");
      return;
    }
    
    setIsLoading(true);
    setSearchQuery(trimmedQuery);
    setActiveScreen(Screen.Explore);
    
    try {
      const res = await saavnApi.searchSongs(trimmedQuery);
      setSearchResults(res.data.results);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderScreen = () => {
    switch (activeScreen) {
      case Screen.Home:
        return (
          <div className="px-6 py-4 animate-fadeIn space-y-10">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold tracking-tight">For You</h2>
                <button 
                  onClick={() => handleSearch("Top Recommendations")} 
                  className="text-sm font-medium text-indigo-400 hover:text-indigo-300 active:scale-95 transition-all"
                >
                  View All
                </button>
              </div>
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide no-scrollbar">
                {featuredSongs.map(song => (
                  <div key={song.id} className="w-40 flex-shrink-0">
                    <SongCard song={song} collection={featuredSongs} />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold tracking-tight">Trending</h2>
                <button 
                  onClick={() => handleSearch("Trending Today")}
                  className="text-sm font-medium text-indigo-400 hover:text-indigo-300 active:scale-95 transition-all"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {trendingSongs.slice(0, 10).map(song => (
                  <SongCard key={song.id} song={song} collection={trendingSongs} />
                ))}
              </div>
            </section>
          </div>
        );
      case Screen.Explore:
        return (
          <div className="px-6 py-4 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-extrabold tracking-tight">
                {searchQuery ? `Results for "${searchQuery}"` : 'Explore Music'}
               </h2>
               {searchQuery && (
                 <button 
                  onClick={() => { setSearchResults([]); setSearchQuery(""); }}
                  className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
                 >
                  Clear
                 </button>
               )}
            </div>
            
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[1,2,3,4,5,6,7,8,9,10].map(i => (
                        <div key={i} className="animate-pulse bg-zinc-900 rounded-3xl h-56"></div>
                    ))}
                </div>
            ) : (
                <>
                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {searchResults.map(song => (
                            <SongCard key={song.id} song={song} collection={searchResults} />
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-8">
                       <div>
                          <p className="text-zinc-400 text-sm font-bold uppercase tracking-[0.2em] mb-4">Popular Genres</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                             {EXPLORE_GENRES.map(genre => (
                               <button 
                                 key={genre.name}
                                 onClick={() => handleSearch(genre.query)}
                                 className={`h-24 rounded-3xl bg-gradient-to-br ${genre.color} p-4 flex items-end shadow-xl hover:scale-[1.02] transition-transform active:scale-95 text-left`}
                               >
                                 <span className="font-extrabold text-lg text-white drop-shadow-md">{genre.name}</span>
                               </button>
                             ))}
                          </div>
                       </div>
                       
                       <div>
                          <p className="text-zinc-400 text-sm font-bold uppercase tracking-[0.2em] mb-4">Quick Searches</p>
                          <div className="flex flex-wrap gap-2">
                             {['New Releases', 'Hindi Hits', 'Tamil Beats', 'Punjabi Pop', 'Classic Rock', '80s Rewind', 'Devotional'].map(tag => (
                               <button 
                                 key={tag}
                                 onClick={() => handleSearch(tag)}
                                 className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-xs font-bold text-zinc-300 transition-colors border border-white/5"
                               >
                                 {tag}
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="py-12 flex flex-col items-center justify-center opacity-20 text-center">
                          <SearchIcon className="w-16 h-16 mb-4" />
                          <p className="font-medium">Discover your next favorite track</p>
                       </div>
                    </div>
                  )}
                </>
            )}
          </div>
        );
      case Screen.Liked:
        return (
          <div className="px-6 py-4 animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold tracking-tight">Liked Songs</h2>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{likedSongs.length} Tracks</p>
            </div>
            {likedSongs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {likedSongs.map(song => (
                  <SongCard key={song.id} song={song} collection={likedSongs} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 space-y-6 opacity-40">
                <div className="p-8 bg-zinc-900 rounded-[3rem]">
                  <HeartIcon className="w-16 h-16 text-indigo-500" />
                </div>
                <div className="text-center">
                   <p className="text-lg font-bold">No favorites yet</p>
                   <p className="text-sm text-zinc-400 mt-1">Start liking songs to build your collection</p>
                </div>
              </div>
            )}
          </div>
        );
      case Screen.Queue:
        return (
          <div className="px-6 py-4 animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold tracking-tight">Up Next</h2>
              {queue.length > 0 && (
                <button 
                  onClick={clearQueue}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 text-xs font-bold uppercase rounded-full tracking-wider hover:bg-zinc-800 transition-colors"
                >
                  Clear Queue
                </button>
              )}
            </div>
            <div className="space-y-3">
              {queue.map((song, index) => (
                <div 
                  key={`${song.id}-${index}`}
                  className={`group flex items-center p-3 rounded-3xl transition-all duration-300 ${currentSongId === song.id ? 'bg-indigo-600/10 border border-indigo-500/10' : 'bg-zinc-900/40 hover:bg-zinc-900/80 border border-transparent'}`}
                >
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden mr-4 shadow-md flex-shrink-0">
                    <img src={song.image[0].link || song.image[0].url} alt="" className="w-full h-full object-cover" />
                    {currentSongId === song.id && (
                      <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate mb-0.5 text-white" dangerouslySetInnerHTML={{ __html: song.name }}></h4>
                    <p className="text-xs text-zinc-400 truncate" dangerouslySetInnerHTML={{ __html: song.primaryArtists }}></p>
                  </div>
                  <button 
                    onClick={() => removeFromQueue(song.id)}
                    className="p-3 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all transform scale-90 group-hover:scale-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
              {queue.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 space-y-4 opacity-30">
                  <QueueIcon className="w-16 h-16" />
                  <p className="text-sm font-medium">No tracks in queue</p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-40 relative">
      <AudioEngine />
      
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/5 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                  <div className="w-1.5 h-6 bg-white rounded-full mx-0.5 animate-pulse"></div>
                  <div className="w-1.5 h-4 bg-white/70 rounded-full mx-0.5 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1.5 h-5 bg-white/90 rounded-full mx-0.5 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
                <h1 className="text-xl font-extrabold tracking-tighter">
                    Lokal<span className="text-indigo-500">Player</span>
                </h1>
            </div>
            <div className="w-full sm:max-w-lg">
                <SearchBar onSearch={handleSearch} placeholder="Songs, artists, or mood..." />
            </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto pb-20">
        {renderScreen()}
      </main>

      {/* Mini Player */}
      <MiniPlayer onExpand={() => setIsPlayerExpanded(true)} />

      {/* Expanded Player */}
      {isPlayerExpanded && (
        <PlayerFull onClose={() => setIsPlayerExpanded(false)} />
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/5 pb-8 pt-4 px-10 flex justify-between items-center max-w-2xl mx-auto rounded-t-[40px] shadow-2xl shadow-indigo-600/10">
        {[
          { icon: HomeIcon, label: 'Home', screen: Screen.Home },
          { icon: SearchIcon, label: 'Explore', screen: Screen.Explore },
          { icon: HeartIcon, label: 'Liked', screen: Screen.Liked, badge: likedSongs.length },
          { icon: QueueIcon, label: 'Queue', screen: Screen.Queue, badge: queue.length }
        ].map((item) => (
          <button 
            key={item.label}
            onClick={() => setActiveScreen(item.screen)}
            className={`group relative flex flex-col items-center gap-1.5 py-1 transition-all duration-300 ${activeScreen === item.screen ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <div className="relative">
              <item.icon className={`w-6 h-6 transition-transform group-active:scale-90 ${activeScreen === item.screen ? 'scale-110' : ''}`} filled={item.label === 'Liked' && item.badge > 0 && activeScreen === Screen.Liked} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-indigo-500 text-white text-[8px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold border-2 border-[#050505] shadow-lg">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest transition-opacity ${activeScreen === item.screen ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
            {activeScreen === item.screen && (
              <div className="absolute -bottom-1 w-1 h-1 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
            )}
          </button>
        ))}
      </nav>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;
