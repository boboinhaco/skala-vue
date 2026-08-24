// art/build-sprites.mjs
//
// art/dino-src/*.png (원화) → public/dinos/*.png (@2x 에셋) 재생성.
//   node art/build-sprites.mjs        (= npm run sprites)
//
// 원화는 픽셀아트가 아니라 고해상도 일러스트를 96x72로 줄인 그림이라
// 픽셀마다 색이 거의 다르다. 그대로 확대하면 축소 잡티가 블록으로 드러나서
//   ① 색을 48개로 줄여 면을 평평하게 만들고
//   ② EPX(Scale2x)로 2배 키워 계단 윤곽을 정리한다.
// 좌표계는 원화 크기 그대로라 dinoSprites.js 는 손댈 필요가 없다.
//
// 원화를 더 큰 해상도로 다시 뽑아 넣어도 그대로 돌아간다.
// 마지막에 종별 바닥 여백(foot)을 재서 dinoSprites.js 값과 대조해 준다.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { inflateSync, deflateSync, crc32 } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { dirname, join, basename } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = join(ROOT, 'art/dino-src')
const OUT_DIR = join(ROOT, 'public/dinos')

const COLORS = 48 // 팔레트 크기 — 낮추면 디테일이 뭉개지고(28색에서 혀가 사라짐) 높이면 잡티가 남는다
const ALPHA_CUT = 128 // 이 미만은 투명 처리해 실루엣을 또렷하게 만든다

// ── PNG 디코드 ───────────────────────────────────────────────
function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('PNG 파일이 아닙니다')

  let pos = 8
  let width = 0
  let height = 0
  let depth = 0
  let colorType = 0
  const idat = []

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.subarray(pos + 8, pos + 8 + len)

    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      depth = data[8]
      colorType = data[9]
    } else if (type === 'IDAT') {
      idat.push(data)
    } else if (type === 'IEND') break

    pos += 12 + len
  }

  if (depth !== 8 || (colorType !== 6 && colorType !== 2)) {
    throw new Error(`지원하지 않는 PNG 형식입니다 (bitDepth ${depth}, colorType ${colorType})`)
  }

  const channels = colorType === 6 ? 4 : 3
  const raw = inflateSync(Buffer.concat(idat))
  const stride = width * channels
  const out = Buffer.alloc(height * stride)

  // 스캔라인 필터 되돌리기
  for (let y = 0, p = 0; y < height; y += 1) {
    const filter = raw[p]
    p += 1
    for (let x = 0; x < stride; x += 1) {
      const cur = raw[p + x]
      const a = x >= channels ? out[y * stride + x - channels] : 0
      const b = y > 0 ? out[(y - 1) * stride + x] : 0
      const c = x >= channels && y > 0 ? out[(y - 1) * stride + x - channels] : 0
      let value

      if (filter === 0) value = cur
      else if (filter === 1) value = cur + a
      else if (filter === 2) value = cur + b
      else if (filter === 3) value = cur + ((a + b) >> 1)
      else {
        const pp = a + b - c
        const pa = Math.abs(pp - a)
        const pb = Math.abs(pp - b)
        const pc = Math.abs(pp - c)
        value = cur + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)
      }

      out[y * stride + x] = value & 0xff
    }
    p += stride
  }

  // null = 투명, 그 외 [r,g,b]
  const grid = []
  for (let y = 0; y < height; y += 1) {
    const row = []
    for (let x = 0; x < width; x += 1) {
      const i = y * stride + x * channels
      const alpha = channels === 4 ? out[i + 3] : 255
      row.push(alpha < ALPHA_CUT ? null : [out[i], out[i + 1], out[i + 2]])
    }
    grid.push(row)
  }

  return { width, height, grid }
}

// ── PNG 인코드 (RGBA) ────────────────────────────────────────
function chunk(type, data) {
  const head = Buffer.alloc(8)
  head.writeUInt32BE(data.length, 0)
  head.write(type, 4, 'ascii')
  const body = Buffer.concat([head.subarray(4), data])
  const tail = Buffer.alloc(4)
  tail.writeUInt32BE(crc32(body) >>> 0, 0)
  return Buffer.concat([head.subarray(0, 4), body, tail])
}

