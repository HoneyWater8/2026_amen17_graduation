import { EV } from '../../theme/tokens';
import { Section } from '../common/Section';
import { SectionHead } from '../common/SectionHead';
import { Reveal } from '../common/Reveal';
import { VideoSlot } from '../common/VideoSlot';
import { G } from '../../data/graduation';

type TestimonyProps = { active: boolean };

/**
 * 02 졸업 간증 영상 — 페이지의 중심 콘텐츠. 16:9 가로 통합본 1개.
 * 영상 URL이 없거나 로드에 실패하면 VideoSlot이 placeholder로 폴백한다.
 */
export function Testimony({ active }: TestimonyProps) {
  return (
    <Section label="02 Testimony" bg={EV.paperDeep}>
      <Reveal active={active}>
        <SectionHead ko="졸업 간증 영상" en="Testimony" />
      </Reveal>

      <Reveal delay={0.06} active={active}>
        <VideoSlot video={G.video} slotKey="testimony" />
      </Reveal>
    </Section>
  );
}
