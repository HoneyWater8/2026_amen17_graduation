/* ─────────────────────────────────────────────────────────
   아멘 제자 17기 졸업 · 초대장 콘텐츠
   일시·장소 확정 — 2026-09-20 (주) 오후예배 14:30 · 다윗성전
   명단 128명 · 여정 사진 61장 · 초원별 새 간증 영상 10편 반영.
   ───────────────────────────────────────────────────────── */

import type { GraduationData, JourneyPhoto, TestimonyGroup } from './types';

/** 초원별 경량본과 전체화면 고화질본을 연결한다. 원격 URL을 로컬 기본 경로보다 우선한다. */
function testimonyOf(number: number, name: string, src?: string, poster?: string, fullSrc?: string): TestimonyGroup {
  return {
    id: `testimony-${number}`,
    name,
    video: {
      src: src || `/video/testimony/${String(number).padStart(2, '0')}/preview.mp4`,
      // 원격 경량본만 등록한 환경에서는 없는 로컬 고화질 주소를 요청하지 않는다.
      fullSrc: fullSrc || (!src ? `/video/testimony/${String(number).padStart(2, '0')}/hd.mp4` : undefined),
      poster: poster || `/video-posters/testimony/${String(number).padStart(2, '0')}.webp`, dur: '', note: '준비중 입니다',
    },
  };
}

/** 03 여정 · 졸업 예배 — 공개 URL이 없으면 로컬 감사 통합본을 사용한다. */
const GRADUATION_SRC = import.meta.env.VITE_GRADUATION_VIDEO_URL || '/video/graduation/preview.mp4';
const GRADUATION_POSTER = import.meta.env.VITE_GRADUATION_VIDEO_POSTER || '/video-posters/graduation.webp';

/**
 * 시기별 사진 경로 생성.
 *
 * 원본을 `FE/public/journey/<slug>/{thumb,full}/NN.jpg` 규칙으로 미리 리사이즈해 두었으므로
 * 파일명을 일일이 나열하지 않고 장수만 적는다. 사진을 더하거나 빼면 count만 고치면 된다.
 * (원본 → 2벌 생성 절차는 README 「콘텐츠 교체 방법」 참고)
 */
function photosOf(slug: string, count: number, label: string): JourneyPhoto[] {
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return {
      caption: `${label} 사진 ${i + 1}`,
      thumb: `/journey/${slug}/thumb/${n}.jpg`,
      full: `/journey/${slug}/full/${n}.jpg`,
    };
  });
}

