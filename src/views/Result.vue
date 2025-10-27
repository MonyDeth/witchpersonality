<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import gsap from "gsap";

const router = useRouter();
const route = useRoute();

const cardRef = ref(null);
const resultRef = ref(null);
const character = ref(null);
const result = ref("");
const revealed = ref(false);

const personalities = {
  1: { name: "Marie", description: "Thoughtful and introspective.", image: "/public/images/1-marie.png" },
  2: { name: "Lyda", description: "Outgoing and adventurous.", image: "/public/images/2-lyda.png" },
  3: { name: "Vanna", description: "Creative and curious.", image: "/public/images/3-vanna.png" },
};

onMounted(() => {
  const answersQuery = route.query.answers;
  if (!answersQuery) {
    result.value = "No results available.";
    return;
  }

  const answers = answersQuery.split(",");
  const counts = {};
  answers.forEach(p => counts[p] = (counts[p] || 0) + 1);

  let max = -Infinity;
  let maxKey = null;
  for (const key in counts) {
    if (counts[key] > max) {
      max = counts[key];
      maxKey = key;
    }
  }

  character.value = personalities[maxKey];
  result.value = character.value.description;

  nextTick(() => {
    animateCardEntry(); // Animate card dropping in on mount
    initCard();         // Initialize click/flip animation
  });
});

function animateCardEntry() {
  const card = cardRef.value;
  const result = resultRef.value;

  const tl = gsap.timeline();

  // Card drops in from above with slight rotation and scale
  tl.from(card, {
    y: 400,
    opacity: 0,
    scale: 0.8,
    rotation: -5,
    duration: .8,
    ease: "power2.out"
  });

  gsap.to(card, {
    y: "-=15",
    duration: 2,
    ease: "easeOut",
    yoyo: true,
    repeat: -1,
    delay: 1.2
  });
  gsap.to(result, {
    y: "-=15",
    duration: 1.5,
    ease: "easeOut",
    yoyo: true,
    repeat: -1,
  });
}

function initCard() {
  const card = cardRef.value;
  const front = card.querySelector(".cardFront");
  const back = card.querySelector(".cardBack");

  gsap.set(card, { transformStyle: "preserve-3d", transformPerspective: 1000, x: 0, y: 0 });
  gsap.set(back, { rotationY: -180 });
  gsap.set(resultRef.value, { opacity: 0, x: 50 });

  const tl = gsap.timeline({ paused: true });
  tl.to(front, { rotationY: 180, duration: 1 })
      .to(back, { rotationY: 0, duration: 1 }, 0)
      .to(card, {
        x: window.innerWidth > 768 ? -220 : 0,
        y: 0,
        rotation: -2,
        duration: 0.8,
        ease: "power2.out"
      }, 0)
      .to(resultRef.value, { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0);

  card.addEventListener("click", () => {
    if (!revealed.value) {
      revealed.value = true;
      tl.play();
    }
  });
}
</script>


<template>
  <div class="page-container">
    <div class="cardCont" ref="cardRef">
      <div class="cardBack" :style="{ backgroundImage: `url(${character?.image})` }"></div>
      <div class="cardFront" style="background-image: url('/src/assets/card-back.png')">
        <div class="click-text dm-serif-text-regular-italic">Click to Reveal</div>
      </div>
    </div>

    <div class="result-container" ref="resultRef">
      <h3 class="subtitle dm-sans-regular">You are:</h3>
      <h1 class="character-name dm-serif-text-regular-italic">{{ character?.name }}</h1>
      <p class="character-description dm-sans-regular">{{ result }}</p>
      <button @click="router.push('/')"class="dm-sans-regular">Restart Test</button>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  position: relative;
  width: 100%;
  background: #2a5bbd;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  flex-wrap: wrap;
}

.cardCont {
  width: 400px;
  max-width: 90%;
  height: 600px;
  max-height: 80vh;
  position: relative;
  cursor: pointer;
  margin-bottom: 2rem;

}

.cardFront, .cardBack {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  cursor: pointer;
  box-shadow: 8px 8px 0px rgba(0,0,0,0.4);


}

.cardBack {
  transform: rotateY(-180deg);
}

.click-text {
  margin: 1rem;
  color: #fff;
  font-size: 1.3rem;
  text-align: center;
}

.result-container {
  position: absolute;
  right: 20%;
  top: 50%;
  transform: translateY(-50%) translateX(220px);
  background: #fff;
  padding: 2rem;
  color: #2a5bbd;
  max-width: 750px;
  min-width: 550px;
  box-shadow: 8px 8px 0px rgba(0,0,0,0.4);
  rotate: 4deg;

}
.subtitle{
  color: #6c6c6c;
}
.character-name{
  font-size: 6rem;
}
.character-description {
  font-size: 1.5rem;
}
/* Responsive: stack card above result */
@media (max-width: 768px) {
  .page-container {
    flex-direction: column;
    align-items: center;
  }
  .result-container {
    position: static;
    transform: none;
    margin-top: 2rem;
    width: 90%;
  }
}

.result-container h2 { margin:0; font-size:1.5rem; }
.result-container p { margin:0; margin-top:0.5rem; line-height:1.4; }
.result-container button {
  margin-top:1rem;
  background:#2a5bbd;
  color:#fff;
  border:none;
  padding:0.8rem 1.5rem;
  cursor:pointer;
}
.result-container button:hover {
  transform: translateY(-2px) scale(1.05);
}
</style>
