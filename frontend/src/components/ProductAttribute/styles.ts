import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1.25rem;
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: 5% 25% 66% 4%;
  width: 100%;
  border-radius: 0.25rem 0.25rem 0 0;
  background-color: #F4F5F8;
  height: 2.75rem;

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

export const AttributeName = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  justify-content: space-between;
  align-items: center;
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 5% 25% 66% 4%;
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

export const ArrangeOrderButton = styled.button`
  width: 100%;
  height: 2rem;
  border-radius: 0.25rem;
  background: none;

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
