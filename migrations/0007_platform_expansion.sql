-- =============================================
-- 플랫폼 대규모 확장 마이그레이션
-- 의료진, 진료과목, 진료FAQ, 지역, 비포애프터 확장
-- 2026-04-13
-- =============================================

-- ─── 1. 의료진 (doctors) ───
CREATE TABLE IF NOT EXISTS doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_en TEXT DEFAULT '',
  slug TEXT UNIQUE NOT NULL,
  title TEXT DEFAULT '원장',              -- 대표원장, 원장, 부원장
  position TEXT DEFAULT '',               -- 보직명
  photo TEXT DEFAULT '',                  -- R2 프로필사진 URL
  photo_full TEXT DEFAULT '',             -- 전신/진료 사진
  greeting TEXT DEFAULT '',               -- 인사말
  philosophy TEXT DEFAULT '',             -- 진료 철학
  education TEXT DEFAULT '[]',            -- JSON: [{year,school,degree}]
  career TEXT DEFAULT '[]',               -- JSON: [{year,org,role}]
  certifications TEXT DEFAULT '[]',       -- JSON: [{name,org,year}]
  memberships TEXT DEFAULT '[]',          -- JSON: [{org,role}]
  specialties TEXT DEFAULT '[]',          -- JSON: ["임플란트","보철"]
  sort_order INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_doctors_slug ON doctors(slug);
CREATE INDEX IF NOT EXISTS idx_doctors_sort ON doctors(sort_order, is_published);

-- ─── 2. 진료과목 (treatments) ───
CREATE TABLE IF NOT EXISTS treatments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_en TEXT DEFAULT '',
  slug TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT '',
  category TEXT DEFAULT 'core',           -- core(핵심), standard(일반), sub(세부)
  short_desc TEXT DEFAULT '',             -- 한줄 소개
  hero_title TEXT DEFAULT '',             -- 히어로 타이틀
  hero_subtitle TEXT DEFAULT '',          -- 히어로 서브타이틀
  hero_image TEXT DEFAULT '',             -- 히어로 배경 이미지
  overview TEXT DEFAULT '',               -- 개요 (HTML)
  process_steps TEXT DEFAULT '[]',        -- JSON: [{step,title,desc,icon}]
  benefits TEXT DEFAULT '[]',             -- JSON: [{title,desc,icon}]
  warnings TEXT DEFAULT '',               -- 주의사항 (HTML)
  duration TEXT DEFAULT '',               -- 시술 소요시간
  recovery TEXT DEFAULT '',               -- 회복기간
  price_range TEXT DEFAULT '',            -- 가격대 안내
  insurance_info TEXT DEFAULT '',         -- 보험 적용 여부
  content_sections TEXT DEFAULT '[]',     -- JSON: [{title,body,image}] 상세섹션
  before_after_note TEXT DEFAULT '',      -- 비포애프터 관련 안내
  cta_text TEXT DEFAULT '',               -- CTA 문구
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  keywords TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  views INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_treatments_slug ON treatments(slug);
CREATE INDEX IF NOT EXISTS idx_treatments_cat ON treatments(category, sort_order);

-- ─── 3. 진료과목별 FAQ (treatment_faqs) ───
CREATE TABLE IF NOT EXISTS treatment_faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  treatment_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_tfaq_treatment ON treatment_faqs(treatment_id, sort_order);

-- ─── 4. 의료진-진료과목 연결 (doctor_treatments) ───
CREATE TABLE IF NOT EXISTS doctor_treatments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doctor_id INTEGER NOT NULL,
  treatment_id INTEGER NOT NULL,
  is_primary INTEGER DEFAULT 0,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_dt_unique ON doctor_treatments(doctor_id, treatment_id);

-- ─── 5. 지역 데이터 (regions) ───
CREATE TABLE IF NOT EXISTS regions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sido TEXT NOT NULL,           -- 시/도
  sigungu TEXT NOT NULL,        -- 시/군/구
  dong TEXT DEFAULT '',         -- 동/읍/면
  full_address TEXT NOT NULL,   -- 전체 주소
  sort_key TEXT DEFAULT ''      -- 검색용 정렬키
);
CREATE INDEX IF NOT EXISTS idx_regions_search ON regions(sido, sigungu, dong);
CREATE INDEX IF NOT EXISTS idx_regions_full ON regions(full_address);

-- ─── 6. 비포애프터 확장 필드 ───
ALTER TABLE cases ADD COLUMN patient_age_group TEXT DEFAULT '';
ALTER TABLE cases ADD COLUMN patient_gender TEXT DEFAULT '';
ALTER TABLE cases ADD COLUMN region_id INTEGER DEFAULT NULL;
ALTER TABLE cases ADD COLUMN region_text TEXT DEFAULT '';
ALTER TABLE cases ADD COLUMN doctor_id INTEGER DEFAULT NULL;
ALTER TABLE cases ADD COLUMN treatment_duration TEXT DEFAULT '';
ALTER TABLE cases ADD COLUMN treatment_id INTEGER DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_cases_doctor ON cases(doctor_id, is_published);
CREATE INDEX IF NOT EXISTS idx_cases_region ON cases(region_text, is_published);
CREATE INDEX IF NOT EXISTS idx_cases_treatment ON cases(treatment_id, is_published);

-- ─── 7. 공지사항 이미지 ───
ALTER TABLE notices ADD COLUMN thumbnail TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS notice_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  notice_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (notice_id) REFERENCES notices(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_notice_images ON notice_images(notice_id, sort_order);

-- ─── 8. 지역 SEO 페이지 ───
CREATE TABLE IF NOT EXISTS seo_regions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  region_name TEXT NOT NULL,       -- "안산시 단원구"
  h1_title TEXT NOT NULL,          -- "안산시 단원구 치과"
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  hero_text TEXT DEFAULT '',
  content TEXT DEFAULT '',          -- HTML 콘텐츠
  nearby_areas TEXT DEFAULT '[]',   -- JSON: ["초지동","고잔동"]
  target_treatments TEXT DEFAULT '[]', -- JSON: ["implant","aesthetic"]
  is_published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_seo_regions_slug ON seo_regions(slug);

-- ─── 9. 블로그 작성자 확장 (기존 author_name 외에 doctor_id 연결) ───
ALTER TABLE blogs ADD COLUMN doctor_id INTEGER DEFAULT NULL;

-- ─── 10. 수가 안내 테이블 ───
CREATE TABLE IF NOT EXISTS price_guide (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  treatment_id INTEGER,
  item_name TEXT NOT NULL,
  price_text TEXT DEFAULT '',       -- "50만원~" 형태
  insurance_covered INTEGER DEFAULT 0,
  note TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_price_guide ON price_guide(treatment_id, sort_order);
