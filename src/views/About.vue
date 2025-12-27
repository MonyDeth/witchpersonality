<script setup>
const team = [
  { name: "Name One", title: "Lead Developer" },
  { name: "Name Two", title: "Artist & Designer" },
  { name: "Name Three", title: "Writer" }
];

const credit = [
  { name: "Rachel", title: "Writer" },
  { name: "Jet", title: "Writer" },
  { name: "Akari", title: "Design and Development" }
];

const socials = [
  { name: "Facebook", icon: "ri-facebook-circle-fill", url: "#" },
  { name: "Instagram", icon: "ri-instagram-fill", url: "#" },
  { name: "TikTok", icon: "ri-tiktok-fill", url: "#" },
  { name: "X (formally Twitter)", icon: "ri-twitter-x-line", url: "#" },
  { name: "BlueSky", icon: "ri-bluesky-fill", url: "#" }
];
</script>

<template>
  <div class="mobile-wrapper">
    <section class="about-card">
      <div class="logo-section">
        <img src="../assets/nompang-blue.webp" alt="Nompang Studios" class="studio-logo" />
        <p class="info lexend">Nompang Studios is a small independent game studio based in Phnom Penh, made up of university students passionate about creating games. So far, we've baked (developed) 2 project and A Witch's Stop being our biggest yet.</p>
        <p class="info lexend-bold">Based in Phnom Penh, Cambodia</p>
      </div>

      <hr class="divider" />

      <div class="info-section">
        <img src="../assets/logo-color.webp" alt="Nompang Studios" class="game-logo" />
        <p class="lexend">
          <strong class="lexend-bold">A Witch’s Stop</strong> is an anime-inspired rhythm game where you play as members in a band full of teen witches. It consists of a gameplay fusion of music and magic where you cast spells along with the rhythm.
        </p>
        <p class="lexend">
         The player will traverse through the cozy seaside village where there’s magic, witches, and high school.
        </p>
      </div>

      <div class="team-section">
        <h3 class="pop">Team</h3>
        <div v-for="member in team" :key="member.name" class="team-member">
          <span class="member-name lexend-bold">{{ member.name }}</span>
          <span class="member-title lexend">{{ member.title }}</span>
        </div>
      </div>

      <div class="team-section">
        <h3 class="pop">Website Credit</h3>
        <div v-for="member in credit" :key="member.name" class="team-member">
          <span class="member-name lexend-bold">{{ member.name }}</span>
          <span class="member-title lexend">{{ member.title }}</span>
        </div>
      </div>

      <div class="team-section">
        <h3 class="pop">Social</h3>
        <div class="social-section">
          <a v-for="social in socials" :key="social.name" :href="social.url" target="_blank" class="social-link">
            <i :class="social.icon"></i>
          </a>
        </div>
      </div>
      <p class="footer-note lexend">© 2026 Nompang Studios</p>
    </section>
  </div>
</template>

<style scoped>
.mobile-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #2A5BBD; /* Matching your main theme */
  padding: 2rem 1rem;

}

.about-card {
  width: 100%;
  max-width: 400px; /* This restricts it to mobile width */
  background: white;
  color: #2A5BBD;
  padding: 2rem;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
}

.studio-logo {
  width: 120px;
  margin-bottom: 1rem;
}
.game-logo {
  width: 200px;
  margin-bottom: 1rem;
}

.location {
  font-size: 0.8rem;
  opacity: 0.8;
}
.info{
  text-align: left;
  margin-top: 12px;
}
.divider {
  border: none;
  border-top: 2px dashed #2A5BBD;
  margin: 2rem 0;
  opacity: 0.3;
}
.info-section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.info-section p {
  padding: 1rem 0;
  font-size: 0.95rem;
  line-height: 1.6;
  text-align: left;
}

.team-section {
  margin-top: 2.5rem;
  text-align: left;
}

.team-section h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #2A5BBD;
  display: inline-block;
}

.team-member {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.member-name { font-size: 1rem; }
.member-title { font-size: 0.8rem; color: #666; }

.social-section {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  font-size: 1.5rem;
}

.social-link {
  color: #2A5BBD;
  transition: transform 0.2s;
  font-size: 32px;
  text-decoration: none;
}

.social-link:hover {
  transform: translateY(-3px);
}

.footer-note {
  margin-top: 3rem;
  font-size: 0.7rem;
  opacity: 0.5;
}
</style>