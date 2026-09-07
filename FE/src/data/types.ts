/* ─────────────────────────────────────────────────────────
   졸업 초대장 데이터 타입 정의
   ───────────────────────────────────────────────────────── */

export type GradMeta = {
  org: string;
  cohort: string;
  cohortShort: string;
  /** 라틴 전용 라벨 — Cinzel Decorative로 조판되므로 한글을 섞지 말 것 */
  cohortEn: string;
  title: string;
  titleEn: string;
  year: string;
  tagline: string;
  subTagline: string;
};

export type GradWhen = {
  /** 표지 하단 한 줄에 노출 (예: "09 . 20") */
  dateDisplay: string;
  dayKo: string;
  time: string;
  note: string;
};

export type GradWhere = {
  name: string;
  address: string;
  detail: string;
};

export type GradVideo = {
  /**
   * 졸업 간증 영상 URL.
   * VITE_VIDEO_URL(Vercel Blob 등)이 있으면 그 값, 없으면 public 경로.
   * 재생에 실패하면 Testimony가 placeholder 슬롯으로 자동 폴백.
   */
  src: string;
  /** 첫 프레임 포스터 이미지 — 없으면 검은 배경 */
  poster?: string;
  dur: string;
  desc: string;
  /** 영상이 아직 없을 때 placeholder에 표시할 안내 문구 */
  note: string;
};

export type JourneyPhoto = {
  caption: string;
  /** 슬롯 번호(01~30). 실제 이미지가 없을 때 placeholder에 표시 */
  tag: string;
  /** 실제 사진 경로 (예: '/journey/01.jpg'). 비우면 tag placeholder */
  image?: string;
};

export type JourneyItem = {
  /** 시기 라벨 (예: "2025 · 봄") — 한글이 섞이므로 serif로 조판 */
  period: string;
  title: string;
  desc: string;
  /** 현재 시점이면 타임라인 다이아몬드를 채움 */
  now?: boolean;
  photos: JourneyPhoto[];
};

export type GradClosing = {
  label: string;
  /** 겹낫표는 첫 줄 앞 · 마지막 줄 뒤에 자동으로 붙음 */
  lines: string[];
  sign: string;
};

export type GraduationData = {
  meta: GradMeta;
  when: GradWhen;
  where: GradWhere;
  video: GradVideo;
  journey: JourneyItem[];
  roster: string[];
  closing: GradClosing;
};

/**
 * 봉투 오버레이 진행 단계.
 *  closed  → 봉투 닫힘, 안내 문구 표시, 본문 애니메이션 미시작
 *  opening → 플랩 회전 + 카드 상승
 *  out     → 오버레이 제거, 본문 활성화
 */
export type EnvelopeStage = 'closed' | 'opening' | 'out';
