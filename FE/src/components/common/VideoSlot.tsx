import { useState } from 'react';
import { EV, FF } from '../../theme/tokens';
import type { GradVideo } from '../../data/types';

type VideoSlotProps = {
  video: GradVideo;
  /** 슬롯 비율. 제공되는 영상이 모두 16:9 가로 촬영본이라 이것이 기본 */
  aspectRatio?: string;
  /** 높이 상한. 16:9에서는 폭이 먼저 제한되므로 보통 지정할 필요가 없다 */
  maxHeight?: number;
  /** placeholder 재생 아이콘 지름 */
  iconSize?: number;
  /** 금박 테두리와 슬롯 사이 여백 */
  pad?: number;
  /** 슬롯 식별용 data 속성 */
  slotKey?: string;
};

/**
 * 영상 슬롯 — 금박 테두리 안의 검은 무대.
 *
 * URL이 비어 있거나 재생에 실패하면 재생 아이콘 placeholder로 폴백한다.
 * 자료가 확정되기 전에도 레이아웃이 무너지지 않게 하기 위한 것으로,
 * Testimony(간증 영상)와 Journey(졸업식 영상)가 함께 쓴다.
 */
export function VideoSlot({
  video,
  aspectRatio = '16 / 9',
  maxHeight,
  iconSize = 44,
  pad = 6,
  slotKey,
}: VideoSlotProps) {
  const [failed, setFailed] = useState(false);
  const showVideo = Boolean(video.src) && !failed;

  return (
    <div style={{ border: `1px solid ${EV.gold}`, padding: pad, background: EV.paperDeep }}>
      <div
        data-role="video-slot"
        data-video-key={slotKey}
        style={{
          position: 'relative', width: '100%', aspectRatio, maxHeight,
          margin: '0 auto', background: '#141210',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}
      >
        {showVideo ? (
          <video
            src={video.src}
            poster={video.poster}
            controls
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 18 }}>
            <svg width={iconSize} height={iconSize} viewBox="0 0 46 46" style={{ margin: '0 auto' }}>
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
            }}>{video.note}</div>
          </div>
        )}
      </div>
    </div>
  );
}
