import styled, { keyframes, css } from 'styled-components';
import { darken } from 'polished';

import { buttonStyle, MainContainer } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1346px;
  width: 1346px;
  padding-bottom: 2.25rem;
`;

const rotate = keyframes` /** widtwidtwidth: 840px;h: 840px;h: 840px;animação para rotacionar o icon. */
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const RulesButton = styled.button`
  ${buttonStyle};
  width: auto;
  padding: 2.125rem;
  
  svg {
    stroke: ${({ theme }) => theme.colors.text};
    width: 1.25rem;
    height: 1.25rem;
    animation: ${rotate} 2s linear infinite;
  }

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const GoBackButton = styled.button`
  ${buttonStyle}

  margin-left: auto;
  width: 6.25rem;
  background-color: #78C5F0;
  color: #fff;
  
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

export const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 18.75rem);
  grid-template-rows: 11.5rem;
  grid-gap: 1.875rem;
  width: 100%;
  margin-top: 1.25rem;
`;

export const GalleryImage = styled.div<{ disabled: boolean, image: string }>`
  display: flex;
  margin: 0;
  border-radius: 1rem;
  background-color: #DBDFEB;
  width: 18.75rem;
  height: 11.5rem;
  /* display: flex; */
  align-items: center;
  justify-content: center;

  display: grid;
  grid-template-columns: repeat(3, 3.5rem);

  background-image: ${({ image }) => `url(${image})`};
  /* background-size: 18.75rem 11.5rem; */
  background-size: cover;
  background-position: center;

  ${({ disabled }) => disabled && css`
    opacity: 0.6;
  `};

  a, button {
    z-index: 7;
    background: none;
  }

  svg {
    opacity: 0;
    width: 3.5rem;
    height: 3.5rem;
  }

  &::before {
    content: '';
    position: absolute;
    /* width: 21.875rem; */
    /* height: 21.875rem; */
    width: 18.75rem;
    height: 11.5rem;
    border-radius: 1rem;
  }

  &:hover {
    color: #fff;

    &::before {
      transition: all 0.2s;
      background-color: rgba(0,0,0,0.6);
    }

    svg {
      opacity: 1;
      z-index: 2;
    }
  }
`;

export const MeasuresContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 10.625rem;
`;

export const DimensionsContainer = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 1.25rem;
  
  p {
    margin: 0 0.375rem;
    color: #0F1331;
    height: 1.75rem;
  }
`;

export const Button = styled.button`
  ${buttonStyle}
  color: #0F1331;
  width: 14.375rem;
  margin-left: auto;

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg.load {
    stroke: #0F1331;
    animation: ${rotate} 2s linear infinite;
  }

  &.viewing {
    background-color: #25CFA1;
    margin-left: auto;
    color: #fff;

    &:hover {
      transition: all 0.2s;
      background-color: ${darken('0.2', '#25CFA1')};
    }
  } 
`;