import styled from 'styled-components';

type PageButtonProps = {
  selected: boolean;
}

export const Container = styled.div`
  display: flex;
  max-width: 23.75rem;
  background-color: #fff;
`;

export const ChangePageButton = styled.button`
  width: 5.75rem;
  height: 2.5rem;
  border: ${({ theme }) => `1px solid ${theme.colors.medium_gray}`};
  background-color: #fff;
  font-size: 0.875rem;

  &.left {
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
  }

  &.right {
    border-left-width: 0;
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  &[disabled] {
    cursor: not-allowed;
    color: ${({ theme }) => theme.colors.placeholder};
  }
  
  color: ${({ theme }) => theme.colors.primary};
`;

export const PageButton = styled.button<PageButtonProps>`
  width: 2.5rem;
  height: 2.5rem;
  color:
    ${({ theme, selected }) => selected ? theme.colors.white : theme.colors.text};
  border: ${({ theme }) => `1px solid ${theme.colors.medium_gray}`};
  border-left: none;
  font-size: 0.875rem;
  background-color:
    ${({ theme, selected }) => selected ? theme.colors.primary : theme.colors.white};
`;


