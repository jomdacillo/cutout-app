# ZeroBG — Free AI Background Remover

> zerobg.net · Free, private, full-resolution AI background removal in your browser.

## Stack
React 18 · Vite 5 · CSS Modules · Lucide React · Web Workers · WebGPU

## Setup
```bash
npm install
cp .env.example .env
npm run dev
```

## Deploy (Render)
1. Push to GitHub (`jomdacillo/cutout-app`)
2. Render → New → Static Site
3. Build command: `npm run build`
4. Publish directory: `dist`

## Custom Domain (Cloudflare + Onamae.com)
1. Onamae.com → set nameservers to `ns1.cloudflare.com` + `ns2.cloudflare.com`
2. Cloudflare → Add site → zerobg.net → Add CNAME pointing to your `.onrender.com` URL
3. Render → Settings → Custom Domains → add `zerobg.net`

## Enable AdSense
1. Get approved at adsense.google.com
2. Uncomment the AdSense script in `index.html`
3. Set `VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX` in `.env`
4. Set `approved={true}` on each `<AdSlot />` in `App.jsx`
5. Replace slot IDs with your real ad unit IDs from AdSense dashboard
