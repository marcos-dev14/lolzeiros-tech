import styled, { css } from "styled-components";

interface IndicatorProps {
  isFocused: boolean;
  twoLines: boolean;
}

interface TitleProps {
  disabled: boolean;
  isOnSafari: boolean;
}

export const Title = styled.strong<TitleProps>`
  font-family: "Roboto";
  font-weight: bold;
  font-size: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  height: 0.625rem;
  line-height: 0.625rem;
  text-transform: uppercase;

  ${({ isOnSafari }) => isOnSafari && css`
    font-family: "Roboto";
    font-weight: bold;
  `}
`;

export const Indicator = styled.span<IndicatorProps>`
  align-self: stretch;
  background-color: #bec2c8;
  width: 1px;
  /* height: 30.5px; */
  height: ${({ twoLines }) => (twoLines ? 50.5 : 30.5)}px;
  display: ${({ isFocused }) => (isFocused ? "none" : "block")};
  user-select: none;

  img {
    width: 30px;
    user-select: none;
  }
`;

export const DropdownImage = styled.img``;

export const Menu = styled.button.attrs({
  type: "button",
})`
  padding: 2px 8px;
  background-color: #f4f5f8;
  color: #424242;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 32px;
  width: 213px;
  margin-left: 4px;

  font-size: 12px;
  line-height: 16px;
  font-family: "Roboto";
  letter-spacing: 0px;

  span {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  img {
    margin-right: 10px;
  }
`;
