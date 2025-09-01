# 🚀 GitHub Pages Setup - Quick Reference

## 📋 What's Been Configured

✅ **Project Setup Complete:**
- `.gitignore` - Comprehensive ignore rules for Node.js/React/Vite
- `vite.config.ts` - Configured for GitHub Pages with `/lynza-demo-one/` base path
- `package.json` - Added deployment scripts and gh-pages dependency
- GitHub Actions workflow - Automatic deployment on push to main
- Deployment script - `./deploy.sh` for easy local testing

## 🔧 Next Steps for You

### 1. Create GitHub Repository
```bash
# On GitHub.com, create a new public repository named: lynza-demo-one
```

### 2. Push Your Code
```bash
git init
git add .
git commit -m "Initial commit: Crypto Learning Adventure Telegram Mini App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lynza-demo-one.git
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Settings → Pages
3. Source: **GitHub Actions** (not branch)
4. The workflow will deploy automatically

### 4. Your App URLs
- **Repository**: `https://github.com/YOUR_USERNAME/lynza-demo-one`
- **Live App**: `https://YOUR_USERNAME.github.io/lynza-demo-one/`

### 5. Configure Telegram Bot
1. Open @BotFather in Telegram
2. Use `/setmenubutton` command
3. Set Web App URL: `https://YOUR_USERNAME.github.io/lynza-demo-one/`

## 🎯 Important Notes

### GitHub Pages Requirements:
- ✅ Repository must be **public** (for free GitHub accounts)
- ✅ Use **GitHub Actions** as source (not branch)
- ✅ Wait 2-5 minutes after first push for deployment

### Telegram Mini App Requirements:
- ✅ Must use **HTTPS** (GitHub Pages provides this)
- ✅ URL must be **publicly accessible**
- ✅ Test in regular browser first before configuring in Telegram

### Build Configuration:
- ✅ Base path set to `/lynza-demo-one/`
- ✅ Assets properly configured for GitHub Pages
- ✅ Code splitting for optimal loading
- ✅ Production optimizations enabled

## 🛠 Local Testing

```bash
# Install dependencies (if not done)
npm install

# Development server
npm run dev

# Test production build
npm run build
npm run preview

# Quick deployment test
./deploy.sh
```

## 🔄 Deployment Process

### Automatic (Recommended):
1. Push to main branch: `git push`
2. GitHub Actions builds and deploys automatically
3. Check Actions tab for deployment status

### Manual:
```bash
npm run deploy
```

## 🎉 Success Checklist

- [ ] GitHub repository created and code pushed
- [ ] GitHub Pages enabled with GitHub Actions
- [ ] App builds successfully (`npm run build`)
- [ ] App accessible at GitHub Pages URL
- [ ] Telegram bot configured with correct URL
- [ ] App loads properly in Telegram

## 🆘 Troubleshooting

### Build Fails:
- Check Actions tab for error details
- Run `npm run build` locally first
- Ensure all TypeScript errors are fixed

### App Not Loading:
- Verify GitHub Pages is enabled
- Check if repository is public
- Wait a few minutes for DNS propagation
- Test URL directly in browser

### Telegram Integration Issues:
- Ensure URL uses HTTPS
- Verify URL is exactly correct in BotFather
- Test app in regular browser first
- Check Telegram's Web App documentation

## 📞 Support Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

🎓 **Your Crypto Learning Adventure is ready to go live!** 🚀
