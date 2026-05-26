/**
 * 🎯 SEO 가격/비용 매트릭스 데이터
 * "지역 + 진료 + 가격" = 구매의도 100% 황금 키워드
 * 
 * ⚠️ 의료법 준수: 정확한 금액 표기 금지 → 범위/구성요소/예상 가격대 안내
 * (광고심의 통과 가능한 표현으로 작성)
 */

export interface CostInfo {
  treatmentSlug: string
  priceRange: string                // "약 100~250만원" 형태
  unit: string                      // "1개당", "1악당"
  factors: Array<{                  // 가격 결정 요인 3-5개
    factor: string
    explanation: string
  }>
  insuranceCovered: boolean         // 보험 적용 여부
  insuranceNote: string             // 보험 안내
  installmentAvailable: boolean     // 분할납부 가능
  installmentNote: string
  consultationFee: string           // 상담료
  beforeAfterTip: string            // 비용 절감 팁
  longTailKeywords: string[]        // 추가 롱테일 키워드
}

export const SEO_COSTS: CostInfo[] = [
  {
    treatmentSlug: 'implant',
    priceRange: '제조사·재료·시술 난이도에 따라 폭이 큼 (상담 시 안내)',
    unit: '1개당',
    factors: [
      { factor: '임플란트 픽스처 제조사', explanation: '오스템·스트라우만·노벨 등 제조사·국가별로 가격대가 다릅니다.' },
      { factor: '뼈이식·상악동거상술 여부', explanation: '잇몸뼈 부족 시 추가 시술이 동반되어 비용이 늘어납니다.' },
      { factor: '크라운 재료', explanation: '지르코니아·PFM·골드 등 보철 재료에 따라 차이가 있습니다.' },
      { factor: '디지털 가이드·네비게이션 사용 여부', explanation: '정밀 가이드 사용 시 약간의 추가 비용이 있을 수 있습니다.' },
      { factor: '진정·수면치료', explanation: '수면 임플란트의 경우 추가 마취관리 비용이 발생합니다.' }
    ],
    insuranceCovered: true,
    insuranceNote: '만 65세 이상은 평생 2개까지 건강보험 적용됩니다(본인부담 30%). 그 외 보험은 비급여입니다.',
    installmentAvailable: true,
    installmentNote: '국민·신한·삼성카드 무이자 3~12개월 분납 가능, 50만 원 미만은 단할부 제한이 있을 수 있습니다.',
    consultationFee: '초진 상담료 — CBCT·정밀진단 패키지에 포함 (별도 결제 없음)',
    beforeAfterTip: '치아우식·잇몸염 등을 먼저 치료하면 임플란트 식립 후 합병증 위험을 크게 줄일 수 있어 장기적으로 비용 절감 효과가 큽니다.',
    longTailKeywords: ['임플란트 가격', '임플란트 비용', '임플란트 얼마', '임플란트 가격대', '뼈이식 임플란트 비용', '디지털 임플란트 가격', '수면 임플란트 비용', '오스템 임플란트 가격']
  },
  {
    treatmentSlug: 'invisalign',
    priceRange: '치료 난이도·단계(stage) 수에 따라 다름 (정밀진단 후 안내)',
    unit: '1악당 (위 또는 아래)',
    factors: [
      { factor: '치료 단계 수 (스테이지)', explanation: '간단한 부분교정부터 전체교정까지 단계 수에 따라 비용이 결정됩니다.' },
      { factor: '인비절라인 라인 선택', explanation: 'Lite·Moderate·Comprehensive·Teen 등 라인별로 가격대가 다릅니다.' },
      { factor: '진단 영상·시뮬레이션 비용', explanation: 'iTero 스캔·ClinCheck 셋업이 포함됩니다.' },
      { factor: '유지장치(리테이너)', explanation: '치료 종료 후 영구적인 안정성을 위한 리테이너가 필요합니다.' }
    ],
    insuranceCovered: false,
    insuranceNote: '비급여 진료 항목입니다. (실손보험 약관에 따라 일부 환급 가능성이 있어 가입 보험사 문의를 권장)',
    installmentAvailable: true,
    installmentNote: '6·12·24개월 무이자/유이자 분납 가능 — 카드사 행사에 따라 조건 변동',
    consultationFee: '정밀 진단료 — 진단 결과 패키지에 포함',
    beforeAfterTip: '디지털 셋업 시뮬레이션을 미리 확인하면 치료 종료 시점·결과를 사전 예측할 수 있어 후회 없는 결정이 가능합니다.',
    longTailKeywords: ['인비절라인 가격', '인비절라인 비용', '투명교정 가격', '인비절라인 얼마', '인비절라인 분납', '인비절라인 분할결제']
  },
  {
    treatmentSlug: 'laminate',
    priceRange: '도재 종류(EMAX/지르코니아)·개수에 따라 다름 (상담 후 정확 안내)',
    unit: '1개당',
    factors: [
      { factor: '도재 종류', explanation: 'EMAX(이맥스)·지르코니아·E.max Press 등 재료별 차이가 있습니다.' },
      { factor: '디자인 복잡도', explanation: '색상·형태·투명도 매칭 난이도에 따라 다릅니다.' },
      { factor: '시뮬레이션·왁스업', explanation: '디지털 디자인 시뮬레이션 포함 여부에 따라 가격이 달라집니다.' },
      { factor: '개수', explanation: '앞니 6~8개 패키지로 진행하는 경우가 많습니다.' }
    ],
    insuranceCovered: false,
    insuranceNote: '심미 목적 비급여 진료입니다.',
    installmentAvailable: true,
    installmentNote: '3·6·12개월 무이자 분납 — 50만 원 이상 시 무이자 적용',
    consultationFee: '심미 상담료 무료 (디지털 시뮬레이션 포함)',
    beforeAfterTip: '치아 미백을 먼저 진행해 자연치 톤을 결정한 뒤 라미네이트 색상을 매칭하면 더 자연스럽고 만족도가 높습니다.',
    longTailKeywords: ['라미네이트 가격', '라미네이트 비용', '라미네이트 얼마', '앞니 라미네이트 가격', '이맥스 라미네이트 가격', '지르코니아 라미네이트 비용']
  },
  {
    treatmentSlug: 'glownate',
    priceRange: '라미네이트보다 보존적 시술 — 합리적 가격대 (상담 시 안내)',
    unit: '1개당',
    factors: [
      { factor: '도재·디자인', explanation: '컴퓨터 색상 매칭 정밀도에 따라 차이가 있습니다.' },
      { factor: '개수', explanation: '단일~6개 이상 패키지별 가격대가 다릅니다.' },
      { factor: '치아 표면 상태', explanation: '기존 충치·변색 정도에 따라 사전 처치가 필요할 수 있습니다.' }
    ],
    insuranceCovered: false,
    insuranceNote: '심미 목적 비급여 진료입니다.',
    installmentAvailable: true,
    installmentNote: '3·6개월 무이자 분납 가능',
    consultationFee: '심미 상담 무료',
    beforeAfterTip: '글로우네이트는 라미네이트 대비 치아 삭제가 거의 없어 향후 다른 치료로 전환할 때도 유리합니다.',
    longTailKeywords: ['글로우네이트 가격', '글로우네이트 비용', '당일 심미치료 가격', '미니라미네이트 비용']
  },
  {
    treatmentSlug: 'orthodontics',
    priceRange: '교정 방식·기간에 따라 폭이 큼 (정밀진단 후 안내)',
    unit: '1악당 (위 또는 아래)',
    factors: [
      { factor: '교정 방식', explanation: '메탈·세라믹·설측(혀쪽)·인비절라인 순으로 가격대가 올라갑니다.' },
      { factor: '치료 기간', explanation: '평균 18~30개월. 케이스 난이도에 따라 변동됩니다.' },
      { factor: '진단 영상', explanation: 'CBCT·세팔로 분석·구강스캔이 포함됩니다.' },
      { factor: '유지장치', explanation: '리테이너 종류(고정·가철식)에 따라 약간의 추가비가 있을 수 있습니다.' }
    ],
    insuranceCovered: false,
    insuranceNote: '심미·기능 개선 목적은 비급여입니다. 단, 구순구개열 등 일부 진단명은 보험 적용 가능합니다.',
    installmentAvailable: true,
    installmentNote: '6·12·24·36개월 분납 가능, 카드사별 무이자 행사 활용 가능',
    consultationFee: '교정 진단료 — 진단 패키지에 포함',
    beforeAfterTip: '교정 전 충치·잇몸 치료를 먼저 마치면 치료 중 응급 상황을 줄이고 전체 비용 효율이 좋아집니다.',
    longTailKeywords: ['치아교정 가격', '치아교정 비용', '교정 얼마', '성인교정 가격', '부분교정 비용', '설측교정 가격', '돌출입 교정 비용']
  },
  {
    treatmentSlug: 'aesthetic',
    priceRange: '시술 종류(미백/크라운/베니어)별로 광범위 (상담 시 안내)',
    unit: '시술별',
    factors: [
      { factor: '시술 종류', explanation: '치아미백·올세라믹·심미충전·잇몸성형 등 시술별로 가격대가 다릅니다.' },
      { factor: '도재·재료', explanation: '재료 등급에 따라 차이가 있습니다.' },
      { factor: '시뮬레이션 비용', explanation: '디지털 디자인 포함 여부에 따라 다릅니다.' }
    ],
    insuranceCovered: false,
    insuranceNote: '심미 목적 비급여 진료입니다.',
    installmentAvailable: true,
    installmentNote: '카드사별 무이자 행사에 따라 3~12개월 분납 가능',
    consultationFee: '심미 상담 무료',
    beforeAfterTip: '치아 색·형태·잇몸라인을 종합적으로 디자인하면 부분 시술 대비 만족도가 높습니다.',
    longTailKeywords: ['심미보철 가격', '치아미백 비용', '올세라믹 가격', '심미치료 비용']
  },
  {
    treatmentSlug: 'general',
    priceRange: '대부분 건강보험 적용 — 본인부담 30% 수준',
    unit: '시술별',
    factors: [
      { factor: '건강보험 적용 항목', explanation: '충치·신경치료·발치·스케일링 등은 건강보험 적용 항목입니다.' },
      { factor: '심평원 수가 기준', explanation: '국가 수가표에 따라 본인부담 30%가 청구됩니다.' },
      { factor: '비급여 항목', explanation: '레진·인레이·골드 등 일부 재료는 비급여입니다.' }
    ],
    insuranceCovered: true,
    insuranceNote: '대부분 건강보험 적용. 비급여 항목은 사전에 안내드립니다.',
    installmentAvailable: true,
    installmentNote: '소액은 즉시결제, 비급여 일부는 카드 분납 가능',
    consultationFee: '진찰료 — 건강보험 수가 기준 부담',
    beforeAfterTip: '6개월~1년 단위 정기 스케일링(연 1회 보험 적용)으로 큰 비용 발생을 예방할 수 있습니다.',
    longTailKeywords: ['충치치료 비용', '신경치료 가격', '스케일링 비용', '발치 비용', '레진 가격', '인레이 비용']
  },
  {
    treatmentSlug: 'periodontal',
    priceRange: '대부분 건강보험 적용 — 본인부담 30% 수준',
    unit: '시술별',
    factors: [
      { factor: '잇몸치료 단계', explanation: '치근활택술·치주소파술·잇몸수술 등 단계별로 다릅니다.' },
      { factor: '치아 개수', explanation: '치료 부위 개수에 따라 차이가 있습니다.' },
      { factor: '뼈이식 동반 여부', explanation: '잇몸뼈 재생술이 동반되면 일부 비급여 추가될 수 있습니다.' }
    ],
    insuranceCovered: true,
    insuranceNote: '잇몸치료는 대부분 건강보험 적용. 일부 뼈이식 재료는 비급여입니다.',
    installmentAvailable: true,
    installmentNote: '비급여 항목 발생 시 카드 분납 가능',
    consultationFee: '진찰료 — 건강보험 수가',
    beforeAfterTip: '잇몸병은 초기일수록 치료비가 적게 듭니다. 출혈·시림 증상이 보이면 빠른 진단이 비용 절감의 핵심입니다.',
    longTailKeywords: ['잇몸치료 비용', '치주치료 가격', '잇몸수술 비용', '잇몸뼈 재생 가격']
  },
  {
    treatmentSlug: 'wisdom-tooth',
    priceRange: '건강보험 적용 — 발치 난이도별로 본인부담 차이',
    unit: '1개당',
    factors: [
      { factor: '사랑니 위치', explanation: '잇몸 위로 나온 일반 발치와 매복 발치는 가격대가 다릅니다.' },
      { factor: '신경관 인접 여부', explanation: '하악신경관 근접 시 CBCT 정밀진단이 동반될 수 있습니다.' },
      { factor: '진정·수면 발치', explanation: '수면발치 시 마취관리 비용이 추가됩니다.' }
    ],
    insuranceCovered: true,
    insuranceNote: '발치는 건강보험 적용 (CBCT 일부 비급여 가능).',
    installmentAvailable: true,
    installmentNote: '소액 즉시결제 또는 카드 단할부',
    consultationFee: '진찰료 — 건강보험 수가',
    beforeAfterTip: '20대 초반에 미리 발치하면 회복 속도가 빨라 비용·시간 모두 절약됩니다. 매복 정도가 심해질수록 비용 부담도 커집니다.',
    longTailKeywords: ['사랑니 발치 비용', '매복 사랑니 가격', '사랑니 뽑는 비용', '수면 사랑니 발치 가격']
  }
]

export const SEO_COSTS_MAP: Record<string, CostInfo> =
  Object.fromEntries(SEO_COSTS.map(c => [c.treatmentSlug, c]))
