import styled from 'styled-components';
import { Box, BoxTextArea } from '~styles/components/box';

export const Container = styled(BoxTextArea)`
  border-radius: 0.25rem;
  border-left-width: 1px;
  font-family: "Roboto";
  padding: 0.625rem;
  height: 2rem;
`;

export const TitleInputBox = styled(Box)`
  min-height: 3.125rem;
  height: auto;

  > div {
    display: flex;
    justify-content: space-between;
    
    p {
      color: #25CFA1;
      font-family: "Roboto";
      font-weight: bold;
      font-size: 0.5rem;
      text-transform: uppercase;
    }
  }
`;