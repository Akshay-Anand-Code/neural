import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

// Read and parse .env file
const envFile = readFileSync('.env');
const envConfig = dotenv.parse(envFile);

// Deploy to Netlify with environment variables
try {
  // Deploy site
  console.log('Deploying to Netlify...');
  execSync('netlify deploy --prod', { stdio: 'inherit' });

  // Set environment variables
  console.log('Setting environment variables...');
  Object.entries(envConfig).forEach(([key, value]) => {
    execSync(`netlify env:set ${key} "${value}"`, { stdio: 'inherit' });
  });

  console.log('Deployment complete!');
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
}