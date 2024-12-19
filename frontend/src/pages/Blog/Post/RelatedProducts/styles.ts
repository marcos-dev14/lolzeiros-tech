import styled, { keyframes } from 'styled-components';

import { MainContainer, SectionTitle, buttonStyle } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1346px;
  padding-bottom: 4.5rem;
  min-height: 52rem;
`;

export const CustomSectionTitle = styled(SectionTitle)`
  margin-top: 1.25rem;
`;

// export const ProductsContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 29.375rem);
//   gap: 2.5rem;
//   margin-top: 2.5rem;
// `;

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
  width: 10.625rem;
  margin-left: 1.25rem;

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg.load {
    stroke: #0F1331;
    animation: ${rotate} 2s linear infinite;
  }
`;

export const ProductsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.875rem;
  margin-top: 1.25rem;
`;