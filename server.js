import http from 'http';
import { isACurlRequest } from './src/validation.js';
import { getAnimation } from './src/animation.js';
import { startFrameLoop } from './src/stream.js';
import { config } from './src/config.js';

/**
 * Handles a single HTTP request.
 * Verifies if the client is using curl, loads animation, and streams it.
 */
function handleRequest(req, res) {
  if (!isACurlRequest(req)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('🚫 This server only supports curl requests.\n');
  }

  let frames;
  try {
    frames = getAnimation();
    if (!Array.isArray(frames) || frames.length === 0) {
      throw new Error('Animation frames are missing');
    }
  } catch (err) {
    console.error('❌ Failed to load animation:', err.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    return res.end('💥 Internal server error. Please try again later.\n');
  }

  // Optional: read frame rate from custom header. Clamp to a sane minimum
  // so a client can't ask us to flood the connection.
  const clientFPS = parseInt(req.headers['x-frame-rate'], 10);
  const interval =
    Number.isInteger(clientFPS) && clientFPS >= config.minFrameIntervalMs
      ? clientFPS
      : config.frameIntervalMs;

  // Color rendering can be disabled via header (per request) or env (globally).
  const requestNoColor = req.headers['x-no-color'] === '1';
  const colors = config.colorsEnabled && !requestNoColor;

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.write('\n🏁 Welcome to runcar.dev — ASCII animation is about to begin!\n\n');

  const cleanup = startFrameLoop(res, frames, interval, { colors });

  // Ensure we clean up resources if the client disconnects
  const onClose = () => {
    cleanup();
    console.log('👋 Client disconnected.');
  };

  res.on('close', onClose);
  res.on('error', onClose);
}

/**
 * Starts the HTTP server.
 */
function createServer() {
  const server = http.createServer(handleRequest);
  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`🏎️  runcar.dev server running at http://localhost:${port}`);
    console.log(
      `   frame interval: ${config.frameIntervalMs}ms, colors: ${config.colorsEnabled ? 'on' : 'off'}`,
    );
  });
}

createServer();
