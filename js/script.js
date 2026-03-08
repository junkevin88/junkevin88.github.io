// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');

function highlightActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightActiveNav);

// Update current year in footer
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for fade-in effect
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Make hero section visible immediately
const heroSection = document.getElementById('home');
if (heroSection) {
    heroSection.style.opacity = '1';
    heroSection.style.transform = 'translateY(0)';
}

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';

// Apply the saved theme
if (currentTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
} else {
    htmlElement.setAttribute('data-theme', 'light');
    themeIcon.textContent = '🌙';
}

// Toggle theme function
function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// Add event listener to theme toggle button
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Audio Player & Playlist
const audioPlayerContainer = document.getElementById('audioPlayerContainer');
const audioToggle = document.getElementById('audioToggle');
const audioControls = document.getElementById('audioControls');
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeBtn = document.getElementById('volumeBtn');
const volumeIcon = document.getElementById('volumeIcon');
const volumeSlider = document.getElementById('volumeSlider');
const audioProgressBar = document.getElementById('audioProgressBar');
const audioProgress = document.getElementById('audioProgress');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const audioTitle = document.getElementById('audioTitle');
const audioArtist = document.getElementById('audioArtist');
const playlistToggleBtn = document.getElementById('playlistToggleBtn');
const playlistContainer = document.getElementById('playlistContainer');
const playlist = document.getElementById('playlist');
const playlistCount = document.getElementById('playlistCount');

// Playlist Data
// Tambahkan lagu-lagu Anda di sini
const playlistData = [
    {
        title: 'Punto y Aparte',
        artist: 'Morat',
        src: 'audio/Punto Y Aparte.mp3'
    },
    // Tambahkan lagu lain di sini, contoh:
    {
        title: ' 給我一首歌的時間',
        artist: 'Jay Chou',
        src: 'audio/給我一首歌的時間.mp3'
    },
    {
        title: ' Like I Can',
        artist: 'Sam Smith feat Aitana',
        src: 'audio/Like I Can.mp3'
    },
];

let currentSongIndex = 0;
let isPlaylistVisible = false;
let wasPlaying = false; // Track if audio was playing before song change

// Initialize Playlist
function initPlaylist() {
    if (playlistData.length === 0) return;
    
    // Render playlist
    renderPlaylist();
    updatePlaylistCount();
    
    // Load first song
    loadSong(currentSongIndex);
}

// Render Playlist
function renderPlaylist() {
    if (!playlist) return;
    
    playlist.innerHTML = '';
    playlistData.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = 'playlist-item';
        if (index === currentSongIndex) {
            li.classList.add('active');
        }
        li.innerHTML = `
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
            ${index === currentSongIndex ? '<span class="playlist-item-icon">▶</span>' : ''}
        `;
        li.addEventListener('click', () => {
            wasPlaying = !audioPlayer.paused;
            currentSongIndex = index;
            loadSong(currentSongIndex);
            if (wasPlaying) {
                audioPlayer.play().catch(e => console.log('Play failed:', e));
                playPauseIcon.textContent = '⏸';
            }
        });
        playlist.appendChild(li);
    });
}

// Update Playlist Count
function updatePlaylistCount() {
    if (playlistCount) {
        const count = playlistData.length;
        playlistCount.textContent = `${count} ${count === 1 ? 'song' : 'songs'}`;
    }
}

// Load Song
function loadSong(index) {
    if (index < 0 || index >= playlistData.length) return;
    
    const song = playlistData[index];
    currentSongIndex = index;
    
    // Update audio source
    audioPlayer.src = song.src;
    
    // Update UI
    if (audioTitle) audioTitle.textContent = song.title;
    if (audioArtist) audioArtist.textContent = song.artist;
    
    // Reset progress
    if (audioProgress) audioProgress.style.width = '0%';
    if (currentTimeDisplay) currentTimeDisplay.textContent = '0:00';
    if (durationDisplay) durationDisplay.textContent = '0:00';
    
    // Load metadata
    audioPlayer.load();
    
    // Render playlist to update active state
    renderPlaylist();
}

