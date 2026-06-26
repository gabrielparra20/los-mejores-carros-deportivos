import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import CarCard from '../components/CarCard';
import carsData from '../data/cars.json';

const GridSection = styled.section`
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  contain: layout style;
  content-visibility: auto;
`;

const SectionTitle = styled(motion.h2)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const SectionSubtitle = styled(motion.p)`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 3rem;
  font-size: 0.95rem;
`;

const Divider = styled.div`
  width: 60px;
  height: 2px;
  background: ${({ theme }) => theme.colors.accent};
  margin: 1rem auto 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
`;

const FilterBar = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
`;

const FilterBtn = styled.button<{ $active: boolean }>`
  background: ${({ $active, theme }) => $active ? theme.colors.accent : 'transparent'};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.textSecondary};
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.border};
  padding: 0.5rem 1.25rem;
  border-radius: 2rem;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const paises = ['Todos', 'Italia', 'Alemania', 'Reino Unido', 'Francia'];

export default function Home() {
  const [filter, setFilter] = useState('Todos');

  const leyendas = carsData.filter(car => car.categoria === 'leyenda');
  const clasicos = carsData.filter(car => car.categoria === 'clasico');

  const filteredClasicos = filter === 'Todos'
    ? clasicos
    : clasicos.filter(car => car.pais === filter);

  return (
    <>
      <Hero />

      <GridSection>
        <SectionTitle
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          ⭐ Leyendas
        </SectionTitle>
        <SectionSubtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Los hypercars más icónicos que marcaron la historia
        </SectionSubtitle>
        <Divider />
        <Grid>
          {leyendas.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </Grid>
      </GridSection>

      <GridSection>
        <SectionTitle
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          🏎️ Clásicos Modernos
        </SectionTitle>
        <SectionSubtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Los segundos mejores — igual de impresionantes
        </SectionSubtitle>
        <Divider />

        <FilterBar
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {paises.map(pais => (
            <FilterBtn
              key={pais}
              $active={filter === pais}
              onClick={() => setFilter(pais)}
            >
              {pais}
            </FilterBtn>
          ))}
        </FilterBar>

        <Grid>
          {filteredClasicos.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </Grid>
      </GridSection>
    </>
  );
}
