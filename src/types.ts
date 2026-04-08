// =============================================
// Cloudflare Bindings & Hono Environment Types
// =============================================

export type Bindings = {
  DB: D1Database
  R2: R2Bucket
  ADMIN_PASSWORD: string
  AUTH_SECRET: string        // HMAC 서명용 시크릿 키
}

export type HonoEnv = { Bindings: Bindings }

// =============================================
// Database Model Types
// =============================================

// --- cases (비포애프터) ---
export interface Case {
  id: number
  title: string
  category: 'implant' | 'aesthetic' | 'resin' | 'tmj' | 'general'
  description: string | null
  pano_before: string | null
  pano_after: string | null
  intra_before: string | null
  intra_after: string | null
  patient_consent: number     // 0/1 환자 동의 여부
  patient_initials: string    // 환자 이니셜 (비식별)
  treatment_date: string | null
  tags: string                // JSON array '["임플란트","뼈이식"]'
  views: number
  is_published: number
  created_at: string
  updated_at: string
}

// --- blogs ---
export interface Blog {
  id: number
  title: string
  content: string | null      // 마크다운 원본
  content_html: string | null // 렌더링된 HTML
  thumbnail: string | null
  meta_title: string | null
  meta_description: string | null
  slug: string | null
  author_name: string
  views: number
  is_published: number
  created_at: string
  updated_at: string
}

export interface BlogImage {
  id: number
  blog_id: number
  image_url: string
  alt_text: string
  sort_order: number
  created_at: string
}

// --- notices (공지사항) ---
export interface Notice {
  id: number
  title: string
  content: string | null
  content_html: string | null
  is_pinned: number
  views: number
  is_published: number
  created_at: string
  updated_at: string
}

// --- FAQ ---
export interface FaqCategory {
  id: number
  name: string
  slug: string
  icon: string | null
  description: string
  sort_order: number
  created_at: string
}

export interface Faq {
  id: number
  category_id: number
  question: string
  answer: string
  sort_order: number
  views: number
  is_published: number
  created_at: string
  updated_at: string
}

// --- users (회원) ---
export interface User {
  id: number
  name: string
  phone: string
  password_hash: string
  email: string | null
  birth_date: string | null
  gender: string
  role: 'user' | 'admin' | 'staff'
  // 동의 항목
  agree_privacy: number
  agree_terms: number
  agree_marketing: number
  agree_marketing_sms: number
  agree_marketing_email: number
  agree_third_party: number
  marketing_agreed_at: string | null
  referral_source: string
  // 메타
  is_active: number
  last_login_at: string | null
  created_at: string
  updated_at: string
}

// --- view_logs (조회수 로그) ---
export interface ViewLog {
  id: number
  content_type: 'case' | 'blog' | 'notice' | 'faq'
  content_id: number
  visitor_hash: string
  viewed_at: string
}

// --- reservations (예약 문의) ---
export interface Reservation {
  id: number
  name: string
  phone: string
  treatment_type: string
  preferred_date: string | null
  preferred_time: string | null
  message: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  user_id: number | null
  created_at: string
  updated_at: string
}

// --- popups (팝업/배너) ---
export interface Popup {
  id: number
  title: string
  content_html: string | null
  image_url: string | null
  link_url: string | null
  popup_type: 'modal' | 'banner' | 'slide'
  position: 'center' | 'top' | 'bottom'
  start_date: string | null
  end_date: string | null
  is_active: number
  sort_order: number
  created_at: string
}
