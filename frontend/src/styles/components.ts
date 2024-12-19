import { darken } from "polished";
import styled, { css } from "styled-components";

export const MenuAndTableContainer = styled.div`
  display: flex;
  margin: 0.625rem auto 0;
  width: 100%;
  align-items: flex-start;
  justify-content: center;
`;

export const SupplierList = styled.ul`
  width: 100%;
  display: flex;
  gap: 1.25rem;
  list-style: none;
  flex-wrap: wrap;
  margin-top: 1.25rem;

  > li {
    button {
      background-color: #ccc;
      border-radius: 0.5rem;
      padding: 1.25rem;
    }
  }
`;

export const MainContainer = styled.div`
  width: 100%;
  border-radius: 0.5rem;
  background-color: #fff;
  padding: 1.25rem;
`;

export const SectionTitle = styled.div`
  width: 100%;
  height: 1.25rem;
  border-radius: 0.25rem;
  background-color: ${({ theme }) => theme.colors.gray};
  padding-left: 1.25rem;
  display: flex;
  align-items: center;
  letter-spacing: 1.2px;
  margin-top: 2rem;

  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
  font-family: "Roboto";
  font-weight: bold;
  text-transform: uppercase;
`;

export const WrapperCardsCupons = styled.div`
  display: flex;
  gap: .5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.25rem;
`;

export const InputFileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.25rem;

  input::file-selector-button {
    display: none;
  }
`;

export const CardSupplierHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;  

export const LabelListSupplier = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.7rem;

  label {
      width: calc(50% - 0.4rem);
      height: 2rem;
      border-radius: 0.3rem;
      background: #ECEFF6;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-inline: 0.4rem;

      font-size: 0.7rem;
      color: #4B4B4B;
      font-style: normal;
      font-weight: 600;
      line-height: normal;

      cursor: auto;

      &:hover {
        background: #1279B1;
        color: #fff;

        transition: all 0.2s;
      }

      span {
        font-style: normal;
        font-weight: 300;
        line-height: normal;
      }
  }

`;

export const ColumnInputContainer = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    &:not(:first-child) {
      margin-top: 1.25rem;
    }
  }
`;

export const buttonStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  height: 3.125rem;

  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.medium_gray};
  font-size: 1rem;

  &:hover {
    transition: all 0.2s;
    background-color: ${({ theme }) =>
      darken("0.075", theme.colors.medium_gray)};
  }
`;

export const CropImageButton = styled.button`
  width: 20.5rem;
  height: 3rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.dark_green};
  color: #fff;
  position: absolute;
  z-index: 999;
  align-self: center;

  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 1rem;
  font-size: 1.125rem;
`;
