import styled from "styled-components";

export const Container = styled.div<{ isDragging: boolean }>`
  display: grid;
  grid-template-columns: 6% 16% 16% 57% 5%;
  width: 100%;
  background-color: ${({ isDragging, theme }) => isDragging ? theme.colors.medium_gray : theme.colors.white};
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
    font-size: 0.75rem;
    color: #272E47;

    &:not(:first-child) {
      border-left: 1px solid ${({ theme }) => theme.colors.medium_gray};
    }

    &:last-child {
      padding-right: 0.375rem;
      justify-content: space-between;
    }
  }
`;