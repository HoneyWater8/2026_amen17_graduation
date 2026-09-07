import { EV, FF } from '../../theme/tokens';
import { useDragScroll } from '../../hooks/useDragScroll';
import type { JourneyPhoto } from '../../data/types';

type PhotoRailProps = {
  photos: JourneyPhoto[];
};

/**
 * 시기별 사진 가로 캐러셀.
 * 터치 스와이프 · 마우스 드래그 · Shift+휠 세 가지 조작을 모두 지원 (useDragScroll).
 *
 * ⚠ touch-action은 'pan-x pan-y' 여야 한다. 'pan-y'만 주면 브라우저의
 *   네이티브 가로 터치 스크롤이 죽는다.
 */
export function PhotoRail({ photos }: PhotoRailProps) {
  const railRef = useDragScroll<HTMLDivElement>();

  return (
    <div
      ref={railRef}
      className="no-scrollbar"
      style={{
        display: 'flex', gap: 8, marginTop: 9,
        overflowX: 'auto', scrollSnapType: 'x mandatory',
        paddingBottom: 2,
        // 섹션의 paddingLeft(22px)만큼 오른쪽으로 흘려보내 화면 끝까지 이어지게 함.
        marginRight: -22,
        userSelect: 'none', WebkitUserSelect: 'none',
        touchAction: 'pan-x pan-y', WebkitOverflowScrolling: 'touch',
      }}
    >
      {photos.map((p, i) => (
        <div
          key={i}
          data-role="photo-slot"
          data-photo-tag={p.tag}
          style={{
            flex: '0 0 auto', width: 128, scrollSnapAlign: 'start',
            background: EV.paperDeep, border: `1px solid ${EV.line}`, padding: 5,
          }}
        >
          <div style={{
            position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden',
            border: p.image ? 'none' : `1px dashed ${EV.gold}66`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FF.latin, fontSize: 15, letterSpacing: 1, color: EV.seal,
          }}>
            {p.image
              ? <img
                  src={p.image}
                  alt={p.caption}
                  draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              : p.tag}
          </div>
          <div style={{
            marginTop: 5, fontFamily: FF.sans, fontSize: 10,
            color: EV.inkSoft, textAlign: 'center',
          }}>{p.caption}</div>
        </div>
      ))}
      {/* 마지막 카드가 화면 끝에 붙지 않도록 하는 스페이서 */}
      <div style={{ flex: '0 0 14px' }} />
    </div>
  );
}
