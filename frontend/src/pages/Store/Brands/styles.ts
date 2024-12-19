import styled from 'styled-components';
import { buttonStyle, MainContainer } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1160px;
`;

export const OptionsHeader = styled.div`
  display: flex;
  margin-top: 2rem;
  align-items: flex-end;
`;

export const DimensionsContainer = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 1.25rem;
  
  > span {
    height: 2rem;
    display: flex;
    align-items: center;
    margin: 0 0.375rem;
  }

  svg {
    width: 0.75rem;
    height: 0.75rem;
    /* height: 1.75rem; */
  }
`;

export const Button = styled.button`
  ${buttonStyle}
  width: 13.8125rem;
  margin-left: 2.5rem;
`;

export const BrandsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 13.8125rem);
  gap: 2.625rem 4rem;
  margin-top: 4rem;
`;