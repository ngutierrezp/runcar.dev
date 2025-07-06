import http from 'http';
import { isACurlRequest } from './src/validation.js';
import { getAnimation } from './src/animation.js';

function createServer() {
  const server = http.createServer((req, res) => {
    if (!isACurlRequest(req)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('This server only supports curl requests.');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' });

    const frames = getAnimation();
    let frameIndex = 0;

    const interval = setInterval(() => {
      const clearScreen = '\x1b[2J\x1b[H'; 
      res.write(clearScreen + frames[frameIndex] + '\n');
      frameIndex = (frameIndex + 1) % frames.length; 
    }, 100);

    req.on('close', () => {
      clearInterval(interval);
    });
  });

  server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}

createServer();
