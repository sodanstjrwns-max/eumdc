import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>이음치과의원 | 실력으로 신뢰를, 신뢰로 마음까지 잇습니다</title>
        <meta name="description" content="부산 명지 이음치과의원 - 임플란트, 심미보철, 턱관절 전문. 투명한 진료, 확실한 결과로 환자의 불안을 확신으로 바꿉니다." />
        <meta name="keywords" content="이음치과, 부산치과, 명지치과, 임플란트, 심미보철, 턱관절, 최효영" />
        <meta property="og:title" content="이음치과의원 | 실력으로 신뢰를, 신뢰로 마음까지" />
        <meta property="og:description" content="부산 명지 이음치과의원 - 투명한 설명, 확실한 결과" />
        <meta property="og:type" content="website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
})
