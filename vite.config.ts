import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

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

// 홈 스크롤 몰입 연출 정적 파일의 내용 해시 (?v= 캐시 버스팅 — 고정 버전 문자열 금지)
const fileHash = (f: string) => createHash('sha256').update(readFileSync(f)).digest('hex').slice(0, 10)

export default defineConfig({
  define: {
    // 공통 스타일시트도 내용 해시로 (2026-11-10 — /static/* 이 immutable 1년 캐시라 고정 ?v= 로는 수정이 안 보임)
    __STYLE_CSS_V__: JSON.stringify(fileHash('public/static/style.css')),
    __STYLE_PATCH_CSS_V__: JSON.stringify(fileHash('public/static/style-patch.css')),
    // 2026-11 리뉴얼 층
    __RENEW_CSS_V__: JSON.stringify(fileHash('public/static/renew.css')),
    __RENEW_HOME_CSS_V__: JSON.stringify(fileHash('public/static/renew-home.css')),
    __RENEW_JS_V__: JSON.stringify(fileHash('public/static/renew.js')),
    __RENEW_HOME_JS_V__: JSON.stringify(fileHash('public/static/renew-home.js')),
    __IMMERSIVE_CSS_V__: JSON.stringify(fileHash('public/static/immersive.css')),
    __IMMERSIVE_JS_V__: JSON.stringify(fileHash('public/static/immersive.js')),
    // 기존 모션 스크립트도 내용 해시로 (2026-10-31 이음 기존 버그 수정 — 고정 ?v=20260611b 는 수정이 캐시에 묻힘)
    __APP_JS_V__: JSON.stringify(fileHash('public/static/app.js')),
    __GSAP_INIT_V__: JSON.stringify(fileHash('public/static/gsap-init.js')),
    // 나머지 공개 스크립트도 내용 해시로 (2026-11-10 — ?v= 없음·고정 ?v=20260611b 는 immutable 1년 캐시에 수정이 묻힘)
    __SUB_JS_V__: JSON.stringify(fileHash('public/static/sub.js')),
    __SCROLL_PERF_JS_V__: JSON.stringify(fileHash('public/static/scroll-perf-patch.js')),
    __DICTIONARY_JS_V__: JSON.stringify(fileHash('public/static/dictionary.js')),
    __TREATMENTS_JS_V__: JSON.stringify(fileHash('public/static/treatments.js')),
    __REGION_JS_V__: JSON.stringify(fileHash('public/static/region.js')),
    __VISIT_JS_V__: JSON.stringify(fileHash('public/static/visit.js')),
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
