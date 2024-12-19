import styled, { css } from 'styled-components';

type ContainerProps = {
  disabled: boolean;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  width: 13.8125rem;
  height: 19.75rem;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.medium_gray};
  padding: 0.625rem;
  position: relative;
  
  ${({ disabled }) => disabled && css`
    opacity: 0.6;
  `}
`;

export const Picture = styled.img`
  height: 12.5rem;
  width: 12.5rem;
  border-radius: 0.5rem;
  /* border: 1px solid ${({ theme }) => theme.colors.medium_gray}; */
  object-fit: cover;
  background-color: #DBDFEB;
`;

export const OverlayHighlightImage = styled.img`
  position: absolute;
  top: 0.625rem;
  left: 0.625rem;
  right: 0.625rem;
  border: 1px solid ${({ theme }) => theme.colors.medium_gray};
  /* border: 1px solid #FF7373; */
  
  width: 12.5rem;
  height: 12.5rem;
  border-radius: 0.5rem;
  object-fit: cover;
  z-index: 1;
`;

export const DropPicture = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #FF7373;
  top: 0;
  left: 0;
  z-index: 2;
`;

export const SetPicture = styled.button`
  position: absolute;
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 50%;
  background-color: #FF7373;
  
  /* top: 68.75%; */
  top: 66.25%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
`;


export const DeleteSupplier = styled.button`
  position: absolute;
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 50%;
  background-color: #FF7373;

  top: 0%;
  right: 0%;
  transform: translate(50%, -50%);

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 50%;
    height: 50%;
  }
`;