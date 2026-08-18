/**
 * 🎯 SEO 슈퍼 매트릭스 데이터
 * 지역(15) × 진료(9) = 135개 롱테일 랜딩 페이지를 위한 데이터 사전
 * 모든 콘텐츠는 SSR로 즉시 렌더링되어 Google/Bing/AI 크롤러가 첫 요청에 색인
 */

export interface RegionInfo {
  slug: string
  name: string           // 명지동
  fullName: string       // 부산 강서구 명지동
  district: string       // 강서구
  city: string           // 부산
  searchVariants: string[] // 검색 변형 키워드 (LSI)
  nearbyAreas: string[]    // 인근 지역 (내부 링크용)
  distance: string         // 이음치과 기준 거리/소요시간 안내
}

export interface TreatmentInfo {
  slug: string
  name: string                    // 임플란트
  nameEn: string                  // Implant
  category: string
  shortBenefit: string            // 1줄 핵심가치
  searchVariants: string[]        // LSI 키워드
  faqs: Array<{ q: string; a: string }>
  processSteps: string[]
  duration: string                // 평균 치료 기간
  whyChoose: string[]             // 이음치과 차별점 (3가지)
  jsonLdServiceType: string       // schema.org Service type
  medicalCondition?: string       // 관련 MedicalCondition
}

// ═════════════════════════════════════════════
// 15개 지역 데이터
// ═════════════════════════════════════════════
export const SEO_REGIONS: RegionInfo[] = [
  {
    slug: 'myeongji',
    name: '명지동',
    fullName: '부산 강서구 명지동',
    district: '강서구',
    city: '부산',
    searchVariants: ['명지동', '명지국제신도시', '명지', '부산 명지', '강서구 명지'],
    nearbyAreas: ['myeongji-ocean', 'sinho', 'eco-delta'],
    distance: '이음치과 바로 그 동네 (도보 5분 이내)'
  },
  {
    slug: 'myeongji-ocean',
    name: '명지오션시티',
    fullName: '부산 강서구 명지오션시티',
    district: '강서구',
    city: '부산',
    searchVariants: ['명지오션시티', '명지오션', '오션시티', '명지 오션'],
    nearbyAreas: ['myeongji', 'sinho'],
    distance: '이음치과까지 차량 5분'
  },
  {
    slug: 'gangseo',
    name: '강서구',
    fullName: '부산 강서구',
    district: '강서구',
    city: '부산',
    searchVariants: ['강서구', '부산 강서구', '강서구 치과'],
    nearbyAreas: ['myeongji', 'noksan', 'daejeo'],
    distance: '강서구 중심 진료권'
  },
  {
    slug: 'noksan',
    name: '녹산동',
    fullName: '부산 강서구 녹산동',
    district: '강서구',
    city: '부산',
    searchVariants: ['녹산동', '녹산', '녹산공단'],
    nearbyAreas: ['myeongji', 'sinho'],
    distance: '이음치과까지 차량 10분'
  },
  {
    slug: 'sinho',
    name: '신호동',
    fullName: '부산 강서구 신호동',
    district: '강서구',
    city: '부산',
    searchVariants: ['신호동', '신호'],
    nearbyAreas: ['myeongji', 'noksan'],
    distance: '이음치과까지 차량 7분'
  },
  {
    slug: 'eco-delta',
    name: '에코델타시티',
    fullName: '부산 강서구 에코델타시티',
    district: '강서구',
    city: '부산',
    searchVariants: ['에코델타', '에코델타시티', '에코델타 신도시'],
    nearbyAreas: ['myeongji', 'daejeo'],
    distance: '이음치과까지 차량 8분'
  },
  {
    slug: 'daejeo',
    name: '대저동',
    fullName: '부산 강서구 대저동',
    district: '강서구',
    city: '부산',
    searchVariants: ['대저동', '대저'],
    nearbyAreas: ['eco-delta', 'gangseo'],
    distance: '이음치과까지 차량 12분'
  },
  {
    slug: 'jisa',
    name: '지사동',
    fullName: '부산 강서구 지사동',
    district: '강서구',
    city: '부산',
    searchVariants: ['지사동', '지사', '지사과학단지'],
    nearbyAreas: ['noksan', 'myeongji'],
    distance: '이음치과까지 차량 15분'
  },
  {
    slug: 'saha',
    name: '사하구',
    fullName: '부산 사하구',
    district: '사하구',
    city: '부산',
    searchVariants: ['사하구', '부산 사하구', '하단', '신평'],
    nearbyAreas: ['hadan', 'sasang'],
    distance: '이음치과까지 차량 15분'
  },
  {
    slug: 'hadan',
    name: '하단동',
    fullName: '부산 사하구 하단동',
    district: '사하구',
    city: '부산',
    searchVariants: ['하단동', '하단', '하단역'],
    nearbyAreas: ['saha', 'sasang'],
    distance: '이음치과까지 차량 12분'
  },
  {
    slug: 'sasang',
    name: '사상구',
    fullName: '부산 사상구',
    district: '사상구',
    city: '부산',
    searchVariants: ['사상구', '부산 사상구', '사상'],
    nearbyAreas: ['hadan', 'buk-gu'],
    distance: '이음치과까지 차량 20분'
  },
  {
    slug: 'buk-gu',
    name: '북구',
    fullName: '부산 북구',
    district: '북구',
    city: '부산',
    searchVariants: ['북구', '부산 북구'],
    nearbyAreas: ['sasang'],
    distance: '이음치과까지 차량 25분'
  },
  {
    slug: 'jangyu',
    name: '장유동',
    fullName: '경남 김해시 장유동',
    district: '김해시',
    city: '경남',
    searchVariants: ['장유동', '장유', '김해 장유'],
    nearbyAreas: ['gimhae', 'bongrim'],
    distance: '이음치과까지 차량 15분'
  },
  {
    slug: 'gimhae',
    name: '김해시',
    fullName: '경남 김해시',
    district: '김해시',
    city: '경남',
    searchVariants: ['김해시', '김해', '경남 김해'],
    nearbyAreas: ['jangyu', 'bongrim'],
    distance: '이음치과까지 차량 20분'
  },
  {
    slug: 'bongrim',
    name: '봉림동',
    fullName: '경남 김해시 봉림동',
    district: '김해시',
    city: '경남',
    searchVariants: ['봉림동', '봉림'],
    nearbyAreas: ['jangyu', 'gimhae'],
    distance: '이음치과까지 차량 18분'
  }
]

