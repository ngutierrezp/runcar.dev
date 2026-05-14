import { LAYOUT } from './config.js';

/**
 * ANSI color helpers for the runcar.dev animation.
 *
 * Frames are produced by scripts/generate-frames.js with a fixed line layout,
 * so we can colorize each frame purely from the line index plus, on rows that
 * mix layers (sky + sun, wheels + obstacles), the column position.
 */

const RESET = '\x1b[0m';

const C = {
  red:           '\x1b[31m',
  green:         '\x1b[32m',
  yellow:        '\x1b[33m',
  blue:          '\x1b[34m',
  magenta:       '\x1b[35m',
  cyan:          '\x1b[36m',
  white:         '\x1b[37m',
  gray:          '\x1b[90m',
  brightRed:     '\x1b[91m',
  brightGreen:   '\x1b[92m',
  brightYellow:  '\x1b[93m',
  brightBlue:    '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan:    '\x1b[96m',
  brightWhite:   '\x1b[97m',
};

// Default base color per line index. `null` means "decide per character".
const LINE_BASE = [
  null,             //  0: cloud + sun rays top         (sky-mixed)
  null,             //  1: cloud + sun body             (sky-mixed)
  null,             //  2: cloud + sun rays bottom      (sky-mixed)
  C.gray,           //  3: distant mountain range
  C.brightGreen,    //  4: tree foliage (peak)
  C.brightGreen,    //  5: tree foliage (upper)
  C.green,          //  6: tree foliage (middle)
  C.green,          //  7: tree foliage (base)
  C.yellow,         //  8: tree trunks
  C.brightRed,    //  9: car roof   (chrome highlight)
  C.brightRed,      // 10: car hood
  C.brightRed,      // 11: car body
  null,             // 12: wheels + obstacles           (road-mixed)
  C.white,          // 13: road top edge
  C.brightYellow,   // 14: lane markers
  C.white,          // 15: road bottom edge
];

const sunStart = LAYOUT.sunX;
const sunEnd   = LAYOUT.sunX + LAYOUT.sunWidth;
const carStart = LAYOUT.carX;
const carEnd   = LAYOUT.carX + LAYOUT.carWidth;

function colorFor(ch, lineIndex, col) {
  if (ch === ' ') return null;

  // Sky lines: characters inside the sun region are yellow, the rest are
  // cloud-white. Position is more reliable than character matching here
  // because clouds and the sun glyph share characters ('/', '\\', '-').
  if (lineIndex >= 0 && lineIndex <= 2) {
    return col >= sunStart && col < sunEnd ? C.brightYellow : C.brightWhite;
  }

  // Wheels line: characters inside the car region are the dark tires (gray);
  // anything else is a roadside obstacle (sand/stone yellow). Keeping
  // obstacles in a different hue from the car prevents them from blending
  // into the silhouette.
  if (lineIndex === 12) {
    return col >= carStart && col < carEnd ? C.white : C.gray;
  }

  return LINE_BASE[lineIndex] ?? null;
}

/**
 * Apply ANSI colors to a single frame.
 */
export function colorizeFrame(frame) {
  const lines = frame.split('\n');
  return lines.map(paintLine).join('\n');
}

function paintLine(line, index) {
  if (line.length === 0) return line;

  let out = '';
  let current = null;
  for (let col = 0; col < line.length; col++) {
    const ch = line[col];
    const color = colorFor(ch, index, col);
    if (color !== current) {
      if (current !== null) out += RESET;
      if (color !== null) out += color;
      current = color;
    }
    out += ch;
  }
  if (current !== null) out += RESET;
  return out;
}
