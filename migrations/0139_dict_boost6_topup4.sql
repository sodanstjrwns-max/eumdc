-- 6차 증량 topup4: interdental-brush, periodontal-pocket 잔여 미달분
UPDATE dict_terms SET full_desc = full_desc || '
<h3>치간칫솔과 구강세정기의 역할 분담</h3>
<p>물 압력으로 세정하는 구강세정기는 음식물 찌꺼기 제거와 잇몸 마사지에는 유용하지만, 치아 면에 달라붙은 치태(세균막)를 벗겨내는 힘은 치간칫솔에 미치지 못합니다. 따라서 구강세정기는 치간칫솔의 대체재가 아닌 보조재로 이해하는 것이 정확합니다. 교정 중이거나 손이 불편한 분에게는 좋은 보완 도구가 되며, 치간칫솔 후 마무리로 사용하면 시너지 효과를 낼 수 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='interdental-brush';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치주낭 깊이와 치아 수명의 관계</h3>
<p>연구에 따르면 치주낭이 6mm를 넘는 치아는 3mm 이하인 치아보다 상실 위험이 수 배 높아집니다. 하지만 반대로 말하면, 깊은 치주낭도 치료와 유지 관리로 안정시키면 치아를 수십 년 더 쓸 수 있다는 뜻이기도 합니다. 발치와 임플란트가 아니라 내 치아를 지키는 것이 언제나 첫 번째 선택지이며, 그 갈림길을 결정하는 지표가 바로 치주낭 깊이의 관리입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='periodontal-pocket';
