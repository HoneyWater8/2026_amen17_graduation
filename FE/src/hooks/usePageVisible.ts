/* ───── 탭을 숨긴 동안 캐러셀 프레임 예약도 해제한다 ───── */
import { useEffect, useState } from 'react';

export function usePageVisible() {
  const [visible, setVisible] = useState(() => document.visibilityState !== 'hidden');
  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return visible;
}