function encodePng(width, height, grid) {
  const raw = Buffer.alloc(height * (1 + width * 4))
  let p = 0
  for (let y = 0; y < height; y += 1) {
    raw[p] = 0 // 필터 없음 — 색이 적어 deflate 만으로 충분히 줄어든다
    p += 1
    for (let x = 0; x < width; x += 1) {
      const c = grid[y][x]
      if (c) {
        raw[p] = c[0]
        raw[p + 1] = c[1]
        raw[p + 2] = c[2]
        raw[p + 3] = 255
      }
      p += 4
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 6

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ── 미디언 컷 색 양자화 ──────────────────────────────────────
function quantize(pixels, count) {
  const pop = new Map()
  for (const [r, g, b] of pixels) {
    const key = (r << 16) | (g << 8) | b
    pop.set(key, (pop.get(key) ?? 0) + 1)
  }

  const entries = [...pop].map(([key, n]) => [[key >> 16, (key >> 8) & 0xff, key & 0xff], n])
  let boxes = [entries]

  while (boxes.length < count) {
    // 색이 가장 넓게 퍼진 상자를 절반 인구 지점에서 쪼갠다
    let widest = -1
    let target = -1
    let axis = 0

    boxes.forEach((box, i) => {
      if (box.length < 2) return
      for (let ch = 0; ch < 3; ch += 1) {
        let lo = 255
        let hi = 0
        for (const [c] of box) {
          if (c[ch] < lo) lo = c[ch]
          if (c[ch] > hi) hi = c[ch]
        }
        if (hi - lo > widest) {
          widest = hi - lo
          target = i
          axis = ch
        }
      }
    })

    if (target < 0) break

    const box = boxes.splice(target, 1)[0]
    box.sort((p, q) => p[0][axis] - q[0][axis])
    const total = box.reduce((sum, [, n]) => sum + n, 0)
    let acc = 0
    let cut = box.length >> 1
    for (let i = 0; i < box.length; i += 1) {
      acc += box[i][1]
      if (acc >= total / 2) {
        cut = Math.max(1, Math.min(i + 1, box.length - 1))
        break
      }
    }
    boxes.push(box.slice(0, cut), box.slice(cut))
  }

  // 상자마다 인구 가중 평균색을 대표로 뽑는다
  return boxes.map((box) => {
    const total = box.reduce((sum, [, n]) => sum + n, 0)
    return [0, 1, 2].map((ch) => Math.round(box.reduce((s, [c, n]) => s + c[ch] * n, 0) / total))
  })
}

// 사람 눈이 초록에 민감한 걸 반영한 가중 거리
function closest(palette, [r, g, b]) {
  let best = palette[0]
  let bestD = Infinity
  for (const p of palette) {
    const d = 2 * (p[0] - r) ** 2 + 3 * (p[1] - g) ** 2 + (p[2] - b) ** 2
    if (d < bestD) {
      bestD = d
      best = p
    }
  }
  return best
}

// ── EPX / Scale2x ────────────────────────────────────────────
// 이웃 네 칸이 같은 색이면 모서리를 그 색으로 채워 계단을 깎는다.
function epx(grid, width, height) {
  const at = (x, y) => (x >= 0 && x < width && y >= 0 && y < height ? grid[y][x] : null)
  const same = (p, q) => p === q || (p && q && p[0] === q[0] && p[1] === q[1] && p[2] === q[2])
  const out = Array.from({ length: height * 2 }, () =>
    Array.from({ length: width * 2 }, () => null),
  )

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = grid[y][x]
      const a = at(x, y - 1)
      const b = at(x + 1, y)
      const c = at(x - 1, y)
      const d = at(x, y + 1)

      out[y * 2][x * 2] = same(c, a) && !same(c, d) && !same(a, b) ? a : p
      out[y * 2][x * 2 + 1] = same(a, b) && !same(a, c) && !same(b, d) ? b : p
      out[y * 2 + 1][x * 2] = same(d, c) && !same(d, b) && !same(c, a) ? c : p
      out[y * 2 + 1][x * 2 + 1] = same(b, d) && !same(b, a) && !same(d, c) ? d : p
    }
  }

  return { width: width * 2, height: height * 2, grid: out }
}

// ── 실행 ─────────────────────────────────────────────────────
const files = readdirSync(SRC_DIR)
  .filter((f) => f.endsWith('.png'))
  .sort()

if (!files.length) {
  console.error(`원화가 없습니다: ${SRC_DIR}`)
  process.exit(1)
}

const measured = {}

for (const file of files) {
  const srcPath = join(SRC_DIR, file)
  const { width, height, grid } = decodePng(readFileSync(srcPath))

  const opaque = []
  for (const row of grid) for (const c of row) if (c) opaque.push(c)

  const palette = quantize(opaque, COLORS)
  const cache = new Map()
  const flat = grid.map((row) =>
    row.map((c) => {
      if (!c) return null
      const key = (c[0] << 16) | (c[1] << 8) | c[2]
      if (!cache.has(key)) cache.set(key, closest(palette, c))
      return cache.get(key)
    }),
  )

  const up = epx(flat, width, height)
  const outPath = join(OUT_DIR, file)
  const png = encodePng(up.width, up.height, up.grid)
  writeFileSync(outPath, png)

  // 원화 좌표계 기준 발끝 아래 여백 — dinoSprites.js 의 foot 과 같아야 한다
  let lastRow = height - 1
  while (lastRow > 0 && grid[lastRow].every((c) => !c)) lastRow -= 1
  measured[file] = height - 1 - lastRow

  const before = readFileSync(srcPath).length
  console.log(
    `${basename(file).padEnd(24)} ${width}x${height} → ${up.width}x${up.height}` +
      `  ${palette.length}색  ${(before / 1024).toFixed(1)}KB → ${(png.length / 1024).toFixed(1)}KB`,
  )
}

// dinoSprites.js 의 foot 값과 대조 (원화를 새로 넣었을 때 어긋나는 걸 잡아준다)
const meta = readFileSync(join(ROOT, 'src/data/dinoSprites.js'), 'utf8')
const declared = {}
for (const m of meta.matchAll(/file: '([\w.]+)',\s*\n\s*foot: (\d+)/g))
  declared[m[1]] = Number(m[2])

const wrong = Object.entries(measured).filter(
  ([f, v]) => declared[f] !== undefined && declared[f] !== v,
)
console.log(`\n${files.length}종 생성 완료 → public/dinos/`)

if (wrong.length) {
  console.log('\n⚠ dinoSprites.js 의 foot 값이 원화와 어긋납니다 (아래 값으로 고치세요):')
  for (const [f, v] of wrong) console.log(`   ${f.padEnd(24)} foot: ${declared[f]} → ${v}`)
  process.exitCode = 1
} else {
  console.log('foot 값 9종 모두 dinoSprites.js 와 일치합니다.')
}
