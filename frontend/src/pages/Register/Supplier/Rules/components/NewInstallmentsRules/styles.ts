import styled, { keyframes } from 'styled-components';
import { Button, TableContent, TableHeader } from '../../styles';

export const RulesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 0.625rem;
  width: 1160px;
`;

export const Rule = styled(RulesContainer)`
  background-color: #F3F4F7;
  border-radius: 0.25rem;
  padding: 0.625rem;
`;

const rotate = keyframes` /** widtwidtwidth: 840px;h: 840px;h: 840px;animação para rotacionar o icon. */
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const CustomButton = styled(Button)`
  margin-left: 1.25rem;
  width: 12.5rem;

  svg {
    stroke: ${({ theme }) => theme.colors.text};
    width: 1.25rem;
    height: 1.25rem;
    animation: ${rotate} 2s linear infinite;
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const Header = styled(TableHeader)`
  /* grid-template-columns: 12% 14% 14% 14% 14% 14% 14% 6%; */
  grid-template-columns: 13% 15% 17% 17% 17% 17% 4%;
  height: 2.75rem;
`;

export const Content = styled(TableContent)`
  /* grid-template-columns: 12% 14% 14% 14% 14% 14% 14% 6%; */
  grid-template-columns: 13% 15% 17% 17% 17% 17% 4%;
`;