#!/bin/bash

set -e

echo "🚀 Setting up madgrades.com development environment..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your API token and other configuration"
fi

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# Build CSS
echo "🎨 Building CSS files..."
npm run build-css

# Generate git info
echo "📋 Generating git info..."
npm run git-info

echo "✅ Setup complete! You can now run 'npm start' to start the development server."
echo ""
echo "📚 Quick commands:"
echo "  - npm start        : Start development server (with CSS watch)"
echo "  - npm run build    : Build production bundle"
echo "  - npm test         : Run tests"
echo ""
echo "🌐 The app will be available at http://localhost:3000"
