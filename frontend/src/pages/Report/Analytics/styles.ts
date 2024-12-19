import styled from 'styled-components';
import { MainContainer, buttonStyle } from '~styles/components';
import { MainTable } from '~styles/components/tables';

type FilterProps = {
  bg: string;
  buttonBg: string;
}

export const Container = styled(MainContainer)`
  max-width: 1160px;
`;

export const TableContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 20.625rem 20.625rem 26.25rem;
  gap: 0 1.25rem;
`;

export const Table = styled(MainTable)`
  margin-top: 1.25rem;
`;

export const Button = styled.button`
  ${buttonStyle}
  width: 8.75rem;
  margin-left: 2.5rem;
`;

export const FilterContainer = styled.div`
  margin: 1.875rem 1.25rem;
  margin-left: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.875rem;
`;

export const Filter = styled.div<FilterProps>`
  width: 100%;
  height: 8rem;
  border-radius: 0.75rem;
  background-color: ${({ bg }) => bg};
  display: flex;
  flex-direction: column;
`;

export const FilterContent = styled.div`
  display: grid;
  padding-left: 1.25rem;
  margin-top: 0.75rem;
  width: 100%;
  grid-template-columns: 1.5rem auto;
  column-gap: 1rem; 
  color: #fff;

  > svg {
    margin-top: 0.375rem;
  }
  
  p {
    font-size: 0.875rem;
  }

  strong {
    font-weight: normal;
    margin: 0.25rem 0;
    font-size: 1.625rem;
  }
`;
