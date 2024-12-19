import { darken } from 'polished';
import styled, { keyframes } from 'styled-components';
import { buttonStyle, MainContainer } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1346px;
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
  width: 8rem;

  &.newProduct {
    width: 14.375rem;
    margin-left: auto;
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
  background-color: #78C5F0;
  color: #fff;
  margin-left: 2.875rem;
  
  svg {
    margin-right: 0.25rem;
    width: 0.9375rem;
    height: 0.9375rem;
  }
  
  &:hover {
    transition: all 0.2s;
    background-color: ${darken('0.2', '#78C5F0')};
  }
`;

export const EditButton = styled.button`
  ${buttonStyle}

  padding: 0 2rem;
  background-color: #78C5F0;
  color: #fff;

  svg {
    margin-right: 0.25rem;
    width: 2rem;
    height: 2rem;
  }

  &:hover {
    transition: all 0.2s;
    background-color: ${darken('0.2', '#78C5F0')};
  }

  /* Adiciona estilo para o botão desabilitado */
  &:disabled {
    background-color: #D3D3D3; /* Substitua pela cor desejada para o botão desabilitado */
    cursor: not-allowed;
    color: #A9A9A9; /* Substitua pela cor desejada para o texto do botão desabilitado */
  }
`;

export const CancelButton = styled.button`
  ${buttonStyle}

  margin-left: auto;
  width: 6.25rem;
  background-color: #d9534f;
  color: #fff;
  margin-left: 2.875rem;
  
  svg {
    margin-right: 0.25rem;
    width: 2rem;
    height: 2rem;
  }
  
  &:hover {
    transition: all 0.2s;
    background-color: ${darken('0.2', '#b52b27')};
  }
`;