import styled from 'styled-components';

type ContainerProps = {
  hasMargin?: boolean;
  customHeight?: boolean;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: ${({ customHeight }) => customHeight ? '3.125rem' : '2.5rem'};
  margin-top: ${({ hasMargin }) => hasMargin ? '1.25rem' : 0};
`;

export const Title = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.5rem;
  text-transform: uppercase;
  font-family: "Roboto";
  font-weight: bold;
`;

export const BoxContainer = styled.div`
  display: flex;

  > div {
    &:not(:first-child) {
      margin-left: 1.875rem;
    }
  }
`;

export const Box = styled.div`
  display: flex;
  align-items: center;
  height: 0.875rem;
  
  div {
    width: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 0.875rem;
    margin-right: 0.25rem;
    background-color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.medium_gray};
    border-radius: 50%;
    
    span {
      display: block;
      width: 0.5rem;
      height: 0.5rem;
      background-color: #48CF9F;
      border-radius: 50%;
    }
  }

  p {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.75rem;
  }
`;
