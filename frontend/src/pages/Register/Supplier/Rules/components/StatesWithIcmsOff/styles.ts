import styled, { keyframes } from 'styled-components';
import { buttonStyle } from '@/src/styles/components';
import { TableContent, TableHeader } from '../../styles';

export const Header = styled(TableHeader)`
  grid-template-columns: 78% 8% 9% 5%;
`;

export const Content = styled(TableContent)`
  grid-template-columns: 78% 8% 9% 5%;
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