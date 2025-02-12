# Quick Start Guide

## Prerequisites
- Node.js 18+
- npm or yarn
- Modern web browser
- API keys for:
  - Venice.ai (AI chat)
  - Bland.AI (Voice synthesis)

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/project-x.git

# Navigate to project directory
cd project-x

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

## Configuration

Set up your environment variables in `.env`:

```bash
# AI Services
VITE_VENICE_API_KEY=your_venice_api_key
VITE_BLAND_AI_KEY=your_bland_ai_key
VITE_BLAND_ORG_ID=your_bland_org_id

# Security
VITE_ACCESS_PASSWORD=your_access_password
```

## Start Development Server

```bash
npm run dev
```

## Basic Usage

### 1. Welcome Screen
- Enter the access password to initialize quantum connection
- System will verify your credentials
- Upon successful verification, you'll be granted access to the dashboard
### 2. Select an Agent

```typescript
import { useAgentStore } from '../store/useAgentStore';

const { selectAgent } = useAgentStore();
selectAgent('donald-trump');
```

### 3. Chat Interface
- Real-time conversations with AI agents
- Dynamic character responses
- Experience-based leveling system
- Voice call capabilities

### 4. Data Vault
- Access quantum data storage
- Filter and analyze CSV data
- Generate API keys for programmatic access
- Export data in various formats

### 5. RPG System
- Character progression
- Inventory management
- Quest completion
- Skill development

### 6. Conspiracy Builder
- Generate AI-powered conspiracies
- Analyze patterns in data
- Share theories on social media
- Track quantum anomalies

## Voice Calls

```typescript
const { startCall } = useAgentStore();

const result = await startCall('1234567890', '1');
```

## Next Steps

1. Read the [Project Manifesto](../guide/manifesto.md)
2. Explore [Character Profiles](../characters/index.md)
3. Learn about [Neural Interface](../guide/neural-network.md)
4. Set up [Voice Integration](../modules/bland-ai.md)