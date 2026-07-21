-- 8차 증량 토핑업5: 3,000자 기준 미달분 최종 보강 (gutta-percha 등 하위 9개)

UPDATE dict_terms SET full_desc = full_desc || '
<h3>거타퍼차와 근관치료의 최종 목표</h3>
<p>근관치료의 궁극적인 목표는 감염된 조직을 완전히 제거하고 그 공간을 세균이 다시 침투할 수 없도록 영구적으로 밀봉하는 것입니다. 거타퍼차는 이 마지막 밀봉 단계를 담당하는 핵심 재료로, 수십 년간 안전성과 효과가 검증되어 현재까지도 표준 근관 충전재로 널리 사용되고 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='gutta-percha';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>교합 문제와 스트레스의 연관성</h3>
<p>심리적 스트레스가 심하면 무의식적으로 이를 악물거나 갈게 되는 경우가 많아 교합에 과도한 힘이 반복적으로 가해질 수 있습니다. 이런 습관이 지속되면 교합 균형이 무너지고 턱관절과 치아 모두에 부담이 누적되므로, 스트레스 관리와 함께 야간 장치 같은 보조 수단을 병행하는 것이 도움이 됩니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='occlusion';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>법랑질과 임신·성장기의 영향</h3>
<p>치아가 형성되는 태아기와 유아기에 영양 결핍이나 특정 질환, 고열이 있으면 법랑질 형성에 영향을 줄 수 있습니다. 이런 시기의 건강 관리가 이후 평생 사용할 치아의 강도와 품질에 영향을 미칠 수 있다는 점에서, 임신 중 구강 건강 관리도 자녀의 치아 건강과 연결된다고 볼 수 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='enamel';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>심미 보철과 조명·촬영 환경</h3>
<p>완성된 보철물의 색은 스튜디오 조명, 자연광, 실내 백열등 등 환경에 따라 다르게 보일 수 있습니다. 결과 확인 시 여러 조명 환경에서 사진을 찍어 비교해 보면 실생활에서의 만족도를 더 정확히 예측할 수 있어, 최종 부착 전 다양한 환경 테스트를 권장하는 치과가 늘고 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='cosmetic-prosthetics';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치근단 절제술과 정기 방사선 추적</h3>
<p>수술이 성공적으로 끝난 후에도 6개월, 1년, 그 이후에도 정기적인 방사선 검사로 병소가 완전히 사라졌는지 추적하는 것이 중요합니다. 뼈의 재생은 서서히 이루어지기 때문에 단기간에 판단하기보다 장기적인 관찰을 통해 최종 성공 여부를 확인해야 합니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='apicoectomy';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치조골과 씹는 습관의 관계</h3>
<p>한쪽으로만 씹는 습관이 오래 지속되면 그 쪽의 치조골에 힘이 편중되어 마모나 흡수가 더 빠르게 진행될 수 있습니다. 양쪽을 균형 있게 사용하는 저작 습관은 치조골 전체의 건강한 자극과 유지에 도움이 되는 간단하지만 중요한 관리 방법입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='alveolar-bone';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치수 보존과 최신 재생치과학 동향</h3>
<p>최근 재생치과학 분야에서는 손상된 치수를 완전히 제거하지 않고 줄기세포나 생체활성 재료를 이용해 재생을 유도하는 연구가 활발히 진행되고 있습니다. 아직 모든 임상에 보편적으로 적용되지는 않지만, 이런 발전은 앞으로 치수를 더 적극적으로 보존할 수 있는 가능성을 열어주고 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='dental-pulp';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>아말감과 심미 치료 트렌드의 변화</h3>
<p>과거에는 충치 치료 후 은색 충전물이 자연스럽게 받아들여졌지만, 최근에는 웃을 때 보이는 부위는 물론 어금니까지도 자연치와 구분되지 않는 심미적 결과를 기대하는 경향이 커지고 있습니다. 이런 인식 변화가 아말감보다 레진이나 세라믹 재료의 선호도를 높이는 배경이 되고 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='amalgam';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>근관 형태와 3차원 영상 진단의 발전</h3>
<p>과거에는 2차원 방사선 사진만으로 근관 형태를 파악해야 했지만, CBCT 같은 3차원 영상 장비의 발전으로 복잡한 근관 구조를 입체적으로 미리 확인할 수 있게 되었습니다. 이런 정밀 진단은 특히 재치료가 필요한 복잡한 케이스에서 치료 계획의 정확도를 크게 높여줍니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='root-canal-anatomy';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>GIC 활용의 지역사회 예방 프로그램</h3>
<p>GIC는 시술이 간편하고 장비 의존도가 낮아 이동식 진료나 대규모 예방 프로그램에서도 활용되는 재료입니다. 접근성이 낮은 지역에서도 비교적 간단한 장비로 충치를 예방하고 관리할 수 있다는 점에서, 공공 구강보건 영역에서도 그 가치가 인정받고 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='gic';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>MTA와 치과 재료의 미래 방향</h3>
<p>MTA를 시작으로 발전해 온 생체활성 재료들은 단순히 공간을 메우는 것을 넘어 조직의 재생을 유도하는 방향으로 계속 진화하고 있습니다. 앞으로 이런 재료들이 더 발전하면 치아를 보존할 수 있는 범위가 지금보다 한층 넓어질 것으로 기대됩니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='mta';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치수 복조술 후 통증 관리</h3>
<p>시술 직후 며칠간은 가벼운 진통제로 조절 가능한 정도의 불편감이 있을 수 있습니다. 통증이 점차 줄어드는 양상이면 정상적인 회복 과정이지만, 오히려 심해지거나 지속된다면 치수 상태를 재평가해야 하므로 경과를 스스로 관찰하고 변화가 있으면 바로 알려주시는 것이 중요합니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='pulp-capping';
