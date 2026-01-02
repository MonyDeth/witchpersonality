<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import audioFile from '../assets/arcade menu acoustic take2.mp3';

const isPlaying = ref(false);
const audioRef = ref(null);
const userWantsMusic = ref(false);

// hasPlayedOnce controls the "First Visit" expanded state
const hasPlayedOnce = ref(false);

const toggleMusic = (event) => {
  if (event) event.stopPropagation();

  if (isPlaying.value) {
    audioRef.value.pause();
    isPlaying.value = false;
    userWantsMusic.value = false;
  } else {
    audioRef.value.play()
        .then(() => {
          isPlaying.value = true;
          userWantsMusic.value = true;
          hasPlayedOnce.value = true;
        })
        .catch((e) => console.log("Playback failed", e));
  }
};

const handleVisibilityChange = () => {
  if (!audioRef.value) return;
  if (document.hidden) {
    audioRef.value.pause();
    isPlaying.value = false;
  } else if (userWantsMusic.value) {
    audioRef.value.play();
    isPlaying.value = true;
  }
};

onMounted(() => {
  if (audioRef.value) { audioRef.value.volume = 0.4; }
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<template>
  <header class="header-wrapper">
    <div class="header-container">
      <nav class="nav">
        <div class="nav-side nav-left">
          <div
              class="music-toggle"
              @click="toggleMusic"
              :class="{ 'is-active': isPlaying, 'is-expanded': !hasPlayedOnce }"
          >
            <div class="icon-container">
              <Transition name="scale-fade" mode="out-in">
                <i v-if="!isPlaying" class="ri-music-2-fill volume-icon"></i>
                <div v-else class="music-bars">
                  <span class="bar"></span>
                  <span class="bar"></span>
                  <span class="bar"></span>
                </div>
              </Transition>
            </div>

            <div class="text-wrapper" :class="{ 'text-hidden': hasPlayedOnce }">
              <span class="play-text lexend-bold">Play Music</span>
            </div>

            <audio ref="audioRef" :src="audioFile" loop preload="metadata"></audio>
          </div>
        </div>

        <div class="nav-middle">
          <router-link to="/">
            <img src="../assets/logo.png" alt="Logo" class="logo" />
          </router-link>
        </div>

        <div class="nav-side nav-right">
          <router-link to="/about" class="nav-link lexend-bold">About</router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #2A5BBD;
  z-index: 1000;
  position: relative;
}

.header-container {
  width: 100%;
  max-width: 450px;
  padding: 0.8rem 1.5rem;
  box-sizing: border-box;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.nav-side { flex: 1; display: flex; align-items: center; }
.nav-left { justify-content: flex-start; }
.nav-right { justify-content: flex-end; }
.nav-middle { flex: 0 0 auto; display: flex; justify-content: center; }

.logo { width: 100px; height: auto; display: block; }
.nav-link { text-decoration: none; color: white; font-size: 0.9rem; }

/* --- MORPHING MUSIC TOGGLE --- */
.music-toggle {
  cursor: pointer;
  height: 40px;
  /* Start with circle dimensions */
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  /* Cubic bezier gives it a slight 'spring' when it morphs */
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  padding: 0;
}

/* Expanded state: Allow width to grow to accommodate text */
.music-toggle.is-expanded {
  width: 130px;
  background: white;
  justify-content: flex-start;
  padding-left: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.music-toggle.is-active {
  background: white;
  width: 40px;
}

/* Text Container Logic */
.text-wrapper {
  max-width: 100px;
  opacity: 1;
  overflow: hidden;
  transition: max-width 0.5s ease, opacity 0.3s ease, margin-left 0.5s ease;
  margin-left: 8px;
}

.text-hidden {
  max-width: 0;
  opacity: 0;
  margin-left: 0;
}

.play-text {
  color: #2A5BBD;
  font-size: 0.85rem;
  white-space: nowrap;
}

.volume-icon {
  color: white;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.is-expanded .volume-icon {
  color: #2A5BBD;
}

/* Visualizer Bars */
.music-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  width: 16px;
  height: 14px;
}

.bar {
  width: 3px;
  background-color: #2a5bbd;
  height: 4px;
  border-radius: 1px;
  animation: equalize 0.8s infinite ease-in-out;
}

.bar:nth-child(1) { animation-delay: -0.4s; }
.bar:nth-child(2) { animation-delay: -0.2s; }
.bar:nth-child(3) { animation-delay: 0s; }

@keyframes equalize {
  0%, 100% { height: 4px; }
  50% { height: 14px; }
}

/* Transitions */
.scale-fade-enter-active, .scale-fade-leave-active { transition: all 0.2s ease; }
.scale-fade-enter-from, .scale-fade-leave-to { opacity: 0; transform: scale(0.5); }

@media screen and (max-width: 480px) {
  .logo { width: 85px; }
}
</style>