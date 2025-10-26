<script setup>
</script>

<template>
  <header class="header">
    <nav class="nav">
      <router-link to="/">
        <img src="../assets/logo.png" alt="Logo" class="logo" />
      </router-link>
      <router-link to="/about" class="nav-link dm-serif-text-regular-italic">About</router-link>
    </nav>
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  padding: 1rem 2rem;
  box-sizing: border-box;
}

.nav {
  display: flex;
  justify-content: space-between; /* pushes items to opposite sides */
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: white;
  font-size: 1.4rem;
  transition: ease-in-out 0.3s;
}
.nav-link:hover {
  scale: 1.2;

}

.logo {
  width: 125px; /* adjust as needed */
  height: auto;
}
</style>
