// postbuild: dist/static 안의 CSS/JS를 esbuild로 미니파이 (소스는 그대로 유지)
// Core Web Vitals — 전송 바이트 절감용
import { build } from 'esbuild'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DIST_STATIC = new URL('../dist/static', import.meta.url).pathname

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

const files = walk(DIST_STATIC).filter((f) => f.endsWith('.css') || f.endsWith('.js'))

let before = 0
let after = 0
for (const f of files) {
  before += statSync(f).size
  await build({
    entryPoints: [f],
    outfile: f,
    allowOverwrite: true,
    minify: true,
    logLevel: 'silent',
    // JS는 구문만 압축 (전역 의존 코드 보호 — 이름 망글링 안 함)
    ...(f.endsWith('.js') ? { minifyIdentifiers: false } : {})
  })
  after += statSync(f).size
}

console.log(
  `[minify-static] ${files.length} files: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (-${(100 - (after / before) * 100).toFixed(0)}%)`
)
