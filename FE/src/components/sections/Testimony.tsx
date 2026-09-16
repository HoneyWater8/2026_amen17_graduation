/* ─────────────────────────────────────────────────────────
   졸업 간증 영상 · 초원별 2열 목록
   ───────────────────────────────────────────────────────── */

import { EV, FF } from '../../theme/tokens';
import { Section } from '../common/Section';
import { SectionHead } from '../common/SectionHead';
import { Reveal } from '../common/Reveal';
import { VideoSlot } from '../common/VideoSlot';
import { G } from '../../data/graduation';

type TestimonyProps = { active: boolean };

/**
 * 02 졸업 간증 영상 — 초원별 16:9 영상 10개와 하단 초원명.
 * 영상 URL이 없거나 로드에 실패하면 VideoSlot이 placeholder로 폴백한다.
 */
export function Testimony({ active }: TestimonyProps) {
  return (
    <Section label="02 Testimony" bg={EV.paperDeep} pad="40px 12px">
      <Reveal active={active}>
        <SectionHead ko={G.testimony.title} en={G.testimony.titleEn} />
      </Reveal>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        columnGap: 16, rowGap: 12,
      }}>
        {G.testimony.groups.map((group) => (
          <Reveal key={group.id} delay={0.06} active={active}>
            <figure style={{ margin: 0, minWidth: 0 }}>
              <VideoSlot
                video={group.video}
                slotKey={group.id}
                label={group.name}
                iconSize={20}
                pad={2}
                compact
              />
              <figcaption style={{
                marginTop: 6, textAlign: 'center', fontFamily: FF.serif,
                fontSize: 15, fontWeight: 700, lineHeight: 1.5, color: EV.ink,
                wordBreak: 'keep-all', overflowWrap: 'anywhere',
              }}>{group.name}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
