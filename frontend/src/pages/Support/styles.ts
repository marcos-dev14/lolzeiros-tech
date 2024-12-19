import styled, { keyframes } from 'styled-components';
import { buttonStyle, MainContainer } from '~styles/components';
import { MainTable } from '~styles/components/tables';

export const Container = styled(MainContainer)`
  max-width: 1160px;
`;

export const Table = styled(MainTable)`
  margin-top: 1.25rem;
  padding-bottom: 2rem;
  max-width: 1346px;
`;

export const TableHeader = styled.div`
  display: flex;
  width: 100%;

  div {
    display: flex;
  }
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
  width: 8rem;

  &.newProduct {
    width: 14.375rem;
    margin-left: auto;
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
