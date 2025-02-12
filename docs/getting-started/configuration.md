# Configuration Guide

## Environment Variables

Create a `.env` file in your project root:

```bash
VITE_VENICE_API_KEY=your_venice_api_key
VITE_OPENAI_EMBEDDINGS_KEY=your_openai_key
VITE_BLAND_AI_KEY=your_bland_ai_key
VITE_BLAND_ORG_ID=your_bland_org_id
VITE_ACCESS_PASSWORD=your_access_password
```

## Module Configuration

### ElizaOS

```yaml
elizaos:
  personality_switching: true
  context_awareness: true
  response_time: 1.5s
  chain_integration: true
```

### LumaLabs

```yaml
lumalabs:
  video_quality: high
  max_duration: 15
  output_format: mp4
  style: cyberpunk
```

### Kaito AI

```yaml
kaito:
  analysis_interval: 60
  alert_threshold: 0.8
  quantum_enabled: true
  cache_duration: 300
```

### Voice Integration with Bland.AI

```yaml
bland_ai:
  api_key: your_api_key
  org_id: your_org_id
  voice_settings:
    quality: high
    language: en-US
    model: neural
```

## Security Settings

```yaml
security:
  encryption:
    algorithm: aes-256-gcm
    key_rotation: 30d
  rate_limiting:
    max_requests: 60
    window_ms: 60000
```

## Development Settings

```yaml
development:
  hot_reload: true
  debug_level: info
  api_mocking: false
  test_mode: false
```

## Production Settings

```yaml
production:
  optimization: true
  compression: true
  caching: true
  monitoring: true
```