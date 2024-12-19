import styled, { css } from "styled-components";
import { Box } from "../../styles/components/box";

type CustomBoxProps = {
  noTitle: boolean;
};

export const CustomBox = styled(Box)<CustomBoxProps>`
  ${({ noTitle }) =>
    noTitle &&
    css`
      height: 3rem;
    `}
`;

export const Measure = styled.p`
  font-size: 0.75rem;
  text-transform: uppercase;
  font-family: "Roboto";
  font-weight: bold;

  color: ${({ theme }) => theme.colors.primary};
`;
