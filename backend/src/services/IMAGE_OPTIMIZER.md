Image Optimizer Service
=======================

Location: `backend/src/services/imageOptimizer.js`

Purpose
-------
Small utility that uses `sharp` to generate optimized image variants (webp,avif,jpeg,png) and resized versions.

Usage
-----
Import and call `optimizeBuffer(buffer, options)` where `options` may include `widths`, `formats`, and `quality`.

Example
```js
import { optimizeBuffer } from './imageOptimizer.js';
const variants = await optimizeBuffer(buffer, { widths: [800, 400], formats: ['webp','jpeg'], quality: 75 });
```

Notes
-----
- Function throws on invalid input.
- Uses in-memory buffers; for large batches consider streaming or temp files.
