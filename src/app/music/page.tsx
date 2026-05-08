"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
} from "lucide-react";

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  color: string;
}

const tracks: Track[] = [
  {
    id: 1,
    title: "Digital Dreams",
    artist: "Liu Huadong",
    duration: "3:45",
    cover: "🎹",
    color: "from-violet-600 to-purple-600",
  },
  {
    id: 2,
    title: "Neon Nights",
    artist: "Liu Huadong",
    duration: "4:12",
    cover: "🌃",
    color: "from-cyan-600 to-blue-600",
  },
  {
    id: 3,
    title: "Midnight Code",
    artist: "Liu Huadong",
    duration: "3:28",
    cover: "💻",
    color: "from-pink-600 to-rose-600",
  },
  {
    id: 4,
    title: "Starlight Symphony",
    artist: "Liu Huadong",
    duration: "5:03",
    cover: "✨",
    color: "from-amber-600 to-orange-600",
  },
];

export default function MusicPage() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      setProgress(Math.max(0, Math.min(100, percent)));
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
  };

  const track = tracks[currentTrack];

  return (
    <div className="min-h-screen px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Music Studio
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Original compositions and sound design projects
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-20 blur-3xl rounded-3xl`}
          />

          <div className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 md:p-12">
            <div className="flex flex-col items-center">
              {/* Album Art */}
              <motion.div
                className={`w-48 h-48 md:w-64 md:h-64 rounded-2xl bg-gradient-to-br ${track.color} flex items-center justify-center mb-8 shadow-2xl`}
                animate={{
                  scale: isPlaying ? [1, 1.02, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: isPlaying ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                <span className="text-8xl md:text-9xl">{track.cover}</span>
              </motion.div>

              {/* Track Info */}
              <div className="text-center mb-8">
                <motion.h2
                  key={track.id}
                  className="text-3xl md:text-4xl font-bold mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {track.title}
                </motion.h2>
                <p className="text-gray-400 text-lg">{track.artist}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md mb-6">
                <div
                  ref={progressRef}
                  className="h-2 bg-white/10 rounded-full cursor-pointer overflow-hidden"
                  onClick={handleProgressClick}
                >
                  <motion.div
                    className={`h-full bg-gradient-to-r ${track.color} rounded-full`}
                    style={{ width: `${progress}%` }}
                    layoutId="progress"
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>{Math.floor((progress / 100) * 228)}:{String(Math.floor(((progress / 100) * 228) % 60)).padStart(2, '0')}</span>
                  <span>{track.duration}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6">
                <motion.button
                  onClick={prevTrack}
                  className="p-3 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SkipBack size={28} />
                </motion.button>

                <motion.button
                  onClick={togglePlay}
                  className={`p-5 rounded-full bg-gradient-to-r ${track.color} text-white shadow-lg`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    boxShadow: isPlaying
                      ? [
                          "0 0 20px rgba(139, 92, 246, 0.5)",
                          "0 0 40px rgba(139, 92, 246, 0.3)",
                          "0 0 20px rgba(139, 92, 246, 0.5)",
                        ]
                      : "0 0 0px rgba(139, 92, 246, 0)",
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </motion.button>

                <motion.button
                  onClick={nextTrack}
                  className="p-3 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SkipForward size={28} />
                </motion.button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-24 accent-violet-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Track List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <ListMusic className="text-violet-400" />
            <h3 className="text-xl font-semibold">Track List</h3>
          </div>

          <div className="space-y-2">
            {tracks.map((t, index) => (
              <motion.button
                key={t.id}
                onClick={() => {
                  setCurrentTrack(index);
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  currentTrack === index
                    ? "bg-white/10 border border-violet-500/30"
                    : "bg-white/5 hover:bg-white/10 border border-transparent"
                }`}
                whileHover={{ x: 4 }}
              >
                <span className="text-2xl">{t.cover}</span>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${currentTrack === index ? "text-violet-400" : ""}`}>
                    {t.title}
                  </p>
                  <p className="text-sm text-gray-500">{t.artist}</p>
                </div>
                <span className="text-gray-500 text-sm">{t.duration}</span>
                {currentTrack === index && isPlaying && (
                  <motion.div
                    className="flex gap-0.5"
                    animate={{ height: [12, 20, 12] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-violet-500 rounded-full"
                        style={{
                          height: `${Math.random() * 16 + 8}px`,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
