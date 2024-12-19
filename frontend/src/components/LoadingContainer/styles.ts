import styled, { keyframes } from 'styled-components';

export const rotate = keyframes` /** widtwidtwidth: 840px;h: 840px;h: 840px;animação para rotacionar o icon. */
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 40rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;

  p {
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
