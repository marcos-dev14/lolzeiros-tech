import styled from 'styled-components';

export const ProductOptionalsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ProductOptionalsHeader = styled.div`
  display: grid;
  grid-template-columns: 5% 43% 17% 17% 14% 4%;
  width: 100%;
  border-radius: 0.25rem 0.25rem 0 0;
  background-color: #F4F5F8;
  height: 2.75rem;
  margin-top: 1.25rem;

  strong {
    font-size: 0.75rem;
    font-family: "Roboto";
    font-weight: bold;
    text-transform: uppercase;
  }

  > div {
    display: flex;
    align-items: center;
    padding: 0 0.625rem;

    &:not(:first-child) {
      border-left: 1px solid ${({ theme }) => theme.colors.medium_gray};
    }

    &:last-child {
      justify-content: space-between;
    }
  }
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 5% 43% 17% 17% 14% 4%;
  width: 100%;
  background-color: #fff;
  height: 2.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.medium_gray};
    
  &:nth-child(2) {
    /* background-color: #f09; */
    border-top: 1px solid ${({ theme }) => theme.colors.medium_gray};
  }

  > div {
    display: flex;
    align-items: center;
    padding: 0 0.625rem;

    &:not(:first-child) {
      border-left: 1px solid ${({ theme }) => theme.colors.medium_gray};
    }

    &:last-child {
      justify-content: space-between;
    }
  }
`;
