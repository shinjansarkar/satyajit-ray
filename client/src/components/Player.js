"use client";

import { useState, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import { Play, Pause, SkipBack, SkipForward, Menu, X } from "lucide-react";

const dummySongs = [
  "Pather Panchali Theme",
  "Apur Sansar Theme",
  "Charulata (The Lonely Wife)",
  "Goopy Gyne Bagha Byne",
  "Agantuk Main Theme",
  "Jalsaghar Music Room",
  "Shatranj Ke Khilari",
];

export default function Player() {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackTitle, setTrackTitle] = useState("সত্যজিৎ রায়ের সুর");
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [activeSongIndex, setActiveSongIndex] = useState(0);

  const progressInterval = useRef(null);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const onReady = (event) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
    updateTrackDetails(event.target);
  };

  const updateTrackDetails = (ytPlayer) => {
    if (ytPlayer && typeof ytPlayer.getVideoData === "function") {
      const data = ytPlayer.getVideoData();
      if (data && data.title) {
        setTrackTitle(data.title);
      }
    }
  };

  const onStateChange = (event) => {
    updateTrackDetails(event.target);
    if (event.data === YouTube.PlayerState.PLAYING) {
      setIsPlaying(true);
      setDuration(event.target.getDuration());
      progressInterval.current = setInterval(() => {
        setCurrentTime(event.target.getCurrentTime());
      }, 1000);
    } else {
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      document.body.classList.add("is-playing");
    } else {
      document.body.classList.remove("is-playing");
    }
    return () => {
      document.body.classList.remove("is-playing");
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const nextVideo = () => {
    if (player) player.nextVideo();
  };

  const prevVideo = () => {
    if (player) player.previousVideo();
  };

  const handleSeek = (e) => {
    if (!player) return;
    const seekTo = (e.target.value / 100) * duration;
    player.seekTo(seekTo, true);
    setCurrentTime(seekTo);
  };

  const playSongAt = (index) => {
    if (player) {
      player.playVideoAt(index);
      setActiveSongIndex(index);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <div className="hidden-player">
        <YouTube
          videoId=""
          opts={{
            height: "1",
            width: "1",
            playerVars: {
              playsinline: 1,
              controls: 0,
              disablekb: 1,
              listType: "playlist",
              list: "PLFRWUzjGwtd8",
            },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>

      <div className="bottom-player-wrapper fade-in delay-4">
        <div className="glass-panel bottom-player">
          {/* Left: Thumbnail & Info */}
          <div className="player-info">
            <div className="thumb-wrapper">
              <div className={`thumb-container ${isPlaying ? "thumb-spin" : ""}`} style={{ animationPlayState: isPlaying ? "running" : "paused" }}>
                <div className="thumb-hole"></div>
              </div>
            </div>
            <div className="track-details">
              <div className="track-title" id="track-title">
                {trackTitle}
              </div>
              <div className="track-artist">Manik Da · Playlist</div>
            </div>
          </div>

          {/* Center: Controls */}
          <div className="player-controls">
            <button onClick={prevVideo} className="control-btn" aria-label="Previous">
              <SkipBack size={18} />
            </button>
            <button onClick={togglePlay} className="play-btn" aria-label="Play/Pause">
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
            <button onClick={nextVideo} className="control-btn" aria-label="Next">
              <SkipForward size={18} />
            </button>
          </div>

          {/* Right/Bottom: Scrubber & Volume */}
          <div className="player-scrubber">
            <span id="time-current" className="time-text">
              {formatTime(currentTime)}
            </span>
            <div className="progress-container">
              <input type="range" min="0" max="100" value={progressPercent || 0} onChange={handleSeek} className="slider" aria-label="Seek" />
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span id="time-duration" className="time-text">
              {formatTime(duration)}
            </span>

            <button onClick={() => setPlaylistOpen(!playlistOpen)} className="control-btn" aria-label="Playlist">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* PLAYLIST PANEL */}
      <div className={`playlist-panel ${playlistOpen ? "" : "hidden"}`}>
        <div className="playlist-header">
          <h3>Up Next</h3>
          <button onClick={() => setPlaylistOpen(false)} className="control-btn">
            <X size={18} />
          </button>
        </div>
        <ul className="playlist-list">
          {dummySongs.map((song, index) => (
            <li
              key={index}
              className={`playlist-item ${activeSongIndex === index ? "active" : ""}`}
              onClick={() => playSongAt(index)}
            >
              {index + 1}. {song}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
