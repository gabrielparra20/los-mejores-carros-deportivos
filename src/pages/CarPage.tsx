import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import carsData from '../data/cars.json';
import CarDetail from '../components/CarDetail';

const Nav = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.glassmorphism};
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.text};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const NextPrev = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavBtn = styled(Link)`
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export default function CarPage() {
  const { id } = useParams();
  const car = carsData.find(c => c.id === id);
  const currentIndex = carsData.findIndex(c => c.id === id);
  const prevCar = currentIndex > 0 ? carsData[currentIndex - 1] : null;
  const nextCar = currentIndex < carsData.length - 1 ? carsData[currentIndex + 1] : null;

  return (
    <>
      <Nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Logo to="/">VELOCITY ICONS</Logo>
        <NavLinks>
          <NavLink to="/">← Colección</NavLink>
          <NextPrev>
            {prevCar && <NavBtn to={`/auto/${prevCar.id}`}>← Anterior</NavBtn>}
            {nextCar && <NavBtn to={`/auto/${nextCar.id}`}>Siguiente →</NavBtn>}
          </NextPrev>
        </NavLinks>
      </Nav>
      <CarDetail car={car} />
    </>
  );
}
