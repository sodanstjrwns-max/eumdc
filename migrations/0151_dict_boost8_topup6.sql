-- 8차 증량 토핑업6: 3,000자(본문+FAQ) 기준 최종 미달분 보강 (osstem 제외 14개)

UPDATE dict_terms SET full_desc = full_desc || '
<h3>GBR과 환자의 협조도</h3>
<p>GBR은 수술 자체의 정교함뿐 아니라 환자의 협조도가 결과에 큰 영향을 줍니다. 처방된 소독약 사용, 금연, 정기적인 내원 관찰을 잘 따르는 환자일수록 이식한 뼈가 안정적으로 자리 잡을 가능성이 높습니다. 수술 전 충분한 설명을 듣고 관리 계획을 이해하는 것이 성공적인 결과의 첫걸음입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='gbr';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>상아질 보존을 위한 치료 원칙</h3>
<p>치아를 치료할 때는 가능한 한 건강한 상아질을 최대한 보존하는 최소 침습적 접근이 원칙입니다. 불필요하게 넓게 삭제하면 치아의 구조적 강도가 약해지고 치수와의 거리도 가까워져 위험이 커지므로, 정밀한 진단으로 필요한 부분만 정확히 치료하는 것이 치아의 장기적 건강을 지키는 길입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='dentin';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>거타퍼차 근관 충전과 환자의 이해</h3>
<p>근관치료를 받는 환자 입장에서는 신경을 제거한 뒤 어떤 재료로, 어떻게 밀봉되는지 궁금할 수 있습니다. 거타퍼차가 근관 내부를 채워 재감염을 막는 원리를 이해하면, 치료 후 왜 크라운 같은 추가 보강이 필요한지도 자연스럽게 받아들일 수 있어 치료 계획에 대한 협조도가 높아집니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='gutta-percha';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>법랑질과 치아 미백 후 관리</h3>
<p>미백 시술 후 일정 기간은 착색이 잘 되는 음식이나 음료를 피하는 것이 좋습니다. 법랑질의 표면 미세 구조가 일시적으로 색소를 더 쉽게 받아들일 수 있는 상태이기 때문입니다. 이 기간을 잘 지키면 미백 효과를 더 오래 유지할 수 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='enamel';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>교합 안정과 전신 자세의 관계</h3>
<p>일부 연구에서는 교합 불균형이 목과 어깨 근육의 긴장, 심하면 전신 자세에까지 영향을 줄 수 있다고 보고합니다. 턱 주변 근육의 과도한 긴장이 목과 등 근육으로 이어지는 사례가 있어, 반복되는 어깨 결림이나 목 통증이 있다면 교합 상태도 함께 점검해 보는 것이 도움이 될 수 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='occlusion';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>심미 보철과 정신적 만족감</h3>
<p>치아의 심미적 개선은 단순히 외관을 바꾸는 것을 넘어 자신감과 대인관계에도 긍정적인 영향을 줄 수 있습니다. 많은 환자들이 심미 보철 후 웃는 것에 대한 부담이 줄고 사회적 활동에 더 적극적으로 참여하게 되었다고 이야기하는 경우가 많아, 심리적 가치도 충분히 고려할 만한 요소입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='cosmetic-prosthetics';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치조골과 임플란트 선택 시기</h3>
<p>발치 직후 치조골이 급격히 흡수되기 전에 임플란트를 계획하면 뼈이식 없이도 충분한 뼈를 확보할 수 있는 경우가 많습니다. 이런 이유로 오래 미루지 않고 발치 초기에 향후 계획을 상담받는 것이 치료 과정을 단순화하고 비용을 줄이는 데 도움이 될 수 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='alveolar-bone';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치근단 절제술과 환자 만족도</h3>
<p>발치 없이 자연치아를 유지할 수 있었던 환자들은 대체로 높은 만족도를 보입니다. 씹는 감각이 자연스럽고 추가적인 임플란트나 보철 비용 부담이 없어, 가능한 경우 우선적으로 시도해 볼 가치가 있는 치료로 평가받고 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='apicoectomy';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>GIC와 치과 재료 선택의 균형</h3>
<p>모든 상황에 하나의 재료만 정답인 경우는 드뭅니다. GIC의 불소 방출과 접착력, 복합레진의 강도와 심미성, 각 재료의 장단점을 이해하고 부위와 목적에 맞게 조합하는 것이 숙련된 치료의 핵심입니다. 환자에게도 왜 특정 재료가 선택되었는지 설명하는 것이 신뢰를 쌓는 과정입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='gic';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치수 건강과 정기검진의 가치</h3>
<p>치수 문제는 초기에는 증상이 미약하거나 없는 경우가 많아 정기검진에서 우연히 발견되는 사례가 적지 않습니다. 특별한 통증이 없더라도 정기적인 방사선 검사와 검진을 통해 치수의 건강 상태를 확인하는 것이 큰 문제로 발전하기 전에 대응할 수 있는 가장 효과적인 방법입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='dental-pulp';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>근관 형태 이해와 환자 설명</h3>
<p>근관치료가 여러 번 방문이 필요하거나 예상보다 복잡해지는 이유를 환자에게 근관의 실제 형태를 보여주며 설명하면 이해와 협조를 얻기 쉬워집니다. 눈에 보이지 않는 내부 구조의 복잡함을 시각적으로 공유하는 것이 치료 과정에 대한 신뢰를 높이는 데 도움이 됩니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='root-canal-anatomy';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>아말감 관련 궁금증에 대한 열린 상담</h3>
<p>아말감의 안전성이나 교체 필요성에 대해 궁금한 점이 있다면 인터넷 정보보다 직접 상담을 통해 본인의 구강 상태에 맞는 정확한 정보를 얻는 것이 좋습니다. 개인의 충전물 상태와 전신 건강을 종합적으로 고려한 상담이 불필요한 불안을 줄이고 합리적인 결정을 돕습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='amalgam';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치수 복조술과 재신경치료 예방</h3>
<p>치수 복조술이 성공적으로 유지되면 근관치료라는 더 큰 치료를 피할 수 있어 치아 구조를 더 많이 보존할 수 있습니다. 이는 치아의 장기적인 강도와 수명에도 긍정적인 영향을 미치므로, 조건이 맞는다면 적극적으로 시도해 볼 가치가 있는 보존적 치료 방법입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='pulp-capping';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>MTA 사용 사례의 확장</h3>
<p>초기에는 근관 천공 수복에 주로 사용되던 MTA는 이제 치수 복조술, 아펙시피케이션, 치근단 수술 등 다양한 상황으로 활용 범위가 넓어졌습니다. 이런 확장은 MTA의 우수한 밀봉력과 생체적합성이 여러 임상 상황에서 반복적으로 검증되었기 때문에 가능했습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='mta';
