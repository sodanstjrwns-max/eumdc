-- bridge / bone-graft 3000자 기준선 미달분 패치
UPDATE dict_terms SET full_desc = full_desc || '
<h3>브릿지 수명을 늘리는 관리 핵심</h3>
<p>브릿지는 가공치 아래 공간에 음식물이 고이기 쉬워 슈퍼플로스나 치간칫솔을 이용한 하방 청소가 수명을 좌우합니다. 이음치과(부산 명지)에서는 브릿지 장착 환자분께 전용 청소 도구 사용법을 직접 시연해 드리며, 6개월 간격 정기검진에서 지대치 상태와 변연 적합도를 함께 점검합니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='bridge';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>골이식 후 성공적인 치유를 위한 체크포인트</h3>
<p>골이식 부위는 초기 1~2주간 이식재가 안정화되는 시기로, 해당 부위로 씹는 것을 피하고 강한 가글이나 빨대 사용을 삼가야 합니다. 흡연은 골형성 세포의 활동을 억제해 실패율을 크게 높이므로 최소 4주 금연이 필수입니다. 이음치과는 CBCT로 골이식 부위의 치유 정도를 정량적으로 확인한 뒤 임플란트 식립 시점을 결정합니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='bone-graft';
