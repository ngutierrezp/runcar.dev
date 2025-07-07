/**
 * A simple streaming utility that displays a series of frames in the console.
 * @param {Number} index 
 * @param {Number} total 
 * @returns {Number} - The next index in a circular manner.
 */
function selectNextIndex(index, total) {
  return (index + 1) % total;
}

/**
 * Streams a series of frames to the console at specified intervals.
 * It clears the console and displays the next frame in the sequence.
 * If the stream is not ready, it waits for the 'drain' event before continuing
 * @param {*} stream - A writable stream to which frames will be pushed
 * @param {Array<string>} frames - An array of strings representing the frames to be displayed
 * @param {Number} [intervalMs=100] - The interval in milliseconds between frames
 * @returns {Function} - A function to stop the streaming
 */
export function streamer(stream, frames, intervalMs = 100) {
  let index = 0;
  let timer;

  function tick() {
    const clear = '\x1b[2J\x1b[3J\x1b[H';
    const frame = frames[index];
    const ok = stream.push(clear + frame + '\n');
    index = selectNextIndex(index, frames.length);

    if (ok) {
      timer = setTimeout(tick, intervalMs);
    } else {
      stream.once('drain', () => {
        timer = setTimeout(tick, intervalMs);
      });
    }
  }

  tick();

  return () => clearTimeout(timer);
}