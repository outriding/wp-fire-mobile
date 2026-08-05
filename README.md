# WP Fire

Production website for a BAFE-certified fire safety company operating across London and the South East.

**Live:** [wpfire.co.uk](https://www.wpfire.co.uk)

![WP Fire hero — Next.js and Three.js canvas](public/images/screenshot-hero.png)

Two-page marketing site with a custom GLSL smoke simulation in the hero. Built and maintained as client work.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS 4**
- **Three.js 0.185** with custom vertex/fragment shaders
- Formspree contact form with honeypot spam protection

## Hero shader

The hero background is three layered planes sharing a single geometry, each with a cloned `ShaderMaterial` offset and scaled differently to build depth.

- **Vertex shader** samples a Perlin noise texture to drive a rotational twist along the plane's Y axis, plus a wind displacement weighted by height — so the base stays anchored while the top drifts.
- **Fragment shader** scrolls the same noise texture vertically for the smoke motion, applies `smoothstep` falloff on all four UV edges to dissolve the plane borders, and mixes in a warm tint weighted toward the base for the fire glow.
- Geometry resolution and camera framing adapt across six breakpoints; the render loop and WebGL context are disposed on unmount.

## Lighthouse

Measured February 2026 on the production deployment.

| Device  | Performance | Accessibility | Best Practices | SEO |
| ------- | ----------- | ------------- | -------------- | --- |
| Mobile  | 98          | 100           | 100            | 100 |
| Desktop | 100         | 100           | 100            | 100 |

## Notes

- Accessible to WCAG AA: semantic landmarks, labelled form fields, live regions for submission status, visible focus states throughout.
- Statically prerendered and deployed on Vercel.
- Shaders are imported as raw text via Turbopack loader rules (see `next.config.mjs`).

## Local development

```bash
npm install
npm run dev
```

Copy `env.example` to `.env.local` and add your Formspree form ID.

---

Built by [Peter Riding](https://x.com/pdriding) — freelance front-end development, Next.js and WebGL.
