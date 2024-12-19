import styled from 'styled-components';

export const ModalTitle = styled.p`
  &::before {
    content: 'iiiii';
    /* display: inline-block; */
    width: 1.75rem;
    height: 1.75rem;
    margin-right: 0.625rem;
    color: #FFC047;
    background-color: #FFC047;
  }

  font-family: "Roboto";
  font-weight: bold;
  font-size: 1.375rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const CloseModal = styled.button`
  position: absolute;
  top: 0.625rem;
  right: 0.625rem;
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 50%;
  background-color: #FF7373;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1rem;
    height: 1rem;
  }
`;
