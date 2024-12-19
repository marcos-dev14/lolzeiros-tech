import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  height: 0.9375rem;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 0.9375rem;
    height: 0.9375rem;
    margin-right: 0.625rem;
    background-color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.medium_gray};
  
    span {
      display: block;
      width: 0.8125rem;
      height: 0.8125rem;
      background-color: #48CF9F;
    }
  }

  p {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.75rem;
    font-family: "Roboto";
    font-weight: bold;
    text-transform: uppercase;
  }
`;
