#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

class RenderDeployer {
  constructor() {
    this.apiKey = process.env.RENDER_API_KEY;
    this.baseUrl = 'https://api.render.com/v1';
    
    if (!this.apiKey) {
      throw new Error('RENDER_API_KEY environment variable is required');
    }
  }

  async makeRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
      const fullUrl = `${this.baseUrl}${endpoint}`;
      
      const options = {
        method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const req = https.request(fullUrl, options, (res) => {
        let body = '';
        
        res.on('data', (chunk) => {
          body += chunk;
        });
        
        res.on('end', () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const response = body ? JSON.parse(body) : {};
              resolve(response);
            } else {
              try {
                const errorResponse = JSON.parse(body);
                reject(new Error(`HTTP ${res.statusCode}: ${errorResponse.message || body}`));
              } catch (parseError) {
                reject(new Error(`HTTP ${res.statusCode}: ${body}`));
              }
            }
          } catch (error) {
            reject(new Error(`Failed to parse response: ${body}`));
          }
        });
      });

      req.on('error', reject);

      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  async createBackendService() {
    console.log('🚀 Creating backend service on Render...');
    
    const serviceConfig = {
      type: 'web_service',
      name: 'sportspickmind-backend',
      ownerID: 'tea-cuug6l5ds78s73aut1b0',
      repo: 'https://github.com/flemmingjt3/sportspickmind-app',
      branch: 'main',
      rootDir: 'backend',
      serviceDetails: {
        runtime: 'node',
        buildCommand: 'npm install',
        startCommand: 'npm start',
        plan: 'starter',
        region: 'oregon',
        envVars: [
        {
          key: 'NODE_ENV',
          value: 'production'
        },
        {
          key: 'PORT',
          value: '10000'
        },
        {
          key: 'MONGODB_URI',
          value: 'mongodb+srv://flemmingjt3_db_user:5j1PuKBmOlj0Yufm@sportspickmind-cluster.efz6mfl.mongodb.net/sportspickmind?retryWrites=true&w=majority&appName=sportspickmind-cluster'
        },
        {
          key: 'JWT_SECRET',
          value: 'spm_production_jwt_secret_2024_enterprise_grade_security_render'
        },
        {
          key: 'JWT_EXPIRE',
          value: '7d'
        },
        {
          key: 'SPORTS_API_BASE_URL',
          value: 'https://www.thesportsdb.com/api/v1/json'
        },
        {
          key: 'RATE_LIMIT_WINDOW_MS',
          value: '900000'
        },
        {
          key: 'RATE_LIMIT_MAX_REQUESTS',
          value: '100'
        },
        {
          key: 'LOG_LEVEL',
          value: 'info'
        }
        ]
      }
    };

    try {
      const response = await this.makeRequest('POST', '/services', serviceConfig);
      console.log('✅ Backend service created successfully!');
      console.log(`📍 Service ID: ${response.service.id}`);
      console.log(`🌐 Service URL: ${response.service.serviceDetails.url}`);
      
      return response.service;
    } catch (error) {
      console.error('❌ Failed to create backend service:', error.message);
      throw error;
    }
  }

  async createFrontendService(backendUrl) {
    console.log('🎨 Creating frontend service on Render...');
    
    const serviceConfig = {
      type: 'static_site',
      name: 'sportspickmind-frontend',
      repo: 'https://github.com/flemmingjt3/sportspickmind-app',
      branch: 'main',
      rootDir: 'frontend/sportspickmind-frontend',
      buildCommand: 'npm install && npm run build',
      publishPath: 'dist',
      envVars: [
        {
          key: 'VITE_API_URL',
          value: backendUrl
        },
        {
          key: 'VITE_APP_NAME',
          value: 'SportsPickMind'
        },
        {
          key: 'VITE_APP_VERSION',
          value: '1.0.0'
        }
      ]
    };

    try {
      const response = await this.makeRequest('POST', '/static-sites', serviceConfig);
      console.log('✅ Frontend service created successfully!');
      console.log(`📍 Site ID: ${response.staticSite.id}`);
      console.log(`🌐 Site URL: ${response.staticSite.url}`);
      
      return response.staticSite;
    } catch (error) {
      console.error('❌ Failed to create frontend service:', error.message);
      throw error;
    }
  }

  async listServices() {
    try {
      // Render API uses different endpoints
      const services = await this.makeRequest('GET', '/services');
      
      return {
        services: services
      };
    } catch (error) {
      console.error('❌ Failed to list services:', error.message);
      throw error;
    }
  }

  async deployAll() {
    console.log('🚀 Starting SportsPickMind deployment to Render...\n');
    
    try {
      // Check if services already exist
      const existing = await this.listServices();
      
      const existingBackend = existing.services.find(s => s.name === 'sportspickmind-backend');
      const existingFrontend = null; // Static sites handled separately
      
      let backendService, frontendService;
      
      if (existingBackend) {
        console.log('📍 Backend service already exists');
        backendService = existingBackend;
      } else {
        backendService = await this.createBackendService();
      }
      
      const backendUrl = backendService.serviceDetails?.url || `https://${backendService.name}.onrender.com`;
      
      if (existingFrontend) {
        console.log('📍 Frontend service already exists');
        frontendService = existingFrontend.staticSite;
      } else {
        frontendService = await this.createFrontendService(backendUrl);
      }
      
      console.log('\n🎉 Deployment configuration complete!');
      console.log('\n📊 Service URLs:');
      console.log(`🔧 Backend API: ${backendUrl}`);
      console.log(`🎨 Frontend App: ${frontendService.url || `https://${frontendService.name}.onrender.com`}`);
      
      console.log('\n⏳ Services are now building and will be live shortly...');
      console.log('📈 You can monitor deployment progress in your Render dashboard');
      
      return {
        backend: backendService,
        frontend: frontendService
      };
      
    } catch (error) {
      console.error('💥 Deployment failed:', error.message);
      throw error;
    }
  }
}

// CLI execution
if (require.main === module) {
  const deployer = new RenderDeployer();
  
  const command = process.argv[2] || 'deploy';
  
  switch (command) {
    case 'deploy':
      deployer.deployAll()
        .then(() => {
          console.log('\n✅ Deployment process completed successfully!');
          process.exit(0);
        })
        .catch((error) => {
          console.error('\n❌ Deployment failed:', error.message);
          process.exit(1);
        });
      break;
      
    case 'list':
      deployer.listServices()
        .then((services) => {
          console.log('📋 Existing services:');
          console.log(JSON.stringify(services, null, 2));
        })
        .catch((error) => {
          console.error('❌ Failed to list services:', error.message);
          process.exit(1);
        });
      break;
      
    default:
      console.log('Usage: node render-deploy.js [deploy|list]');
      process.exit(1);
  }
}

module.exports = RenderDeployer;
