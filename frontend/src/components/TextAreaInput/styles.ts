import styled from 'styled-components';
import { Box, BoxTextArea } from '~styles/components/box';

export const TextArea = styled(BoxTextArea)`
  border-radius: 0.25rem;
  border-left-width: 1px;
  font-family: "Roboto";
  padding: 0.625rem;
  height: 3.125rem;
`;

export const TitleInputBox = styled(Box)`
  height: 4.25rem;

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