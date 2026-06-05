// 치과 용어 219개 full_desc 고품질 HTML 본문 생성 스크립트
// GPT-5 사용, 용어별 고유 구조화 콘텐츠 생성. 결과를 /tmp/dict_generated.json 에 저장.
import OpenAI from 'openai'
import fs from 'fs'

const client = new OpenAI({
  apiKey: process.env.GSK_TOKEN,
  baseURL: process.env.OPENAI_BASE_URL
})

const dump = JSON.parse(fs.readFileSync('/tmp/dict_dump.json', 'utf8'))
const terms = dump[0].results

// 카테고리별 한글 라벨 (프롬프트 컨텍스트용)
const CAT_LABEL = {
  'implant': '임플란트', 'prosthetic': '보철', 'restorative': '보존(충치·신경치료)',
  'periodontal': '치주(잇몸)', 'tmj-ortho': '턱관절·교정', 'pediatric': '소아치과',
  'oral-surgery': '구강외과', 'digital': '디지털 치과', 'materials': '치과 재료',
  'general-anatomy': '구강 해부·일반'
}

const SYSTEM = `당신은 서울대 치의학 출신 통합치의학과 전문의이며, 환자가 쉽게 이해하도록 치과 용어를 설명하는 의료 콘텐츠 에디터입니다.
주어진 치과 용어에 대해 환자용 백과사전 본문을 HTML로 작성합니다.

[작성 규칙]
1. 출력은 순수 HTML 조각만. <html>,<body> 같은 래퍼 금지. 허용 태그: <h3>, <p>, <ul>, <li>, <strong>.
2. 다음 4개 섹션을 반드시 포함하되, 용어 특성에 맞게 소제목(h3)은 자연스럽게 변형:
   - 첫 단락: 주어진 정의를 바탕으로 한 핵심 설명 (정의 문장을 그대로 베끼지 말고 확장·재서술)
   - <h3>원리 또는 특징</h3> + 설명
   - <h3>언제 필요한가 / 적응증</h3> 또는 <h3>관련 상황</h3> + <ul> 리스트 2~4개
   - <h3>알아두면 좋은 점</h3> 또는 주의사항 + 설명
3. 전체 분량: 한국어 350~550자 (공백 제외 기준 대략). 너무 길지 않게.
4. 문체: 환자 친화적, 신뢰감 있는 의료 전문가 톤. 과장·허위 효능 주장 금지.
5. 병원명을 1회만 자연스럽게 언급 가능 ("이음치과"). 전화번호·예약 문구는 넣지 말 것(별도 CTA 있음).
6. 의학적으로 정확해야 함. 모르면 일반론으로 안전하게.
7. 용어마다 내용이 달라야 함. 템플릿 복붙 절대 금지.`

function userPrompt(t) {
  return `용어: ${t.term}${t.english ? ` (${t.english})` : ''}
분야(카테고리): ${CAT_LABEL[t.cat] || t.cat}
기존 한줄 정의: ${t.short_desc}
참고 설명: ${t.full_desc}
관련 진료: ${t.related_service || '없음'}

위 용어에 대한 환자용 백과사전 HTML 본문을 작성하세요.`
}

async function genOne(t, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const r = await client.chat.completions.create({
        model: 'gpt-5-mini',
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: userPrompt(t) }
        ]
      })
      let html = (r.choices[0].message.content || '').trim()
      // 코드펜스 제거
      html = html.replace(/^```html\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim()
      if (html.length < 120) throw new Error('too short: ' + html.length)
      return html
    } catch (e) {
      if (i === retries - 1) { console.error(`  [FAIL] ${t.slug}: ${e.message}`); return null }
      await new Promise(r => setTimeout(r, 1500 * (i + 1)))
    }
  }
}

const out = {}
// 이미 생성한 결과 이어받기 (중단 대비)
if (fs.existsSync('/tmp/dict_generated.json')) {
  Object.assign(out, JSON.parse(fs.readFileSync('/tmp/dict_generated.json', 'utf8')))
  console.log(`resuming: ${Object.keys(out).length} already done`)
}

const CONCURRENCY = 6
const pending = terms.filter(t => !out[t.slug])
console.log(`to generate: ${pending.length}`)

let done = Object.keys(out).length
for (let i = 0; i < pending.length; i += CONCURRENCY) {
  const batch = pending.slice(i, i + CONCURRENCY)
  const results = await Promise.all(batch.map(t => genOne(t).then(html => ({ slug: t.slug, html }))))
  for (const { slug, html } of results) {
    if (html) out[slug] = html
  }
  done = Object.keys(out).length
  fs.writeFileSync('/tmp/dict_generated.json', JSON.stringify(out, null, 1))
  console.log(`progress: ${done}/${terms.length}`)
}

console.log(`\nDONE. total generated: ${Object.keys(out).length}/${terms.length}`)
