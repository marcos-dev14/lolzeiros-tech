import { darken } from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  width: 15rem;
  display: flex;
  align-items: center;
  position: relative;
`;

export const Input = styled.input`
  border: none;
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  border-radius: 0.25rem 0 0 0.25rem;
  
  width: 11.875rem;
  height: 2rem;
  padding: 0 2rem 0 0.75rem;

  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  border: ${({ theme }) => `1px solid ${theme.colors.medium_gray}`};

  &::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
    font-style: italic;
  }
`;

export const ClearInput = styled.button`
  width: 0.9375rem;
  height: 0.9375rem;
  border-radius: 50%;
  background-color: #000;
  position: absolute;
  right: 3.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 60%;
    height: 60%;
  }
`;

export const SearchButton = styled.button`
  width: 3.125rem;
  height: 2rem;
  background-color: ${({ theme }) => theme.colors.gray};
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  border: ${({ theme }) => `1px solid ${theme.colors.medium_gray}`};
  border-left-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: #272E47;
  }

  &:hover {
    transition: all 0.2s;
    background-color: ${({ theme }) => darken('0.075', theme.colors.gray)};
  }
`;