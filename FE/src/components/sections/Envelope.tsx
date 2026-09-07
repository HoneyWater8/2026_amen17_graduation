import { EV, FF, MOTION } from '../../theme/tokens';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { CornerOrnaments } from '../common/CornerOrnaments';
import { Seal } from '../common/Seal';
import { G } from '../../data/graduation';
import type { EnvelopeStage } from '../../data/types';

type EnvelopeProps = {
  stage: EnvelopeStage;
  onOpen: () => void;
};

/**
 * 봉투 오버레이 (z-index 20).
 * 화면 아무 곳이나 누르면 플랩이 젖혀지고 안쪽 카드가 위로 빠져나간 뒤 전체가 페이드아웃된다.
 *
 * ⚠ 플랩에 backface-visibility: hidden 을 주면 안 된다.
 *   172도 회전하면 뒷면이 되어 통째로 사라진다. transform-style: preserve-3d 를 쓸 것.
 */
export function Envelope({ stage, onOpen }: EnvelopeProps) {
  const opening = stage !== 'closed';
  const reduced = usePrefersReducedMotion();

  // 진입 연출은 모션 감소 모드이거나 이미 열리는 중이면 붙이지 않는다.
  // 열기 시작과 동시에 걷어내야 인라인 opacity·transform 전환이 곧바로 먹는다.
  const enter = (value: string) => (reduced || opening ? undefined : value);

  return (
    <div
      onClick={opening ? undefined : onOpen}
      style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 24,
        background: `radial-gradient(ellipse at 50% 40%, ${EV.paperDeep} 0%, ${EV.backdrop} 72%)`,
        zIndex: 20,
        cursor: opening ? 'default' : 'pointer',
        opacity: stage === 'out' ? 0 : 1,
        pointerEvents: stage === 'out' ? 'none' : 'auto',
        transition: 'opacity .5s ease .55s',
      }}
    >
      <div style={{ width: '100%', maxWidth: 320, textAlign: 'center', marginTop: '18%' }}>
        <div style={{
          fontFamily: FF.serif, fontSize: 12, fontWeight: 700, letterSpacing: 2,
          color: EV.goldTx,
          opacity: opening ? 0 : 1, transition: 'opacity .3s ease',
          animation: enter(MOTION.enter.label),
        }}>{G.meta.org}</div>

        {/* 봉투 */}
        <div style={{
          position: 'relative', marginTop: 22, aspectRatio: '3 / 2', perspective: 900,
          animation: enter(MOTION.enter.envelope),
        }}>

          {/* 안에서 빠져나오는 카드.
              ⚠ aspect-ratio를 줘도 flex 자식의 min-content 높이가 더 크면 늘어난다 → overflow: hidden 필수 */}
          <div style={{
            position: 'absolute', left: '10%', right: '10%', top: '6%',
            aspectRatio: '3 / 2.1', background: EV.paper,
            border: `1px solid ${EV.line}`,
            boxShadow: '0 10px 28px rgba(0,0,0,.18)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: '20px 18px', overflow: 'hidden',
            transform: opening ? 'translateY(-72%)' : 'translateY(0)',
            transition: 'transform 1.05s cubic-bezier(.22,1,.36,1) .35s',
            zIndex: 1,
          }}>
            <div style={{ position: 'absolute', inset: 7, border: `1.5px solid ${EV.gold}`, opacity: 0.75, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 11, border: `.5px solid ${EV.gold}`, opacity: 0.5, pointerEvents: 'none' }} />
            <CornerOrnaments size={14} inset={9} dotRadius={1.3} />

            <div style={{ fontFamily: FF.latin, fontSize: 10.5, letterSpacing: 2, color: EV.seal }}>
              {G.meta.cohortEn}
            </div>
            <div style={{
              fontFamily: FF.serif, fontSize: 19, fontWeight: 700, color: EV.ink,
              lineHeight: 1.2, letterSpacing: -0.5,
            }}>
              아멘 제자<br />17기 졸업
            </div>
            <div style={{ marginTop: 2 }}><Seal size={46} /></div>
          </div>

          {/* 봉투 본체 */}
          <div style={{
            position: 'absolute', inset: 0, background: EV.envel,
            border: `1px solid ${EV.envelDk}`, zIndex: 2,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            boxShadow: 'inset 0 6px 14px rgba(0,0,0,.05), 0 12px 30px rgba(0,0,0,.14)',
          }}>
            <svg viewBox="0 0 300 200" preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <path d="M0 200 L150 108 L300 200 Z" fill={EV.envelDk} opacity=".55" />
              <path d="M0 0 L0 200 L150 108 Z" fill={EV.envelDk} opacity=".3" />
              <path d="M300 0 L300 200 L150 108 Z" fill={EV.envelDk} opacity=".3" />
            </svg>
          </div>

          {/* 상단 플랩 — z-index는 회전 중간(.42s)에 바뀌어 카드 뒤로 넘어간다 */}
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 0, height: '56%',
            transformOrigin: 'top center', zIndex: opening ? 0 : 3,
            transform: opening ? 'rotateX(-172deg)' : 'rotateX(0deg)',
            transition: 'transform .85s cubic-bezier(.5,.05,.3,1), z-index 0s linear .42s',
            transformStyle: 'preserve-3d',
          }}>
            <svg viewBox="0 0 300 168" preserveAspectRatio="none"
              style={{ width: '100%', height: '100%', display: 'block' }}>
              <defs>
                {/* 닫힘: 바깥 면 / 열림: 봉투 안쪽 면 — 그라데이션을 교체해 뒤집힌 느낌을 만든다 */}
                <linearGradient id="evFlapSh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fff" stopOpacity=".5" />
                  <stop offset="100%" stopColor="#000" stopOpacity=".12" />
                </linearGradient>
                <linearGradient id="evFlapIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#000" stopOpacity=".14" />
                  <stop offset="100%" stopColor="#fff" stopOpacity=".35" />
                </linearGradient>
              </defs>
              <path d="M0 0 L300 0 L150 160 Z" fill={EV.envel} stroke={EV.envelDk} strokeWidth="1" />
              <path d="M0 0 L300 0 L150 160 Z" fill={opening ? 'url(#evFlapIn)' : 'url(#evFlapSh)'} opacity=".55" />
            </svg>
          </div>

          {/* 왁스 씰 */}
          <Seal size={118} style={{
            position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-50%)',
            zIndex: 4, opacity: opening ? 0 : 1, transition: 'opacity .3s ease',
            filter: 'drop-shadow(0 3px 7px rgba(0,0,0,.3))',
          }} />
        </div>

        {/* 열기 안내 */}
        <div style={{
          position: 'relative', zIndex: 10, marginTop: 34,
          display: 'inline-flex', alignItems: 'center', gap: 9,
          fontFamily: FF.serif, fontSize: 14, fontWeight: 700, letterSpacing: 1,
          color: EV.ink,
          opacity: opening ? 0 : 1, transition: 'opacity .3s ease',
          animation: enter(MOTION.enter.hint),
        }}>
          <svg width="15" height="15" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6.5" fill="none" stroke={EV.gold} strokeWidth="1.2" />
            <circle cx="8" cy="8" r="2.4" fill={EV.gold} />
          </svg>
          화면을 눌러 편지를 열어보세요
        </div>
      </div>
    </div>
  );
}
