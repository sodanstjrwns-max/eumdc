-- 용어사전에 맞춤 FAQ 컬럼 추가 (JSON 배열: [{"q":"...","a":"..."}])
ALTER TABLE dict_terms ADD COLUMN faqs TEXT DEFAULT '';
