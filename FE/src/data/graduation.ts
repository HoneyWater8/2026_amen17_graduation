/* ─────────────────────────────────────────────────────────
   아멘 제자 17기 졸업 · 초대장 콘텐츠
   일시·장소 확정 — 2026-09-20 (주) 오후예배 14:30 · 다윗성전
   ⚠️ 명단 · 사진 · 영상은 아직 placeholder — 확정 후 이 파일만 교체
   ───────────────────────────────────────────────────────── */

import type { GraduationData, JourneyPhoto } from './types';

/* 영상 2종 — Vercel Blob 등 외부 URL이 있으면 우선, 없으면 저장소 자체 호스팅 경로.
   둘 다 없으면 VideoSlot이 placeholder를 표시하므로 레이아웃은 무너지지 않는다. */

/** 02 졸업 간증 영상 — 함께 졸업하지 못한 네 지체가 보내온 영상의 통합본 */
const TESTIMONY_SRC = import.meta.env.VITE_TESTIMONY_VIDEO_URL || '/video/testimony.mp4';
const TESTIMONY_POSTER = import.meta.env.VITE_TESTIMONY_VIDEO_POSTER || undefined;

/** 03 여정 · 졸업식 — 제자들이 목사님께 한마디씩 전하는 영상 */
const GRADUATION_SRC = import.meta.env.VITE_GRADUATION_VIDEO_URL || '/video/graduation.mp4';
const GRADUATION_POSTER = import.meta.env.VITE_GRADUATION_VIDEO_POSTER || undefined;

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

/** 사진이 아직 없는 시기 — 번호 placeholder만 채운다 */
function placeholderPhotos(count: number, label: string): JourneyPhoto[] {
  return Array.from({ length: count }, (_, i) => ({
    caption: `${label} 사진 ${i + 1}`,
    tag: String(i + 1).padStart(2, '0'),
  }));
}

export const G: GraduationData = {
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

  // 졸업 간증 영상 — 함께 졸업하지 못한 네 지체의 영상을 하나로 엮은 통합본 1개
  video: {
    src: TESTIMONY_SRC,
    poster: TESTIMONY_POSTER,
    dur: "약 4분",
    desc: "네 지체의 이야기를 하나로 엮은 영상입니다.",
    note: "영상은 확정 후 업로드됩니다"
  },

  // 함께 걸어온 길 — 시기별 6개 항목, 각 항목마다 가로 캐러셀 사진 5장
  journey: [
    {
      period: "2026 · 03", title: "입학식",
      photos: photosOf("entrance", 23, "입학식")
    },
    {
      // 사진 미수령 — 확보되면 photosOf("class", <장수>, "제자 수업")으로 교체
      period: "2026", title: "제자 수업",
      photos: placeholderPhotos(5, "제자 수업")
    },
    {
      period: "2026 · 06", title: "하나로가족한마당",
      photos: photosOf("festival", 19, "하나로가족한마당")
    },
    {
      period: "2026", title: "식사 모임",
      photos: photosOf("fellowship", 17, "식사 모임")
    },
    {
      // 아직 치르지 않은 일정이라 사진이 없다. 제자들이 목사님께 한마디씩 전하는
      // 영상이 들어갈 자리로 둔다.
      period: "2026 · 09", title: "졸업식",
      desc: "제자들이 담임목사님께 전하는 한마디", now: true,
      video: {
        src: GRADUATION_SRC,
        poster: GRADUATION_POSTER,
        dur: "",
        note: "졸업식 후 업로드됩니다"
      }
    }
  ],

  // 졸업생 전원 — placeholder 120명. 확정 후 실제 성함으로 교체
  roster: [
    "김○○", "이○○", "박○○", "정○○", "최○○", "강○○",
    "조○○", "윤○○", "장○○", "임○○", "한○○", "오○○",
    "서○○", "신○○", "권○○", "황○○", "안○○", "송○○",
    "전○○", "홍○○", "고○○", "문○○", "손○○", "양○○",
    "배○○", "백○○", "허○○", "유○○", "남○○", "심○○",
    "노○○", "하○○", "곽○○", "성○○", "차○○", "주○○",
    "우○○", "구○○", "민○○", "류○○", "김○○", "이○○",
    "박○○", "정○○", "최○○", "강○○", "조○○", "윤○○",
    "장○○", "임○○", "한○○", "오○○", "서○○", "신○○",
    "권○○", "황○○", "안○○", "송○○", "전○○", "홍○○",
    "고○○", "문○○", "손○○", "양○○", "배○○", "백○○",
    "허○○", "유○○", "남○○", "심○○", "노○○", "하○○",
    "곽○○", "성○○", "차○○", "주○○", "우○○", "구○○",
    "민○○", "류○○", "김○○", "이○○", "박○○", "정○○",
    "최○○", "강○○", "조○○", "윤○○", "장○○", "임○○",
    "한○○", "오○○", "서○○", "신○○", "권○○", "황○○",
    "안○○", "송○○", "전○○", "홍○○", "고○○", "문○○",
    "손○○", "양○○", "배○○", "백○○", "허○○", "유○○",
    "남○○", "심○○", "노○○", "하○○", "곽○○", "성○○",
    "차○○", "주○○", "우○○", "구○○", "민○○", "류○○"
  ],

  closing: {
    label: "맺는 말",
    lines: [
      "에스라가 위대하신 하나님 여호와를",
      "송축하매 모든 백성이 손을 들고",
      "아멘 아멘 하고 응답하고",
      "몸을 굽혀 얼굴을 땅에 대고",
      "여호와께 경배하니라"
    ],
    sign: "느헤미야 8장 6절"
  }
};
