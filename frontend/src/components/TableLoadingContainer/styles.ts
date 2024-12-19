import styled, { keyframes } from 'styled-components';

export const rotate = keyframes` /** widtwidtwidth: 840px;h: 840px;h: 840px;animação para rotacionar o icon. */
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.p`
  display: flex;
  height: 20rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  span {
    color: #767778;
    font-size: 1.25rem;
    margin-top: 1rem;
  }

  svg {
    stroke: #767778;
    width: 2.5rem;
    height: 2.5rem;
    animation: ${rotate} 2s linear infinite;
  }
`;
