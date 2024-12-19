import styled from 'styled-components';
import { buttonStyle, MainContainer } from '~styles/components';
import { MainTable } from '~styles/components/tables';

export const Container = styled(MainContainer)`
  max-width: 1160px;
`;

export const Table = styled(MainTable)`
  margin-top: 1.25rem;
  padding-bottom: 2rem;
`;

export const TableHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  div {
    display: flex;
  }
`;

export const Button = styled.button`
  ${buttonStyle}
  color: #0F1331;
  width: 8rem;
  width: 14.375rem;

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
