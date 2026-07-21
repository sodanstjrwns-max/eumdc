-- 8차 증량 최종: 3,000자(본문+FAQ) 기준 잔여 미달분 5개 마무리 보강

UPDATE dict_terms SET full_desc = full_desc || '
<h3>GBR 수술 계획과 치과의 역할</h3>
<p>GBR은 단독 수술이 아니라 향후 임플란트까지 이어지는 전체 치료 계획의 일부입니다. 처음부터 최종 보철까지 내다보고 뼈의 양과 위치를 계획하는 치과의 판단력이 결과에 큰 영향을 미치므로, 경험이 축적된 치과에서 충분한 진단을 거쳐 진행하는 것이 좋습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='gbr';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>상아질 노출과 일상 속 예방 습관</h3>
<p>부드러운 칫솔과 적절한 압력으로 칫솔질하는 습관, 산성 음식 후 물로 헹구는 습관을 들이면 상아질 노출을 상당 부분 예방할 수 있습니다. 작은 생활 습관의 변화가 장기적으로 시린 증상과 마모를 줄이는 데 큰 역할을 합니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='dentin';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>거타퍼차 충전과 환자의 장기적 안심</h3>
<p>근관 치료가 잘 마무리되어 거타퍼차로 안전하게 밀봉되면, 그 치아는 신경이 없어도 오랜 기간 정상적으로 기능할 수 있습니다. 정기적인 검진만 잘 받는다면 근관치료를 받은 치아도 충분히 오래 사용할 수 있다는 점을 알아두시면 좋겠습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='gutta-percha';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치근단 절제술 상담 시 확인할 점</h3>
<p>수술을 고려하고 있다면 성공 가능성, 예상 회복 기간, 실패 시 대안에 대해 담당 치과와 충분히 상의하는 것이 좋습니다. CBCT 등 정밀 진단을 통한 사전 평가가 이루어졌는지 확인하면 더 안심하고 치료를 받을 수 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='apicoectomy';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>법랑질 건강을 위한 정기검진의 역할</h3>
<p>법랑질은 스스로 재생되지 않기 때문에 손상이 진행되기 전 조기에 발견하는 것이 무엇보다 중요합니다. 정기검진에서 초기 탈회나 미세한 균열을 발견하면 간단한 관리로 더 큰 손상을 예방할 수 있어, 6개월 주기의 정기검진이 법랑질 건강을 지키는 가장 효과적인 방법입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='enamel';
