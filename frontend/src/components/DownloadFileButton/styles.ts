import { buttonStyle } from "@/src/styles/components";
import styled from "styled-components";
import { rotate } from "../LoadingContainer/styles";

export const Button = styled.button`
  ${buttonStyle}
  color: #0F1331;
  width: 8.125rem;
  margin-left: auto;

  &.newProduct {
    width: 14.375rem;
  }

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg.load {
    stroke: #0F1331;
    animation: ${rotate} 2s linear infinite;
  }
`;