import styled from 'styled-components';
import { buttonStyle, MainContainer } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1160px;
  min-height: 600px;
`;

export const CustomHeader = styled.div`
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
  width: 17.25rem;
`;
