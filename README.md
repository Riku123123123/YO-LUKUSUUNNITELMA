# YO-lukusuunnitelma

## GitHub Pages + API proxy

This app can be hosted on GitHub Pages for the frontend, while the chatbot requests go through a small serverless API endpoint.

### Deploy to Vercel
1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add the environment variable:
   - GEMINI_API_KEY=your_key_here
4. Deploy.

Then set this in the browser before loading the site:

```js
window.GEMINI_PROXY_URL = 'https://your-project.vercel.app/api/gemini';
```

If you prefer not to set it manually, I can wire it directly into the page as a default value.
