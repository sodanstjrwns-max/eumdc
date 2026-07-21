-- 3차 증량 topup2: 3,000자 미달 잔여 11개 용어 최종 보강

UPDATE dict_terms SET full_desc = full_desc || '
<h3>실란트 시술 후 확인해야 할 것</h3>
<p>시술 직후에는 씹을 때 살짝 높은 느낌이 들 수 있는데, 대부분 며칠 내 자연스럽게 적응되며 불편이 지속되면 간단한 조정으로 해결됩니다. 이후 정기검진 때마다 실란트의 마모·탈락 여부를 확인하고 필요하면 보충합니다. 실란트를 했다고 양치를 소홀히 하면 치아 사이 충치는 막을 수 없으므로, 실란트·불소·칫솔질·치실의 4중 예방을 함께 유지하는 것이 핵심입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='sealant';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>입마름과 틀니 사용자</h3>
<p>침은 틀니가 잇몸에 밀착되도록 돕는 접착제 역할도 합니다. 구강 건조증이 있으면 틀니 유지력이 떨어지고 잇몸 쓸림·통증이 잦아지므로, 인공타액 사용과 함께 틀니 적합도 점검을 자주 받는 것이 좋습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='dry-mouth';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>진정 치료 비용 안내</h3>
<p>의식 하 진정은 비급여 항목으로 진정 방법(흡입·정맥)과 치료 시간에 따라 비용이 달라집니다. 상담 시 치료 계획과 함께 진정 비용을 투명하게 안내드리며, 여러 치료를 한 번에 진행하면 진정 횟수를 줄여 전체 부담을 낮출 수 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='conscious-sedation';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치석과 착색은 다릅니다</h3>
<p>커피·차·흡연으로 생기는 착색(스테인)은 색소가 표면에 물든 것이고, 치석은 세균막이 굳은 침착물입니다. 착색은 미관 문제에 가깝지만 치석은 잇몸병의 직접 원인입니다. 스케일링 시 두 가지가 함께 제거되며, 착색이 심하면 에어플로우 분사 세정을 병행하면 효과적입니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='calculus';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>잇몸 퇴축과 교정치료</h3>
<p>잇몸이 얇은 분이 교정으로 치아를 바깥쪽으로 이동시키면 퇴축이 생기거나 악화될 수 있습니다. 교정 전 잇몸 두께 평가가 필요한 이유이며, 위험 부위는 교정 전후 잇몸이식으로 보강하기도 합니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='gum-recession';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>구취 측정도 가능합니다</h3>
<p>본인 구취는 스스로 정확히 알기 어렵습니다. 손등을 핥아 말린 뒤 냄새를 맡거나 치실 사용 후 치실 냄새를 확인하는 자가 진단법이 있고, 필요 시 구취 측정기로 황화합물 농도를 객관적으로 확인할 수도 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='halitosis';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>금관과 MRI 검사</h3>
<p>금 합금은 비자성 재료라 MRI 촬영에 지장이 없고 제거할 필요도 없습니다. 다만 촬영 부위에 따라 영상에 약간의 인공음영이 생길 수 있어, 두경부 MRI 예정 시 보철물 존재를 의료진에게 알려주시면 됩니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='gold-crown';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>치주질환 위험도 자가 체크</h3>
<p>양치 시 잦은 출혈, 잇몸이 붓고 검붉은 색, 잇몸이 내려가 치아가 길어 보임, 치아 사이가 벌어짐, 씹을 때 힘이 없는 느낌, 지속되는 구취 중 두 가지 이상 해당하면 치주염이 진행 중일 수 있으니 검진을 받아보세요.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='periodontal-disease';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>이갈이와 수면무호흡의 관계</h3>
<p>수면 중 기도가 좁아지는 순간 이를 갈면서 턱을 앞으로 내미는 보상 반응이 나타난다는 연구들이 있습니다. 심한 코골이나 주간 졸림이 동반된 이갈이라면 수면검사를 함께 고려하는 것이 근본 관리에 도움이 됩니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='bruxism';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>턱 소리와 함께 귀 통증이 있다면</h3>
<p>턱관절은 귀 바로 앞에 있어 관절·근육 문제가 귀 통증, 먹먹함, 이명처럼 느껴지기도 합니다. 이비인후과 검사에서 이상이 없는 귀 증상이라면 턱관절 평가를 받아보시는 것이 원인 규명에 도움이 됩니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='tmj-clicking';

UPDATE dict_terms SET full_desc = full_desc || '
<h3>매복치 발치 후 관리 포인트</h3>
<p>깊은 매복치 발치 후에는 부기가 2~3일째 최고조에 달했다가 가라앉습니다. 냉찜질은 첫 48시간, 이후에는 온찜질이 회복에 도움이 되며, 처방 항생제는 끝까지 복용하세요. 입이 잘 안 벌어지는 증상(개구 제한)은 1~2주 내 서서히 회복됩니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='impacted-tooth';
