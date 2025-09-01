#!/bin/bash

# 🚀 Deployment Script for Crypto Learning Adventure
# This script helps with building and deploying the Telegram Mini App

set -e

echo "🎓 Crypto Learning Adventure - Deployment Script"
echo "================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo "🔍 Checking dependencies..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

if ! command_exists git; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "✅ All dependencies found!"

# Install npm packages
echo "📦 Installing npm packages..."
npm install

# Run linter
echo "🔍 Running linter..."
npm run lint

# Build the project
echo "🏗️  Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build successful!"

# Check if this is a git repository
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Crypto Learning Adventure Telegram Mini App"
    echo "🔗 Don't forget to add your GitHub remote:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/lynza-demo-one.git"
    echo "   git push -u origin main"
else
    echo "📝 Git repository found"
fi

# Preview the build
echo "🌐 Starting preview server..."
echo "📱 Test your app at: http://localhost:4173"
echo "🔗 Your GitHub Pages URL will be: https://YOUR_USERNAME.github.io/lynza-demo-one/"
echo ""
echo "💡 To deploy:"
echo "   1. Push to GitHub: git push"
echo "   2. GitHub Actions will deploy automatically"
echo "   3. Or run manually: npm run deploy"
echo ""
echo "🤖 For Telegram setup:"
echo "   1. Open @BotFather in Telegram"
echo "   2. Configure Menu Button with your GitHub Pages URL"
echo "   3. Test in Telegram!"

npm run preview
