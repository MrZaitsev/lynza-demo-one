# 🚀 Deployment Guide - GitHub Pages + Telegram Mini App

This guide will help you deploy your Crypto Learning Adventure Telegram Mini App to GitHub Pages and configure it with BotFather.

## 📋 Prerequisites

- GitHub account
- Telegram account
- Bot created via BotFather
- Git installed locally

## 🔧 Setup Steps

### 1. GitHub Repository Setup

1. **Create a new repository on GitHub:**
   - Repository name: `lynza-demo-one` (or your preferred name)
   - Make it public (required for GitHub Pages)
   - Don't initialize with README (we already have files)

2. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Crypto Learning Adventure Telegram Mini App"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/lynza-demo-one.git
   git push -u origin main
   ```

### 2. GitHub Pages Configuration

1. **Go to your repository on GitHub**
2. **Navigate to Settings → Pages**
3. **Configure the source:**
   - Source: `GitHub Actions`
   - The workflow will automatically deploy when you push to main

4. **Enable GitHub Pages:**
   - The site will be available at: `https://YOUR_USERNAME.github.io/lynza-demo-one/`

### 3. Install Dependencies and Deploy

```bash
# Install the new dependency
npm install

# Build and test locally
npm run build
npm run preview

# Deploy manually (optional - GitHub Actions will do this automatically)
npm run deploy
```

### 4. Telegram Mini App Setup

1. **Open BotFather in Telegram** (@BotFather)

2. **Configure your Mini App:**
   ```
   /mybots
   → Select your bot
   → Bot Settings
   → Menu Button
   → Configure Menu Button
   ```

3. **Set the Mini App URL:**
   ```
   Button text: 🎓 Learn Crypto
   Web App URL: https://YOUR_USERNAME.github.io/lynza-demo-one/
   ```

4. **Alternative: Use /setmenubutton command:**
   ```
   /setmenubutton
   → Select your bot
   → Send button text: 🎓 Learn Crypto
   → Send the URL: https://YOUR_USERNAME.github.io/lynza-demo-one/
   ```

### 5. Test Your Mini App

1. **Open your bot in Telegram**
2. **Tap the menu button (bottom left)**
3. **Select "🎓 Learn Crypto"**
4. **Your app should load in the Telegram Web App interface**

## 🎯 Important URLs

Replace `YOUR_USERNAME` with your actual GitHub username:

- **Repository**: `https://github.com/YOUR_USERNAME/lynza-demo-one`
- **Live App**: `https://YOUR_USERNAME.github.io/lynza-demo-one/`
- **Telegram Mini App URL**: Same as Live App URL above

## 🔄 Automatic Deployment

The GitHub Actions workflow will automatically:
- ✅ Run on every push to main branch
- ✅ Install dependencies
- ✅ Run linter checks
- ✅ Build the project
- ✅ Deploy to GitHub Pages

## 🛠 Manual Deployment

If you need to deploy manually:

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📱 Testing Locally

```bash
# Development server
npm run dev

# Production preview
npm run build && npm run preview
```

## 🔍 Troubleshooting

### Common Issues:

1. **404 Error on GitHub Pages:**
   - Check if the repository is public
   - Ensure GitHub Pages is enabled in repository settings
   - Wait a few minutes for deployment to complete

2. **Blank page in Telegram:**
   - Check browser console for errors
   - Ensure the URL is correct in BotFather
   - Try opening the URL directly in a browser first

3. **Build Failures:**
   - Check GitHub Actions logs in the "Actions" tab
   - Ensure all dependencies are properly installed
   - Check for TypeScript or linting errors

4. **Telegram Web App not loading:**
   - Verify the URL is exactly correct in BotFather
   - Check if the site has HTTPS (GitHub Pages provides this automatically)
   - Test the URL in a regular browser first

## 🎨 Customization

To customize the deployment:

1. **Change the base URL** (if using a custom domain):
   ```typescript
   // vite.config.ts
   base: '/your-custom-path/',
   ```

2. **Update repository name:**
   - Change in `vite.config.ts`
   - Update GitHub repository name
   - Update URLs in this guide

## 📞 Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Verify all URLs are correct
3. Test the app in a regular browser first
4. Check Telegram's Web App documentation

## 🚀 Go Live!

Once everything is set up:
1. Your app will be live at `https://YOUR_USERNAME.github.io/lynza-demo-one/`
2. Users can access it through your Telegram bot
3. Updates deploy automatically when you push to GitHub
4. Share your bot with users to start their crypto learning journey! 🎓📱
