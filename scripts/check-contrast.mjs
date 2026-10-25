#!/usr/bin/env node
/**
 * Kiểm tra tương phản WCAG 2.x của các cặp token màu thực sự dùng trong giao diện,
 * ở cả chế độ sáng và tối. Đọc thẳng src/theme/tokens.css.
 *
 *   node scripts/check-contrast.mjs            # bảng đầy đủ, exit 1 nếu có cặp bắt buộc rớt
 *   node scripts/check-contrast.mjs --quiet    # chỉ in các cặp rớt
 *
 * Ngưỡng: chữ thường 4.5, thành phần giao diện/viền/icon có nghĩa 3.0.
 * Nhóm "info" chỉ in cảnh báo (ví dụ chấm màu luôn phải đi kèm chữ hoặc icon).
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const css = readFileSync(join(root, 'src/theme/tokens.css'), 'utf8')
const quiet = process.argv.includes('--quiet')

function parseBlock(selectorRe) {
  const m = css.match(new RegExp(selectorRe + '\\s*\\{([^}]*)\\}'))
  if (!m) throw new Error('Không tìm thấy khối ' + selectorRe + ' trong tokens.css')
  const out = {}
  for (const [, name, r, g, b] of m[1].matchAll(/--color-([a-z0-9-]+):\s*(\d+)\s+(\d+)\s+(\d+)\s*;/g)) {
    out[name] = [Number(r), Number(g), Number(b)]
  }
  return out
}

const light = parseBlock(':root')
const dark = { ...light, ...parseBlock('\\.dark') }
const modes = { sáng: light, tối: dark }

const lin = (c) => {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
const blend = (fg, bg, a) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)))

/** Một màu là tên token, hoặc [token, alpha, nền] (token pha alpha lên nền, giống bg-x/15 của Tailwind). */
function resolve(spec, palette) {
  const get = (n) => {
    if (!palette[n]) throw new Error('Thiếu token: ' + n)
    return palette[n]
  }
  if (typeof spec === 'string') return get(spec)
  const [token, alpha, over = 'surface'] = spec
  return blend(get(token), get(over), alpha)
}
const label = (spec) => (typeof spec === 'string' ? spec : `${spec[0]}/${Math.round(spec[1] * 100)}${spec[2] ? ' trên ' + spec[2] : ''}`)

const TEXT = 4.5
const UI = 3.0
const surfaces = ['surface', 'background', 'surface-variant']

/** [nhóm, chữ/icon, nền, ngưỡng] */
const checks = []
const add = (group, fgs, bgs, min) => {
  for (const f of [].concat(fgs)) for (const b of [].concat(bgs)) checks.push({ group, fg: f, bg: b, min })
}

add('Chữ', 'text-primary', [...surfaces, 'surface-container', 'ai-container'], TEXT)
add('Chữ', 'text-secondary', [...surfaces, 'surface-container-high'], TEXT)
add('Chữ', 'brand', [...surfaces, 'surface-container', 'primary-fixed', ['brand', 0.1], ['brand', 0.15]], TEXT)
add('Chữ', 'ai-accent', ['ai-container', 'surface', 'secondary-fixed'], TEXT)
add('Chữ', 'on-primary', ['primary-container', 'primary'], TEXT)
add('Chữ', 'on-solid', ['error-solid', 'success-solid'], TEXT)
add('Chữ', 'on-ai', 'ai-accent', TEXT)
for (const k of ['success', 'warning', 'error']) {
  add('Chữ trạng thái', `status-${k}-text`, [...surfaces, [`status-${k}`, 0.15]], TEXT)
}
add('Chữ trạng thái', 'error', ['surface', 'error-container'], TEXT)

add('Thành phần UI (3:1)', 'border-strong', surfaces, UI)
add('Thành phần UI (3:1)', ['primary-container', 'error-solid', 'success-solid', 'ai-accent'], ['surface', 'background'], UI)

/** Chỉ cảnh báo, không làm rớt. */
const info = []
for (const k of ['urgent', 'high', 'medium', 'low']) info.push({ group: 'Chấm độ ưu tiên', fg: `priority-${k}`, bg: 'surface', min: UI })
info.push({ group: 'Icon ghi âm', fg: 'recording-red', bg: 'surface', min: UI })

const fmt = (n) => n.toFixed(2).padStart(5)
let failures = 0
const lines = []

for (const [modeName, palette] of Object.entries(modes)) {
  lines.push(`\n=== Chế độ ${modeName} ===`)
  let lastGroup = ''
  for (const c of [...checks, ...info.map((i) => ({ ...i, info: true }))]) {
    const r = ratio(resolve(c.fg, palette), resolve(c.bg, palette))
    const ok = r >= c.min
    if (!ok && !c.info) failures++
    if (quiet && (ok || c.info)) continue
    if (c.group !== lastGroup) {
      lines.push(`\n[${c.group}]`)
      lastGroup = c.group
    }
    const status = ok ? 'đạt  ' : c.info ? 'chú ý' : 'RỚT  '
    lines.push(`  ${status} ${fmt(r)} (≥ ${c.min})  ${label(c.fg)}  trên  ${label(c.bg)}`)
  }
}

console.log(lines.join('\n'))
console.log(failures === 0 ? '\nTất cả cặp bắt buộc đều đạt.' : `\n${failures} cặp bắt buộc chưa đạt.`)
if (info.length) console.log('Ghi chú: nhóm "chú ý" chỉ để tham khảo; chấm màu và icon ghi âm phải luôn đi kèm chữ hoặc icon.')
process.exit(failures === 0 ? 0 : 1)
