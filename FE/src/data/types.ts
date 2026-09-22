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
   * 영상 URL 또는 public 기준 경로. 각 콘텐츠에서 환경 변수나 경로를 지정한다.
   * 비어 있거나 재생에 실패하면 VideoSlot이 placeholder로 자동 폴백한다.
   */
  src: string;
  /** 첫 프레임 포스터 이미지 — 없으면 검은 배경 */
  poster?: string;
  dur: string;
  /** 영상 위에 표시할 설명. 사진 등 항목 전체의 설명과 구분한다 */
  desc?: string;
  /** 영상이 아직 없을 때 placeholder에 표시할 안내 문구 */
  note: string;
};

export type TestimonyGroup = {
  /** 초원명을 바꾸어도 재생 집계가 이어지도록 고정하는 식별자 */
  id: string;
  name: string;
  video: GradVideo;
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
  /** 타임라인 항목 전체에 대한 한 줄 설명 */
  desc?: string;
  /** 현재 시점이면 타임라인 다이아몬드를 채움 */
  now?: boolean;
  /** 사진 가로 캐러셀. video와 함께 있으면 사진 다음에 영상을 표시한다 */
  photos?: JourneyPhoto[];
  /** 사진과 함께 표시할 수 있는 영상 (졸업 예배의 감사 영상) */
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
  testimony: {
    title: string;
    titleEn: string;
    groups: TestimonyGroup[];
  };
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
