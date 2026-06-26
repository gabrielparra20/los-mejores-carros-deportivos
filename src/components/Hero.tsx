import styled from 'styled-components';
import { motion } from 'framer-motion';
import LogoWall from './LogoWall';

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bg};
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
`;

const Glow = styled.div`
  position: absolute;
  width: 60vw;
  height: 40vw;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(230, 57, 70, 0.08) 0%, transparent 70%);
  pointer-events: none;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(0.875rem, 2vw, 1.125rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.3em;
  margin-bottom: 1.5rem;
  font-weight: 400;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 10vw, 6rem);
  font-weight: 900;
  font-family: ${({ theme }) => theme.fonts.display};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.text} 0%, ${({ theme }) => theme.colors.accent} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  margin-bottom: 1rem;
`;

const Tagline = styled(motion.p)`
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  font-weight: 300;
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

const ScrollDot = styled(motion.div)`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
`;

export default function Hero() {
  return (
    <HeroSection>
      <Glow />
      <LogoWall />
      <Content>
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          La leyenda sobre ruedas
        </Subtitle>
        <Title
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
          VELOCITY
          <br />
          ICONS
        </Title>
        <Tagline
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
        >
          Los autos más rápidos e icónicos de cada marca. Una colección de bestias que marcaron la historia.
        </Tagline>
      </Content>
      <ScrollIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span>Descubrí</span>
        <ScrollDot
          animate={{ y: [0, 8, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </ScrollIndicator>
    </HeroSection>
  );
}
