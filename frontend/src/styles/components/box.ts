import styled, { css } from 'styled-components';
import ReactInputMask from 'react-input-mask';

interface BoxContainerProps {
  fullW?: boolean;
  noTitle?: boolean;
}

interface BoxProps {
  validated: boolean;
}

export interface BoxInputProps extends BoxProps {
  width: string;
  isInput?: boolean;
  error?: boolean;
}

export const inputStyle = css`
  border-style: solid;
  border-width: 1px;
  border-left-width: 0;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;

  color: ${({ theme }) => theme.colors.text};
    
  height: 2rem;
    
  font-size: 0.75rem;
  padding-left: 0.59375rem;
  padding-right: 0.35rem;

  &[disabled] {
    background-color: ${({ theme }) => theme.colors.disabledBg};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
    font-style: italic;
  }
`;

export const Box = styled.div<BoxContainerProps>`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  
  height: ${({ noTitle }) => noTitle ? '2rem' : '3.125rem'};
  color: ${({ theme }) => theme.colors.text};

  ${({ fullW }) => fullW && css`
    width: 100%;
  `}

  label {
    font-size: 0.5rem;
    text-transform: uppercase;
    font-family: "Roboto";
    font-weight: bold;
  }
  
  > div {
    display: flex;
    flex-direction: row;

    &.status {
      justify-content: space-between;
    }
  }
`;

export const BoxBadge = styled.span<BoxProps>`
  border-style: solid;
  border-width: 1px;
  border-color: ${({ theme, validated }) =>
    validated ? theme.colors.validatedBorder : theme.colors.medium_gray};
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  background-color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;
    
  height: 2rem;
  width: 2rem;
`;

export const BoxInput = styled.input<BoxInputProps>`
  ${inputStyle}
  
  border-color: ${({ theme, validated }) =>
    validated ? theme.colors.validatedBorder : theme.colors.medium_gray};
  width: ${({ width }) => width};
`;

export const BoxTextArea = styled.textarea<BoxInputProps>`
  ${inputStyle}
  
  border-color: ${({ theme, validated }) =>
    validated ? theme.colors.validatedBorder : theme.colors.medium_gray};
  width: ${({ width }) => width};
  resize: none;
`;

export const BoxInputMask = styled(ReactInputMask)<BoxInputProps>`
  ${inputStyle}

  border-color: ${({ theme, validated }) =>
    validated ? theme.colors.validatedBorder : theme.colors.medium_gray};
  width: ${({ width }) => width};
  text-align: left;
`;

export const DateBoxWrapper = styled.div`
  height: 2.75rem;
`;