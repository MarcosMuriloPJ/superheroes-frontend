# Super Heroes Manager - Frontend

Uma aplicação Vue.js 3 para gerenciar super-heróis, desenvolvida com Options API e integrada com uma API .NET Core.

## 🚀 Funcionalidades

- **Listagem de Heróis**: Visualize todos os super-heróis cadastrados com informações detalhadas.
- **Cadastro de Heróis**: Adicione novos heróis com nome, poderes, características físicas e data de nascimento.
- **Edição de Heróis**: Atualize as informações dos heróis de forma simples e intuitiva.
- **Visualização Detalhada**: Veja informações completas de cada herói, incluindo cálculo de idade e IMC.
- **Gerenciamento de Superpoderes**: Selecione múltiplos superpoderes para cada herói.
- **Interface Responsiva**: Design adaptável para desktop e dispositivos móveis.
- **Validação de Formulários**: Validação completa no frontend e backend, com feedback visual claro.
- **Tratamento de Erros Aprimorado**: Exibição de mensagens de erro personalizadas e detalhadas vindas da API.

## 🛠️ Tecnologias Utilizadas

- **Vue.js 3**: Framework JavaScript progressivo (Options API).
- **Vue Router**: Roteamento SPA.
- **Axios**: Cliente HTTP para comunicação com a API.
- **CSS3**: Estilização moderna com gradientes, animações e responsividade.
- **Vite**: Build tool e servidor de desenvolvimento rápido.

## 📋 Pré-requisitos

- **Node.js**: Versão 18+ (para o frontend).
- **npm** ou **yarn**: Gerenciador de pacotes.
- **API .NET Core**: Rodando em `http://localhost:5000` (com CORS configurado para `http://localhost:5173`).

## 🔧 Instalação e Configuração

1.  **Clone o repositório**:

    ```bash
    git clone https://github.com/MarcosMuriloPJ/superheroes-frontend.git
    cd superheroes-frontend
    ```

2.  **Instale as dependências**:

    ```bash
    npm install
    ```

3.  **Configure a URL da API**:

    - O arquivo `src/services/api.js` já está configurado para `http://localhost:5000/api`.
    - Se sua API estiver em um endereço diferente, edite `API_BASE_URL` neste arquivo.

4.  **Execute o servidor de desenvolvimento**:

    ```bash
    npm run dev
    ```

5.  **Acesse a aplicação**:
    - Abra o navegador em `http://localhost:5173`.

## 🏗️ Estrutura do Projeto

```
superheroes-frontend/
├── public/             # Arquivos estáticos
├── src/
│   ├── assets/         # Estilos e imagens globais
│   ├── components/     # Componentes Vue reutilizáveis
│   ├── router/         # Configuração de rotas (index.js)
│   ├── services/       # Serviços de API (api.js)
│   ├── views/          # Páginas da aplicação
│   └── App.vue         # Componente raiz da aplicação
├── index.html          # HTML principal
├── package.json        # Dependências e scripts
└── vite.config.js      # Configuração do Vite
```

## 🎯 Funcionalidades Detalhadas

### Página Inicial (`HomeView.vue`)

- Dashboard com estatísticas dos heróis.
- Cards com funcionalidades principais.

### Lista de Heróis (`HeroesView.vue`)

- Cards responsivos com informações resumidas.
- Botões de ação (Ver, Editar, Excluir).
- Modal de confirmação para exclusão.
- Estado vazio quando não há heróis.

### Formulário de Criação/Edição (`CreateHeroView.vue`, `EditHeroView.vue`)

- Formulários intuitivos para adicionar e atualizar heróis.
- Validação em tempo real.
- Seleção múltipla de superpoderes.
- Exibição de erros de validação diretamente nos campos do formulário.
- Mensagens de erro gerais para conflitos ou problemas do servidor.

### Detalhes do Herói (`HeroDetailView.vue`)

- Apresenta informações completas do herói, incluindo idade e IMC calculados.
- Lista de superpoderes com descrições.
- Botões de ação contextuais para edição e exclusão.

## 🔌 Integração com API

A aplicação consome uma API .NET Core com os seguintes endpoints:

- `GET /api/heroes` - Lista todos os heróis.
- `GET /api/heroes/{id}` - Obtém um herói específico.
- `POST /api/heroes` - Cria um novo herói.
- `PUT /api/heroes/{id}` - Atualiza um herói.
- `DELETE /api/heroes/{id}` - Exclui um herói.
- `GET /api/superpowers` - Lista todos os superpoderes.

## 🎨 Design e UX

- **Paleta de Cores**: Azul, cinza, verde e vermelho para feedback visual.
- **Componentes de UI**: Botões com hover effects, cards com sombras, formulários com validação visual e modais para confirmações.
- **Responsividade**: Layouts adaptativos para diversos tamanhos de tela (desktop, tablet, mobile).

## 🚀 Build para Produção

```bash
# Build da aplicação
npm run build

# Preview do build
npm run preview
```

Os arquivos de produção serão gerados na pasta `dist/`.

## 🧪 Testes

Para executar os testes:

```bash
npm run test
```

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento.
- `npm run build` - Compila a aplicação para produção.
- `npm run preview` - Pré-visualiza o build de produção.
- `npm run lint` - Executa o linter (se configurado).

---
