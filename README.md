# Project X: Quantum Neural Interface

A futuristic web application that enables users to interact with AI-powered digital personalities through holographic interfaces and natural conversations. Experience conversations with unique characters like Donald Trump (Quantum Commander) and Elon Musk (Neural Prophet) in a cyberpunk-inspired interface.

## 🌟 Features

- **Advanced AI Agents**
  - Unique personalities with deep backstories
  - Consistent character traits and speech patterns
  - Dynamic conversation handling
  - Real-time response generation

- **Futuristic UI/UX**
  - Holographic 3D visualizations
  - Matrix-style visual effects
  - CRT screen aesthetics
  - Responsive cyberpunk design
  - Real-time chat interface

- **Technical Features**
  - DeepSeek AI integration
  - OpenAI embeddings for context
  - IndexedDB for chat persistence
  - WebGL-powered 3D graphics
  - WebSocket support for real-time features

## 🚀 Tech Stack

- **Frontend**
  - React 18 with TypeScript
  - Three.js + React Three Fiber
  - Framer Motion animations
  - Tailwind CSS
  - Lucide React icons

- **AI/ML**
  - DeepSeek Chat API
  - OpenAI Embeddings API
  - Custom prompt engineering
  - Semantic analysis

- **State Management**
  - Zustand
  - IndexedDB
  - Real-time WebSocket integration

## 🛠 Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and add your API keys:
   ```bash
   VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
   VITE_OPENAI_EMBEDDINGS_KEY=your_openai_embeddings_key
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── agents/              # AI agent definitions
├── components/          # React components
├── store/              # Zustand state management
├── types/              # TypeScript types
├── utils/              # Utility functions
│   ├── deepseek.ts     # DeepSeek API integration
│   ├── embeddings.ts   # OpenAI embeddings
│   └── semanticAnalysis.ts # Message analysis
└── pages/              # Application pages
```

## 🔑 Environment Variables

Required environment variables:

- `VITE_DEEPSEEK_API_KEY`: Your DeepSeek API key for AI chat
- `VITE_OPENAI_EMBEDDINGS_KEY`: Your OpenAI API key for embeddings

## 🎮 Features in Development

- Voice synthesis and recognition
- Advanced hologram animations
- Additional AI agents
- Expanded conversation capabilities
- Mobile app integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Three.js for 3D graphics capabilities
- DeepSeek for AI conversation capabilities
- OpenAI for embeddings technology
- The React and TypeScript communities