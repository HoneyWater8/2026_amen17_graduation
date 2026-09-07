/* ─────────────────────────────────────────────────────────
   Envelope · 졸업장 디자인 토큰
   FE-legacy/README.md 「Design Tokens」의 확정값과 1:1 대응
   ───────────────────────────────────────────────────────── */

export const EV = {
  /** 기본 배경 — 표지·여정·맺는 말 */
  paper:     '#FBF7EE',
  /** 교차 배경 — 영상·명단 섹션, 사진 카드 */
  paperDeep: '#F2EADA',
  /** 봉투 본체 */
  envel:     '#EDE2CB',
  /** 봉투 접힘선·테두리 */
  envelDk:   '#DFD0B2',
  /** 루트(460px) 바깥 여백 */
  backdrop:  '#E5DCC8',

  ink:      '#1E1B16',
  inkSoft:  '#5A5348',

  /** 장식 전용 금색 — 테두리·구분선·점선. paper 위 대비 3.21:1 이라 텍스트 금지 */
  gold:     '#A8862C',
  /** 텍스트용 금색 — 대비 4.5:1 확보. 24px 미만 금색 글자는 반드시 이것 */
  goldTx:   '#6F5719',
  /** 어두운 배경 위 금색 — 영상 슬롯 */
  goldLt:   '#D8BE72',

  /** 포인트 컬러 — 왁스 씰·영문 라벨·다이아몬드·타임라인 마커 */
  seal:     '#8C2B22',
  /** 카드 테두리 */
  line:     'rgba(30,27,22,0.14)',
};

export const FF = {
  /** 한글 전체 + 기본 body */
  serif: '"Nanum Myeongjo", serif',
  /** 영문·숫자 전용. ⚠ 한글 글리프가 없어 한글 섞인 문자열에 쓰면 서체가 갈라짐 */
  latin: '"Cinzel Decorative", "Nanum Myeongjo", serif',
  /** 본문 sans 자리 — 나눔명조로 통일 (Pretendard는 용량 문제로 제거) */
  sans:  '"Nanum Myeongjo", serif',
};

/** 모션 값 — 봉투 연출 타이밍은 핸드오프 확정값 */
export const MOTION = {
  flap:        'transform .85s cubic-bezier(.5,.05,.3,1)',
  card:        'transform 1.05s cubic-bezier(.22,1,.36,1) .35s',
  overlayFade: 'opacity .5s ease .55s',
  /** stage: opening → out 전환까지의 시간 (ms) */
  openDuration: 1500,
};

/** 루트 레이아웃 */
export const LAYOUT = {
  maxWidth: 460,
};
