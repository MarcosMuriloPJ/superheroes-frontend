<template>
  <div class="home">
    <div class="container">
      <div class="features-section">
        <h2 class="section-title">Funcionalidades</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <h3>Listagem Completa</h3>
            <p>Visualize todos os seus super-heróis cadastrados com informações detalhadas sobre cada um.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">➕</div>
            <h3>Cadastro Fácil</h3>
            <p>Adicione novos heróis com nome, poderes, características físicas e data de nascimento.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">✏️</div>
            <h3>Edição Rápida</h3>
            <p>Atualize as informações dos seus heróis de forma simples e intuitiva.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Superpoderes</h3>
            <p>Gerencie os superpoderes de cada herói com uma ampla variedade de opções disponíveis.</p>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <h2 class="section-title">Estatísticas</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ heroCount }}</div>
            <div class="stat-label">Heróis Cadastrados</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-number">{{ superpowerCount }}</div>
            <div class="stat-label">Superpoderes Disponíveis</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-number">{{ totalSuperpowers }}</div>
            <div class="stat-label">Total de Poderes Atribuídos</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { heroesApi, superpowersApi } from '@/services/api'
import { notify } from "@kyvg/vue3-notification";

export default {
  name: 'HomeView',
  data() {
    return {
      heroCount: 0,
      superpowerCount: 0,
      totalSuperpowers: 0
    }
  },
  async mounted() {
    await this.loadStats()
  },
  methods: {
    async loadStats() {
      try {
        const heroesResponse = await heroesApi.getAll()
        let heroes = []
        if (heroesResponse.data.data) {
          heroes = heroesResponse.data.data
        } else if (Array.isArray(heroesResponse.data)) {
          heroes = heroesResponse.data
        }
        
        this.heroCount = heroes.length
        
        this.totalSuperpowers = heroes.reduce((total, hero) => {
          return total + (hero.superpowers ? hero.superpowers.length : 0)
        }, 0)

        const superpowersResponse = await superpowersApi.getAll()
        this.superpowerCount = superpowersResponse.data.length || 0
      } catch (error) {
        notify({
          type: 'error',
          title: 'Erro',
          text: error
        })

        this.heroCount = 0
        this.superpowerCount = 0
        this.totalSuperpowers = 0
      }
    }
  }
}
</script>

<style scoped>
.home {
  padding: 0;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.btn-large {
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-placeholder {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 60px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-icon {
  font-size: 6rem;
  margin-bottom: 20px;
}

.hero-placeholder p {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 50px;
  font-weight: 700;
}

.features-section {
  margin-bottom: 80px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  color: #2c3e50;
  font-size: 1.4rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.6;
  margin: 0;
}

.stats-section {
  background: #f8f9fa;
  padding: 60px 0;
  margin: 0 -20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.stat-card {
  background: white;
  padding: 40px 20px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 10px;
}

.stat-label {
  color: #7f8c8d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1.1rem;
  }

  .hero-actions {
    justify-content: center;
  }

  .btn-large {
    padding: 12px 24px;
    font-size: 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .feature-card {
    padding: 30px 20px;
  }

  .stats-section {
    padding: 40px 0;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn-large {
    width: 100%;
    max-width: 300px;
  }

  .hero-placeholder {
    padding: 40px 20px;
  }

  .hero-icon {
    font-size: 4rem;
  }

  .section-title {
    font-size: 1.8rem;
    margin-bottom: 30px;
  }
}
</style>

