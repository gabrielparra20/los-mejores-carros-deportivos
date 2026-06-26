import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { Car } from '../types';
import { useTilt3D } from '../hooks/useTilt3D';
import { useEngineSound } from '../hooks/useEngineSound';

const Card = styled(motion(Link))`
  display: block;
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: border-color 0.3s ease;
  min-height: 340px;
  contain: layout style;
  content-visibility: auto;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@v1.0.0';

const BRAND_LOGO_FILE: Record<string, string> = {
  Ferrari: 'ferrari-logo.svg',
  Lamborghini: 'lamborghini-logo.png',
  Porsche: 'porsche-logo.svg',
  McLaren: 'mclaren-logo.svg',
  Bugatti: 'bugatti-logo.svg',
};

/* ─── Color palette for each brand ─── */
const BRAND_GRADIENTS: Record<string, string> = {
  Ferrari: 'linear-gradient(135deg, #ff1a1a, #8b0000)',
  Lamborghini: 'linear-gradient(135deg, #f5a623, #8b4513)',
  Porsche: 'linear-gradient(135deg, #1a1a1a, #8b0000)',
  McLaren: 'linear-gradient(135deg, #ff6600, #1a1a1a)',
  Bugatti: 'linear-gradient(135deg, #1a1a2e, #8b0000)',
};

const ImageArea = styled.div<{ $marca: string }>`
  position: relative;
  width: 100%;
  height: 200px;
  background: ${({ $marca }) => BRAND_GRADIENTS[$marca] || 'linear-gradient(135deg, #1a1a1a, #333)'};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const TiltContainer = styled.div`
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.15s ease-out;
`;

const CarImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease, opacity 0.4s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const OverlayPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 25% 50%, rgba(255,255,255,0.03) 0%, transparent 50%);
  pointer-events: none;
`;

const SpeedLines = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;

  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 200%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  }
  &::before { transform: translateY(-30px) rotate(2deg); }
  &::after { transform: translateY(30px) rotate(-2deg); }
`;

const LogoPlaceholder = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  color: rgba(255,255,255,0.12);
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  user-select: none;
  mix-blend-mode: overlay;
`;

const GlowEffect = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(255, 255, 255, 0.1) 0%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  mix-blend-mode: overlay;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const Info = styled.div`
  padding: 1.25rem;
`;

const Marca = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const BrandLogoMini = styled.img`
  height: 0.9rem;
  width: auto;
  opacity: 0.7;
`;

const Modelo = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.125rem;
  margin: 0.35rem 0 0.5rem;
  font-weight: 700;
`;

const Specs = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Spec = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const Badge = styled.span<{ $tipo: string }>`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: ${({ $tipo, theme }) => $tipo === 'leyenda' ? theme.colors.accent : 'rgba(255,255,255,0.08)'};
  color: ${({ $tipo }) => $tipo === 'leyenda' ? 'white' : 'rgba(255,255,255,0.6)'};
  border: ${({ $tipo }) => $tipo === 'leyenda' ? 'none' : '1px solid rgba(255,255,255,0.15)'};
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.3rem 0.6rem;
  border-radius: 0.25rem;
  z-index: 2;
`;

interface CarCardProps {
  car: Car;
  index: number;
}

export default function CarCard({ car, index }: CarCardProps) {
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });
  const tilt = useTilt3D({ maxDeg: 6, scale: 1.02 });
  const sound = useEngineSound(car.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: `${((e.clientX - rect.left) / rect.width) * 100}%`,
      y: `${((e.clientY - rect.top) / rect.height) * 100}%`,
    });
    tilt.handleMouseMove(e as unknown as React.MouseEvent<HTMLDivElement>);
  };

  return (
    <Card
      to={`/auto/${car.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={sound.play}
      onMouseLeave={sound.stop}
    >
      <ImageArea $marca={car.marca}>
        <TiltContainer
          ref={tilt.ref}
          onMouseLeave={tilt.handleMouseLeave}
        >
          <CarImg
            src={`/images/${car.imagen}`}
            alt={`${car.marca} ${car.modelo}`}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </TiltContainer>
        <OverlayPattern />
        <SpeedLines />
        <LogoPlaceholder>
          {car.marca === 'Mercedes-AMG' ? 'AMG' : car.marca.toUpperCase()}
        </LogoPlaceholder>
        <GlowEffect style={{ '--mouse-x': mousePos.x, '--mouse-y': mousePos.y }} />
      </ImageArea>
      <Info>
        <Marca>
          {BRAND_LOGO_FILE[car.marca] && (
            <BrandLogoMini
              src={`${CDN_BASE}/${BRAND_LOGO_FILE[car.marca]}`}
              alt={car.marca}
            />
          )}
          {car.marca}
        </Marca>
        <Modelo>{car.modelo}</Modelo>
        <Specs>
          <Spec>⚡ {car.especificaciones.potencia} HP</Spec>
          <Spec>⏱ {car.especificaciones.aceleracion}s</Spec>
          <Spec>🚀 {car.especificaciones.velocidadMaxima} km/h</Spec>
        </Specs>
      </Info>
      {car.categoria && <Badge $tipo={car.categoria}>{car.categoria}</Badge>}
    </Card>
  );
}
