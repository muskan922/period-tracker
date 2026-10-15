# 🚀 Deployment Guide: Hosting Your Period Tracker App

Since this project is a modern Single Page Application (SPA) built with React, Vite, and TypeScript, it can be hosted **entirely for free** on several premium hosting platforms. 

Follow the guide below to build and deploy your application.

---

## 1. Preparing the Build Locally

Before deploying to any platform, make sure the project compiles successfully. Run the following command in your terminal:

```bash
npm run build
```

This will run the TypeScript compiler check (`tsc -b`) and bundle your production-ready assets into the `dist/` directory.

---

## 2. Recommended Hosting Options (All Free)

Here are the three easiest and most reliable platforms to deploy your Vite frontend:

### Option A: Vercel (Recommended 🌟)
Vercel is the creator of Next.js and has outstanding support for React/Vite SPAs.

1. **Deploying via GitHub (Automated):**
   * Push your project code to a public or private GitHub repository.
   * Go to [vercel.com](https://vercel.com/) and log in with your GitHub account.
   * Click **Add New** > **Project**.
   * Import your repository.
   * Vercel will automatically detect **Vite** as the framework. Keep the default settings and click **Deploy**.
   * Any future pushes to your GitHub main branch will automatically trigger a new deployment.

2. **Deploying via Command Line (No GitHub required):**
   * Run the Vercel installer:
     ```bash
     npm install -g vercel
     ```
   * Deploy instantly by running:
     ```bash
     vercel
     ```
   * Follow the prompt questions (accept defaults), and your app will be live on a production URL in seconds.

---

### Option B: Netlify
Netlify is extremely developer-friendly and supports easy drag-and-drop builds.

1. **Deploying via Git Integration:**
   * Go to [netlify.com](https://www.netlify.com/) and create a free account.
   * Select **Add new site** > **Import an existing project**.
   * Select GitHub, choose your repository, and set the build settings:
     * **Build command:** `npm run build`
     * **Publish directory:** `dist`
   * Click **Deploy site**.

2. **Deploying via Drag and Drop:**
   * Run `npm run build` to generate the `dist` folder.
   * Go to your Netlify dashboard and click **Sites**.
   * Scroll down to **"Want to deploy a new site without Git?"**
   * Drag and drop your local `dist` folder directly onto the screen.

---

### Option C: GitHub Pages
If your repository is already on GitHub, you can host it directly on GitHub Pages.

1. Install the `gh-pages` helper package:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Open your `package.json` and add a `homepage` field at the top level:
   ```json
   "homepage": "https://<your-username>.github.io/<your-repo-name>",
   ```
3. In `package.json`, add the following deploy scripts under `"scripts"`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
4. Run the deploy script:
   ```bash
   npm run deploy
   ```
5. On GitHub, go to your repository **Settings** > **Pages** and ensure the source branch is set to `gh-pages`.

---

## 3. Important: Handling Router Redirects (SPA Routing)

If you configure routing in the future (e.g. React Router) and deploy to a subfolder or use dynamic URLs, users might face `404 Not Found` errors when refreshing the page on sub-routes. Here is how to prevent it:

*   **For Vercel:** Add a `vercel.json` file in your root folder with:
    ```json
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
    }
    ```
*   **For Netlify:** Create a file named `_redirects` inside your public folder with:
    ```text
    /*    /index.html   200
    ```
