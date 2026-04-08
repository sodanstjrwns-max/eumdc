-- =============================================
-- 스키마 점검 개선 마이그레이션
-- 2026-04-08
-- =============================================

-- ───────────────────────────────────────────
-- 1. blogs: slug에 UNIQUE 인덱스 (SEO URL 충돌 방지)
-- ───────────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);

-- ───────────────────────────────────────────
-- 2. blogs: author_name 추가 (SEO 블로그 글 작성자)
-- ───────────────────────────────────────────
ALTER TABLE blogs ADD COLUMN author_name TEXT DEFAULT '이음치과';

-- ───────────────────────────────────────────
-- 3. blog_images: alt_text 추가 (SEO 접근성)
-- ───────────────────────────────────────────
ALTER TABLE blog_images ADD COLUMN alt_text TEXT DEFAULT '';

-- ───────────────────────────────────────────
-- 4. cases: category 인덱스 (카테고리별 필터링 최적화)
-- ───────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_cases_category ON cases(category, is_published, created_at DESC);

-- ───────────────────────────────────────────
-- 5. cases: patient_consent 필드 (환자 동의 추적)
--    비포애프터 게시 시 환자 촬영·게시 동의 여부
-- ───────────────────────────────────────────
ALTER TABLE cases ADD COLUMN patient_consent INTEGER DEFAULT 0;
ALTER TABLE cases ADD COLUMN patient_initials TEXT DEFAULT '';
ALTER TABLE cases ADD COLUMN treatment_date TEXT;

-- ───────────────────────────────────────────
-- 6. cases: tags 필드 (다중 태그 필터링)
--    JSON 배열 형태로 저장 예: '["임플란트","뼈이식","상악"]'
-- ───────────────────────────────────────────
ALTER TABLE cases ADD COLUMN tags TEXT DEFAULT '[]';

-- ───────────────────────────────────────────
-- 7. notices: content_html 추가 (리치 콘텐츠 지원)
-- ───────────────────────────────────────────
ALTER TABLE notices ADD COLUMN content_html TEXT;

-- ───────────────────────────────────────────
-- 8. users: role 필드 (관리자/일반 사용자 구분)
--    'user' = 일반, 'admin' = 관리자, 'staff' = 스태프
-- ───────────────────────────────────────────
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';

-- ───────────────────────────────────────────
-- 9. users: 마케팅 동의일시 추적
--    동의 시점을 기록해야 법적 근거 확보 가능
-- ───────────────────────────────────────────
ALTER TABLE users ADD COLUMN marketing_agreed_at DATETIME;

-- ───────────────────────────────────────────
-- 10. users: 유입 경로 추적 (마케팅 분석)
-- ───────────────────────────────────────────
ALTER TABLE users ADD COLUMN referral_source TEXT DEFAULT '';

-- ───────────────────────────────────────────
-- 11. faq_categories: description 추가
-- ───────────────────────────────────────────
ALTER TABLE faq_categories ADD COLUMN description TEXT DEFAULT '';

-- ───────────────────────────────────────────
-- 12. 중복 인덱스 정리
--     users.phone은 이미 UNIQUE 제약조건이 있으므로
--     idx_users_phone 인덱스는 불필요 (SQLite가 자동 생성)
-- ───────────────────────────────────────────
DROP INDEX IF EXISTS idx_users_phone;

-- ───────────────────────────────────────────
-- 13. 조회수 로그 테이블 (중복 조회 방지 + 분석용)
--     IP/fingerprint 기반 일일 1회 카운트
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS view_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT NOT NULL,     -- 'case', 'blog', 'notice', 'faq'
  content_id INTEGER NOT NULL,
  visitor_hash TEXT NOT NULL,     -- IP+UA 해시 (개인정보 비식별)
  viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_view_logs_content ON view_logs(content_type, content_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_view_logs_dedup ON view_logs(content_type, content_id, visitor_hash, viewed_at);

-- ───────────────────────────────────────────
-- 14. 예약 문의 테이블 (리드 수집)
--     웹사이트에서 간편 예약 문의 접수
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  treatment_type TEXT DEFAULT '',   -- 'implant', 'aesthetic', 'resin', 'tmj', 'general', 'pediatric'
  preferred_date TEXT,              -- 희망 날짜 (YYYY-MM-DD)
  preferred_time TEXT,              -- 희망 시간대 ('morning', 'afternoon', 'evening')
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',    -- 'pending', 'confirmed', 'completed', 'cancelled'
  user_id INTEGER,                  -- 회원인 경우 연결
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reservations_phone ON reservations(phone);

-- ───────────────────────────────────────────
-- 15. 팝업/배너 테이블 (프로모션 관리)
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS popups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content_html TEXT,
  image_url TEXT,
  link_url TEXT,
  popup_type TEXT DEFAULT 'modal',  -- 'modal', 'banner', 'slide'
  position TEXT DEFAULT 'center',   -- 'center', 'top', 'bottom'
  start_date DATETIME,
  end_date DATETIME,
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_popups_active ON popups(is_active, start_date, end_date);
