import { EV, FF } from '../../theme/tokens';
import { Rule } from './Rule';

type SectionHeadProps = {
  ko: string;
  /** 라틴 전용 — Cinzel Decorative로 조판되므로 한글을 섞지 말 것 */
  en: string;
};

/** 섹션 헤더 — 영문 라벨 + 한글 제목 + 구분선. */
export function SectionHead({ ko, en }: SectionHeadProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: FF.latin, fontSize: 14, letterSpacing: 2,
        color: EV.seal, textTransform: 'uppercase'
      }}>{en}</div>
      <div style={{
        marginTop: 7, fontFamily: FF.serif, fontSize: 25,
        fontWeight: 700, color: EV.ink, letterSpacing: -0.5
      }}>{ko}</div>
      <Rule w={80} />
    </div>
  );
}
