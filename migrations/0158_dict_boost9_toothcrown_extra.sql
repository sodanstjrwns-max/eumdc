UPDATE dict_terms SET full_desc = full_desc || '
<h3>치관 형태를 결정하는 유전적 요인</h3>
<p>치아의 크기, 교두의 개수와 위치, 전체적인 치관 윤곽은 유전적 영향을 크게 받아 가족 구성원 간에 비슷한 치아 형태가 나타나는 경우가 흔합니다. 이런 유전적 특성은 저작 효율이나 충치 취약 부위에도 간접적으로 영향을 줄 수 있어, 가족력을 참고해 예방적 관리 방향을 세우는 것도 도움이 될 수 있습니다.</p>', updated_at=CURRENT_TIMESTAMP WHERE slug='tooth-crown';
