# Researcher Portfolio Website

A modern, responsive portfolio website for researchers, designed to showcase academic work, publications, and professional information. This website is ready to be deployed on GitHub Pages.

## Features

- 🎨 Modern, clean design with smooth animations
- 📱 Fully responsive (mobile, tablet, desktop)
- 📄 Sections for About, Publications, Resume, and Contact
- 🔗 Easy to customize with your information
- 🚀 Ready for GitHub Pages deployment

## Customization

### 1. Update Personal Information

Edit `index.html` and replace:
- `Your Name` with your actual name
- `Research Position @ Institution` with your position
- `[Your Research Area]` and other placeholders with your information
- Update the timeline in the About section with your experience
- Add your education details
- Update research interests tags

### 2. Add Publications

In the Publications section, replace the example publications with your own:
- Update paper titles
- Add your co-authors (highlight your name with `<strong>` tags)
- Add publication venues
- Update links (arXiv, PDF, Code, BibTeX)

### 3. Add Profile Photo

Replace the profile placeholder in the hero section:
- Add your photo in the `hero-image` section
- Replace the SVG placeholder with: `<img src="images/profile.jpg" alt="Your Name">`
- Create an `images` folder and add your photo

### 4. Update Contact Information

Update the contact section:
- Replace `your.email@example.com` with your email
- Update GitHub, Google Scholar, Twitter, LinkedIn links
- Remove any social links you don't want to include

### 5. Add Resume

- Add your resume PDF file to the root directory
- Rename it to `resume.pdf` or update the link in the Resume section

## Deployment to GitHub Pages

### Method 1: Using GitHub Web Interface

1. Create a new repository on GitHub (e.g., `yourusername.github.io`)
2. Upload all files to the repository
3. Go to Settings → Pages
4. Under "Source", select the main branch
5. Click Save
6. Your site will be available at `https://yourusername.github.io`

### Method 2: Using Git Command Line

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/yourusername.github.io.git

# Push to GitHub
git push -u origin main

# Enable GitHub Pages in repository Settings → Pages
```

### Method 3: Using Custom Domain

If you want to use a custom domain:

1. Add a `CNAME` file in the root directory with your domain name
2. Configure DNS settings for your domain
3. Update GitHub Pages settings to use your custom domain

## File Structure

```
researcher-portfolio/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Stylesheet
├── js/
│   └── script.js      # JavaScript functionality
├── README.md          # This file
└── resume.pdf         # Your resume (add this)
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Feel free to use this template for your personal portfolio. Customize it as needed!

## Credits

- Font: Inter (Google Fonts)
- Design: Modern, clean academic portfolio style

## Support

If you encounter any issues or have questions:
1. Check that all file paths are correct
2. Ensure images are in the correct folders
3. Verify that all links are working
4. Check browser console for any JavaScript errors
