# Cutout — AI Background Remover

A production-ready React app that removes image backgrounds entirely in the browser using the **RMBG-1.4** AI model by BRIA AI — no API key, no uploads, completely free.

## ✦ Features

- **100% client-side** — images never leave your device
- **Real AI** — RMBG-1.4 (state-of-the-art segmentation model)
- **WebGPU accelerated** — falls back to WebAssembly automatically
- **Drag & drop** upload
- **Download transparent PNG** or copy to clipboard
- **Zero cost** — no API key, no account required

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + Vite |
| AI Model | RMBG-1.4 via `@huggingface/transformers` |
| Inference | WebGPU (fp16) → WASM (fp32) fallback |
| Styling | CSS Modules + CSS Custom Properties |
| Worker | Native Web Worker (ES module) |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** On first load, the app downloads the RMBG-1.4 model (~170 MB) from Hugging Face. This is cached by your browser for subsequent visits.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
cutout-app/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx              # Entry point
    ├── App.jsx               # Root component
    ├── App.module.css
    ├── styles/
    │   └── global.css        # CSS variables & resets
    ├── hooks/
    │   └── useRmbgWorker.js  # Worker lifecycle hook
    ├── worker/
    │   └── rmbg.worker.js    # Web Worker (AI inference)
    ├── utils/
    │   └── image.js          # Image utilities
    └── components/
        ├── Header.jsx / .module.css
        ├── ModelStatus.jsx / .module.css
        ├── DropZone.jsx / .module.css
        ├── ResultPanel.jsx / .module.css
        ├── ActionBar.jsx / .module.css
        ├── InfoBar.jsx / .module.css
        └── Toast.jsx / .module.css
```

## Browser Support

| Browser | WebGPU | WASM Fallback |
|---------|--------|---------------|
| Chrome 113+ | ✅ | ✅ |
| Edge 113+ | ✅ | ✅ |
| Firefox | ❌ | ✅ |
| Safari 18+ | ✅ | ✅ |

## Model Info

- **Model:** [briaai/RMBG-1.4](https://huggingface.co/briaai/RMBG-1.4)
- **Task:** Image segmentation / background removal
- **Size:** ~170 MB (downloaded once, cached)
- **License:** [bria-rmbg-1.4](https://huggingface.co/briaai/RMBG-1.4/blob/main/LICENSE)

## License

MIT
