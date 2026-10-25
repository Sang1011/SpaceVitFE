#!/usr/bin/env node
/**
 * Kiểm tra các nơi khai báo token màu luôn khớp nhau:
 *   - src/theme/tokens.css  (nguồn chính: khối :root và .dark)
 *   - src/theme/color-names.json (Tailwind và cn.ts đọc từ đây)
 *   - src/lib/cn.ts phải dùng color-names.json, không tự khai báo danh sách riêng.
 *
 *   node scripts/check-tokens.mjs
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf8')
const css = read('src/theme/tokens.css')
const names = JSON.parse(read('src/theme/color-names.json'))
const cn = read('src/lib/cn.ts')

const errors = []
const block = (re) => {
  const m = css.match(new RegExp(re + '\\s*\\{([^}]*)\\}'))
  if (!m) {
    errors.push('Không tìm thấy khối ' + re + ' trong tokens.css')
    return { names: [], bad: [] }
  }
  const all = [...m[1].matchAll(/--color-([a-z0-9-]+):\s*([^;]+);/g)]
  return {
    names: all.map((x) => x[1]),
    bad: all.filter((x) => !/^\d+\s+\d+\s+\d+$/.test(x[2].trim())).map((x) => x[1]),
  }
}

const rootBlock = block(':root')
const darkBlock = block('\\.dark')
const rootSet = new Set(rootBlock.names)
const nameSet = new Set(names)

for (const n of rootSet) if (!nameSet.has(n)) errors.push(`--color-${n} có trong tokens.css nhưng thiếu trong color-names.json`)
for (const n of nameSet) if (!rootSet.has(n)) errors.push(`"${n}" có trong color-names.json nhưng thiếu trong :root của tokens.css`)
for (const n of darkBlock.names) if (!rootSet.has(n)) errors.push(`--color-${n} chỉ có trong .dark, thiếu giá trị mặc định trong :root`)
for (const n of [...rootBlock.bad, ...darkBlock.bad]) errors.push(`--color-${n} không đúng dạng "R G B" (kênh RGB, cần cho độ trong suốt của Tailwind)`)
if (new Set(names).size !== names.length) errors.push('color-names.json có tên trùng lặp')
if (!cn.includes('color-names.json')) errors.push('src/lib/cn.ts phải import color-names.json (không khai báo danh sách màu riêng)')

if (errors.length) {
  console.error('Token chưa đồng bộ:\n - ' + errors.join('\n - '))
  process.exit(1)
}
console.log(`Token đồng bộ: ${rootSet.size} màu, ${darkBlock.names.length} màu có giá trị riêng cho chế độ tối.`)
