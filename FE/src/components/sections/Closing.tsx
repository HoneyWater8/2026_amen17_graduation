import { EV, FF } from '../../theme/tokens';
import { Section } from '../common/Section';
import { SectionHead } from '../common/SectionHead';
import { Reveal } from '../common/Reveal';
import { Rule } from '../common/Rule';
import { G } from '../../data/graduation';

type ClosingProps = { active: boolean };

/**
 * 05 맺는 말 — 말씀 본문 + 출처 + 푸터.
 *
 * 겹낫표는 각 줄을 inline-block 스팬으로 감싸고 그 바깥에 absolute로 붙인다.
 * 이렇게 해야 가운데 정렬에 영향을 주지 않으면서 텍스트 시작/끝에 정확히 붙는다.
 */
export function Closing({ active }: ClosingProps) {
  const lines = G.closing.lines;

  return (
    <Section label="05 Closing" bg={EV.paper} pad="52px 22px 28px">
      <div style={{ flex: 1 }} />

      <Reveal active={active}>
        <SectionHead ko="맺는 말" en="Closing" />
      </Reveal>

      <Reveal delay={0.08} active={active}>
        <div style={{
          fontFamily: FF.serif, fontSize: 14.5, lineHeight: 2,
          color: EV.ink, textAlign: 'center',
        }}>
          {lines.map((line, i) => (
            <div key={i} style={{ minHeight: line === '' ? 12 : 'auto' }}>
              <span style={{ position: 'relative', display: 'inline-block' }}>
                {i === 0 && (
                  <span style={{
                    position: 'absolute', right: '100%', marginRight: 5, top: 0,
                    color: EV.goldTx, whiteSpace: 'nowrap',
                  }}>『</span>
                )}
                {line}
                {i === lines.length - 1 && (
                  <span style={{
                    position: 'absolute', left: '100%', marginLeft: 5, top: 0,
                    color: EV.goldTx, whiteSpace: 'nowrap',
                  }}>』</span>
                )}
              </span>
            </div>
          ))}

          <div style={{
            marginTop: 14, fontFamily: FF.serif, fontSize: 12.5,
            fontWeight: 700, color: EV.goldTx, letterSpacing: 0.5, lineHeight: 1.6,
          }}>{G.closing.sign}</div>
        </div>
        <Rule w={72} />
      </Reveal>

      <div style={{ flex: 1 }} />

      <div style={{
        textAlign: 'center', fontFamily: FF.serif, fontSize: 11,
        letterSpacing: 0.5, color: EV.inkSoft, opacity: 0.85,
      }}>© {G.meta.org} · {G.meta.cohortEn} · {G.meta.year}</div>
    </Section>
  );
}
