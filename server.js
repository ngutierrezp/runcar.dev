import http from 'http';
import { Readable } from 'stream';
import { isACurlRequest } from './src/validation.js';
import { getAnimation } from './src/animation.js';
import { streamer } from './src/stream.js';

/**
 * Handles incoming HTTP requests and streams animation frames to the client.
 * It checks if the request is a curl request, retrieves the animation frames,
 * and streams them to the response.
 * If the request is not a curl request, it responds with a 400 status code.
 * If the animation frames cannot be loaded, it responds with a 500 status code.
 * @param {*} req
 * @param {*} res 
 * @returns {void}
 * @throws {Error} If the animation frames are missing or invalid.
 * @throws {Error} If the request is not a curl request.
 * @throws {Error} If there is an error reading the animation file.
 * @throws {Error} If the server fails to start.
 */
function handleRequest(req, res) {
  if (!isACurlRequest(req)) {
    if (!res.headersSent) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
    }
    return res.end('This server only supports curl requests.\n');
  }

  let frames;

  try {
    frames = getAnimation();
    if (!Array.isArray(frames) || frames.length === 0) {
      throw new Error('Animation frames are missing or invalid');
    }
  } catch (err) {
    console.error('Failed to load animation:', err.message);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
    }
    return res.end('Failed to load animation.\n');
  }

  const stream = new Readable({ read() {} });
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  stream.pipe(res);

  const cleanup = streamer(stream, frames);

  const onClose = () => {
    cleanup();
    stream.destroy();
    console.log('Client disconnected. ❌');
  };

  res.on('close', onClose);
  res.on('error', onClose);
}

function createServer() {
  const server = http.createServer(handleRequest);
  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`🚗 Server is running at http://localhost:${port}`);
  });
}

createServer();
