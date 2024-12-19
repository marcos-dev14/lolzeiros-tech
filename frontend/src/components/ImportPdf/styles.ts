import styled from 'styled-components';
import { buttonStyle } from '~styles/components';

type ToastProps = {
  hasError: boolean;
}

export const Container = styled.button.attrs({
  type: 'button'
})`
  ${buttonStyle}

  width: 14.375rem;
  color: #fff;
  /* font-family: "SFProBold"; */

  background-color: #DBDFEB;
  margin-top: 1.25rem;
  color: #0F1331;
  width: 100%;
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
