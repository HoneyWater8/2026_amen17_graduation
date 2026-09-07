import { EV, FF } from '../../theme/tokens';
import { Section } from '../common/Section';
import { SectionHead } from '../common/SectionHead';
import { Reveal } from '../common/Reveal';
import { Frame } from '../common/Frame';
import { G } from '../../data/graduation';

type GraduatesProps = { active: boolean };

/** 04 졸업생 전원 — 4열 이름 그리드. */
export function Graduates({ active }: GraduatesProps) {
  return (
    <Section label="04 Graduates" bg={EV.paperDeep}>
      <Reveal active={active}>
        <SectionHead ko="졸업생 전원" en="Graduates" />
      </Reveal>

      <Reveal delay={0.06} active={active}>
        <Frame pad="18px 14px">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '7px 4px' }}>
            {G.roster.map((name, i) => (
              <div key={i} style={{
                fontFamily: FF.serif, fontSize: 12, color: EV.ink,
                textAlign: 'center', letterSpacing: 0.5,
              }}>{name}</div>
            ))}
          </div>
        </Frame>
      </Reveal>
    </Section>
  );
}
