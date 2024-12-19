import styled, { keyframes } from 'styled-components';
import { buttonStyle, MainContainer, SectionTitle } from '~styles/components';
import { MainTable, TableFooter } from '~styles/components/tables';

export const Container = styled(MainContainer)`
  max-width: 1160px;
`;

export const CustomSectionTitle = styled(SectionTitle)`
  margin-top: 1.25rem;
  background-color: #040C22;
  color: ${({ theme }) => theme.colors.white};
  font-weight: normal;
`;

export const Table = styled(MainTable)`
  margin-top: 1.25rem;
  padding-bottom: 2rem;
`;

export const TableHeader = styled.div`
  display: flex;
  width: 100%;

  /* div {
    display: flex;
  } */
`;

const rotate = keyframes` /** widtwidtwidth: 840px;h: 840px;h: 840px;animação para rotacionar o icon. */
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Button = styled.button`
  ${buttonStyle}
  color: #0F1331;
  width: 8.125rem;
  margin-left: auto;

  &.newProduct {
    width: 14.375rem;
  }

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg.load {
    stroke: #0F1331;
    animation: ${rotate} 2s linear infinite;
  }
`;

export const SalesTableFooter = styled(TableFooter)`
  p { 
    p { 
      display: inline;
      color: #21D0A1;

      &:last-child {
        color: #3798CD;
      }
    }
  }
`;

export const badgeColors = {
  'Todos': '#040C22',
  'Novo': '#FF9D25',
  'Recebido': '#43BDFF',
  'Transmitido': '#3699CF',
  'Faturado': '#21D0A1',
  'Pausado': '#B7BFC9',
  'Cancelado': '#FF6F6F',
}

export const Badge = styled.div<{ status: 'Todos' | 'Novo' | 'Recebido' | 'Transmitido' | 'Faturado' | 'Pausado' | 'Cancelado' }>`
  height: 1.25rem;
  border-radius: 0.625rem;
  
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  
  padding: 0 1rem;
  background-color: ${({ status }) => badgeColors[status]};

  p {
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.625rem;
  }
  
  svg {
    width: 0.625rem;
    margin-right: 0.25rem;
  }
`;