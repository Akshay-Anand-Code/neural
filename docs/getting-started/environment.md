# Environment Setup

## System Requirements

- Node.js 18+
- npm or yarn
- Modern web browser
- API keys for services

## Development Environment

### 1. Node.js Setup

```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Verify installation
node --version
npm --version
```

### 2. Project Setup

```bash
# Clone repository
git clone https://github.com/yourusername/project-x.git

# Install dependencies
cd project-x
npm install
```

### 3. Environment Variables

Create `.env` file:

```bash
# API Keys
VITE_VENICE_API_KEY=your_venice_api_key
VITE_OPENAI_EMBEDDINGS_KEY=your_openai_key
VITE_BLAND_AI_KEY=your_bland_ai_key
VITE_BLAND_AI_KEY=your_bland_ai_key
VITE_BLAND_ORG_ID=your_bland_org_id

# Optional Settings
VITE_DEBUG_MODE=true
VITE_API_MOCKING=false
```

### 4. Development Server

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## IDE Setup

### VS Code

Recommended extensions:
- ESLint
- Prettier
- TypeScript
- Tailwind CSS IntelliSense

`settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Git Configuration

```bash
# Configure Git
git config user.name "Your Name"
git config user.email "your@email.com"

# Set up pre-commit hooks
npm install husky --save-dev
npx husky install
```

## Testing Environment

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```