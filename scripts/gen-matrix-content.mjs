// 매트릭스 28페이지(7지역×4진료) 지역 특화 고유 콘텐츠 생성
// 95.6% 중복 → 지역마다 다른 본문. 결과: /tmp/matrix_generated.json (key: "rs__ts")
import OpenAI from 'openai'
import fs from 'fs'

const client = new OpenAI({ apiKey: process.env.GSK_TOKEN, baseURL: process.env.OPENAI_BASE_URL })
const jobs = JSON.parse(fs.readFileSync('/tmp/matrix_jobs.json', 'utf8'))

const SYSTEM = `당신은 부산 강서구 명지동에 위치한 '이음치과의원'의 의료 콘텐츠 에디터이자, 그 지역을 잘 아는 통합치의학과 전문의입니다.
특정 지역 거주자가 특정 치과 진료를 검색했을 때 보게 되는 '지역 맞춤 안내' 본문을 HTML로 작성합니다.

[목표] 같은 진료라도 지역마다 본문이 확연히 다르게 — 그 지역의 실제 특성(생활권, 교통, 거주 인구 특성, 인근 지역, 내원 동선)을 녹여 고유한 콘텐츠를 만듭니다.

[작성 규칙]
1. 출력은 순수 HTML 조각만. 허용 태그: <h3>, <p>, <ul>, <li>, <strong>. 래퍼 태그 금지.
2. 구조:
   - <h3>{지역}에서 이음치과까지</h3> + 그 지역에서의 접근성·동선·교통을 구체적으로 (거리 정보 활용)
   - <h3>{지역} 주민에게 {진료}가 필요한 이유</h3> 또는 지역 생활상과 연결한 단락
   - <ul>로 그 지역 특화 포인트 2~3개
3. 분량: 한국어 300~450자.
4. 지역 고유성 필수: 다른 지역 본문과 절대 겹치지 않게. 지명·생활권·교통을 구체적으로.
5. 의료광고법 주의: 과장·최상급 단정("최고","유일") 금지, 허위 효능 금지. 사실 기반·정보 제공 톤.
6. 전화번호/예약 문구 금지(별도 CTA 있음). 병원명 '이음치과'는 자연스럽게 사용 가능.`

function prompt(j) {
  return `지역: ${j.rfull} (${j.rname}), 행정구역: ${j.city} ${j.district}
이음치과까지 거리/동선: ${j.distance}
인근 지역: ${(j.nearby || []).join(', ') || '없음'}
진료: ${j.tname} — ${j.benefit}

위 "${j.rname} ${j.tname}" 조합에 대한 지역 맞춤 안내 HTML 본문을 작성하세요. 그 지역만의 특성을 반드시 반영하세요.`
}

async function genOne(j, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const r = await client.chat.completions.create({
        model: 'gpt-5-mini',
        messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: prompt(j) }]
      })
      let html = (r.choices[0].message.content || '').trim()
      html = html.replace(/^```html\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim()
      if (html.length < 150) throw new Error('too short')
      return html
    } catch (e) {
      if (i === retries - 1) { console.error(`[FAIL] ${j.rs}/${j.ts}: ${e.message}`); return null }
      await new Promise(r => setTimeout(r, 1500 * (i + 1)))
    }
  }
}

const out = {}
if (fs.existsSync('/tmp/matrix_generated.json')) Object.assign(out, JSON.parse(fs.readFileSync('/tmp/matrix_generated.json', 'utf8')))

const pending = jobs.filter(j => !out[`${j.rs}__${j.ts}`])
console.log(`to generate: ${pending.length}`)
const C = 6
for (let i = 0; i < pending.length; i += C) {
  const batch = pending.slice(i, i + C)
  const res = await Promise.all(batch.map(j => genOne(j).then(html => ({ k: `${j.rs}__${j.ts}`, html }))))
  for (const { k, html } of res) if (html) out[k] = html
  fs.writeFileSync('/tmp/matrix_generated.json', JSON.stringify(out, null, 1))
  console.log(`progress: ${Object.keys(out).length}/${jobs.length}`)
}
console.log(`DONE: ${Object.keys(out).length}/${jobs.length}`)
