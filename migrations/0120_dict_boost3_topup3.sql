-- 3차 증량 topup3: 잔여 4개 용어 최종 마감

UPDATE dict_terms SET full_desc = full_desc || '
<h3>실란트에 대한 흔한 오해</h3>
<p>"실란트를 하면 이가 상한다"는 오해가 있지만, 실란트는 치아를 전혀 깎지 않는 무삭제 예방 처치입니다. 표면 처리에 쓰는 산부식제도 법랑질 표면을 미세하게 거칠게 만들 뿐 치아를 손상시키지 않습니다. 오히려 실란트를 하지 않아 생기는 홈 충치가 치아를 실제로 갉아먹는 위협입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='sealant';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>입마름에 도움이 되는 식습관</h3>
<p>수분이 많은 과일과 채소를 곁들이고, 지나치게 짜거나 마른 음식은 피하세요. 식사 중 국물이나 물을 함께 마시면 삼키기가 수월해집니다. 잠자리 곁에 물을 두고, 실내 가습으로 건조한 환경을 개선하는 것도 야간 입마름 완화에 도움이 됩니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='dry-mouth';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>웃음가스(흡입 진정)에 대해</h3>
<p>아산화질소 흡입 진정은 코 마스크로 가스를 마시며 몸이 편안해지는 가장 가벼운 진정법입니다. 투여를 멈추면 몇 분 내 회복되어 당일 일상 복귀가 가능하고, 소아 치료나 가벼운 불안 조절에 널리 사용됩니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='conscious-sedation';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>잇몸 퇴축과 검은 삼각형(블랙 트라이앵글)</h3>
<p>치아 사이 잇몸(치간유두)이 퇴축하면 검은 삼각형 공간이 생겨 심미적으로 신경 쓰이고 음식물도 잘 낍니다. 완전한 회복은 어렵지만 레진·라미네이트로 공간을 줄이거나 교정적 접근으로 개선할 수 있어, 상태에 따라 최선의 방법을 상담해드립니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='gum-recession';
