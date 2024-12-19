import styled, { css } from 'styled-components';
import { SectionTitle, MainContainer, buttonStyle } from '~styles/components';
import { MainTable } from '~styles/components/tables';

type FilterProps = {
  bg: string;
  buttonBg: string;
  active: boolean;
}

type SectionTitleProps = {
  bg: string;
}

export const Container = styled(MainContainer)`
  max-width: 1160px;
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
  margin-top: 1.875rem;
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

  button {
    width: 100%;
    border-radius:  0 0 0.75rem 0.75rem;
    background-color:
      ${({ active, bg, buttonBg }) => active ? bg : buttonBg};
    height: 1.875rem;
    margin-top: auto;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 0.875rem;
    color: #fff;

    ${({ active }) => !active && css`
      svg {
        transform: rotateZ(-90deg);
      }
    `};

    svg {
      margin-left: 0.25rem;
    }
  }
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

export const CustomSectionTitle = styled(SectionTitle)<SectionTitleProps>`
  margin-top: 1.875rem;
  background-color: ${({ bg }) => bg};
  color: #fff;
`;