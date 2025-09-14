#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class VercelDeployer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.frontendPath = path.join(this.projectRoot, 'frontend', 'sportspickmind-frontend');
  }

  async checkVercelCLI() {
    try {
      execSync('vercel --version', { stdio: 'pipe' });
      console.log('✅ Vercel CLI is available');
      return true;
    } catch (error) {
      console.log('📦 Installing Vercel CLI...');
      try {
        execSync('npm install -g vercel', { stdio: 'inherit' });
        console.log('✅ Vercel CLI installed successfully');
        return true;
      } catch (installError) {
        console.error('❌ Failed to install Vercel CLI:', installError.message);
        return false;
      }
    }
  }

  async setupProject() {
    console.log('🔧 Setting up Vercel project...');
    
    try {
      // Change to frontend directory
      process.chdir(this.frontendPath);
      
      // Check if already linked to Vercel
      const vercelConfigPath = path.join(this.frontendPath, '.vercel');
      if (fs.existsSync(vercelConfigPath)) {
        console.log('📍 Project already linked to Vercel');
        return true;
      }
      
      // Link project to Vercel (this will prompt for configuration)
      console.log('🔗 Linking project to Vercel...');
      execSync('vercel link --yes', { stdio: 'inherit' });
      
      console.log('✅ Project linked successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to setup Vercel project:', error.message);
      return false;
    }
  }

  async setEnvironmentVariables(backendUrl) {
    console.log('🔧 Setting up environment variables...');
    
    try {
      const envVars = [
        { key: 'VITE_API_URL', value: backendUrl },
        { key: 'VITE_APP_NAME', value: 'SportsPickMind' },
        { key: 'VITE_APP_VERSION', value: '1.0.0' }
      ];
      
      for (const envVar of envVars) {
        try {
          execSync(`vercel env add ${envVar.key} production`, {
            input: envVar.value,
            stdio: ['pipe', 'inherit', 'inherit']
          });
          console.log(`✅ Set ${envVar.key}`);
        } catch (error) {
          // Variable might already exist, try to update
          console.log(`📝 Updating ${envVar.key}...`);
        }
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to set environment variables:', error.message);
      return false;
    }
  }

  async deploy(production = true) {
    console.log(`🚀 Deploying to Vercel ${production ? '(Production)' : '(Preview)'}...`);
    
    try {
      process.chdir(this.frontendPath);
      
      const deployCommand = production ? 'vercel --prod' : 'vercel';
      const result = execSync(deployCommand, { 
        stdio: ['inherit', 'pipe', 'inherit'],
        encoding: 'utf8'
      });
      
      // Extract URL from output
      const urlMatch = result.match(/https:\/\/[^\s]+/);
      const deployUrl = urlMatch ? urlMatch[0] : null;
      
      if (deployUrl) {
        console.log('✅ Deployment successful!');
        console.log(`🌐 Frontend URL: ${deployUrl}`);
        return deployUrl;
      } else {
        console.log('✅ Deployment completed');
        return null;
      }
      
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      throw error;
    }
  }

  async deployWithBackend(backendUrl) {
    console.log('🚀 Starting SportsPickMind frontend deployment to Vercel...\n');
    
    try {
      // Check Vercel CLI
      const cliReady = await this.checkVercelCLI();
      if (!cliReady) {
        throw new Error('Vercel CLI setup failed');
      }
      
      // Setup project
      const projectReady = await this.setupProject();
      if (!projectReady) {
        throw new Error('Project setup failed');
      }
      
      // Set environment variables
      if (backendUrl) {
        await this.setEnvironmentVariables(backendUrl);
      }
      
      // Deploy
      const deployUrl = await this.deploy(true);
      
      console.log('\n🎉 Frontend deployment complete!');
      if (deployUrl) {
        console.log(`🌐 Live URL: ${deployUrl}`);
      }
      
      return deployUrl;
      
    } catch (error) {
      console.error('💥 Frontend deployment failed:', error.message);
      throw error;
    }
  }
}

// CLI execution
if (require.main === module) {
  const deployer = new VercelDeployer();
  const backendUrl = process.argv[2] || 'https://sportspickmind-backend.onrender.com';
  
  deployer.deployWithBackend(backendUrl)
    .then((url) => {
      console.log('\n✅ Vercel deployment completed successfully!');
      if (url) {
        console.log(`🌐 Your app is live at: ${url}`);
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Vercel deployment failed:', error.message);
      process.exit(1);
    });
}

module.exports = VercelDeployer;
