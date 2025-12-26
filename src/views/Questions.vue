<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { questions } from "../data/question.js";
import gsap from "gsap";

const router = useRouter();
const selectedAnswers = ref([]);
const currentIndex = ref(0);
const currentQuestion = computed(() => questions[currentIndex.value]);
const progress = computed(() => ((currentIndex.value + 1) / questions.length) * 100);

const selectedAnswer = ref(null);

const answersContainerRef = ref(null);

function selectAnswer(personality) {
  selectedAnswer.value = personality;
}

function nextQuestion() {
  if (!selectedAnswer.value) return;

  selectedAnswers.value.push(selectedAnswer.value);

  const isLastQuestion = currentIndex.value === questions.length - 1;

  if (!answersContainerRef.value) return;

  gsap.to(answersContainerRef.value, {
    y: -30,
    opacity: 0,
    duration: 0.4,
    ease: "ease-out",
    onComplete: () => {
      if (isLastQuestion) {
        router.push({
          name: "Result",
          query: { answers: selectedAnswers.value.join(",") },
        });
      } else {
        currentIndex.value += 1;
        selectedAnswer.value = null;
        nextTick(() => animateAnswersIn());
      }
    }
  });
}

function animateAnswersIn() {
  if (!answersContainerRef.value) return;

  gsap.fromTo(
      answersContainerRef.value,
      { y:80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "ease-out" }
  );
}

// Animate on mount
onMounted(() => {
  nextTick(() => animateAnswersIn());
});
</script>


<template>
  <div class="page-container" >
    <div class="question-box rotate-2">
      <h2 class="question-text pop">{{ currentQuestion.text }}</h2>

      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- Answers wrapper with ref -->
    <div class="question-box answers-wrapper rotate-2" ref="answersContainerRef">
      <div class="answers">
        <button
            v-for="(answer, index) in currentQuestion.answers"
            :key="index"
            @click="selectAnswer(answer.personality)"
            :class="{ selected: selectedAnswer === answer.personality }"
            class="answer-button lexend"
        >
          {{ answer.text }}
        </button>
      </div>

      <button
          class="next-button lexend"
          :disabled="!selectedAnswer"
          @click="nextQuestion"
      >
        Next
      </button>
    </div>

  </div>
</template>


<style scoped>
.page-container {
  background-color: #2a5bbd;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  flex-direction: column;
  box-sizing: border-box;
}

.rotate-m2{
  transform: rotate(1deg);
}

.question-box {
  background-color: white;
  padding: 1rem 2rem;
  width: 100%;
  max-width: 750px;
  box-shadow: 3px 8px 1px rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question-text {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  color: #1a47a1;
}

.progress-bar-container {
  width: 100%;
  height: 10px;
  background-color: #dddddd;
  margin-bottom: 2rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #2a5bbd;
  transition: width 0.3s ease;
}

.answers {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  font-size: 1rem;
}

.answer-button {
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  background-color: white;
  color: #2a5bbd;
  border: 1px solid #e3e3e3;
  cursor: pointer;
  text-align: center;
  transition: ease-in-out.2s;
}

.answer-button.selected {
  background-color: #FDC648;
  color: #2a5bbd;
  scale: 1.05;
  rotate: 2deg;
}

.answer-button:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);

}

.next-button {
  margin-top: 2rem;
  padding: 1rem 4rem;
  font-size: 1.1rem;
  border: none;
  background-color: #2a5bbd;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.next-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.next-button:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);

}

@media (max-width: 768px) {
  .question-text {
    font-size: 1.2rem;
  }
  .answer-button {
    font-size: 1rem;
    padding: .7rem 1rem;
  }

}
</style>
