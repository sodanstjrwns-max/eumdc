-- 5차 증량 topup3: plaque 잔여 미달분
UPDATE dict_terms SET full_desc = full_desc || '
<h3>치태와 치석의 차이, 헷갈리지 마세요</h3>
<p>치태는 세균막이라 칫솔질로 제거할 수 있지만, 치태가 침 속 미네랄과 결합해 굳어진 치석은 칫솔로는 절대 제거되지 않습니다. 치태가 치석으로 굳는 데는 보통 며칠이면 충분하므로, 매일의 칫솔질과 치실이 치석 형성을 막는 유일한 방법입니다. 이미 생긴 치석은 스케일링으로만 제거할 수 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='plaque';
