<template>
  <div class="hero-detail-view">
    <div class="container">
      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando informações do herói...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <h2>Erro ao carregar herói</h2>
        <p>{{ error }}</p>
        <router-link to="/heroes" class="btn btn-primary">
          Voltar para Lista
        </router-link>
      </div>

      <!-- Hero details -->
      <div v-else-if="hero" class="hero-details">
        <div class="hero-header">
          <div class="hero-title-section">
            <h1 class="hero-name">{{ hero.heroName }}</h1>
            <p class="civil-name">{{ hero.name }}</p>
          </div>
          <div class="hero-actions">
            <router-link 
              :to="`/heroes/${hero.id}/edit`" 
              class="btn btn-primary"
            >
              Editar
            </router-link>
            <router-link to="/heroes" class="btn btn-secondary">
              Voltar
            </router-link>
          </div>
        </div>

        <!-- Hero Information Cards -->
        <div class="hero-info-grid">
          <!-- Personal Information -->
          <div class="info-card">
            <h3 class="card-title">Informações Pessoais</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">Nome Civil:</span>
                <span class="info-value">{{ hero.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Nome de Herói:</span>
                <span class="info-value">{{ hero.heroName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Data de Nascimento:</span>
                <span class="info-value">{{ formatDate(hero.birthdate) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Idade:</span>
                <span class="info-value">{{ calculateAge(hero.birthdate) }} anos</span>
              </div>
            </div>
          </div>

          <!-- Physical Characteristics -->
          <div class="info-card">
            <h3 class="card-title">Características Físicas</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">Altura:</span>
                <span class="info-value">{{ hero.height }}m</span>
              </div>
              <div class="info-item">
                <span class="info-label">Peso:</span>
                <span class="info-value">{{ hero.weight }}kg</span>
              </div>
              <div class="info-item">
                <span class="info-label">IMC:</span>
                <span class="info-value">{{ calculateBMI(hero.height, hero.weight) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Superpowers Section -->
        <div class="superpowers-section">
          <h3 class="section-title">Superpoderes</h3>
          <div v-if="hero.superpowers && hero.superpowers.length > 0" class="superpowers-grid">
            <div 
              v-for="superpower in hero.superpowers" 
              :key="superpower.id" 
              class="superpower-card"
            >
              <h4 class="superpower-name">{{ superpower.name }}</h4>
              <p class="superpower-description">{{ superpower.description }}</p>
            </div>
          </div>
          <div v-else class="no-superpowers">
            <p>Nenhum superpoder cadastrado para este herói.</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="bottom-actions">
          <router-link 
            :to="`/heroes/${hero.id}/edit`" 
            class="btn btn-primary btn-large"
          >
            Editar Herói
          </router-link>
          <button 
            @click="confirmDelete" 
            class="btn btn-danger btn-large"
          >
            Excluir Herói
          </button>
        </div>
      </div>

      <!-- Delete confirmation modal -->
      <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
        <div class="modal" @click.stop>
          <h3>Confirmar Exclusão</h3>
          <p>Tem certeza que deseja excluir o herói <strong>{{ hero?.heroName }}</strong>?</p>
          <p class="warning-text">Esta ação não pode ser desfeita.</p>
          <div class="modal-actions">
            <button @click="cancelDelete" class="btn btn-secondary">
              Cancelar
            </button>
            <button @click="deleteHero" class="btn btn-danger" :disabled="deleting">
              {{ deleting ? 'Excluindo...' : 'Excluir' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { heroesApi } from '@/services/api'

export default {
  name: 'HeroDetailView',
  data() {
    return {
      hero: null,
      loading: false,
      error: null,
      showDeleteModal: false,
      deleting: false
    }
  },
  async mounted() {
    await this.loadHero()
  },
  methods: {
    async loadHero() {
      const heroId = this.$route.params.id
      
      if (!heroId) {
        this.error = 'ID do herói não fornecido'
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await heroesApi.getById(heroId)
        this.hero = response.data
      } catch (error) {
        console.error('Error loading hero:', error)
        
        this.error = error.message || 'Erro ao carregar o herói. Tente novamente.'
      } finally {
        this.loading = false
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },

    calculateAge(birthdate) {
      const birth = new Date(birthdate)
      const today = new Date()
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      
      return age
    },

    calculateBMI(height, weight) {
      const bmi = weight / (height * height)
      return bmi.toFixed(1)
    },

    confirmDelete() {
      this.showDeleteModal = true
    },

    cancelDelete() {
      this.showDeleteModal = false
    },

    async deleteHero() {
      if (!this.hero) return

      this.deleting = true

      try {
        await heroesApi.delete(this.hero.id)
        this.$router.push('/heroes')
      } catch (error) {
        console.error('Error deleting hero:', error)
        this.error = 'Erro ao excluir o herói. Tente novamente.'
        this.cancelDelete()
      } finally {
        this.deleting = false
      }
    }
  }
}
</script>

<style scoped>
.hero-detail-view {
  max-width: 1000px;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container h2 {
  color: #e74c3c;
  margin-bottom: 15px;
}

.error-container p {
  color: #7f8c8d;
  margin-bottom: 30px;
}

.hero-details {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.hero-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.hero-title-section {
  flex: 1;
}

.hero-name {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.civil-name {
  font-size: 1.3rem;
  opacity: 0.9;
  margin: 0;
  font-style: italic;
}

.hero-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.hero-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

.info-card {
  padding: 30px;
  border-bottom: 1px solid #e1e8ed;
}

.info-card:nth-child(odd) {
  border-right: 1px solid #e1e8ed;
}

.card-title {
  color: #2c3e50;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.info-label {
  font-weight: 600;
  color: #7f8c8d;
  flex: 1;
}

.info-value {
  font-weight: 500;
  color: #2c3e50;
  text-align: right;
  flex: 1;
}

.superpowers-section {
  padding: 40px;
  border-top: 1px solid #e1e8ed;
}

.section-title {
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 25px 0;
  text-align: center;
}

.superpowers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.superpower-name {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.superpower-description {
  color: #7f8c8d;
  margin: 0;
  line-height: 1.5;
}

.no-superpowers {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-style: italic;
}

.bottom-actions {
  padding: 30px 40px;
  background: #f8f9fa;
  display: flex;
  gap: 20px;
  justify-content: center;
  border-top: 1px solid #e1e8ed;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;
}

.btn-large {
  padding: 15px 30px;
  font-size: 1.1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(149, 165, 166, 0.3);
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
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
  border-radius: 15px;
  max-width: 450px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal h3 {
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-size: 1.5rem;
}

.modal p {
  color: #34495e;
  margin-bottom: 15px;
  line-height: 1.5;
}

.warning-text {
  color: #e74c3c;
  font-weight: 500;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
}

.modal-actions .btn {
  min-width: 120px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-detail-view {
    padding: 15px;
  }

  .hero-header {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
  }

  .hero-name {
    font-size: 2.2rem;
  }

  .civil-name {
    font-size: 1.1rem;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-info-grid {
    grid-template-columns: 1fr;
  }

  .info-card:nth-child(odd) {
    border-right: none;
  }

  .info-card {
    padding: 25px 20px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .info-value {
    text-align: left;
  }

  .superpowers-section {
    padding: 30px 20px;
  }

  .superpowers-grid {
    grid-template-columns: 1fr;
  }

  .bottom-actions {
    flex-direction: column;
    padding: 25px 20px;
  }

  .btn-large {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .hero-name {
    font-size: 1.8rem;
  }

  .civil-name {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .hero-actions .btn {
    width: 100%;
  }

  .card-title {
    font-size: 1.2rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .modal {
    padding: 25px 20px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions .btn {
    width: 100%;
  }
}
</style>

