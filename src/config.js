/**
 * Minimal runtime configuration for the runcar.dev animation.
 *
 * Values can be overridden via environment variables so the server stays
 * tweakable without code changes.
 */

function readInt(name, fallback) {
  const raw = process.env[name];
  if (raw == null || raw === '') return fallback;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readBool(name, fallback) {
  const raw = process.env[name];
  if (raw == null || raw === '') return fallback;
  return !['0', 'false', 'no', 'off'].includes(raw.toLowerCase());
}


// NO_COLOR disables colors. An empty value (or absent variable) keeps them on.
const noColorRequested =
  process.env.NO_COLOR != null && process.env.NO_COLOR !== '';

export const config = {
  // Milliseconds between frames. Lower = faster animation.
  frameIntervalMs: readInt('FRAME_INTERVAL_MS', 90),

  // Hard floor for client-supplied frame rates (avoid hammering the server).
  minFrameIntervalMs: readInt('MIN_FRAME_INTERVAL_MS', 30),

  // Toggle ANSI color output. Honors the standard NO_COLOR convention too.
  colorsEnabled: readBool('RUNCAR_COLORS', true) && !noColorRequested,

  // Width / number of frames used by the generator script.
  width: readInt('ANIMATION_WIDTH', 64),
  frames: readInt('ANIMATION_FRAMES', 32),
};

/**
 * Layout constants shared between the frame generator and the colorizer.
 *
 * Changing them requires re-running `npm run generate`. They identify the
 * fixed-position regions of every frame (sun, car) so the colorizer can pick
 * colors by column without parsing the scene back from text.
 */
export const LAYOUT = {
  // Sun glyph occupies a 3-wide, 3-row block of the sky starting here.
  sunX: 50,
  sunWidth: 3,

  // Car silhouette (wheels row) occupies a 13-wide block starting here.
  carX: 19,
  carWidth: 13,
};