export const G: GraduationData = {
  videoUi: { play: '영상 재생', resume: '영상 이어보기' },
  meta: {
    org: "하나로교회",
    cohort: "아멘 제자 17기",
    cohortShort: "17기",
    cohortEn: "AMEN 17TH",
    title: "졸업 예배",
    titleEn: "GRADUATION",
    year: "2026",
    tagline: "함께 걸어온 길, 함께 맞는 졸업",
    subTagline: "제자의 길을 완주한 17기를 축하합니다"
  },

  // 일시 · 장소 — 2026-09-20 (주) 주일 오후예배 14:30, 다윗성전. 확정값.
  //   2026-09-06 담임목사님 발표 → 2026-09-07 시간·장소까지 발주 측 확인 완료.
  when: {
    dateDisplay: "09 . 20",
    dayKo: "오후예배",
    time: "14:30",
    note: "오후예배 중 진행됩니다"
  },
  where: {
    name: "다윗성전",
    address: "하나로교회 다윗성전",
    detail: "예배 후 다과 · 기념 촬영"
  },

  // 졸업 간증 영상 — 초원별 10개. 배열 순서대로 왼쪽부터 2열로 표시한다.
  // 이름·영상은 각 항목에서 교체하며, 로컬 영상 경로도 URL 자리에 직접 넣을 수 있다.
  testimony: {
    title: '졸업 간증 영상',
    titleEn: 'Testimony',
    groups: [
      testimonyOf(1, '생사위주 초원', import.meta.env.VITE_TESTIMONY_1_VIDEO_URL, import.meta.env.VITE_TESTIMONY_1_VIDEO_POSTER, import.meta.env.VITE_TESTIMONY_1_VIDEO_FULL_URL),
      testimonyOf(2, 'Onlyhim 초원', import.meta.env.VITE_TESTIMONY_2_VIDEO_URL, import.meta.env.VITE_TESTIMONY_2_VIDEO_POSTER, import.meta.env.VITE_TESTIMONY_2_VIDEO_FULL_URL),
      testimonyOf(3, '하.군.남 초원', import.meta.env.VITE_TESTIMONY_3_VIDEO_URL, import.meta.env.VITE_TESTIMONY_3_VIDEO_POSTER, import.meta.env.VITE_TESTIMONY_3_VIDEO_FULL_URL),
      testimonyOf(4, '다모인 초원', import.meta.env.VITE_TESTIMONY_4_VIDEO_URL, import.meta.env.VITE_TESTIMONY_4_VIDEO_POSTER, import.meta.env.VITE_TESTIMONY_4_VIDEO_FULL_URL),
      testimonyOf(5, '은혜둥이 팔복둥이 초원', import.meta.env.VITE_TESTIMONY_5_VIDEO_URL, import.meta.env.VITE_TESTIMONY_5_VIDEO_POSTER, import.meta.env.VITE_TESTIMONY_5_VIDEO_FULL_URL),
      testimonyOf(6, '영음 초원', import.meta.env.VITE_TESTIMONY_6_VIDEO_URL, import.meta.env.VITE_TESTIMONY_6_VIDEO_POSTER, import.meta.env.VITE_TESTIMONY_6_VIDEO_FULL_URL),
      testimonyOf(7, '감사의 언니들 초원', import.meta.env.VITE_TESTIMONY_7_VIDEO_URL, import.meta.env.VITE_TESTIMONY_7_VIDEO_POSTER, import.meta.env.VITE_TESTIMONY_7_VIDEO_FULL_URL),
      testimonyOf(8, '더드림 가조 초원', import.meta.env.VITE_TESTIMONY_8_VIDEO_URL, import.meta.env.VITE_TESTIMONY_8_VIDEO_POSTER, import.meta.env.VITE_TESTIMONY_8_VIDEO_FULL_URL),
      testimonyOf(9, '어순종팀 초원', import.meta.env.VITE_TESTIMONY_9_VIDEO_URL, import.meta.env.VITE_TESTIMONY_9_VIDEO_POSTER, import.meta.env.VITE_TESTIMONY_9_VIDEO_FULL_URL),
      testimonyOf(10, '부어부어 초원', import.meta.env.VITE_TESTIMONY_10_VIDEO_URL, import.meta.env.VITE_TESTIMONY_10_VIDEO_POSTER, import.meta.env.VITE_TESTIMONY_10_VIDEO_FULL_URL),
    ],
  },

  // 함께 걸어온 길 — 시기별 사진 캐러셀. 졸업 예배는 감사 영상도 함께 표시한다.
  journey: [
    {
      period: "2026 · 03", title: "입학식",
      photos: photosOf("entrance", 23, "입학식")
    },
    {
      period: "2026 · 06", title: "하나로가족한마당",
      photos: photosOf("festival", 19, "하나로가족한마당")
    },
    {
      period: "2026", title: "식사 모임",
      photos: photosOf("fellowship", 18, "식사 모임")
    },
    {
      period: "2026 · 09 · 20", title: "졸업 예배",
      photos: photosOf("graduation", 1, "졸업 예배"),
      video: {
        src: GRADUATION_SRC,
        fullSrc: import.meta.env.VITE_GRADUATION_VIDEO_FULL_URL || (!import.meta.env.VITE_GRADUATION_VIDEO_URL ? '/video/graduation/hd.mp4' : undefined),
        poster: GRADUATION_POSTER,
        dur: "",
        desc: "감사 영상 · 제자들이 담임목사님께 전하는 한마디",
        note: "준비중 입니다"
      }
    }
  ],

  // 졸업생 전원 — 제자17기 명단(2026-09) 기준 128명, 이름 오름차순.
  // "이서영B"처럼 붙은 B는 동명이인 구분자다. 원본 시트 표기를 그대로 쓴다.
  roster: [
    "강철봉", "고나경", "구수진", "구지은", "권영화", "권정안",
    "김건영", "김공선", "김미옥", "김민서", "김민지", "김봉준",
    "김선형", "김세희", "김소진", "김수경", "김수연", "김승겸",
    "김여은", "김영님", "김영락", "김예은", "김용회", "김유경",
    "김이영", "김정미", "김주언", "김지인", "김찬희", "김태식",
    "김하언", "김혜진B", "김호민", "김희서", "김희진", "남동수",
    "노서이", "노서준", "노태청", "문한별", "박선영", "박윤희",
    "박의수", "박인서", "박재두", "박주향", "박준호", "박지혜",
    "박해원", "박해준", "백도영", "백정화", "백지연", "서숙희",
    "송민경", "송상준", "안옥임", "안정환", "양명자", "오동근",
    "오민규", "오성민", "오소망", "오예슬", "오지선", "유리현",
    "유세인", "유채연", "유희진", "윤경희", "윤다이", "윤석열",
    "윤정우", "윤정은", "윤준용", "윤태점", "이민혁", "이서영",
    "이서영B", "이수정", "이시은", "이애련", "이용승", "이유경",
    "이유빈", "이은기", "이장은", "이재웅", "이정숙", "이종운",
    "이준서", "이준용", "이환민", "장미", "장미B", "장선화",
    "장승희", "전세훈", "전아라", "전주혁", "정다인", "정선",
    "정준혁", "정진웅", "정해원", "정현선", "조다슬", "조성제",
    "조성주", "조영길", "조한성", "조환희", "진재웅", "최강운",
    "최로사", "최송엽", "최수헌", "최예준", "최은숙", "최인정",
    "최지운", "최창원", "최현식", "한고은", "함수윤", "홍민정",
    "홍상민", "황옥희"
  ],

  closing: {
    label: "맺는 말씀",
    lines: [
      "에스라가 위대하신 하나님 여호와를",
      "송축하매 모든 백성이 손을 들고",
      "아멘 아멘 하고 응답하고",
      "몸을 굽혀 얼굴을 땅에 대고",
      "여호와께 경배하니라"
    ],
    sign: "느헤미야 8장 6절",
    credit: "DESIGNED & DEVELOPED BY HONEYWATER"
  }
};
