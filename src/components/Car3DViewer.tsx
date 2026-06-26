import { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@v1.0.0';

const BRAND_LOGO_FILE: Record<string, string> = {
  Ferrari: 'ferrari-logo.svg',
  Lamborghini: 'lamborghini-logo.png',
  Porsche: 'porsche-logo.svg',
  McLaren: 'mclaren-logo.svg',
  Bugatti: 'bugatti-logo.svg',
};

/* ─── 3D Turntable rotation ─── */
const turntable = keyframes`
  from { transform: rotateY(0deg); }
  to   { transform: rotateY(360deg); }
`;

/* ─── Moving light streak across the surface ─── */
const lightSweep = keyframes`
  0%   { opacity: 0; transform: translateX(-100%) skewX(-15deg); }
  10%  { opacity: 0.6; }
  30%  { opacity: 0.1; }
  50%  { opacity: 0.6; }
  70%  { opacity: 0.1; }
  90%  { opacity: 0.6; }
  100% { opacity: 0; transform: translateX(200%) skewX(-15deg); }
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1200px;
  overflow: visible;
`;

const RotatingLayer = styled.div<{ $active: boolean; $mouseX: number; $mouseY: number }>`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  /* Base tilt follows mouse */
  transform: ${({ $mouseX, $mouseY }) =>
    `perspective(1200px) rotateX(${$mouseY}deg) rotateY(${$mouseX}deg)`};
  transition: transform 0.15s ease-out;
  will-change: transform;

  /* Continuous turntable rotation on hover */
  ${Wrapper}:hover & {
    animation: ${turntable} ${({ $active }) => $active ? '6s' : '0s'} linear infinite;
  }
`;

/* ─── Front face: car image ─── */
const CarImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1.5rem;
  backface-visibility: hidden;
`;

/* ─── Back face: brand logo ─── */
const BackFace = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(26,26,26,0.6), rgba(0,0,0,0.3));
`;

const BackLogo = styled.img<{ $isPng: boolean }>`
  width: 60%;
  height: 60%;
  object-fit: contain;
  opacity: 0.7;
  ${({ $isPng }) => $isPng ? 'filter: brightness(10) saturate(0);' : ''}
`;

/* ─── Light sweep overlay ─── */
const LightSweep = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 30%,
    rgba(255, 255, 255, 0.25) 40%,
    rgba(255, 255, 255, 0.35) 45%,
    rgba(255, 255, 255, 0.25) 50%,
    transparent 70%
  );
  pointer-events: none;
  mix-blend-mode: overlay;
  backface-visibility: hidden;

  ${Wrapper}:hover & {
    animation: ${lightSweep} 3s ease-in-out infinite;
  }
`;

/* ─── Reflection shine ─── */
const Shine = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  background: linear-gradient(
    135deg,
    transparent 40%,
    rgba(255, 255, 255, 0.04) 50%,
    transparent 60%
  );
  pointer-events: none;
  backface-visibility: hidden;
`;

/* ─── Ground shadow that shifts with rotation ─── */
const GroundShadow = styled.div<{ $active: boolean }>`
  position: absolute;
  bottom: -20px;
  left: 10%;
  width: 80%;
  height: 30px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%);
  filter: blur(8px);
  transform: rotateX(90deg);
  transform-origin: bottom center;
  pointer-events: none;
  ${({ $active }) => $active ? 'animation: shadow-pulse 3s ease-in-out infinite;' : ''}
`;

interface Car3DViewerProps {
  src: string;
  alt: string;
  marca: string;
  onHover?: () => void;
  onLeave?: () => void;
}

export default function Car3DViewer({ src, alt, marca, onHover, onLeave }: Car3DViewerProps) {
  const [active, setActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const logoFile = BRAND_LOGO_FILE[marca];
  const isPng = logoFile?.endsWith('.png');

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      setMousePos({ x, y });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
    setActive(false);
    onLeave?.();
  }, [onLeave]);

  return (
    <Wrapper
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { setActive(true); onHover?.(); }}
      onMouseLeave={handleMouseLeave}
    >
      <RotatingLayer $active={active} $mouseX={mousePos.x} $mouseY={mousePos.y}>
        {/* Front: car image */}
        <CarImg
          src={src}
          alt={alt}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* Back: brand logo */}
        {logoFile && (
          <BackFace>
            <BackLogo
              src={`${CDN_BASE}/${logoFile}`}
              alt={marca}
              $isPng={isPng}
              draggable={false}
            />
          </BackFace>
        )}
        <LightSweep />
        <Shine />
      </RotatingLayer>
      <GroundShadow $active={active} />
    </Wrapper>
  );
}
