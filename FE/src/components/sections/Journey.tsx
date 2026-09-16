import { EV, FF } from '../../theme/tokens';
import { Section } from '../common/Section';
import { SectionHead } from '../common/SectionHead';
import { Reveal } from '../common/Reveal';
import { PhotoRail } from '../common/PhotoRail';
import { VideoSlot } from '../common/VideoSlot';
import { G } from '../../data/graduation';

type JourneyProps = { active: boolean };

/** 03 함께 걸어온 길 — 시기별 사진 캐러셀과 졸업식 영상을 타임라인으로 표시한다. */
export function Journey({ active }: JourneyProps) {
  return (
    <Section label="03 Our Journey" bg={EV.paper}>
      <Reveal active={active}>
        <SectionHead ko="함께 걸어온 길" en="Our Journey" />
      </Reveal>

      {/* paddingLeft 22px — 왼쪽에 타임라인 축 자리를 확보 */}
      <div style={{ position: 'relative', paddingLeft: 22 }}>
        <div style={{
          position: 'absolute', left: 5, top: 6, bottom: 6, width: 1,
          background: `linear-gradient(${EV.gold},${EV.gold}22)`,
        }} />

        {G.journey.map((t, i) => (
          <Reveal key={i} delay={i * 0.05} y={12} active={active}>
            <div style={{ position: 'relative', padding: '11px 0' }}>
              <div style={{
                position: 'absolute', left: -22, top: 15, width: 11, height: 11,
                transform: 'rotate(45deg)',
                background: t.now ? EV.seal : EV.paper,
                border: `1px solid ${EV.seal}`,
              }} />
              {/* period는 한글이 섞이므로 latin(Cinzel)을 쓰면 서체가 갈라진다 → serif 고정 */}
              <div style={{ fontFamily: FF.serif, fontSize: 12, fontWeight: 700, color: EV.seal }}>
                {t.period}
              </div>
              <div style={{
                marginTop: 2, fontFamily: FF.serif, fontSize: 16,
                fontWeight: 700, color: EV.ink,
              }}>{t.title}</div>
              {t.desc && (
                <div style={{
                  marginTop: 2, fontFamily: FF.sans, fontSize: 11,
                  color: EV.inkSoft, lineHeight: 1.5,
                }}>{t.desc}</div>
              )}

              {/* 아직 치르지 않은 일정(졸업식)은 사진 대신 영상 자리를 둔다.
                  타임라인 축과 오른쪽 여백 안에 영상 폭을 맞춘다. */}
              {t.video ? (
                <div style={{ marginTop: 9, marginRight: 22 }}>
                  <VideoSlot
                    video={t.video}
                    iconSize={34}
                    pad={5}
                    slotKey="graduation"
                  />
                </div>
              ) : (
                t.photos && <PhotoRail photos={t.photos} />
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
