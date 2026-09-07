import { EV } from '../../theme/tokens';

type RuleProps = {
  /** 구분선 전체 폭 (좌우로 w/2씩 나뉨) */
  w?: number;
};

/** 다이아몬드 구분선 — [gradient w/2] ◆ [gradient w/2] */
export function Rule({ w = 100 }: RuleProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 8, margin: '16px 0'
    }}>
      <span style={{ height: 1, width: w / 2, background: `linear-gradient(90deg,transparent,${EV.seal})` }} />
      <svg width="9" height="9" viewBox="0 0 9 9">
        <path d="M4.5 0 L9 4.5 L4.5 9 L0 4.5Z" fill={EV.seal} />
      </svg>
      <span style={{ height: 1, width: w / 2, background: `linear-gradient(90deg,${EV.seal},transparent)` }} />
    </div>
  );
}
