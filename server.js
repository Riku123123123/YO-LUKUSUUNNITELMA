const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const STATIC_ROOT = process.cwd();
const ENV_PATH = path.join(STATIC_ROOT, '.env');

function loadEnvFile() {
  if (!fs.existsSync(ENV_PATH)) return;

  const content = fs.readFileSync(ENV_PATH, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
    process.env[key] = value;
  }
}

loadEnvFile();

const API_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_yo;

if (!API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY not found. Add it to .env before starting the server.');
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    default: return 'text/plain; charset=utf-8';
  }
}

async function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

async function proxyToGemini(requestBody) {
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY missing on server.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: requestBody
  });

  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { ok: true, message: 'Proxy server is running' });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/gemini') {
    try {
      const requestBody = await readRequestBody(req);
      const result = await proxyToGemini(requestBody);
      sendJson(res, result.status, result.data);
    } catch (error) {
      sendJson(res, 500, { error: { message: error.message || 'Proxy request failed' } });
    }
    return;
  }

  const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.join(STATIC_ROOT, requestedPath);

  if (!filePath.startsWith(STATIC_ROOT)) {
    sendJson(res, 403, { error: { message: 'Forbidden' } });
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      sendJson(res, 404, { error: { message: 'Not found' } });
      return;
    }

    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Gemini proxy server running at http://localhost:${PORT}`);
});
