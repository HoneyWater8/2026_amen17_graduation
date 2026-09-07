import { useState } from 'react';
import { EV, FF } from '../../theme/tokens';
import { Section } from '../common/Section';
import { SectionHead } from '../common/SectionHead';
import { Reveal } from '../common/Reveal';
import { G } from '../../data/graduation';

type TestimonyProps = { active: boolean };

/**
 * 02 졸업 간증 영상 — 페이지의 중심 콘텐츠. 9:16 세로 통합본 1개.
 * 영상 URL이 없거나 로드에 실패하면 placeholder 슬롯으로 폴백한다.
 */
export function Testimony({ active }: TestimonyProps) {
  const [failed, setFailed] = useState(false);
  const showVideo = Boolean(G.video.src) && !failed;

  return (
    <Section label="02 Testimony" bg={EV.paperDeep}>
      <Reveal active={active}>
        <SectionHead ko="졸업 간증 영상" en="Testimony" />
      </Reveal>

      <Reveal delay={0.06} active={active}>
        <div style={{ border: `1px solid ${EV.gold}`, padding: 6, background: EV.paperDeep }}>
          <div
            data-role="video-slot"
            style={{
              position: 'relative', width: '100%', aspectRatio: '9 / 16', maxHeight: 420,
              margin: '0 auto', background: '#141210',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            }}
          >
            {showVideo ? (
              <video
                src={G.video.src}
                poster={G.video.poster}
                controls
                playsInline
                preload="metadata"
                onError={() => setFailed(true)}
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: 18 }}>
                <svg width="44" height="44" viewBox="0 0 46 46" style={{ margin: '0 auto' }}>
                  <circle cx="23" cy="23" r="22" fill="none" stroke={EV.goldLt} strokeWidth="1" />
                  <path d="M18 14 L33 23 L18 32 Z" fill={EV.goldLt} />
                </svg>
                <div style={{
                  marginTop: 12, fontFamily: FF.latin, fontSize: 10,
                  letterSpacing: 3, color: EV.goldLt,
                }}>VIDEO</div>
                <div style={{
                  marginTop: 5, fontFamily: FF.sans, fontSize: 11,
                  color: 'rgba(255,255,255,.55)',
                }}>{G.video.note}</div>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
