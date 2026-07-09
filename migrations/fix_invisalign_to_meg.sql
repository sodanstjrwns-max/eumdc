-- 인비절라인/Invisalign → MEG Aligner 투명교정 (메가젠 제품 사용, 상표/허위표시 리스크 제거)
-- slug='invisalign'은 SEO 자산 보존을 위해 유지
UPDATE treatments
SET
  name = 'MEG Aligner 투명교정',
  name_en = 'MEG Aligner',
  short_desc = '메가젠 디지털 통합 투명교정 — 눈에 안 띄게, 일상 그대로, 명지동에서 진료',
  hero_title = 'MEG Aligner 투명교정',
  hero_subtitle = '눈에 띄지 않는 투명교정으로 자연스럽게',
  overview = 'MEG Aligner는 국내 대표 임플란트·디지털 덴탈 기업 메가젠(MegaGen)이 개발한 디지털 통합 투명교정 시스템입니다. 이음치과의원은 디지털 스캔으로 시작해 단계별 투명 장치를 통해 점진적으로 치아를 이동시키는 방식으로 진료하며, 부산 강서구 명지동에서 투명교정을 담당합니다. 장치를 뺐다 낄 수 있어 일상생활·식사·구강위생 관리가 자유롭습니다.',
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'invisalign';

-- seo_regions 지역 콘텐츠(HTML) 내 '인비절라인' → '투명교정' 일괄 치환 (24개 행)
UPDATE seo_regions
SET content = REPLACE(content, '인비절라인', '투명교정'),
    updated_at = CURRENT_TIMESTAMP
WHERE content LIKE '%인비절라인%';
