<template>
  <div class="heroes-view">
    <div class="container">
      <div class="header">
        <h1>Super Heroes</h1>
        <router-link to="/heroes/create" class="btn btn-primary">
          Adicionar Herói
        </router-link>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando informações do heróis...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <h2>Erro ao carregar herói</h2>
        <p>{{ error }}</p>
        <router-link to="/heroes" class="btn btn-primary">
          Voltar para Lista
        </router-link>
      </div>

      <!-- Empty state -->
      <div v-else-if="heroes.length === 0" class="empty-state">
        <h3>Nenhum super-herói encontrado</h3>
        <p>Que tal adicionar o primeiro herói?</p>
        <router-link to="/heroes/create" class="btn btn-primary">
          Adicionar Primeiro Herói
        </router-link>
      </div>

      <!-- Heroes list -->
      <div v-else class="heroes-grid">
        <div v-for="hero in heroes" :key="hero.id" class="hero-card">
          <div class="hero-card-header">
            <h3>{{ hero.heroName }}</h3>
            <span class="hero-name">{{ hero.name }}</span>
          </div>
          
          <div class="hero-details">
            <p><strong>Data de Nascimento:</strong> {{ formatDate(hero.birthdate) }}</p>
            <p><strong>Altura:</strong> {{ hero.height }}m</p>
            <p><strong>Peso:</strong> {{ hero.weight }}kg</p>
          </div>

          <div class="hero-superpowers">
            <h4>Superpoderes:</h4>
            <div class="superpowers-list">
              <span 
                v-for="superpower in hero.superpowers" 
                :key="superpower.id" 
                class="superpower-tag"
              >
                {{ superpower.name }}
              </span>
            </div>
          </div>

          <div class="hero-actions">
            <router-link 
              :to="`/heroes/${hero.id}`" 
              class="btn btn-secondary"
            >
              Detalhes
            </router-link>
            <router-link 
              :to="`/heroes/${hero.id}/edit`" 
              class="btn btn-outline"
            >
              Editar
            </router-link>
            <button 
              @click="confirmDelete(hero)" 
              class="btn btn-danger"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal" @click.stop>
        <h3>Confirmar Exclusão</h3>
        <p>Tem certeza que deseja excluir o herói <strong>{{ heroToDelete?.heroName }}</strong>?</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn btn-secondary">
            Cancelar
          </button>
          <button @click="deleteHero" class="btn btn-danger" :disabled="deleting">
            {{ deleting ? 'Excluindo...' : 'Excluir' }}
          </button>
        </div>

        <!-- Delete Error state -->
        <div v-if="deleteError" class="error-message">{{ deleteError }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { heroesApi } from '@/services/api'

export default {
  name: 'HeroesView',
  data() {
    return {
      heroes: [],
      loading: false,
      error: null,
      deleteError: null,
      showDeleteModal: false,
      heroToDelete: null,
      deleting: false
    }
  },
  async mounted() {
    await this.loadHeroes()
  },
  methods: {
    async loadHeroes() {
      this.loading = true
      this.error = null
      
      try {
        const response = await heroesApi.getAll()
        
        if (response.data.data) {
          this.heroes = response.data.data
        } else if (Array.isArray(response.data)) {
          this.heroes = response.data
        } else {
          this.heroes = []
        }
      } catch (error) {
        console.error('Error loading heroes:', error)
        this.error = error.message || 'Erro ao carregar os heróis. Tente novamente.'
      } finally {
        this.loading = false
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR')
    },

    confirmDelete(hero) {
      this.heroToDelete = hero
      this.showDeleteModal = true
    },

    cancelDelete() {
      this.heroToDelete = null
      this.showDeleteModal = false
    },

    async deleteHero() {
      if (!this.heroToDelete) return

      this.deleting = true
      this.deleteError = null

      try {
        await heroesApi.delete(this.heroToDelete.id)
        await this.loadHeroes()
        this.cancelDelete()
      } catch (error) {
        console.error('Error deleting hero:', error)
        this.deleteError = error.message || 'Erro ao excluir o herói. Tente novamente.'
      } finally {
        this.deleting = false
      }
    }
  }
}
</script>

<style scoped>
.heroes-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading-container, .error-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #2c3e50;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state h3 {
  color: #7f8c8d;
  margin-bottom: 10px;
}

.empty-state p {
  color: #95a5a6;
  margin-bottom: 30px;
}

.heroes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.hero-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hero-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.hero-card-header {
  margin-bottom: 15px;
}

.hero-card-header h3 {
  color: #2c3e50;
  margin: 0 0 5px 0;
  font-size: 1.4em;
}

.hero-name {
  color: #7f8c8d;
  font-style: italic;
}

.hero-details {
  margin-bottom: 15px;
}

.hero-details p {
  margin: 5px 0;
  color: #34495e;
}

.hero-superpowers {
  margin-bottom: 20px;
}

.hero-superpowers h4 {
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-size: 1em;
}

.superpowers-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.superpower-tag {
  background-color: #ecf0f1;
  color: #2c3e50;
  padding: 4px 8px;
  border-radius: 15px;
  font-size: 0.8em;
  font-weight: 500;
}

.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-actions .btn {
  flex: 1;
  min-width: 80px;
  font-size: 0.9em;
  padding: 8px 12px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal h3 {
  color: #2c3e50;
  margin: 0 0 15px 0;
}

.modal p {
  color: #34495e;
  margin-bottom: 25px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.modal-actions .btn {
  min-width: 100px;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .heroes-grid {
    grid-template-columns: 1fr;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-actions .btn {
    flex: none;
  }
}
</style>