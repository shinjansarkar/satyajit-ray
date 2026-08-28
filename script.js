let player;
let isPlaying = false;
let progressInterval;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('yt-player-container', {
        height: '1',
        width: '1',
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'disablekb': 1,
            'listType': 'playlist',
            'list': 'PLFRWUzjGwtd8' // Provided by user
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    updateTimeDisplay();
    // Try to get video data for initial title if possible
    setTimeout(updateTrackDetails, 1000);
}

function updateTrackDetails() {
    if (player && typeof player.getVideoData === 'function') {
        const data = player.getVideoData();
        if (data && data.title) {
            document.getElementById('track-title').textContent = data.title;
        }
    }
}

function onPlayerStateChange(event) {
    const playIcon = document.getElementById('play-icon');
    
    // Update track details whenever state changes (like next video)
    updateTrackDetails();
    
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        document.body.classList.add('is-playing');
        playIcon.setAttribute('data-lucide', 'pause');
        lucide.createIcons();
        startProgressInterval();
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        isPlaying = false;
        document.body.classList.remove('is-playing');
        playIcon.setAttribute('data-lucide', 'play');
        lucide.createIcons();
        stopProgressInterval();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btnPlay = document.getElementById('btn-play');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const seekBar = document.getElementById('seek-bar');
    
    btnPlay.addEventListener('click', () => {
        if (!player || typeof player.getPlayerState !== 'function') return;
        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    });

    btnNext.addEventListener('click', () => {
        if (player && typeof player.nextVideo === 'function') {
            player.nextVideo();
        }
    });

    btnPrev.addEventListener('click', () => {
        if (player && typeof player.previousVideo === 'function') {
            player.previousVideo();
        }
    });

    seekBar.addEventListener('input', (e) => {
        if (!player || typeof player.getDuration !== 'function') return;
        const duration = player.getDuration();
        const seekTo = (e.target.value / 100) * duration;
        player.seekTo(seekTo, true);
        updateTimeDisplay(seekTo);
    });

    // Playlist Panel Toggle
    const btnPlaylist = document.getElementById('btn-playlist');
    const btnClosePlaylist = document.getElementById('btn-close-playlist');
    const playlistPanel = document.getElementById('playlist-panel');
    
    if (btnPlaylist && playlistPanel) {
        btnPlaylist.addEventListener('click', () => {
            playlistPanel.classList.toggle('hidden');
        });
    }
    
    if (btnClosePlaylist && playlistPanel) {
        btnClosePlaylist.addEventListener('click', () => {
            playlistPanel.classList.add('hidden');
        });
    }
    
    populatePlaylist();
    startLiveCounter();
});

// Live Listener via Socket.io
function startLiveCounter() {
    const listenerEl = document.getElementById('listener-count');
    if (!listenerEl) return;
    
    if (typeof io !== 'undefined') {
        // IMPORTANT: Replace this URL with your actual Render URL after deploying!
        // Example: const socket = io('https://my-backend.onrender.com');
        const socket = io('https://YOUR_RENDER_APP_NAME.onrender.com');
        
        socket.on('visitorCountUpdate', (count) => {
            listenerEl.textContent = `${count} here now`;
        });
    } else {
        // Fallback
        listenerEl.textContent = `1 here now`;
    }
}

// Clock logic
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let mins = now.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    mins = mins < 10 ? '0' + mins : mins;
    const clockEl = document.getElementById('time-clock');
    if (clockEl) {
        clockEl.textContent = `${hours}:${mins} IST`;
    }
}
setInterval(updateClock, 1000);
updateClock();

// Dummy Playlist
const dummySongs = [
    "Pather Panchali Theme",
    "Apur Sansar Theme",
    "Charulata (The Lonely Wife)",
    "Goopy Gyne Bagha Byne",
    "Agantuk Main Theme",
    "Jalsaghar Music Room",
    "Shatranj Ke Khilari"
];

function populatePlaylist() {
    const list = document.getElementById('playlist-list');
    if (!list) return;
    list.innerHTML = '';
    
    dummySongs.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = 'playlist-item';
        li.textContent = `${index + 1}. ${song}`;
        li.onclick = () => {
            if (player && typeof player.playVideoAt === 'function') {
                player.playVideoAt(index);
                document.querySelectorAll('.playlist-item').forEach(el => el.classList.remove('active'));
                li.classList.add('active');
            }
        };
        list.appendChild(li);
    });
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds === undefined || seconds < 0) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

function updateTimeDisplay(overrideCurrent) {
    if (!player || typeof player.getDuration !== 'function') return;
    
    const current = overrideCurrent !== undefined ? overrideCurrent : (player.getCurrentTime() || 0);
    const duration = player.getDuration() || 0;
    
    document.getElementById('time-current').textContent = formatTime(current);
    document.getElementById('time-duration').textContent = formatTime(duration);
    
    const progressPercent = duration > 0 ? (current / duration) * 100 : 0;
    const seekBar = document.getElementById('seek-bar');
    const progressFill = document.getElementById('progress-fill');
    
    if (overrideCurrent === undefined) {
        seekBar.value = progressPercent;
    }
    progressFill.style.width = `${progressPercent}%`;
}

function startProgressInterval() {
    updateTimeDisplay();
    progressInterval = setInterval(updateTimeDisplay, 1000);
}

function stopProgressInterval() {
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    updateTimeDisplay();
}
