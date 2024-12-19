import { darken } from 'polished';
import styled, { keyframes } from 'styled-components';
import { buttonStyle, MainContainer } from '~styles/components';
import { MainTable } from '~styles/components/tables';

export const Container = styled(MainContainer)`
  max-width: 1160px;
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
  width: 11.875rem;
  margin-left: 1.25rem;
  
  &.attach {
    width: 12.5rem;
    margin-left: 0;
    
    svg {
      margin-right: 0.25rem;
    }
  }
  
  &.new {
    margin-left: 0;
    width: 17.1875rem;
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

export const GoBackButton = styled.button`
  ${buttonStyle}

  margin-left: auto;
  width: 6.25rem;
  background-color: #DAE0EC;
  color: #fff;
  margin-left: 1.875rem;
  
  svg {
    margin-right: 0.25rem;
    width: 0.9375rem;
    height: 0.9375rem;
  }
  
  &:hover {
    transition: all 0.2s;
    background-color: ${darken('0.2', '#DAE0EC')};
  }
`;

export const AttachmentContainer = styled.div`
  display: grid;
  grid-template-columns: 12.5rem auto;
  align-items: center;
  gap: 0 1.25rem;

  p {
    color: #B7BFC9;
    font-size: 0.75rem;
  }

`;