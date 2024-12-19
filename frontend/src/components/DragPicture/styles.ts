import styled, { css } from 'styled-components';

type ContainerProps = {
  file: string;
}

type ToastProps = {
  hasError: boolean;
}

export const Container = styled.div<ContainerProps>`  
  background-color: #F4F5F8;
  width: 21.875rem;
  height: 21.875rem;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  text-align: center;
  background-image: ${({ file }) => `url(${file})`};
  background-size: cover;

  > p {
    font-size: 0.75rem;
    line-height: 1rem;
  }

  &::before {
    content: '';
    position: absolute;
    /* width: 21.875rem; */
    /* height: 21.875rem; */
    width: 100%;
    height: 100%;
    border-radius: 1rem;
  }
  
  &:hover {
    &::before {
      transition: all 0.2s;
      background-color: rgba(0,0,0,0.6);
    }

    p {
      z-index: 2;
      color: #fff;
    }
  }

  ${({ file }) => file && css`
    transition: all 0.2s;
    
    p {
      opacity: 0;
    }

    &:hover {
      p {
        opacity: 1;
      }
    }
  `}
`;

export const Toast = styled.div<ToastProps>`
  width: 19.875rem;
  height: 3rem;
  border-radius: 1rem;
  background-color: #fa3030;
  color: #fff;
  position: absolute;
  display: flex;
  transition: all 0.4s;
  opacity: ${({ hasError }) => hasError ? 1 : 0};
  align-items: center;
  justify-content: center;
  bottom: 1rem;
  
  p {
    line-height: 3rem;
  }
`;

export const DeletePhoto = styled.button`
  position: absolute;
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 50%;
  background-color: #FF7373;

  top: 1rem;
  right: 1rem;
  /* transform: translate(50%, -50%); */

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 50%;
    height: 50%;
  }

  &[disabled] {
    cursor: not-allowed;
  }
`;