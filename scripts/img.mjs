// node scripts/img.mjs -> src-images/*.jpg -> public/images/<name>-<w>.webp  (Unsplash, illustrative only — not B&N projects)
import sharp from 'sharp'
import fs from 'node:fs'
const src = 'src-images', out = 'public/images'
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true })
const jobs = [
  ['lobby3', 'lift', [21, 9], [[760, 58], [1400, 54]]],
  ['samples', 'samples', [4, 3], [[560, 60], [900, 56]]],
]
for (const [file, name, a, sizes] of jobs) for (const [w, q] of sizes)
  await sharp(`${src}/${file}.jpg`).resize({ width: w, height: Math.round((w * a[1]) / a[0]), fit: 'cover', position: 'centre' }).webp({ quality: q, effort: 6 }).toFile(`${out}/${name}-${w}.webp`)
for (const f of fs.readdirSync(out)) { const m = await sharp(`${out}/${f}`).metadata(); console.log(f, m.width + 'x' + m.height, (fs.statSync(`${out}/${f}`).size / 1024).toFixed(0) + 'KB') }
