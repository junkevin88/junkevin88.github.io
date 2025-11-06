# GitHub Pages Deployment Guide

Follow these steps to deploy your portfolio website to GitHub Pages.

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Name your repository (e.g., `researcher-portfolio` or `your-username.github.io`)
   - **Note**: If you want your site at `username.github.io`, name the repo exactly `username.github.io`
   - Otherwise, it will be at `username.github.io/repository-name`
5. Make it **Public** (GitHub Pages free tier requires public repos)
6. **DO NOT** initialize with README, .gitignore, or license (we already have files)
7. Click **"Create repository"**

## Step 2: Initialize Git and Push to GitHub

Run these commands in your terminal (you're already in the project directory):

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Portfolio website with dark mode"

# Add your GitHub repository as remote (replace with your actual repository URL)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Important**: Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub username and repository name.

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **"Settings"** tab (top menu)
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Click **"Save"**

## Step 4: Access Your Website

- Your site will be available at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`
- If you named your repo `username.github.io`, it will be at: `https://YOUR-USERNAME.github.io/`
- It may take a few minutes (up to 10) for the site to be available after enabling Pages

## Step 5: Update Files (Future Updates)

Whenever you make changes to your website:

```bash
# Add all changes
git add .

# Commit changes
git commit -m "Description of your changes"

# Push to GitHub
git push
```

GitHub Pages will automatically rebuild your site (usually within 1-2 minutes).

## Troubleshooting

- **404 Error**: Wait a few minutes and refresh. GitHub Pages can take time to build.
- **Styles not loading**: Make sure all file paths in `index.html` are relative (e.g., `css/style.css` not `/css/style.css`)
- **Images not showing**: Ensure image files are in the repository and paths are correct

## Custom Domain (Optional)

If you have a custom domain, you can add it in the Pages settings. GitHub will provide instructions for DNS configuration.

