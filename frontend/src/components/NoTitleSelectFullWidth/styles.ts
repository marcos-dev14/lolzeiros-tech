import styled from "styled-components";

interface IndicatorProps {
  isFocused: boolean;
}

interface TitleProps {
  disabled: boolean;
}

export const Title = styled.strong<TitleProps>`
  text-align: left;
  display: block;
  font-weight: bold;
  text-align: left;
  font: bold 12px/16px "Roboto";
  letter-spacing: 0px;
  color: #424242;
  margin-bottom: 5px;
  height: 16px;
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
`;

export const Indicator = styled.span<IndicatorProps>`
  align-self: stretch;
  background-color: #bec2c8;
  width: 1px;
  height: 30.5px;
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
