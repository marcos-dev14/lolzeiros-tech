import styled from "styled-components";
import {
  Box,
  BoxBadge,
  BoxInputProps,
  inputStyle,
} from "../../styles/components/box";

export const CustomBox = styled(Box)`
  position: relative;

  height: 2rem;
`;

export const DateBoxBadge = styled(BoxBadge)`
  min-width: 2rem;
  min-height: 2rem;
`;

export const DateInput = styled.input<BoxInputProps>`
  ${inputStyle}
  background-color: #fff;
  border-color: ${({ theme, validated }) =>
    validated ? theme.colors.validatedBorder : theme.colors.medium_gray};
  width: ${({ width }) => width};
  text-align: left;
  padding: 0 0.375rem;

  p {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.75rem;
  }

  b {
    color: #b7bfc9;
  }
`;

export const DateBoxInput = styled.input<BoxInputProps>`
  ${inputStyle}
  background-color: #fff;
  border-color: ${({ theme, validated }) =>
    validated ? theme.colors.validatedBorder : theme.colors.medium_gray};
  width: ${({ width }) => width};
  text-align: left;
  padding: 0 0.375rem;

  p {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.75rem;
  }

  b {
    color: #b7bfc9;
  }
`;
