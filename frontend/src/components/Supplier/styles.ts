import styled, { css } from 'styled-components';

type ContainerProps = {
  disabled: boolean;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  width: 13.8125rem;
  height: 14.25rem;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.medium_gray};
  padding: 0.625rem;
  position: relative;

  ${({ disabled }) => disabled && css`
    opacity: 0.6;
  `}
`;

export const Picture = styled.img`
  width: 100%;
  height: 6.25rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.medium_gray};
  object-fit: cover;
  background-color: #DBDFEB;
`;

export const DropPicture = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #FF7373;
  top: 0;
  left: 0;
`;

export const SetPicture = styled.button`
  position: absolute;
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 50%;
  background-color: #FF7373;
  
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

  &[disabled] {
    cursor: not-allowed;
  }
`;