"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReelCreation } from '@/contexts/ReelCreationContext';
import { Music, ArrowLeft, ArrowRight, Check } from 'lucide-react';

// Sample music tracks
const MUSIC_TRACKS = [
  {
    id: 'upbeat',
    name: 'Upbeat Vibe',
    artist: 'Royalty Free',
    duration: '0:30',
    category: 'Trending',
  },
  {
    id: 'chill',
    name: 'Chill Lo-Fi',
    artist: 'Royalty Free',
    duration: '0:30',
    category: 'Popular',
  },
  {
    id: 'electronic',
    name: 'Electronic Pulse',
    artist: 'Royalty Free',
    duration: '0:30',
    category: 'Trending',
  },
  {
    id: 'acoustic',
    name: 'Acoustic Morning',
    artist: 'Royalty Free',
    duration: '0:30',
    category: 'For You',
  },
  {
    id: 'no-music',
    name: 'No Music',
    artist: '',
    duration: '',
    category: 'No Music',
  },
];

export function MusicSelectionStep() {
  const { state, selectMusic, goToNextStep, goToPreviousStep } = useReelCreation();
  const [selectedId, setSelectedId] = useState<string | null>(state.selectedMusic?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTracks = useMemo(() => {
    return MUSIC_TRACKS.filter(track => 
      track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelect = (track: typeof MUSIC_TRACKS[0]) => {
    selectMusic(track);
    setSelectedId(track.id);
  };

  // Get album art color based on track ID
  const getAlbumArtColor = (id: string) => {
    const colors = [
      'from-purple-500/20 to-pink-500/20',
      'from-blue-500/20 to-cyan-500/20',
      'from-emerald-500/20 to-teal-500/20',
      'from-amber-500/20 to-orange-500/20',
      'from-rose-500/20 to-red-500/20',
    ];
    return colors[id.charCodeAt(0) % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block"
        >
          <h2 className="text-2xl font-bold text-white">
            Select Music for Your Reel
          </h2>
          <p className="mt-2 text-gray-400">
            Choose a track that matches your content's vibe
          </p>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search tracks, artists, or categories..."
          className="block w-full pl-10 pr-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Music Grid */}
      <div className="space-y-4">
        {filteredTracks.map((track) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative group p-4 rounded-xl cursor-pointer transition-colors ${
              selectedId === track.id 
                ? 'bg-gray-800/80 ring-2 ring-blue-500' 
                : 'bg-gray-800/50 hover:bg-gray-800/70'
            }`}
            onClick={() => handleSelect(track)}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center ${getAlbumArtColor(track.id)}`}>
                <Music className="h-6 w-6 text-white/80" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white truncate">{track.name}</h3>
                <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">{track.duration}</span>
                  {track.category && (
                    <span className="mx-2 text-gray-600">•</span>
                  )}
                  <span className="text-xs text-gray-400">{track.category}</span>
                </div>
              </div>
              {selectedId === track.id && (
                <div className="flex-shrink-0 text-blue-500">
                  <Check className="h-5 w-5" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={goToPreviousStep}
          className="flex items-center space-x-2 px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        
        <button
          onClick={goToNextStep}
          disabled={!selectedId}
          className={`flex items-center space-x-2 px-6 py-2.5 text-sm font-medium rounded-md transition-colors ${
            selectedId
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>Continue</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
