// Local dev server for API endpoints
import { createServer } from 'http';
import { config } from 'dotenv';
config();

const PORT = 3001;

const { default: chatHandler } = await import('./api/chat.js');
const { default: leadHandler } = await import('./api/lead.js');

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try { req.body = JSON.parse(body); } catch { req.body = {}; }
      
      if (req.url === '/api/chat') return chatHandler(req, res);
      
      if (req.url === '/api/lead') {
        // Shim Vercel's res.status().json() for local dev
        res.status = (code) => {
          res.statusCode = code;
          return {
            json: (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            },
            end: () => res.end(),
          };
        };
        return leadHandler(req, res);
      }
      
      res.writeHead(404); res.end('Not found');
    });
  } else {
    res.writeHead(404); res.end('Not found');
  }
});

server.listen(PORT, () => console.log(`API dev server running on http://localhost:${PORT}`));
