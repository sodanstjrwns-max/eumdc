# 이음치과의원 홈페이지

## Project Overview
- **Name**: 이음치과의원 (EUM Dental Clinic)
- **Goal**: 부산 명지 이음치과의원의 프리미엄 홈페이지
- **Design**: wearebrand.io 스타일 기반 - 미니멀, 프리미엄, 네이비/화이트/골드
- **Slogan**: 실력으로 신뢰를, 신뢰로 마음까지 잇습니다.

## Features (완료)
- Hero Section: 슬로건과 예약 CTA
- 병원 소개: 투명성, 실력, 신뢰 핵심 가치
- 원장 소개: 최효영 원장 학력/경력/수료 과정
- 진료 안내: 임플란트(대표), 심미보철, 심미레진, 턱관절, 일반진료
- 시설·장비: CBCT, 구강스캐너, 3D 프린터, 플라즈마 소독기 등
- 진료시간: 월-목 12:00-21:00, 토-일 10:00-17:00, 금 정기휴무
- 오시는 길: 주소, 자차/대중교통 안내
- 반응형 디자인: 데스크톱, 태블릿, 모바일 완전 대응
- 스크롤 애니메이션, 프리로더, 플로팅 전화 버튼

## URLs
- **Dev**: http://localhost:3000
- **Phone**: 051-206-5888
- **Email**: hyogunim@gmail.com

## URI Paths
| Path | Description |
|------|-------------|
| `/` | 메인 홈페이지 (원페이지) |
| `/#about` | 병원 소개 |
| `/#director` | 의료진 소개 |
| `/#services` | 진료 안내 |
| `/#equipment` | 시설·장비 |
| `/#hours` | 진료시간 |
| `/#location` | 오시는 길 |
| `/static/style.css` | 스타일시트 |
| `/static/app.js` | JavaScript |
| `/static/favicon.svg` | 파비콘 |

## Tech Stack
- **Backend**: Hono (Cloudflare Workers)
- **Frontend**: Vanilla HTML/CSS/JS (Noto Sans KR + Playfair Display)
- **Build**: Vite
- **Platform**: Cloudflare Pages

## 미구현 사항
- 실제 원장/병원 사진 교체 필요
- 네이버 지도 임베드 (현재 링크형)
- 블로그/SNS 연동
- 투명교정 케이스 추가 (향후)
- 시술 전후 사진 갤러리

## 운영정보
- **병원명**: 이음치과의원
- **대표원장**: 최효영
- **주소**: 부산광역시 강서구 명지국제8로 265 2층
- **전화**: 051-206-5888
- **개원**: 2025년 12월 말

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: 개발 완료 (배포 대기)
- **Last Updated**: 2026-04-02
