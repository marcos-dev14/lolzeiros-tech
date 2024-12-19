import styled from 'styled-components';
import { Box, BoxInput } from '~styles/components/box';

export const Input = styled(BoxInput)`
  border-radius: 0.25rem;
  border-left-width: 1px;
  padding-left: 0.625rem;
`;

export const TitleInputBox = styled(Box)`
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