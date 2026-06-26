import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@v1.0.0';

const LOGOS = [
  { id: 'ferrari', marca: 'Ferrari', file: 'ferrari-logo.svg' },
  { id: 'lambo', marca: 'Lamborghini', file: 'lamborghini-logo.png' },
  { id: 'porsche', marca: 'Porsche', file: 'porsche-logo.svg' },
  { id: 'mclaren', marca: 'McLaren', file: 'mclaren-logo.svg' },
  { id: 'bugatti', marca: 'Bugatti', file: 'bugatti-logo.svg' },
];

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.3) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.3) translateY(-10px); }
`;

const WallContainer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const LogoBox = styled.div<{ $visible: boolean }>`
  position: absolute;
  width: clamp(100px, 12vw, 180px);
  height: clamp(100px, 12vw, 180px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${({ $visible }) => $visible ? fadeIn : fadeOut} 0.5s ease-out forwards;
  pointer-events: none;
`;

const LogoImg = styled.img<{ $isPng: boolean }>`
  max-width: 85%;
  max-height: 85%;
  object-fit: contain;
  ${({ $isPng }) => $isPng ? 'filter: brightness(10) saturate(0);' : ''}
`;

const POSITIONS = [
  { top: '10%', left: '5%' },
  { top: '15%', right: '15%' },
  { top: '35%', left: '40%' },
  { top: '50%', right: '10%' },
  { top: '65%', left: '10%' },
];

export default function LogoWall() {
  const [visible, setVisible] = useState<string[]>([]);

  useEffect(() => {
    const showRandom = () => {
      const count = 2 + Math.floor(Math.random() * 2);
      const shuffled = [...LOGOS].sort(() => Math.random() - 0.5);
      setVisible(shuffled.slice(0, count).map(l => l.id));
    };

    showRandom();
    const interval = setInterval(showRandom, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <WallContainer>
      {LOGOS.map((logo, i) => {
        const pos = POSITIONS[i];
        const isPng = logo.file.endsWith('.png');
        return (
          <LogoBox
            key={logo.id}
            $visible={visible.includes(logo.id)}
            style={{
              top: pos.top,
              left: 'left' in pos ? pos.left : undefined,
              right: 'right' in pos ? pos.right : undefined,
            }}
          >
            <LogoImg
              src={`${CDN_BASE}/${logo.file}`}
              alt={logo.marca}
              $isPng={isPng}
              draggable={false}
            />
          </LogoBox>
        );
      })}
    </WallContainer>
  );
}
