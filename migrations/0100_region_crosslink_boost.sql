-- ═══════════════════════════════════════════════════════════════════
-- 🔗 지역↔지역 Cross-Link Graph 강화
-- 목표: 20개 지역의 nearby_areas를 4 → 5+ 로 확장
-- 효과: 내부 링크 그래프 밀도 증가 → SEO 권위(authority) 분산
-- ═══════════════════════════════════════════════════════════════════

-- 김해시 권역 (5개 지역) — 명지(허브)·강서구 연결 추가
UPDATE seo_regions SET nearby_areas = '[{"name":"장유동","slug":"jangyu"},{"name":"김해시","slug":"gimhae"},{"name":"삼계동","slug":"samgye"},{"name":"진영읍","slug":"jinyeong"},{"name":"명지동","slug":"myeongji"}]' WHERE slug = 'bongrim';
UPDATE seo_regions SET nearby_areas = '[{"name":"장유동","slug":"jangyu"},{"name":"진영읍","slug":"jinyeong"},{"name":"삼계동","slug":"samgye"},{"name":"봉림동","slug":"bongrim"},{"name":"강서구","slug":"gangseo"}]' WHERE slug = 'gimhae';
UPDATE seo_regions SET nearby_areas = '[{"name":"김해시","slug":"gimhae"},{"name":"진영읍","slug":"jinyeong"},{"name":"삼계동","slug":"samgye"},{"name":"봉림동","slug":"bongrim"},{"name":"명지동","slug":"myeongji"}]' WHERE slug = 'jangyu';
UPDATE seo_regions SET nearby_areas = '[{"name":"김해시","slug":"gimhae"},{"name":"장유동","slug":"jangyu"},{"name":"삼계동","slug":"samgye"},{"name":"봉림동","slug":"bongrim"},{"name":"명지동","slug":"myeongji"}]' WHERE slug = 'jinyeong';
UPDATE seo_regions SET nearby_areas = '[{"name":"장유동","slug":"jangyu"},{"name":"김해시","slug":"gimhae"},{"name":"봉림동","slug":"bongrim"},{"name":"진영읍","slug":"jinyeong"},{"name":"강서구","slug":"gangseo"}]' WHERE slug = 'samgye';

-- 북구 권역 (5개 지역) — 사상구·강서구 인접 연결
UPDATE seo_regions SET nearby_areas = '[{"name":"화명동","slug":"hwamyeong"},{"name":"덕천동","slug":"deokcheon"},{"name":"금곡동","slug":"geumgok"},{"name":"사상구","slug":"sasang"},{"name":"구랑동","slug":"gurang"}]' WHERE slug = 'buk-gu';
UPDATE seo_regions SET nearby_areas = '[{"name":"북구","slug":"buk-gu"},{"name":"화명동","slug":"hwamyeong"},{"name":"금곡동","slug":"geumgok"},{"name":"구랑동","slug":"gurang"},{"name":"사상구","slug":"sasang"}]' WHERE slug = 'deokcheon';
UPDATE seo_regions SET nearby_areas = '[{"name":"덕천동","slug":"deokcheon"},{"name":"화명동","slug":"hwamyeong"},{"name":"북구","slug":"buk-gu"},{"name":"구랑동","slug":"gurang"},{"name":"사상구","slug":"sasang"}]' WHERE slug = 'geumgok';
UPDATE seo_regions SET nearby_areas = '[{"name":"덕천동","slug":"deokcheon"},{"name":"화명동","slug":"hwamyeong"},{"name":"금곡동","slug":"geumgok"},{"name":"북구","slug":"buk-gu"},{"name":"사상구","slug":"sasang"}]' WHERE slug = 'gurang';
UPDATE seo_regions SET nearby_areas = '[{"name":"덕천동","slug":"deokcheon"},{"name":"금곡동","slug":"geumgok"},{"name":"구랑동","slug":"gurang"},{"name":"북구","slug":"buk-gu"},{"name":"사상구","slug":"sasang"}]' WHERE slug = 'hwamyeong';

-- 강서구 권역 (8개 미달 지역) — 명지 허브 + 사하구 낙동강 건너편 연결
UPDATE seo_regions SET nearby_areas = '[{"name":"강동동","slug":"gangdong"},{"name":"가락동","slug":"garak"},{"name":"에코델타시티","slug":"eco-delta"},{"name":"명지동","slug":"myeongji"},{"name":"강서구","slug":"gangseo"}]' WHERE slug = 'daejeo';
UPDATE seo_regions SET nearby_areas = '[{"name":"대저동","slug":"daejeo"},{"name":"에코델타시티","slug":"eco-delta"},{"name":"명지국제신도시","slug":"myeongji"},{"name":"강서구","slug":"gangseo"},{"name":"가락동","slug":"garak"}]' WHERE slug = 'gangdong';
UPDATE seo_regions SET nearby_areas = '[{"name":"강동동","slug":"gangdong"},{"name":"대저동","slug":"daejeo"},{"name":"지사동","slug":"jisa"},{"name":"강서구","slug":"gangseo"},{"name":"명지동","slug":"myeongji"}]' WHERE slug = 'garak';
UPDATE seo_regions SET nearby_areas = '[{"name":"녹산동","slug":"noksan"},{"name":"명지동","slug":"myeongji"},{"name":"신호동","slug":"sinho"},{"name":"구랑동","slug":"gurang"},{"name":"강서구","slug":"gangseo"}]' WHERE slug = 'jisa';
UPDATE seo_regions SET nearby_areas = '[{"name":"명지동","slug":"myeongji"},{"name":"신호동","slug":"sinho"},{"name":"에코델타시티","slug":"eco-delta"},{"name":"녹산동","slug":"noksan"},{"name":"강서구","slug":"gangseo"}]' WHERE slug = 'myeongji-ocean';
UPDATE seo_regions SET nearby_areas = '[{"name":"명지동","slug":"myeongji"},{"name":"명지오션시티","slug":"myeongji-ocean"},{"name":"녹산동","slug":"noksan"},{"name":"가락동","slug":"garak"},{"name":"강서구","slug":"gangseo"}]' WHERE slug = 'sinho';

-- 사상구 권역 (3개 지역) — 북구·사하구 양방향 연결
UPDATE seo_regions SET nearby_areas = '[{"name":"사상구","slug":"sasang"},{"name":"주례동","slug":"jurye"},{"name":"학장동","slug":"gangdong"},{"name":"감만동","slug":"garak"},{"name":"북구","slug":"buk-gu"}]' WHERE slug = 'gamjeon';
UPDATE seo_regions SET nearby_areas = '[{"name":"사상구","slug":"sasang"},{"name":"감전동","slug":"gamjeon"},{"name":"학장동","slug":"gangdong"},{"name":"감만동","slug":"garak"},{"name":"하단동","slug":"hadan"}]' WHERE slug = 'jurye';
UPDATE seo_regions SET nearby_areas = '[{"name":"감전동","slug":"gamjeon"},{"name":"주례동","slug":"jurye"},{"name":"하단동","slug":"hadan"},{"name":"북구","slug":"buk-gu"},{"name":"강서구","slug":"gangseo"}]' WHERE slug = 'sasang';

-- 사하구 권역 (1개 지역) — 명지 허브 연결
UPDATE seo_regions SET nearby_areas = '[{"name":"하단동","slug":"hadan"},{"name":"사하구","slug":"saha"},{"name":"다대동","slug":"dadeok"},{"name":"괴정동","slug":"goejeong"},{"name":"명지동","slug":"myeongji"}]' WHERE slug = 'sinpyeong';
