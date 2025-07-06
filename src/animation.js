import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

/**
 * Read the animation/karts.txt file and return the frame animation.
 * Then put the animation in console.log.
 * The animation is a series of frames separated by a line break.
 * Each frame is a string with the same length.
 * @returns {Array<string>} - An array of frames from the animation file.
 */
export function getAnimation() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, '../animations/car.txt');
  if (!fs.existsSync(filePath)) {
    console.error('Animation file not found:', filePath);
    return '';
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const frameRegex = /# Frame \d+\n([\s\S]*?)(?=\n# Frame|\n*$)/g;
    const frames = [];
    let match;
    while ((match = frameRegex.exec(content)) !== null) {
      frames.push(match[1]);
    }
    return frames;
  } catch (error) {
    console.error('Error reading animation file:', error);
    return '';
  }

}