// Next Song
function nextSong() {
    wasPlaying = !audioPlayer.paused;
    if (currentSongIndex < playlistData.length - 1) {
        currentSongIndex++;
    } else {
        currentSongIndex = 0; // Loop to first song
    }
    loadSong(currentSongIndex);
    if (wasPlaying) {
        audioPlayer.play().catch(e => console.log('Play failed:', e));
        playPauseIcon.textContent = '⏸';
    }
}

// Previous Song
function prevSong() {
    wasPlaying = !audioPlayer.paused;
    if (currentSongIndex > 0) {
        currentSongIndex--;
    } else {
        currentSongIndex = playlistData.length - 1; // Loop to last song
    }
    loadSong(currentSongIndex);
    if (wasPlaying) {
        audioPlayer.play().catch(e => console.log('Play failed:', e));
        playPauseIcon.textContent = '⏸';
    }
}

// Toggle audio player visibility
if (audioToggle && audioPlayerContainer) {
    audioToggle.addEventListener('click', () => {
        audioPlayerContainer.classList.toggle('collapsed');
    });
}

// Toggle playlist visibility
if (playlistToggleBtn && playlistContainer) {
    playlistToggleBtn.addEventListener('click', () => {
        isPlaylistVisible = !isPlaylistVisible;
        playlistContainer.classList.toggle('show', isPlaylistVisible);
    });
}

// Play/Pause functionality
if (playPauseBtn && audioPlayer) {
    playPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseIcon.textContent = '⏸';
        } else {
            audioPlayer.pause();
            playPauseIcon.textContent = '▶';
        }
    });
}

// Next/Previous buttons
if (nextBtn) {
    nextBtn.addEventListener('click', nextSong);
}

if (prevBtn) {
    prevBtn.addEventListener('click', prevSong);
}

// Auto-play next song when current song ends
if (audioPlayer) {
    audioPlayer.addEventListener('ended', () => {
        wasPlaying = true; // Was playing when it ended
        nextSong();
        // Play will be handled by nextSong() since wasPlaying is true
    });
}

// Update progress bar
if (audioPlayer && audioProgress) {
    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        audioProgress.style.width = progress + '%';
        
        // Update current time
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        }
    });

    // Update duration
    audioPlayer.addEventListener('loadedmetadata', () => {
        if (durationDisplay) {
            durationDisplay.textContent = formatTime(audioPlayer.duration);
        }
    });
}

// Seek functionality
if (audioProgressBar && audioPlayer) {
    audioProgressBar.addEventListener('click', (e) => {
        const rect = audioProgressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        audioPlayer.currentTime = pos * audioPlayer.duration;
    });
}

// Volume control
if (volumeSlider && audioPlayer) {
    audioPlayer.volume = volumeSlider.value / 100;
    
    volumeSlider.addEventListener('input', (e) => {
        audioPlayer.volume = e.target.value / 100;
        
        // Update volume icon
        if (volumeIcon) {
            if (e.target.value == 0) {
                volumeIcon.textContent = '🔇';
            } else if (e.target.value < 50) {
                volumeIcon.textContent = '🔉';
            } else {
                volumeIcon.textContent = '🔊';
            }
        }
    });
}

// Volume button mute/unmute
if (volumeBtn && audioPlayer && volumeIcon) {
    let previousVolume = 50;
    
    volumeBtn.addEventListener('click', () => {
        if (audioPlayer.volume > 0) {
            previousVolume = audioPlayer.volume * 100;
            audioPlayer.volume = 0;
            volumeSlider.value = 0;
            volumeIcon.textContent = '🔇';
        } else {
            audioPlayer.volume = previousVolume / 100;
            volumeSlider.value = previousVolume;
            if (previousVolume < 50) {
                volumeIcon.textContent = '🔉';
            } else {
                volumeIcon.textContent = '🔊';
            }
        }
    });
}

// Format time helper function
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Initialize audio player as collapsed by default
if (audioPlayerContainer) {
    audioPlayerContainer.classList.add('collapsed');
}

// Initialize playlist when page loads
document.addEventListener('DOMContentLoaded', () => {
    initPlaylist();
});