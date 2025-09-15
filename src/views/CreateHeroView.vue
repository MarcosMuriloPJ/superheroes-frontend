<template>
  <div class="create-hero-view">
    <div class="container">
      <div class="page-header">
        <h1>Adicionar Novo Herói</h1>
        <p>Preencha as informações abaixo para cadastrar um novo super-herói</p>
      </div>

      <div class="form-container">
        <form @submit.prevent="submitForm" class="hero-form">          
          <!-- Nome Civil -->
          <div class="form-group">
            <label for="name" class="form-label">Nome Civil *</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="form-control"
              :class="{ error: errors.name }"
              placeholder="Ex: Bruce Wayne"
            />
            <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
          </div>

          <!-- Nome do Herói -->
          <div class="form-group">
            <label for="heroName" class="form-label">Nome do Herói *</label>
            <input
              id="heroName"
              v-model="form.heroName"
              type="text"
              class="form-control"
              :class="{ error: errors.heroName }"
              placeholder="Ex: Batman"
            />
            <div v-if="errors.heroName" class="error-message">{{ errors.heroName }}</div>
          </div>

          <!-- Data de Nascimento -->
          <div class="form-group">
            <label for="birthdate" class="form-label">Data de Nascimento *</label>
            <input
              id="birthdate"
              v-model="form.birthdate"
              type="date"
              class="form-control"
              :class="{ error: errors.birthdate }"
            />
            <div v-if="errors.birthdate" class="error-message">{{ errors.birthdate }}</div>
          </div>

          <!-- Altura e Peso -->
          <div class="form-row">
            <div class="form-group">
              <label for="height" class="form-label">Altura (metros) *</label>
              <input
                id="height"
                v-model.number="form.height"
                type="number"
                step="0.01"
                class="form-control"
                :class="{ error: errors.height }"
                placeholder="Ex: 1.88"
              />
              <div v-if="errors.height" class="error-message">{{ errors.height }}</div>
            </div>

            <div class="form-group">
              <label for="weight" class="form-label">Peso (kg) *</label>
              <input
                id="weight"
                v-model.number="form.weight"
                type="number"
                step="0.1"
                class="form-control"
                :class="{ error: errors.weight }"
                placeholder="Ex: 95.0"
              />
              <div v-if="errors.weight" class="error-message">{{ errors.weight }}</div>
            </div>
          </div>

          <!-- Superpoderes -->
          <div class="form-group">
            <label class="form-label">Superpoderes *</label>
            <div v-if="loadingSuperpowers" class="loading-message">
              Carregando superpoderes...
            </div>
            <div v-else-if="superpowers.length === 0" class="error-message">
              Erro ao carregar superpoderes
            </div>
            <div v-else class="superpowers-grid">
              <label
                v-for="superpower in superpowers"
                :key="superpower.id"
                class="superpower-checkbox"
              >
                <input
                  type="checkbox"
                  :value="superpower.id"
                  v-model="form.superpowersIds"
                />
                <span class="checkmark"></span>
                <div class="superpower-info">
                  <strong>{{ superpower.name }}</strong>
                  <p>{{ superpower.description }}</p>
                </div>
              </label>
            </div>
            <div v-if="errors.superpowersIds" class="error-message">{{ errors.superpowersIds }}</div>
          </div>

          <!-- Botões de Ação -->
          <div class="form-actions">
            <router-link to="/heroes" class="btn btn-secondary">
              Cancelar
            </router-link>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? 'Salvando...' : 'Salvar Herói' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { heroesApi, superpowersApi } from '@/services/api'
import { notify } from "@kyvg/vue3-notification";

