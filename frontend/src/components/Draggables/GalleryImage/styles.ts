import styled, { css } from "styled-components";

type Props = {
  image: string;
  disabled: boolean;
  isDragging: boolean;
  isSorting: boolean;
}

export const Container = styled.div<Props>`
  display: flex;
  margin: 0;
  border-radius: 1rem;
  background-color: ${({ isDragging, theme }) => isDragging ? theme.colors.medium_gray : theme.colors.white};
  width: 18.75rem;
  height: 11.5rem;
  /* display: flex; */
  align-items: center;
  justify-content: center;
  position: relative;

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

  > div {
    opacity: 0;
  }
  
  ${({ isDragging }) => !isDragging && css`
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

      > div {
        opacity: 1;
      }

      &::before {
        transition: all 0.2s;
        background-color: rgba(0,0,0,0.6);
      }

      svg {
        opacity: 1;
        z-index: 2;
      }
    }
  `}
  
  ${({ isDragging }) => isDragging && css`
    > div {
      opacity: 1;
    }
  `}
  
  ${({ isSorting }) => isSorting && css`
    opacity: 0.6;
    cursor: not-allowed;
  `}
`;

export const DraggingBadge = styled.div`
  height: 2rem;
  width: 100%;
  border-radius: 1rem 1rem 0 0;
  background-color: #FF9D25;
  display: grid;
  place-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 7;
  transition: all 0.2s;
  
  svg {
    height: 1.125rem;
    opacity: 1;
    z-index: 9;
  }
`;