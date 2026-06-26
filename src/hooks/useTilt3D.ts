import { useRef, useCallback } from 'react';

interface TiltOptions {
  maxDeg?: number;
  perspective?: number;
  scale?: number;
}

export function useTilt3D({ maxDeg = 8, perspective = 1000, scale = 1.02 }: TiltOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  // Store last transform to restore on mouse leave
  const lastTransform = useRef('');

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * maxDeg;
      const rotateX = ((centerY - y) / centerY) * maxDeg;

      el.style.transform = `
        perspective(${perspective}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(${scale}, ${scale}, ${scale})
      `;
    },
    [maxDeg, perspective, scale]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `
      perspective(${perspective}px)
      rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)
    `;
  }, [perspective]);

  return { ref, handleMouseMove, handleMouseLeave };
}
