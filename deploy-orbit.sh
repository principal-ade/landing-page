#!/bin/bash

# Orbit Deployment Script
# This script helps deploy the Orbit-enabled code-city-landing

set -e

echo "🚀 Orbit Deployment Script"
echo "========================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check environment variables
check_env() {
    if [ -z "${!1}" ]; then
        echo -e "${RED}Error: $1 is not set${NC}"
        exit 1
    else
        echo -e "${GREEN}✓${NC} $1 is set"
    fi
}

# Select deployment target
echo ""
echo "Select deployment target:"
echo "1) Vercel"
echo "2) Docker (local)"
echo "3) Docker (production)"
echo "4) AWS App Runner"
echo "5) Traditional Node.js"
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo -e "\n${YELLOW}Deploying to Vercel...${NC}"
        
        # Check if vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm i -g vercel
        fi
        
        # Deploy to Vercel
        vercel --prod
        ;;
        
    2)
        echo -e "\n${YELLOW}Building and running with Docker (local)...${NC}"
        
        # Check required environment variables
        check_env GITHUB_CLIENT_ID
        check_env GITHUB_CLIENT_SECRET
        check_env AWS_ACCESS_KEY_ID
        check_env AWS_SECRET_ACCESS_KEY
        check_env ORBIT_ADMIN_SECRET
        
        # Build and run
        docker-compose -f docker-compose.orbit.yml up --build
        ;;
        
    3)
        echo -e "\n${YELLOW}Building Docker image for production...${NC}"
        
        # Build production image
        docker build -f Dockerfile.orbit -t code-city-orbit:latest .
        
        echo -e "${GREEN}✓ Docker image built successfully${NC}"
        echo ""
        echo "To run the image:"
        echo "docker run -p 3002:3002 \\"
        echo "  -e GITHUB_CLIENT_ID=xxx \\"
        echo "  -e GITHUB_CLIENT_SECRET=xxx \\"
        echo "  -e AWS_ACCESS_KEY_ID=xxx \\"
        echo "  -e AWS_SECRET_ACCESS_KEY=xxx \\"
        echo "  -e FEEDBACK_S3_BUCKET=codecity-feedback \\"
        echo "  -e ORBIT_ADMIN_SECRET=xxx \\"
        echo "  code-city-orbit:latest"
        
        # Option to push to registry
        read -p "Push to Docker registry? (y/n): " push_choice
        if [ "$push_choice" = "y" ]; then
            read -p "Enter registry URL (e.g., your-registry.com/code-city-orbit): " registry
            docker tag code-city-orbit:latest $registry:latest
            docker push $registry:latest
            echo -e "${GREEN}✓ Pushed to $registry${NC}"
        fi
        ;;
        
    4)
        echo -e "\n${YELLOW}Preparing for AWS App Runner...${NC}"
        
        # Build the application
        npm run build
        
        echo -e "${GREEN}✓ Build complete${NC}"
        echo ""
        echo "Next steps for App Runner:"
        echo "1. Push code to GitHub"
        echo "2. In AWS Console, create new App Runner service"
        echo "3. Connect to your GitHub repository"
        echo "4. Set environment variables in App Runner console"
        echo "5. Deploy!"
        ;;
        
    5)
        echo -e "\n${YELLOW}Building for traditional Node.js deployment...${NC}"
        
        # Install production dependencies
        npm ci --only=production
        
        # Build the application
        npm run build
        
        # Compile the server
        npx tsc server.ts --outDir dist --esModuleInterop --module commonjs
        
        echo -e "${GREEN}✓ Build complete${NC}"
        echo ""
        echo "To start the production server:"
        echo "NODE_ENV=production node server.js"
        echo ""
        echo "Or use PM2:"
        echo "pm2 start server.js --name orbit-app"
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment process complete!${NC}"
echo ""
echo "Post-deployment checklist:"
echo "□ Verify environment variables are set"
echo "□ Test OAuth flow at /api/orbit/auth/github"
echo "□ Check WebSocket connection at /orbit/signal"
echo "□ Verify S3 permissions"
echo "□ Test admin endpoints with x-admin-secret"
echo "□ Monitor CloudWatch/logs for errors"
echo "□ Set up SSL/TLS for production"