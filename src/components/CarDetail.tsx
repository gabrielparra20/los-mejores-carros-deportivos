import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { Car } from '../types';
import Car3DViewer from './Car3DViewer';
import { useEngineSound } from '../hooks/useEngineSound';

const Section = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  overflow: hidden;
`;

const GlowBg = styled.div`
  position: absolute;
  width: 80vw;
  height: 60vw;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(230, 57, 70, 0.06) 0%, transparent 70%);
  pointer-events: none;
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
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

/* ─── Brand gradients for detail ─── */
const BRAND_GRADIENTS_DETAIL: Record<string, string> = {
  Ferrari: 'linear-gradient(135deg, #ff1a1a 0%, #8b0000 40%, #1a0000 100%)',
  Lamborghini: 'linear-gradient(135deg, #f5a623 0%, #8b4513 40%, #1a0a00 100%)',
  Porsche: 'linear-gradient(135deg, #1a1a1a 0%, #8b0000 40%, #1a0000 100%)',
  McLaren: 'linear-gradient(135deg, #ff6600 0%, #1a1a1a 40%, #0a0a0a 100%)',
  Bugatti: 'linear-gradient(135deg, #1a1a2e 0%, #8b0000 40%, #1a0000 100%)',
};

const ImageWrapper = styled(motion.div)`
  position: relative;
  perspective: 1000px;
`;

const CarImage = styled.div<{ $marca: string }>`
  width: 100%;
  aspect-ratio: 4/3;
  background: ${({ $marca }) => BRAND_GRADIENTS_DETAIL[$marca] || 'linear-gradient(135deg, #1a1a1a, #333)'};
  border-radius: 1.5rem;
  overflow: hidden;
  transform-style: preserve-3d;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.15s ease-out;
  will-change: transform;
`;


const LogoAnim = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.06;
  pointer-events: none;
  white-space: nowrap;
  letter-spacing: 0.1em;
`;

const InfoSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BackBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  transition: color 0.2s ease;
  margin-bottom: 1rem;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const MarcaLabel = styled.span`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const BrandLogoSm = styled.img`
  height: 1.2rem;
  width: auto;
  opacity: 0.6;
`;

const CatBadge = styled.span<{ $tipo: string }>`
  display: inline-block;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  padding: 0.2rem 0.5rem;
  border-radius: 0.2rem;
  background: ${({ $tipo }) => $tipo === 'leyenda' ? 'rgba(230,57,70,0.15)' : 'rgba(255,255,255,0.06)'};
  color: ${({ $tipo }) => $tipo === 'leyenda' ? '#e63946' : 'rgba(255,255,255,0.5)'};
  border: 1px solid ${({ $tipo }) => $tipo === 'leyenda' ? 'rgba(230,57,70,0.3)' : 'rgba(255,255,255,0.1)'};
  margin-left: auto;
`;

const ModeloTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 900;
  line-height: 1.1;
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1.5rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SpecItem = styled.div`
  text-align: center;

  span:first-child {
    display: block;
    font-size: 1.25rem;
    font-weight: 700;
    font-family: ${({ theme }) => theme.fonts.display};
    color: ${({ theme }) => theme.colors.accent};
  }

  span:last-child {
    display: block;
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 0.25rem;
  }
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.7;
`;

const StoryToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.accent};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 0;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const StoryBox = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surfaceGlass};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StoryText = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;

  & + & {
    margin-top: 1rem;
  }
`;

const FamosoBox = styled.div`
  background: linear-gradient(135deg, rgba(212, 168, 83, 0.08), rgba(230, 57, 70, 0.08));
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(212, 168, 83, 0.2);
`;

const FamosoTitle = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.colors.gold};
  font-weight: 700;
`;

const FamosoText = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 0.5rem;
  line-height: 1.6;
  font-style: italic;
`;

interface CarDetailProps {
  car: Car | undefined;
}

export default function CarDetail({ car }: CarDetailProps) {
  const [showStory, setShowStory] = useState(false);
  const [logoVisible, setLogoVisible] = useState(true);
  const sound = useEngineSound(car?.id);

  if (!car) {
    return (
      <Section>
        <p>Auto no encontrado</p>
        <BackBtn to="/">Volver al inicio</BackBtn>
      </Section>
    );
  }

  return (
    <Section>
      <GlowBg />
      <Container>
        <ImageWrapper
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <CarImage
            $marca={car.marca}
            onMouseEnter={() => setLogoVisible(true)}
            onMouseLeave={() => setLogoVisible(false)}
          >
            <Car3DViewer
              src={`/images/${car.imagen}`}
              alt={`${car.marca} ${car.modelo}`}
              marca={car.marca}
              onHover={sound.play}
              onLeave={sound.stop}
            />
            <AnimatePresence>
              {logoVisible && (
                <LogoAnim
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.08, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                >
                  {car.marca.toUpperCase()}
                </LogoAnim>
              )}
            </AnimatePresence>
          </CarImage>
        </ImageWrapper>

        <InfoSection
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <BackBtn to="/">← Todos los autos</BackBtn>
          <MarcaLabel>
            {BRAND_LOGO_FILE[car.marca] && (
              <BrandLogoSm
                src={`${CDN_BASE}/${BRAND_LOGO_FILE[car.marca]}`}
                alt={car.marca}
              />
            )}
            {car.pais} · {car.marca}
            {car.categoria && <CatBadge $tipo={car.categoria}>{car.categoria}</CatBadge>}
          </MarcaLabel>
          <ModeloTitle>{car.modelo}</ModeloTitle>

          <SpecsGrid>
            <SpecItem>
              <span>{car.especificaciones.potencia}</span>
              <span>HP</span>
            </SpecItem>
            <SpecItem>
              <span>{car.especificaciones.aceleracion}s</span>
              <span>0-100 km/h</span>
            </SpecItem>
            <SpecItem>
              <span>{car.especificaciones.velocidadMaxima}</span>
              <span>km/h</span>
            </SpecItem>
          </SpecsGrid>

          <Description>{car.impacto}</Description>

          <StoryToggle onClick={() => setShowStory(!showStory)}>
            {showStory ? '▼' : '▶'} {showStory ? 'Ocultar historia' : 'Leer historia completa'}
          </StoryToggle>

          <AnimatePresence initial={false}>
            {showStory && (
              <StoryBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <StoryText><strong>Historia:</strong> {car.historia}</StoryText>
                <StoryText><strong>Motivación:</strong> {car.motivacion}</StoryText>
              </StoryBox>
            )}
          </AnimatePresence>

          {car.famosoPor && (
            <FamosoBox>
              <FamosoTitle>⭐ Por qué es leyenda</FamosoTitle>
              <FamosoText>{car.famosoPor}</FamosoText>
            </FamosoBox>
          )}
        </InfoSection>
      </Container>
    </Section>
  );
}
