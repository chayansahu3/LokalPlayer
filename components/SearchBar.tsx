
import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon } from './Icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search for songs, artists..." }) => {
  const [value, setValue] = useState("");
  const lastEmittedQuery = useRef("");

  useEffect(() => {
    const trimmed = value.trim();
    
    // Don't search for very short strings
    if (trimmed.length > 0 && trimmed.length < 2) return;
    
    // If empty, we might want to clear results, but the parent handleSearch handles empty
    if (trimmed === lastEmittedQuery.current) return;

    const timer = setTimeout(() => {
      if (trimmed !== lastEmittedQuery.current) {
        lastEmittedQuery.current = trimmed;
        onSearch(trimmed);
      }
    }, 600);
    
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="relative group w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
      </div>
      <input
        type="text"
        className="block w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-slate-800 text-white text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-500 outline-none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
