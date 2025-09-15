import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  response => response,
  error => {
    let errorMessage = 'Ocorreu um erro inesperado.'
    let errorDetails = null

    if (error.response) {
      if (error.response.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data.errors) {
          errorMessage = 'Erro de validação:'
          errorDetails = error.response.data.errors
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data
        }
      }
    } else if (error.request) {
      errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão ou se a API está online.'
    } else {
      errorMessage = error.message
    }

    const customError = new Error(errorMessage)
    customError.response = error.response
    customError.details = errorDetails
    customError.status = error.response?.status

    return Promise.reject(customError)
  }
)


export const heroesApi = {
  getAll() {
    return api.get('/heroes')
  },

  getById(id) {
    return api.get(`/heroes/${id}`)
  },

  create(heroData) {
    return api.post('/heroes', heroData)
  },

  update(id, heroData) {
    return api.put(`/heroes/${id}`, heroData)
  },

  delete(id) {
    return api.delete(`/heroes/${id}`)
  }
}

export const superpowersApi = {
  getAll() {
    return api.get('/superpowers')
  }
}

export default api