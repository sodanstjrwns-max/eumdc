-- 로그인/예약 API 브루트포스·스팸 방어용 rate limit 테이블
-- (코드에서 CREATE TABLE IF NOT EXISTS로도 자동 생성되지만, 마이그레이션으로 명시)
CREATE TABLE IF NOT EXISTS login_attempts (
  ip TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_start INTEGER NOT NULL
);
