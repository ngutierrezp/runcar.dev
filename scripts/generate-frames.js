/**
 * Build the animation file at animations/car.txt.
 *
 * The scene is composed of layered horizontal patterns scrolling at different
 * speeds (parallax). Pattern lengths are picked so that every layer wraps
 * cleanly within the configured frame count, which keeps the animation loop
 * perfectly continuous.
 *
 *   Layer         Speed (cols/frame)   Pattern length   Cycles in FRAMES=32
 *   -----------   ------------------   --------------   -------------------
 *   clouds        0.5                  16               1
 *   mountains     0.5                  16               1
 *   trees         1                    32               1
 *   trunks        1                    32               1
 *   lane          1                    4                8
 *   rocks         2                    32               2
 *
 * The world scrolls LEFT (positive offsets) so the car appears to drive
 * forward, to the right. Run with: npm run generate
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config, LAYOUT } from '../src/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIDTH = config.width;
const FRAMES = config.frames;

// === Sky ============================================================
// Three-row fluffy cloud silhouette. The middle row carries a vapor tail
// (`\__`) so the cloud doesn't feel symmetric.
const CLOUD_R0 = '       ___      '; // top crown
const CLOUD_R1 = '      /   \\__   '; // body with tail
const CLOUD_R2 = '      \\___/     '; // base

// Three-row sun glyph. Top and bottom rows are rays radiating outward.
const SUN_R0 = '\\|/';
const SUN_R1 = '-O-';
const SUN_R2 = '/|\\';

// === Mountains ======================================================
// Two peaks per 16-col period gives a continuous, naturalistic range.
const MOUNTAIN = '   /\\__   /\\__  ';

// === Trees ==========================================================
// Period 32 = one pine tree (cols 0-15) followed by one round leafy tree
// (cols 16-31). Foliage spans four rows for a fuller crown.
//
//   Pine                    Round tree
//      /\                       __
//     /^^\                    _ooo_
//    /^^^^\                 ooooooooo
//   /^^^^^^\                 ooooooo
//      ||                      |||
const TREE_R0 = '       /\\              __       ';
const TREE_R1 = '      /^^\\           _ooo_      ';
const TREE_R2 = '     /^^^^\\        ooooooooo    ';
const TREE_R3 = '    /^^^^^^\\        ooooooo     ';
const TRUNK   = '       ||              |||      ';

// === Road ===========================================================
// Heavier dashed centerline so it reads as a real lane marker.
const LANE = '==  ';

// === Obstacles ======================================================
// Three obstacle shapes scattered across one 32-col cycle.
const ROCKS = '      (  )      oo      ()      ';

// === Car (sprites without leading padding) ==========================
const CAR_TOP   = '_____';
const CAR_HOOD  = '/|_||_\\.__';
const CAR_BODY  = '(   _    _ _\\';
const CAR_WHEEL = '=-(_)--(_)--\'';

const SUN_X = LAYOUT.sunX;
const CAR_X = LAYOUT.carX;
const CAR_W = LAYOUT.carWidth;

function tile(pattern, offset, width = WIDTH) {
  const len = pattern.length;
  let out = '';
  for (let i = 0; i < width; i++) {
    let idx = (i + offset) % len;
    if (idx < 0) idx += len;
    out += pattern[idx];
  }
  return out;
}

function overlay(base, sprite, x) {
  const arr = base.split('');
  for (let i = 0; i < sprite.length; i++) {
    const ch = sprite[i];
    if (ch === ' ') continue; // spaces in sprites are transparent
    const pos = x + i;
    if (pos >= 0 && pos < arr.length) arr[pos] = ch;
  }
  return arr.join('');
}

const blank = () => ' '.repeat(WIDTH);
const road  = () => '_'.repeat(WIDTH);

function buildFrame(f) {
  // Positive offsets shift the patterns LEFT, which makes the car appear to
  // drive forward (to the right).
  const fast = f;
  const med  = Math.floor(f / 2);
  const rock = f * 2;

  const lines = [];

  // 0-2: sky (clouds + 3-row sun)
  lines.push(overlay(tile(CLOUD_R0, med), SUN_R0, SUN_X));
  lines.push(overlay(tile(CLOUD_R1, med), SUN_R1, SUN_X));
  lines.push(overlay(tile(CLOUD_R2, med), SUN_R2, SUN_X));

  // 3: mountain range
  lines.push(tile(MOUNTAIN, med));

  // 4-7: tree foliage (alternating pine and round trees, 4 rows tall)
  lines.push(tile(TREE_R0, fast));
  lines.push(tile(TREE_R1, fast));
  lines.push(tile(TREE_R2, fast));
  lines.push(tile(TREE_R3, fast));

  // 8: trunks
  lines.push(tile(TRUNK, fast));

  // 9-11: car body (anchored). Each sprite is overlaid at its own X so the
  // silhouette reads correctly without padding inside the sprites.
  lines.push(overlay(blank(), CAR_TOP,  CAR_X + 2));
  lines.push(overlay(blank(), CAR_HOOD, CAR_X + 1));
  lines.push(overlay(blank(), CAR_BODY, CAR_X));

  // 12: wheels + roadside obstacles. The car region is cleared before
  // stamping the wheels so rocks never overlap the silhouette.
  let wheels = tile(ROCKS, rock);
  wheels =
    wheels.slice(0, CAR_X) +
    ' '.repeat(CAR_W) +
    wheels.slice(CAR_X + CAR_W);
  wheels = overlay(wheels, CAR_WHEEL, CAR_X);
  lines.push(wheels);

  // 13-15: road (top edge, dashed centerline, bottom edge)
  lines.push(road());
  lines.push(tile(LANE, fast));
  lines.push(road());

  return lines.join('\n');
}

function buildAll() {
  let out = '';
  for (let f = 0; f < FRAMES; f++) {
    out += `# Frame ${f + 1}\n${buildFrame(f)}\n\n`;
  }
  return out;
}

const outPath = path.join(__dirname, '..', 'animations', 'car.txt');
fs.writeFileSync(outPath, buildAll());
console.log(`Wrote ${FRAMES} frames (${WIDTH} cols) to ${outPath}`);
