import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'

// 수가표 기준일 = 수가 데이터 파일 마지막 커밋 날짜(빌드 시 상수).
// new Date()로 매일 '오늘'이 찍히던 기준일·lastReviewed 대체 (2026-09-29). 얕은 클론·git 없음 → src/data/content-dates.ts 폴백.
function lastCommitDate(paths: string[]): string {
  try {
    const run = (cmd: string) => execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
    if (run('git rev-parse --is-shallow-repository') === 'true') return ''
    return run(`git log -1 --format=%cs -- ${paths.join(' ')}`)
  } catch {
    return ''
  }
}

// 파일이 처음 추가된 커밋 날짜(게시일 용도). 얕은 클론·git 없음 → '' (content-dates.ts 폴백).
function firstCommitDate(path: string): string {
  try {
    const run = (cmd: string) => execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
    if (run('git rev-parse --is-shallow-repository') === 'true') return ''
    const lines = run(`git log --diff-filter=A --format=%cs -- ${path}`).split('\n').filter(Boolean)
    return lines[lines.length - 1] || ''
  } catch {
    return ''
  }
}

export default defineConfig({
  define: {
    __PRICES_DATE__: JSON.stringify(lastCommitDate(['migrations/0020_price_guide_from_excel.sql'])),
    // 지역×진료 추천(/best/:slug) 페이지: 게시일 = 템플릿 최초 커밋, 수정일 = 템플릿·지역/진료 데이터 마지막 커밋
    __BEST_PUBLISHED_DATE__: JSON.stringify(firstCommitDate('src/pages/region-treatment-best.tsx')),
    __BEST_MODIFIED_DATE__: JSON.stringify(lastCommitDate(['src/pages/region-treatment-best.tsx', 'src/data/seo-matrix.ts'])),
  },
  plugins: [
    build(),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    })
  ]
})
