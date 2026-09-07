import { EV, FF } from '../../theme/tokens';
import { Section } from '../common/Section';
import { Frame } from '../common/Frame';
import { Reveal } from '../common/Reveal';
import { Rule } from '../common/Rule';
import { Seal } from '../common/Seal';
import { G } from '../../data/graduation';

type CoverProps = { active: boolean };

/** 01 표지 — 행사 정체성과 일시·장소를 한눈에. */
export function Cover({ active }: CoverProps) {
  return (
    <Section label="01 Cover" pad="14px">
      <Frame pad="34px 20px 30px" fill>
        <Reveal active={active}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: FF.serif, fontSize: 13, fontWeight: 700,
              letterSpacing: 2, color: EV.goldTx,
            }}>{G.meta.org}</div>

            <div style={{
              marginTop: 18, fontFamily: FF.latin, fontSize: 17,
              letterSpacing: 3, color: EV.seal,
            }}>{G.meta.cohortEn}</div>

            {/* 38px이라 장식용 gold를 텍스트에 써도 대비 기준(24px 이상)을 만족한다 */}
            <div style={{
              marginTop: 9, fontFamily: FF.serif, fontSize: 38, fontWeight: 700,
              color: EV.ink, lineHeight: 1.15, letterSpacing: -1,
            }}>
              아멘 제자<br /><span style={{ color: EV.gold }}>17기</span> 졸업
            </div>

            <Rule w={100} />

            <div style={{ fontFamily: FF.serif, fontSize: 13.5, color: EV.inkSoft, lineHeight: 1.8 }}>
              {G.meta.tagline}<br />
              <span style={{ fontSize: 12, opacity: 0.82 }}>{G.meta.subTagline}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 26 }}>
              <Seal size={112} />
            </div>

            <div style={{
              marginTop: 18, fontFamily: FF.sans, fontSize: 11,
              color: EV.inkSoft, letterSpacing: 1,
            }}>
              {G.when.dateDisplay} · {G.when.dayKo} {G.when.time} · {G.where.name}
            </div>
          </div>
        </Reveal>
      </Frame>
    </Section>
  );
}
