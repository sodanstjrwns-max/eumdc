/**
 * 명지 치과 진료별 사진 카드 그리드 (홈 AREA GUIDE · /regions/myeongji 허브 공용, 2026-10-14)
 * 카드 순서·이름·URL·사진은 MYEONGJI_CORE 하나에서 나오며, 같은 배열로 ItemList JSON-LD 를 만든다 (1:1).
 * 스타일은 이음치과 로고 토큰(네이비 --brand-navy · 민트 --brand-mint)만 사용.
 */
import { MYEONGJI_CORE, myeongjiCorePath, myeongjiCoreCardImage, myeongjiCoreName } from '../data/myeongji-core'

export function myeongjiCardGrid(idPrefix: string) {
  return (
    <>
      <ul class="mj-card-grid" role="list">
        {MYEONGJI_CORE.map((p, i) => (
          <li>
            <a class="mj-card" href={myeongjiCorePath(p.slug)} aria-labelledby={`${idPrefix}-${p.slug}`}>
              <span class="mj-card-img">
                <img src={myeongjiCoreCardImage(p.slug)} width="600" height="600" loading="lazy" decoding="async" alt={myeongjiCoreName(p)} />
              </span>
              <span class="mj-card-body">
                <span class="mj-card-tag" aria-hidden="true">{String(i + 1).padStart(2, '0')} · {p.tag}</span>
                <strong class="mj-card-title" id={`${idPrefix}-${p.slug}`}>{myeongjiCoreName(p)}</strong>
                <span class="mj-card-line">{p.line}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <style dangerouslySetInnerHTML={{ __html: MJ_CARD_CSS }} />
    </>
  )
}

const MJ_CARD_CSS = `
.mj-card-grid{list-style:none;margin:28px 0 8px;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.mj-card{display:flex;flex-direction:column;height:100%;background:#fff;border:1px solid rgba(0,48,106,.1);border-radius:18px;overflow:hidden;text-decoration:none;color:var(--brand-navy-deep,#00204A);transition:transform .35s var(--ease,ease),box-shadow .35s var(--ease,ease),border-color .35s}
.mj-card:hover,.mj-card:focus-visible{transform:translateY(-4px);box-shadow:0 18px 40px -18px rgba(0,48,106,.35);border-color:var(--brand-mint,#4ABCBD)}
.mj-card:focus-visible{outline:2px solid var(--brand-mint,#4ABCBD);outline-offset:3px}
.mj-card-img{display:block;aspect-ratio:1/1;overflow:hidden;background:#eef5f7}
.mj-card-img img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .6s var(--ease,ease)}
.mj-card:hover .mj-card-img img{transform:scale(1.04)}
.mj-card-body{display:flex;flex-direction:column;gap:6px;padding:16px 18px 20px}
.mj-card-tag{font-family:var(--font-ui,inherit);font-size:.7rem;letter-spacing:.12em;color:var(--brand-mint-deep,#2E9799);font-weight:600}
.mj-card-title{font-size:1.08rem;font-weight:700;color:var(--brand-navy,#00306A);line-height:1.35}
.mj-card-line{font-size:.88rem;line-height:1.55;color:rgba(10,31,61,.68)}
@media (max-width:900px){.mj-card-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}}
@media (max-width:420px){.mj-card-body{padding:12px 12px 14px}.mj-card-title{font-size:.98rem}.mj-card-line{font-size:.8rem}}
`
