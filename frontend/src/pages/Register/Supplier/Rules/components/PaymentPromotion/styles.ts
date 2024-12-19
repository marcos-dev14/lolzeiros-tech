import styled, { keyframes } from 'styled-components';
import { TableContent, TableHeader } from '../../styles';
import { buttonStyle } from '~styles/components';

export const Header = styled(TableHeader)`
  grid-template-columns: 15% 15% 66% 4%;
  height: 2.75rem;
`;

export const Content = styled(TableContent)`
  grid-template-columns: 15% 15% 66% 4%;
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
  ${buttonStyle};
  width: 10rem;
  
  svg {
    stroke: ${({ theme }) => theme.colors.text};
    width: 1.25rem;
    height: 1.25rem;
    animation: ${rotate} 2s linear infinite;
  }
`;

