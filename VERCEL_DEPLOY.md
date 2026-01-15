# Deploy to Vercel - Quick Guide

## Prerequisites
1. A GitHub account (or GitLab/Bitbucket)
2. A Vercel account (free tier available)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account

3. **Import Project:**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

4. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? (Press Enter for default)
   - Directory? (Press Enter for `./`)
   - Override settings? **No**

4. **For Production:**
   ```bash
   vercel --prod
   ```

## Important Notes

- ✅ **Data Storage**: This app uses `localStorage` (client-side only), so data is stored in the user's browser
- ✅ **No Environment Variables Needed**: The app works without any configuration
- ✅ **Free Tier**: Vercel's free tier includes:
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS
  - Custom domains

## Troubleshooting

### Build Fails?
- Make sure all dependencies are in `package.json`
- Check that `npm run build` works locally first
- Review build logs in Vercel dashboard

### Data Not Persisting?
- This is expected - data is stored in browser's localStorage
- Each user/browser has their own data
- Data persists across sessions but not across devices

## Next Steps After Deployment

1. **Custom Domain (Optional):**
   - Go to Project Settings → Domains
   - Add your custom domain

2. **Environment Variables (If Needed Later):**
   - Go to Project Settings → Environment Variables
   - Add any required variables

3. **Automatic Deployments:**
   - Every push to `main` branch auto-deploys
   - Preview deployments for pull requests

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
