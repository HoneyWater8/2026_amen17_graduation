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
   * 영상 URL. 환경 변수(Vercel Blob 등)가 있으면 그 값, 없으면 public 경로.
   * 비어 있거나 재생에 실패하면 VideoSlot이 placeholder로 자동 폴백한다.
   */
  src: string;
  /** 첫 프레임 포스터 이미지 — 없으면 검은 배경 */
  poster?: string;
  dur: string;
  /** 영상 자체의 설명. 타임라인 항목은 JourneyItem.desc를 쓰므로 여기서는 비워둔다 */
  desc?: string;
  /** 영상이 아직 없을 때 placeholder에 표시할 안내 문구 */
  note: string;
};

export type JourneyPhoto = {
  /** 이미지 alt 텍스트 전용. 화면에는 표시하지 않는다 */
  caption: string;
  /** 캐러셀 카드용 썸네일(320w). 없으면 tag placeholder를 표시 */
  thumb?: string;
  /** 라이트박스용 이미지(1280w). 카드를 눌렀을 때만 로드된다 */
  full?: string;
  /** 사진이 아직 없는 시기의 placeholder 번호 */
  tag?: string;
};

export type JourneyItem = {
  /** 시기 라벨 (예: "2025 · 봄") — 한글이 섞이므로 serif로 조판 */
  period: string;
  title: string;
  /** 한 줄 설명. 현재는 쓰지 않지만 필요해지면 항목에 다시 넣으면 된다 */
  desc?: string;
  /** 현재 시점이면 타임라인 다이아몬드를 채움 */
  now?: boolean;
  /** 사진 가로 캐러셀. video가 있는 항목에는 없다 */
  photos?: JourneyPhoto[];
  /**
   * 사진 대신 영상이 들어가는 항목 (졸업식).
   * photos와 함께 주면 영상이 우선한다.
   */
  video?: GradVideo;
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
