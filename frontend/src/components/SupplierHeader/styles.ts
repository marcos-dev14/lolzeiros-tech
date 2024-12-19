import styled, { css } from 'styled-components';
import { darken } from 'polished';
import { buttonStyle } from '../../styles/components';

type HeaderButtonProps = {
  width?: string;
  selected: boolean;
}

export const Container = styled.div`
  display: flex;

  button:not(:first-child, .goBack) {
    margin-left: 2.5rem;
  }

`;

export const Button = styled.button<HeaderButtonProps>`
  ${buttonStyle}

  width: ${({ width }) => !!width ? width : '10.625rem'};

  ${({ selected }) => selected && css`
    color: #fff;
    background-color: #1279B1;
    `};
    
    &:hover {
      transition: all 0.2s;
      color: #fff;
      background-color: ${darken('0.05', '#1279B1')};
    }
`;

export const GoBackButton = styled.button`
  ${buttonStyle}

  margin-left: auto;
  width: 6.25rem;
  background-color: #78C5F0;
  color: #fff;
  
  svg {
    margin-right: 0.25rem;
    width: 0.9375rem;
    height: 0.9375rem;
  }
  
  &:hover {
    transition: all 0.2s;
    background-color: ${darken('0.2', '#78C5F0')};
  }
`;

