<template>
  <header class="app-header">
    <div class="container">
      <div class="logo-section">
        <h1 class="app-title">Super Heroes Manager</h1>
        <p class="app-subtitle">Gerencie seus super-heróis favoritos</p>
      </div>
      
      <nav class="main-nav">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/heroes" class="nav-link">Heróis</RouterLink>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <RouterView />
  </main>

  <footer class="app-footer">
    <div class="container">
      <p>&copy; 2025 Super Heroes Manager. Desenvolvido com Vue.js e .NET Core.</p>
    </div>
  </footer>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView
  }
}
</script>
