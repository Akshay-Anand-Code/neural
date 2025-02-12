# Installation

## Prerequisites

Before installing Project X, ensure you have:

- Bland.AI account and API key
- Node.js 18 or higher
- npm or yarn package manager
- A modern web browser
- API keys for required services

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/project-x.git

# Navigate to project directory
cd project-x

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## Environment Setup

Create a `.env` file in your project root with the following variables:

```bash
VITE_VENICE_API_KEY=your_venice_api_key
VITE_BLAND_AI_KEY=your_bland_ai_key
VITE_BLAND_ORG_ID=your_bland_org_id
VITE_ACCESS_PASSWORD=your_access_password
```

## Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Production Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Documentation Development

Run the documentation site locally:

```bash
npm run docs:dev
```

Build the documentation:

```bash
npm run docs:build
```

## Troubleshooting

### Common Issues

1. **Missing Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   - Ensure all required environment variables are set
   - Check for typos in API keys

3. **Port Conflicts**
   - Default port is 5173
   - Change port in `vite.config.ts` if needed

### Getting Help

- Check the [FAQ](../resources/faq.md)
- Join our [Community](../resources/community.md)
- File an issue on GitHub