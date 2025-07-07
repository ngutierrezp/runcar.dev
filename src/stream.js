/**
 * Starts the frame animation loop directly to the HTTP response.
 * Uses setTimeout with drift compensation for better frame accuracy.
 * Cleans up properly when the client disconnects.
 */
export function startFrameLoop(res, frames, intervalMs = 100) {
  let index = 0;
  let timer;
  let firstFrame = true;
  let lastTick = Date.now();

  const tick = () => {
    const now = Date.now();
    const drift = now - lastTick;
    lastTick = now;

    // Clear screen only on first frame, then just reset cursor position
    const clear = firstFrame ? '\x1b[2J\x1b[3J\x1b[H' : '\x1b[H';
    firstFrame = false;

    const frame = frames[index];
    const content = `${clear}${frame}\n`;

    // Push the frame; if the client is slow, wait for 'drain'
    const ok = res.write(content);
    index = (index + 1) % frames.length;

    const nextDelay = Math.max(0, intervalMs - (Date.now() - now));
    if (ok) {
      timer = setTimeout(tick, nextDelay);
    } else {
      res.once('drain', () => {
        timer = setTimeout(tick, nextDelay);
      });
    }
  }

  tick();

  return () => clearTimeout(timer);
}