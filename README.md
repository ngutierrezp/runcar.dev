# 🏎️ RunCar.dev

Welcome to **RunCar.dev**!
A colorful, parallax-rich ASCII animation served entirely over HTTP — straight into your terminal. 🌐🎨🎮

![Car Animation](https://cdn.ngutierrezp.cl/car.gif)

---

## 🚀 What is this?

**RunCar.dev** is a minimalist visual experiment that simulates a car driving down a road using ASCII art.
Clouds, a glowing sun, distant mountains, alternating pine / round-leaf trees, lane markers and roadside rocks all scroll past at different speeds, giving a smooth parallax illusion — all inside your terminal. 🚗💨

---

## 🛠️ How to Run It

No installation required!
Simply open your terminal and run:

```bash
curl runcar.dev
```

> ⚠️ Make sure `curl` is installed. It's available by default on most Unix systems (Linux/macOS).
> On Windows, you can use Git Bash or WSL.

---

## ✨ What You'll See

- 🎨 A **fully colored** ASCII scene with a layered, parallax-scrolling world
- ☁️ **Sky**: clouds and a 3-row sun with rays above and below
- ⛰️ **Mountains**: a distant gray range moving at half speed
- 🌲 **Trees**: alternating pine trees and round-leaf trees, four-row foliage
- 🚙 **Car**: chrome-white roof, bright-red body, gray tires — anchored at the center
- 🪨 **Obstacles**: sand-toned rocks (`(  )`, `oo`, `()`) zipping past the wheels
- 🛣️ **Road**: white edges and a bright-yellow `==` dashed centerline

---

## ⚙️ Customizing the animation

You can tweak playback on a per-request basis with HTTP headers:

```bash
# Override frame interval (ms). Clamped to MIN_FRAME_INTERVAL_MS.
curl -H "X-Frame-Rate: 60" runcar.dev

# Disable ANSI colors for plain monochrome output.
curl -H "X-No-Color: 1" runcar.dev
```

Or, if you're running your own instance, configure it via environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `FRAME_INTERVAL_MS` | `90` | ms between frames |
| `MIN_FRAME_INTERVAL_MS` | `30` | floor for `X-Frame-Rate` |
| `RUNCAR_COLORS` | `true` | `0`/`false`/`no`/`off` disables colors |
| `NO_COLOR` | _(unset)_ | [Standard convention](https://no-color.org/) — any non-empty value disables colors |
| `ANIMATION_WIDTH` | `64` | columns used by the frame generator |
| `ANIMATION_FRAMES` | `32` | number of frames generated |
| `PORT` | `3000` | HTTP port |

---

## 🧰 Local development

```bash
# Install nothing — it's pure stdlib Node (ESM)
npm start                       # run the server on http://localhost:3000

# Rebuild the animation frames deterministically
npm run generate
```

The frames live in `animations/car.txt` and are built by `scripts/generate-frames.js`
from a few small pattern strings. Pattern lengths are picked so every parallax
layer loops seamlessly within `ANIMATION_FRAMES`.

---

## 🤝 Contributing

We welcome your feedback, bug reports, and pull requests!
Feel free to open an [Issue](https://github.com/ngutierrezp/runcar.dev/issues) or a [Pull Request](https://github.com/ngutierrezp/runcar.dev/pulls) with your ideas.

---

## 🧪 Demo Preview

You can visit the main page to get more details and see the animation in action:
[RunCar.dev](https://runcar.dev)

---

## 🧡 Love It?

Support the project by starring ⭐ the repo or sharing it with your terminal-loving friends.

---
