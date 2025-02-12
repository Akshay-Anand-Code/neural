import { defineConfig } from 'vitepress'

export default defineConfig({
  buildEnd: async (siteConfig) => {
    // Generate sourcemaps
    siteConfig.vite = siteConfig.vite || {};
    siteConfig.vite.build = siteConfig.vite.build || {};
    siteConfig.vite.build.sourcemap = true;
  },
  title: "Project X Documentation",
  description: "Documentation for Project X - AI-Driven Conspiratorial System",
  base: '/',
  srcDir: '.',
  outDir: './dist',
  ignoreDeadLinks: true,
  
  themeConfig: {
    siteTitle: 'Project X',
    appearance: {
      initialValue: 'dark'
    },
    
    nav: [
      { text: 'Overview', link: '/overview/introduction' },
      { text: 'Guide', link: '/guide/welcome' },
      { text: 'API', link: '/api/index' },
      { text: 'Back to App', link: 'https://terminal.illuminatibothiddenticker.com/' }
    ],

    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/overview/introduction' },
            { text: 'Quick Start', link: '/overview/quick-start' },
            { text: 'Installation', link: '/getting-started/installation' },
            { text: 'Configuration', link: '/getting-started/configuration' }
          ]
        },
        {
          text: 'Core Features',
          collapsed: false,
          items: [
            { text: 'Welcome Screen', link: '/guide/welcome' },
            { text: 'Manifesto', link: '/guide/manifesto' },
            { text: 'Agents', link: '/guide/agents' },
            { text: 'Neural Network', link: '/guide/neural-network' },
            { text: 'Voice Calls', link: '/guide/voice-calls' }
          ]
        },
        {
          text: 'Core Modules',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/modules/' },
            { text: 'ElizaOS', link: '/modules/elizaos' },
            { text: 'LumaLabs', link: '/modules/lumalabs' },
            { text: 'Kaito AI', link: '/modules/kaito-ai' },
            { text: 'EchoChambers', link: '/modules/echochambers' },
            { text: 'Bland.AI', link: '/modules/bland-ai' }
          ]
        },
        {
          text: 'Character System',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/characters/' },
            { text: 'Donald Trump', link: '/characters/donald-trump' },
            { text: 'Elon Musk', link: '/characters/elon-musk' },
            { text: 'Anonymous', link: '/characters/anonymous-collective' },
            { text: 'Doctor Terminus', link: '/characters/doctor-terminus' },
            { text: 'Neo Prime', link: '/characters/neo-prime' },
            { text: 'Time Keeper', link: '/characters/time-keeper' },
            { text: 'Reptilian', link: '/characters/reptilian' },
            { text: 'Illuminati', link: '/characters/illuminati' },
            { text: 'Occult', link: '/characters/occult' },
            { text: 'Flat Earther', link: '/characters/flat-earther' }
          ]
        },
        {
          text: 'API Reference',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Agent API', link: '/api/agent' },
            { text: 'Message API', link: '/api/message' },
            { text: 'Voice API', link: '/api/voice' },
            { text: 'Venice API', link: '/api/venice' },
            { text: 'WebSocket', link: '/api/websocket/connection' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/TheDevTeam420' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Project X'
    },

    search: {
      provider: 'local'
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  }
})