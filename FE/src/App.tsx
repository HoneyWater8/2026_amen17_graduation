/* ─────────────────────────────────────────────────────────
   아멘 제자 17기 졸업 · 봉투 개봉(Envelope) 초대장
   하나로교회 · 봉투 오버레이 + 5섹션 세로 스크롤
   ───────────────────────────────────────────────────────── */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { EV, LAYOUT, MOTION } from './theme/tokens';
import type { EnvelopeStage } from './data/types';
import { Envelope } from './components/sections/Envelope';
import { ShareFAB } from './components/common/ShareFAB';
import { track } from './utils/analytics';
import { Cover } from './components/sections/Cover';
import { Testimony } from './components/sections/Testimony';
import { Journey } from './components/sections/Journey';
import { Graduates } from './components/sections/Graduates';
import { Closing } from './components/sections/Closing';

export default function App() {
  const [stage, setStage] = useState<EnvelopeStage>('closed');
  const openTimerRef = useRef<number | null>(null);

  // 본문 등장 애니메이션은 봉투가 완전히 걷힌 뒤에야 시작한다.
  const active = stage === 'out';

  const open = useCallback(() => {
    // 페이지에 들어온 사람 중 실제로 봉투를 연 비율을 보기 위한 지표.
    track('envelope_open');
    setStage('opening');
    openTimerRef.current = window.setTimeout(() => setStage('out'), MOTION.openDuration);
  }, []);

  useEffect(() => () => {
    if (openTimerRef.current !== null) window.clearTimeout(openTimerRef.current);
  }, []);

  return (
    <div style={{
      position: 'relative', width: '100%', maxWidth: LAYOUT.maxWidth,
      // 100vh는 모바일 주소창 높이를 포함해 하단이 잘린다 → dvh
      height: '100dvh',
      margin: '0 auto', overflow: 'hidden', background: EV.paper,
      boxShadow: '0 0 60px rgba(0,0,0,.16)',
    }}>
      {/* 본문 (z-index 10) — 스크롤은 body가 아니라 이 컨테이너가 담당 */}
      <div
        data-scroll-root
        className="no-scrollbar"
        style={{
          position: 'absolute', inset: 0,
          overflowY: 'auto', overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: EV.paper, zIndex: 10,
        }}
      >
        <Cover active={active} />
        <Testimony active={active} />
        <Journey active={active} />
        <Graduates active={active} />
        <Closing active={active} />
      </div>

      {/* 봉투 오버레이 (z-index 20) — stage === 'out' 이면 투명 + pointer-events none */}
      <Envelope stage={stage} onOpen={open} />

      {/* 공유 FAB (z-index 40+) — 봉투 오버레이보다 위라 열린 뒤에만 노출된다 */}
      <ShareFAB active={active} />

      {/* Vercel Web Analytics — 방문자·페이지뷰·유입 경로 (쿠키 없음) */}
      <Analytics />
    </div>
  );
}
