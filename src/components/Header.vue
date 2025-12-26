<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import audioFile from '../assets/arcade menu acoustic take2.mp3';

const isPlaying = ref(false);
const audioRef = ref(null);
// We track if the user *intended* for the music to be on
const userWantsMusic = ref(false);

const playMusic = () => {
  if (audioRef.value && !isPlaying.value) {
    audioRef.value.play()
        .then(() => {
          isPlaying.value = true;
          userWantsMusic.value = true;
        })
        .catch(() => {
          console.log("Autoplay blocked. Waiting for interaction.");
        });
  }
};

const toggleMusic = (event) => {
  event.stopPropagation();
  if (isPlaying.value) {
    audioRef.value.pause();
    isPlaying.value = false;
    userWantsMusic.value = false;
  } else {
    audioRef.value.play();
    isPlaying.value = true;
    userWantsMusic.value = true;
  }
};

// --- FIX: STOP MUSIC WHEN APP IS CLOSED/HIDDEN ---
const handleVisibilityChange = () => {
  if (!audioRef.value) return;

  if (document.hidden) {
    // Tab is hidden or phone is locked
    audioRef.value.pause();
    isPlaying.value = false;
  } else {
    // Tab is back in focus - only resume if the user hadn't manually muted it
    if (userWantsMusic.value) {
      audioRef.value.play();
      isPlaying.value = true;
    }
  }
};

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = 0.4;
  }

  // Unlock audio on first click
  window.addEventListener('click', playMusic, { once: true });

  // Listen for tab/app switching
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
  window.removeEventListener('click', playMusic);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<template>
  <header class="header-wrapper">
    <div class="header-container">
      <nav class="nav">
        <router-link to="/">
          <img src="../assets/logo.png" alt="Logo" class="logo" />
        </router-link>

        <div class="nav-right">
          <div class="music-toggle" @click="toggleMusic">
            <i :class="isPlaying ? 'ri-volume-up-fill' : 'ri-volume-mute-fill'" class="volume-icon"></i>

            <div class="music-bars" :class="{ 'is-playing': isPlaying }">
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </div>

            <audio ref="audioRef" :src="audioFile" loop preload="auto"></audio>
          </div>

          <router-link to="/about" class="nav-link pop">About</router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  background: #2A5BBD;
  z-index: 1000;
}

.header-container {
  width: 100%;
  max-width: 450px;
  padding: 1rem 1.5rem;
  box-sizing: border-box;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.logo { width: 100px; height: auto; }
.nav-link { text-decoration: none; color: white; font-size: 1.1rem; font-weight: bold; }

/* --- MUSIC PLAYER STYLES --- */
.music-toggle {
  cursor: pointer;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.15);
  padding: 0 14px;
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.music-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
}

.volume-icon {
  color: white;
  font-size: 1.2rem;
}

.music-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  width: 18px;
  height: 14px;
}

.bar {
  width: 3px;
  background-color: white;
  height: 3px; /* Static height when paused */
  border-radius: 1px;
}

/* Animation only plays when music is active */
.is-playing .bar {
  animation: equalize 0.8s infinite ease-in-out;
}

.is-playing .bar:nth-child(1) { animation-delay: -0.4s; }
.is-playing .bar:nth-child(2) { animation-delay: -0.2s; }
.is-playing .bar:nth-child(3) { animation-delay: 0s; }

@keyframes equalize {
  0%, 100% { height: 4px; }
  50% { height: 14px; }
}

@media screen and (max-width: 480px) {
  .logo { width: 85px; }
  .nav-link { font-size: 0.95rem; }
}
</style>