export const SEO_REGIONS_MAP: Record<string, RegionInfo> =
  Object.fromEntries(SEO_REGIONS.map(r => [r.slug, r]))

// ═════════════════════════════════════════════
// 9개 진료 데이터 (5대 핵심 + 4개 일반)
// ═════════════════════════════════════════════
export const SEO_TREATMENTS: TreatmentInfo[] = [
  {
    slug: 'implant',
    name: '임플란트',
    nameEn: 'Dental Implant',
    category: 'implant',
    shortBenefit: '평생 쓰는 내 치아처럼 — 디지털 가이드 임플란트',
    searchVariants: ['임플란트', '임플란트 비용', '임플란트 가격', '임플란트 잘하는곳', '임플란트 추천', '임플란트 전문', '임플란트 후기'],
    duration: '평균 3~6개월 (즉시 임플란트 시 단축 가능)',
    whyChoose: [
      '🦷 디지털 가이드 수술로 식립 정확도 ±0.1mm',
      '🏥 SLA·BLT 인증 정품 픽스처만 사용 (오스템·스트라우만)',
      '👨‍⚕️ 통합치의학 전문의 직접 진단·수술·보철'
    ],
    processSteps: [
      'CBCT·구강스캔 정밀 진단',
      '디지털 수술 가이드 제작',
      '픽스처(인공치근) 식립',
      '골유착(뼈와 붙는 과정) 대기 (2~3개월)',
      '보철물(크라운) 장착 및 교합(윗니 아랫니 맞물림)조정'
    ],
    faqs: [
      { q: '임플란트 비용은 얼마인가요?', a: '픽스처·보철 종류, 잇몸뼈 상태에 따라 다릅니다. CBCT 진단 후 정확한 비용을 안내드리며, 보험 적용(만 65세 이상 2개)도 가능합니다.' },
      { q: '임플란트 수술이 아픈가요?', a: '국소마취 후 진행하며 수술 자체는 통증이 거의 없습니다. 수술 후 1~2일 가벼운 부종이 있을 수 있으나 처방 약으로 충분히 조절됩니다.' },
      { q: '임플란트 수명은 얼마나 되나요?', a: '정기적인 관리(6개월마다 스케일링·체크업)를 받으시면 평균 15~20년 이상 사용 가능하며, 잘 관리하면 평생 사용도 가능합니다.' },
      { q: '당일 임플란트 가능한가요?', a: '발치즉시·즉시부하 임플란트는 골 상태가 양호한 경우 가능합니다. CBCT 진단으로 가능 여부를 확인합니다.' }
    ],
    jsonLdServiceType: 'MedicalProcedure',
    medicalCondition: '치아 상실(Tooth loss, ICD-10 K08)'
  },
  {
    slug: 'invisalign',
    name: 'MEG Aligner 투명교정',
    nameEn: 'MEG Aligner',
    category: 'orthodontics',
    shortBenefit: '메가젠 디지털 통합 투명교정 — 눈에 안 띄게, 일상 그대로',
    searchVariants: ['투명교정', 'MEG Aligner', '메가젠 투명교정', '투명교정 비용', '투명교정 가격', '투명교정 잘하는곳', '투명교정 추천', '투명 치아교정'],
    duration: '경증 6~12개월, 일반 12~24개월',
    whyChoose: [
      '✨ 메가젠 MEG Aligner — 디지털 통합 투명교정 솔루션',
      '📱 디지털 셋업으로 치료 전 시뮬레이션 확인',
      '🍱 탈착식으로 식사·양치·중요한 일정 자유'
    ],
    processSteps: [
      '디지털 구강 스캔 (3D)',
      '디지털 셋업 시뮬레이션 확인',
      '맞춤 MEG Aligner 장치 제작',
      '1~2주마다 다음 단계 장치 교체',
      '교정 종료 후 유지장치(리테이너)'
    ],
    faqs: [
      { q: '투명교정은 정말 눈에 안 보이나요?', a: '투명한 폴리우레탄 소재로 가까이서도 거의 보이지 않습니다. 직장·면접·결혼식 등 중요한 자리에서도 부담 없이 진행할 수 있습니다.' },
      { q: '투명교정 비용은 얼마인가요?', a: '치료 난이도와 장치 단계(stage) 수에 따라 다릅니다. 초진 진단 후 정확한 비용을 안내드리며 분할 결제도 가능합니다.' },
      { q: '투명교정 vs 일반 교정 차이는?', a: '투명교정은 탈착식·투명·디지털 시뮬레이션이 강점이고, 일반 브라켓은 복잡한 케이스에 강합니다. 라이프스타일·증례에 따라 맞춤 추천드립니다.' },
      { q: '하루 몇 시간 착용해야 하나요?', a: '최소 20~22시간 착용이 필요합니다. 식사·양치 외엔 항상 끼고 계셔야 효과가 보장됩니다.' }
    ],
    jsonLdServiceType: 'MedicalProcedure',
    medicalCondition: '부정교합(Malocclusion, ICD-10 K07)'
  },
  {
    slug: 'laminate',
    name: '라미네이트',
    nameEn: 'Laminate',
    category: 'aesthetic',
    shortBenefit: '결혼·면접 전 가장 많이 찾는 심미 끝판왕',
    searchVariants: ['라미네이트', '라미네이트 비용', '라미네이트 가격', '라미네이트 잘하는곳', '심미보철', '치아성형', '앞니라미네이트'],
    duration: '진단부터 부착까지 약 2~3주',
    whyChoose: [
      '🎨 디지털 가이드 설계로 자연스러운 형태·색상',
      '💎 EMAX·지르코니아 등 정품 도재 사용',
      '🔬 미세 삭제로 치아 손상 최소화'
    ],
    processSteps: [
      '디자인 상담 + 색상·형태 시뮬레이션',
      '치아 미세 삭제 (최소 0.3~0.5mm)',
      '본뜨기 + 임시 라미네이트 부착',
      '세라믹 라미네이트 제작 (기공소)',
      '시적·교합(윗니 아랫니 맞물림)조정 후 영구 부착'
    ],
    faqs: [
      { q: '라미네이트는 치아를 많이 깎나요?', a: '평균 0.3~0.5mm 정도만 삭제합니다. 손톱 두께의 절반 수준이며, 신경까지 닿지 않아 통증이 거의 없습니다.' },
      { q: '라미네이트 비용은 얼마인가요?', a: '도재 종류(EMAX/지르코니아), 개수에 따라 다릅니다. 앞니 6~8개 기준으로 안내드리며 무이자 분납도 가능합니다.' },
      { q: '라미네이트 수명은 얼마나 되나요?', a: '평균 10~15년 이상 사용 가능합니다. 정기 검진과 야간 마우스가드 사용으로 수명을 연장할 수 있습니다.' },
      { q: '라미네이트 후 자연스러운가요?', a: '디지털 색상 매칭과 형태 디자인으로 본인 치아처럼 자연스럽게 마무리됩니다. 가까이서 봐도 티가 거의 안 납니다.' }
    ],
    jsonLdServiceType: 'MedicalProcedure',
    medicalCondition: '치아 변색·심미 부조화(Tooth discoloration, ICD-10 K03)'
  },
  {
    slug: 'orthodontics',
    name: '치아교정',
    nameEn: 'Orthodontics',
    category: 'orthodontics',
    shortBenefit: '투명교정(MEG Aligner)·설측·클리피씨 통합 교정 진단',
    searchVariants: ['치아교정', '교정', '치아교정 비용', '교정 잘하는곳', '교정 추천', '성인교정', '부분교정', '돌출입 교정', '덧니 교정'],
    duration: '평균 18~30개월 (난이도별 차이)',
    whyChoose: [
      '🔀 투명교정(MEG Aligner)·설측·클리피씨·메탈 — 라이프스타일별 통합 진단',
      '📊 디지털 셋업으로 치료 완료 모습 미리 시뮬레이션',
      '🦷 부분교정·전체교정 모두 가능 — 케이스별 맞춤'
    ],
    processSteps: [
      'CBCT·세팔로·구강스캔 정밀 진단',
      '디지털 셋업으로 치료 시뮬레이션',
      '장치 부착 (MEG Aligner 투명교정/브라켓 등)',
      '월 1회 조정',
      '교정 종료 후 유지장치(리테이너)'
    ],
    faqs: [
      { q: '성인도 교정 가능한가요?', a: '네, 가능합니다. 50대 이상도 잇몸뼈 상태가 양호하면 교정 가능합니다. 투명교정(MEG Aligner)은 성인에게 특히 인기가 많습니다.' },
      { q: '교정 비용은 얼마인가요?', a: '장치 종류(투명교정 MEG Aligner/설측/클리피씨/메탈)와 난이도에 따라 다릅니다. 초진 진단 후 정확한 비용을 안내드립니다.' },
      { q: '돌출입·덧니도 교정으로 개선되나요?', a: '대부분 가능합니다. 정도가 심한 경우 발치 교정 또는 양악수술 병행 진단이 필요할 수 있습니다.' },
      { q: '부분교정도 가능한가요?', a: '앞니만 가지런하게 원하시는 경우 부분교정(6~12개월)이 가능합니다. 진단 후 적합 여부를 판단합니다.' }
    ],
    jsonLdServiceType: 'MedicalProcedure',
    medicalCondition: '부정교합(Malocclusion, ICD-10 K07)'
  },
  {
    slug: 'aesthetic',
    name: '심미보철',
    nameEn: 'Aesthetic Prosthodontics',
    category: 'aesthetic',
    shortBenefit: '라미네이트·올세라믹 통합 심미 치료',
    searchVariants: ['심미보철', '심미치료', '앞니보철', '올세라믹', '치아성형'],
    duration: '진단부터 완성까지 2~4주',
    whyChoose: [
      '🎨 라미네이트·올세라믹·인레이 통합 진단',
      '💎 정품 도재(EMAX/지르코니아) 사용',
      '🔬 정밀 디자인으로 자연스러운 마무리'
    ],
    processSteps: [
      '심미 상담 + 디지털 시뮬레이션',
      '치아 형성 및 본뜨기',
      '임시 보철 부착',
      '최종 보철 제작 및 시적',
      '교합(윗니 아랫니 맞물림)조정 + 영구 접착'
    ],
    faqs: [
      { q: '심미보철 vs 라미네이트 차이는?', a: '라미네이트는 앞면만, 올세라믹은 치아 전체를 덮는 보철입니다. 치아 상태에 따라 적합한 방식을 진단합니다.' },
      { q: '심미보철 비용은요?', a: '도재 종류와 개수에 따라 다릅니다. 정확한 비용은 진단 후 안내드립니다.' }
    ],
    jsonLdServiceType: 'MedicalProcedure',
    medicalCondition: '치아 변색·심미 부조화'
  },
  {
    slug: 'general',
    name: '충치치료',
    nameEn: 'Cavity Treatment',
    category: 'general',
    shortBenefit: '미세 충치부터 신경치료까지 — 자연치 최대 보존',
    searchVariants: ['충치치료', '충치', '레진치료', '신경치료', '인레이', '온레이', '엔도'],
    duration: '단순 충치 1회, 신경치료 2~4회',
    whyChoose: [
      '🔬 현미경 진료로 미세 충치도 정확히 제거',
      '🦷 신경치료 시 자연치 보존 최우선',
      '🎨 심미 레진·세라믹 인레이로 자연스럽게'
    ],
    processSteps: [
      '진단 (X-ray·구강검진)',
      '충치 부위 제거',
      '레진/인레이/온레이 충전',
      '교합(윗니 아랫니 맞물림)조정 및 폴리싱'
    ],
    faqs: [
      { q: '충치치료가 아픈가요?', a: '대부분 국소마취 후 진행해 통증이 거의 없습니다. 신경치료가 필요한 경우에도 마취 하에 편안하게 진행합니다.' },
      { q: '인레이와 레진 차이는?', a: '레진은 1회 충전, 인레이는 본뜨기 후 만들어 부착하는 방식입니다. 충치 범위에 따라 적합한 방법을 선택합니다.' }
    ],
    jsonLdServiceType: 'MedicalProcedure',
    medicalCondition: '치아우식증(Dental caries, ICD-10 K02)'
  },
  {
    slug: 'periodontal',
    name: '잇몸치료',
    nameEn: 'Periodontal Treatment',
    category: 'general',
    shortBenefit: '잇몸 출혈·붓기·구취 — 근본 원인부터 치료',
    searchVariants: ['잇몸치료', '치주치료', '풍치', '잇몸염', '치은염', '치주염', '잇몸수술'],
    duration: '비외과 4~6회, 외과 1~2회',
    whyChoose: [
      '🦷 비외과·외과 단계별 치료 계획',
      '🔬 치주균 검사 기반 정밀 치료',
      '⚕️ 통합치의학 전문의 직접 진단'
    ],
    processSteps: [
      '치주 정밀 검진 (포켓 깊이 측정)',
      '잇몸 위·아래 스케일링',
      '치근활택술(루트플레이닝)',
      '필요시 잇몸 외과적 치료',
      '정기 유지관리'
    ],
    faqs: [
      { q: '잇몸이 자주 붓고 피가 나요. 풍치인가요?', a: '치은염(잇몸 염증) 또는 초기 치주염일 가능성이 높습니다. 방치하면 잇몸뼈 손실로 이어질 수 있으니 검진을 권장합니다.' },
      { q: '잇몸치료 보험 적용되나요?', a: '스케일링은 연 1회 건강보험 적용됩니다. 치주치료도 일부 항목 보험 적용 가능합니다.' }
    ],
    jsonLdServiceType: 'MedicalProcedure',
    medicalCondition: '치주염(Periodontitis, ICD-10 K05)'
  },
  {
    slug: 'wisdom-tooth',
    name: '사랑니 발치',
    nameEn: 'Wisdom Tooth Extraction',
    category: 'surgical',
    shortBenefit: '매복·맹출 사랑니 정밀 발치 — 통증·부종 최소화',
    searchVariants: ['사랑니', '사랑니 발치', '사랑니 뽑기', '매복사랑니', '사랑니 비용'],
    duration: '발치 30분~1시간, 회복 3~7일',
    whyChoose: [
      '📷 CBCT로 신경관 위치 정밀 확인',
      '⏱️ 매복 사랑니도 최소침습 발치',
      '💊 통증·부종 관리 프로토콜'
    ],
    processSteps: [
      'CBCT·X-ray로 신경관·위치 확인',
      '국소마취',
      '발치 (매복 시 분할 발치)',
      '봉합 및 거즈 압박',
      '7일 후 봉합사 제거'
    ],
    faqs: [
      { q: '사랑니 꼭 뽑아야 하나요?', a: '바르게 맹출되어 기능하면 뽑지 않아도 됩니다. 매복·통증·인접치 손상 우려 시 발치를 권장합니다.' },
      { q: '사랑니 발치 후 부어요?', a: '3일째 부종이 가장 심하고 7일이면 거의 가라앉습니다. 발치 후 24시간은 얼음찜질, 이후 온찜질이 효과적입니다.' }
    ],
    jsonLdServiceType: 'MedicalProcedure',
    medicalCondition: '제3대구치 매복(Impacted third molar, ICD-10 K01.1)'
  }
]

export const SEO_TREATMENTS_MAP: Record<string, TreatmentInfo> =
  Object.fromEntries(SEO_TREATMENTS.map(t => [t.slug, t]))

// 5대 핵심 진료 (메인 키워드)
export const PRIORITY_TREATMENT_SLUGS = ['implant', 'invisalign', 'laminate', 'orthodontics']

// 핵심 지역 (가장 가까운 진료권)
export const PRIORITY_REGION_SLUGS = ['myeongji', 'myeongji-ocean', 'gangseo', 'noksan', 'sinho', 'eco-delta', 'jangyu']