export default {
  name: 'CreateHeroView',
  data() {
    return {
      form: {
        name: '',
        heroName: '',
        birthdate: '',
        height: null,
        weight: null,
        superpowersIds: []
      },
      superpowers: [],
      loadingSuperpowers: false,
      submitting: false,
      errors: {},
    }
  },
  async mounted() {
    await this.loadSuperpowers()
  },
  methods: {
    async loadSuperpowers() {
      this.loadingSuperpowers = true
      try {
        const response = await superpowersApi.getAll()
        this.superpowers = response.data || []
      } catch (error) {
        notify({
          type: 'error',
          title: 'Erro',
          text: error.message || error
        })

        this.superpowers = []
      } finally {
        this.loadingSuperpowers = false
      }
    },

    validateForm() {
      this.errors = {}

      // Nome Civil
      if (!this.form.name || this.form.name.trim() === '') {
        this.errors.name = 'Nome civil é obrigatório'
      } else if (this.form.name.length > 120) {
        this.errors.name = 'Nome civil deve ter no máximo 120 caracteres'
      }

      // Nome do Herói
      if (!this.form.heroName || this.form.heroName.trim() === '') {
        this.errors.heroName = 'Nome do herói é obrigatório'
      } else if (this.form.heroName.length > 120) {
        this.errors.heroName = 'Nome do herói deve ter no máximo 120 caracteres'
      }

      // Data de Nascimento
      if (!this.form.birthdate) {
        this.errors.birthdate = 'Data de nascimento é obrigatória'
      } else {
        const birthDate = new Date(this.form.birthdate)
        const today = new Date()
        if (birthDate > today) {
          this.errors.birthdate = 'Data de nascimento não pode ser no futuro'
        }
      }

      // Altura
      if (!this.form.height || this.form.height <= 0) {
        this.errors.height = 'Altura deve ser maior que zero'
      } else if (this.form.height > 10) {
        this.errors.height = 'Altura deve ser realista (máximo 10 metros)'
      }

      // Peso
      if (!this.form.weight || this.form.weight <= 0) {
        this.errors.weight = 'Peso deve ser maior que zero'
      } else if (this.form.weight > 1000) {
        this.errors.weight = 'Peso deve ser realista (máximo 1000 kg)'
      }

      // Superpoderes
      if (!this.form.superpowersIds || this.form.superpowersIds.length === 0) {
        this.errors.superpowersIds = 'Pelo menos um superpoder deve ser selecionado'
      }

      return Object.keys(this.errors).length === 0
    },

    async submitForm() {
      if (!this.validateForm()) {
        return
      }

      this.submitting = true

      try {
        const heroData = {
          name: this.form.name.trim(),
          heroName: this.form.heroName.trim(),
          birthdate: this.form.birthdate + 'T00:00:00',
          height: this.form.height,
          weight: this.form.weight,
          superpowersIds: this.form.superpowersIds
        }

        const response = await heroesApi.create(heroData)
        notify({
          type: 'success',
          title: 'Sucesso',
          text: response.data.message
        })
        this.$router.push('/heroes')

      } catch (error) {
        if (error.details) {
          for (const key in error.details) {
            const fieldName = key.toLowerCase();
            if (fieldName.includes("name") && !fieldName.includes("hero")) {
              this.errors.name = error.details[key][0];
            } else if (fieldName.includes("heroname")) {
              this.errors.heroName = error.details[key][0];
            } else if (fieldName.includes("birthdate")) {
              this.errors.birthdate = error.details[key][0];
            } else if (fieldName.includes("height")) {
              this.errors.height = error.details[key][0];
            } else if (fieldName.includes("weight")) {
              this.errors.weight = error.details[key][0];
            } else if (fieldName.includes("superpower")) {
              this.errors.superpowersIds = error.details[key][0];
            }
          }
        } else {
          notify({
            type: 'error',
            title: 'Erro',
            text: error.message || error
          })
        }
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.create-hero-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 2.5rem;
}

.page-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.form-container {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.hero-form {
  max-width: 600px;
  margin: 0 auto;
}

.superpowers-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.superpower-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.superpower-checkbox:hover {
  background-color: #f0f7ff;
  border-color: #3498db;
}

.superpower-checkbox input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  position: relative;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.3s ease;
}

.superpower-checkbox input[type="checkbox"]:checked + .checkmark {
  background-color: #3498db;
  border-color: #3498db;
}

.superpower-checkbox input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 12px;
}

.superpower-info {
  flex: 1;
}

.superpower-info strong {
  color: #2c3e50;
  font-size: 1rem;
  display: block;
  margin-bottom: 4px;
}

.superpower-info p {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e1e8ed;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;
  min-width: 140px;
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

/* Responsive Design */
@media (max-width: 768px) {
  .create-hero-view {
    padding: 15px;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .form-container {
    padding: 25px 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .form-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
  }

  .superpowers-grid {
    max-height: 300px;
  }

  .superpower-checkbox {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.8rem;
  }

  .page-header p {
    font-size: 1rem;
  }

  .form-container {
    padding: 20px 15px;
  }

  .form-control {
    padding: 10px 12px;
    font-size: 16px;
  }

  .superpowers-grid {
    max-height: 250px;
  }
}
</style>

