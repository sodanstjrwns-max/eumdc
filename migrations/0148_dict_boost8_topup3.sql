-- 8차 증량 토핑업3: 15개 용어 전체 (각 1섹션 추가, 목표 2400자+ 도달)

UPDATE dict_terms SET full_desc = full_desc || '
<h3>임플란트 개수가 많을 때의 브랜드 통일 이점</h3>
<p>여러 개의 치아를 동시에 임플란트로 수복하는 경우, 같은 브랜드로 통일하면 수술 도구와 부품을 일관되게 사용할 수 있어 시술 효율이 높아지고 추후 유지관리도 단순해집니다. 오스템처럼 국내에서 부품 수급이 원활한 브랜드는 이런 다수 식립 케이스에서도 안정적인 관리를 제공할 수 있는 실질적인 장점이 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='osstem';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>GBR과 임플란트 동시 식립 가능 여부</h3>
<p>뼈의 부족한 정도가 크지 않다면 임플란트를 식립하면서 동시에 GBR을 진행하는 것이 가능해 치료 기간을 줄일 수 있습니다. 반면 결손이 크거나 초기 고정력이 충분하지 않을 것으로 예상되면, 먼저 GBR로 뼈를 만든 뒤 충분한 치유 기간을 거쳐 임플란트를 식립하는 단계적 접근이 더 안전합니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='gbr';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>심미 보철과 발음, 기능의 조화</h3>
<p>미소를 아름답게 만드는 것뿐 아니라 발음과 씹는 기능이 함께 편안해야 성공적인 심미 보철이라 할 수 있습니다. 치아 길이나 각도가 조금만 달라져도 특정 발음이 부자연스러워질 수 있어, 최종 형태를 확정하기 전 말하기와 씹기를 충분히 시험해 보는 과정이 필요합니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='cosmetic-prosthetics';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>교합과 나이에 따른 변화 관리</h3>
<p>나이가 들면서 치아 마모, 잇몸 퇴축, 보철물 노화 등으로 교합은 서서히 변화합니다. 이런 변화를 방치하면 어느 순간 급격한 불편감으로 나타날 수 있어, 정기검진에서 미세한 변화를 지속적으로 확인하고 필요시 소규모 조정을 통해 큰 문제로 발전하는 것을 예방하는 것이 바람직합니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='occlusion';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>근관 치료와 재발 방지를 위한 최종 수복</h3>
<p>근관을 완벽하게 치료하고 충전했더라도 위쪽의 최종 수복이 부실하면 세균이 새로 침투해 재감염이 생길 수 있습니다. 근관치료 완료 후 가급적 빠른 시일 내에 적절한 충전이나 크라운으로 치아를 밀봉하는 것이 치료 전체의 성공을 지키는 마지막 단계입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='root-canal-anatomy';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치수 건강과 전신 건강의 연결</h3>
<p>치수에 만성적인 감염이 방치되면 그 염증이 국소적으로 끝나지 않고 전신적인 염증 반응에 영향을 줄 수 있다는 연구들이 있습니다. 당뇨나 심혈관 질환이 있는 분들은 구강 내 감염 관리가 전신 건강 관리와도 연결된다는 점에서 치수 문제를 미루지 않고 조기에 치료받는 것이 중요합니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='dental-pulp';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>법랑질 두께와 치료 계획의 관계</h3>
<p>법랑질의 두께는 치아 부위마다 다르며, 얇은 부위에 과도한 삭제가 필요한 치료를 계획하면 상아질이나 치수에 가까워져 부담이 커질 수 있습니다. 라미네이트나 크라운 같은 보철 치료를 계획할 때 법랑질의 두께를 고려한 최소 침습적 삭제 설계가 치아의 장기적 건강을 지키는 핵심입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='enamel';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>상아질과 치아 색조의 관계</h3>
<p>법랑질은 반투명하기 때문에 치아의 실제 색조는 아래에 있는 상아질의 색이 크게 좌우합니다. 미백 치료나 보철물의 색을 정할 때 상아질의 원래 색과 투명도를 고려하는 것이 자연스러운 결과를 만드는 데 중요하며, 이는 심미 치료 계획에서 흔히 간과되는 세부 요소입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='dentin';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>아말감 사용에 대한 국제적 규제 동향</h3>
<p>일부 국가에서는 환경적 이유로 아말감 사용을 점진적으로 줄이는 정책을 시행하고 있으며, 이런 흐름 속에서 대체 재료의 개발과 물성 개선이 더욱 활발해지고 있습니다. 국내에서도 이런 국제적 동향과 환자의 심미적 요구에 맞춰 아말감 사용 빈도가 자연스럽게 감소하는 추세입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='amalgam';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>GIC와 치아 우식 활성 관리 프로그램</h3>
<p>충치 발생 위험이 높은 환자를 대상으로 하는 예방 관리 프로그램에서는 GIC의 불소 방출 특성을 적극 활용합니다. 정기적으로 위험 부위에 GIC를 적용하거나 실란트와 병행해 충치 발생을 억제하는 전략은 특히 구강건조증이나 다발성 충치 이력이 있는 환자에게 유용합니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='gic';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치수 복조술과 환자와의 소통</h3>
<p>치수 복조술은 신경을 보존하려는 시도이지만 100% 성공을 보장할 수 없다는 점을 치료 전에 충분히 설명하는 것이 중요합니다. 경과 관찰 중 근관치료로 전환될 가능성이 있다는 것을 미리 이해하고 있으면, 실제로 전환이 필요한 상황에서도 환자가 당황하지 않고 원활하게 다음 치료로 넘어갈 수 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='pulp-capping';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>MTA 적용 부위에 따른 조작 난이도</h3>
<p>MTA는 점도가 있는 재료라 근관 깊은 곳이나 좁은 천공 부위에 정확히 적용하기 위해서는 전용 운반 기구와 숙련된 손기술이 필요합니다. 특히 습기가 많은 환경에서 정확한 위치에 원하는 두께로 채우는 작업은 세심한 주의를 요구하는 과정입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='mta';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>거타퍼차와 근관 형태 순응성</h3>
<p>온도가압법으로 연화된 거타퍼차는 근관의 미세한 굴곡과 부가 근관까지 흘러들어가 채울 수 있는 순응성을 가집니다. 이런 특성 덕분에 복잡한 근관 형태를 가진 치아에서도 비교적 치밀한 밀봉이 가능해져, 근관치료의 장기적인 성공률을 뒷받침하는 중요한 요소가 됩니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='gutta-percha';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치근단 절제술과 심미 부위 고려사항</h3>
<p>앞니처럼 잇몸 라인이 미소에 직접적으로 보이는 부위에서 치근단 절제술을 시행할 때는 절개와 봉합 기법이 잇몸 형태에 미치는 영향을 함께 고려해야 합니다. 최소 절개 기법을 활용하면 회복 후 잇몸 라인의 변화를 최소화해 심미적인 결과를 지킬 수 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='apicoectomy';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치조골과 전신 골다공증의 관계</h3>
<p>전신적인 골다공증이 있는 경우 치조골에도 영향을 줄 수 있어 임플란트나 발치 후 치유에 고려해야 할 요소가 됩니다. 골다공증 치료제 중 일부는 턱뼈의 치유에 영향을 줄 수 있어, 관련 약물을 복용 중이라면 치과 치료 전 반드시 담당 의료진과 정보를 공유하는 것이 안전합니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='alveolar-bone';
