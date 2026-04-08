-- 회원 테이블
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  birth_date TEXT,
  gender TEXT DEFAULT '',
  -- 동의 항목
  agree_privacy INTEGER DEFAULT 0,         -- 개인정보 수집·이용 동의 (필수)
  agree_terms INTEGER DEFAULT 0,           -- 이용약관 동의 (필수)
  agree_marketing INTEGER DEFAULT 0,       -- 마케팅 활용 동의 (선택)
  agree_marketing_sms INTEGER DEFAULT 0,   -- SMS 마케팅 (선택)
  agree_marketing_email INTEGER DEFAULT 0, -- 이메일 마케팅 (선택)
  agree_third_party INTEGER DEFAULT 0,     -- 제3자 제공 동의 (선택)
  -- 메타
  is_active INTEGER DEFAULT 1,
  last_login_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active, created_at DESC);

-- 블로그 본문 내 이미지 삽입 위치 (SEO 최적화)
-- blogs 테이블에 seo 관련 컬럼 추가
ALTER TABLE blogs ADD COLUMN meta_title TEXT;
ALTER TABLE blogs ADD COLUMN meta_description TEXT;
ALTER TABLE blogs ADD COLUMN slug TEXT;
ALTER TABLE blogs ADD COLUMN content_html TEXT;  -- 리치 콘텐츠 (HTML 저장)
