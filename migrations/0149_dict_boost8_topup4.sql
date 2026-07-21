-- 8차 증량 토핑업4: 잔여 짧은 용어 보강 (gutta-percha, gic, pulp-capping, apicoectomy, alveolar-bone, dentin, root-canal-anatomy, mta, amalgam)

UPDATE dict_terms SET full_desc = full_desc || '
<h3>거타퍼차 보관과 품질 관리</h3>
<p>거타퍼차는 시간이 지나거나 부적절하게 보관되면 유연성이 떨어져 조작성이 나빠질 수 있습니다. 치과에서는 정품 거타퍼차 콘을 적정 환경에서 보관하고 유효기간을 관리해 치료의 일관된 품질을 유지합니다. 작은 재료 하나까지 관리하는 것이 안정적인 근관치료 결과로 이어집니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='gutta-percha';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>GIC 시술 시 습도 조절의 중요성</h3>
<p>GIC는 다른 접착 재료보다 습기에 관대하지만, 경화 초기 단계에서 지나치게 건조하거나 과도한 수분에 노출되면 물성이 저하될 수 있습니다. 적절한 습도 조절 하에 시술하는 것이 GIC의 불소 방출 효과와 내구성을 온전히 살리는 핵심 조건입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='gic';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치수 복조술과 환자의 연령대별 성공률 차이</h3>
<p>어린이와 젊은 성인은 치수의 혈류와 재생 능력이 좋아 치수 복조술의 성공률이 상대적으로 높은 편입니다. 반면 나이가 들면서 치수강이 좁아지고 혈류가 감소하면 회복 능력도 함께 줄어들 수 있어, 연령에 따라 치료 방향과 예후에 대한 기대치를 다르게 설정하는 것이 합리적입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='pulp-capping';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치근단 절제술 후 흉터와 회복 외관</h3>
<p>수술 부위는 잇몸 안쪽을 절개하기 때문에 외부에서 흉터가 보이는 경우는 드뭅니다. 다만 잇몸이 완전히 아물기까지 일시적으로 형태가 달라 보일 수 있으며, 대부분 몇 주에서 몇 개월 사이에 자연스러운 잇몸 형태로 회복됩니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='apicoectomy';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치조골 재생 수술의 발전</h3>
<p>과거에는 뼈가 부족하면 치료가 어려웠지만, 최근 GBR과 다양한 이식재의 발전으로 상당한 골결손도 재생이 가능해졌습니다. 성장인자를 활용한 재생 촉진 기술도 함께 연구되고 있어, 치조골 재생 수술의 예측 가능성과 성공률은 계속 향상되는 추세입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='alveolar-bone';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>상아질 지각과민증의 자연 완화 가능성</h3>
<p>노출된 상아세관은 시간이 지나면서 침 속 무기질이 자연스럽게 침착되어 부분적으로 막히는 경우가 있어, 증상이 서서히 완화되기도 합니다. 다만 이 과정은 느리고 불확실하므로, 증상이 불편하다면 적극적으로 치료를 받는 것이 삶의 질 측면에서 더 나은 선택입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='dentin';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>근관 치료 성공률에 영향을 주는 전신 요인</h3>
<p>당뇨나 면역저하 상태는 근관치료 후 치유 속도와 성공률에 영향을 줄 수 있습니다. 전신 건강 상태를 치과 진료 전에 충분히 공유하면 치료 계획을 세울 때 이런 요인을 반영해 더 예측 가능한 결과를 기대할 수 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='root-canal-anatomy';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>MTA와 치아 보존 철학</h3>
<p>MTA의 발전은 발치 대신 치아를 살리려는 보존적 치료 철학과 맞닿아 있습니다. 과거에는 어려웠던 복잡한 근관 문제나 천공도 MTA를 통해 치아를 유지할 수 있는 가능성이 넓어지면서, 자연치아 보존의 범위가 계속 확장되고 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='mta';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>아말감과 알레르기 반응</h3>
<p>매우 드물지만 금속 성분에 대한 알레르기 반응으로 구강 내 편평 병변이 나타나는 경우가 보고된 바 있습니다. 이런 증상이 의심되면 알레르기 검사를 통해 원인을 확인하고, 필요시 비금속 재료로 교체하는 것을 고려할 수 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='amalgam';
