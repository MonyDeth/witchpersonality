<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import audioFile from '../assets/arcade menu acoustic take2.mp3';

const isPlaying = ref(false);
const audioRef = ref(null);
const userWantsMusic = ref(false);

// State to track if the user has already interacted with the music
const hintDismissed = ref(false);

// Logic: Show hint ONLY if music is not playing AND they haven't interacted yet
const showHint = computed(() => !isPlaying.value && !hintDismissed.value);

const playMusic = () => {
  if (audioRef.value && !isPlaying.value) {
    audioRef.value.play()
        .then(() => {
          isPlaying.value = true;
          userWantsMusic.value = true;
          // Hide hint permanently after first successful play
          hintDismissed.value = true;
        })
        .catch(() => {
          console.log("Autoplay blocked. Waiting for interaction.");
        });
  }
};

const toggleMusic = (event) => {
  event.stopPropagation();

  // User clicked the toggle, so they know where it is. Dismiss hint forever.
  hintDismissed.value = true;

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

const handleVisibilityChange = () => {
  if (!audioRef.value) return;
  if (document.hidden) {
    audioRef.value.pause();
    isPlaying.value = false;
  } else {
    if (userWantsMusic.value) {
      audioRef.value.play();
      isPlaying.value = true;
    }
  }
};

onMounted(() => {
  if (audioRef.value) { audioRef.value.volume = 0.4; }
  window.addEventListener('click', playMusic, { once: true });
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
        <div class="nav-side nav-left">
          <div class="music-toggle" @click="toggleMusic" :class="{ 'is-active': isPlaying }">
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

    <Transition name="fade">
      <div v-if="showHint" class="music-hint-pill lexend">
        <div class="hint-icon-circle">
          <i class="ri-music-2-fill"></i>
        </div>
        <span>Tap the <strong>anywhere</strong> to play music. Tap music icon at top left to mute!</span>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
/* Styles remain exactly the same as your provided CSS */
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
  padding: 0.5rem 1.5rem;
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

.logo { width: 120px; height: auto; display: block; }
.nav-link { text-decoration: none; color: white; font-size: 1rem; }

.music-toggle {
  cursor: pointer;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.music-toggle.is-active {
  background: white;
}

.volume-icon { color: white; font-size: 1.2rem; }

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

.music-hint-pill {
  position: fixed;
  bottom: 50px;
  background: white;
  color: #2A5BBD;
  padding: 10px 18px;
  font-size: .85rem;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 6px 6px 0 rgba(0,0,0,0.2);
  pointer-events: none;
  z-index: 9999;
  max-width: 280px;
  border: 2px solid #2A5BBD;
}

.hint-icon-circle {
  background: #2A5BBD;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.fade-enter-active, .fade-leave-active { transition: all 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(20px); }

.scale-fade-enter-active, .scale-fade-leave-active { transition: all 0.2s ease; }
.scale-fade-enter-from, .scale-fade-leave-to { opacity: 0; transform: scale(0.5); }

@media screen and (max-width: 480px) {
  .logo { width: 100px; }
  .nav-link { font-size: 0.9rem; }
  .music-hint-pill { width: 85%; }
}
</style>