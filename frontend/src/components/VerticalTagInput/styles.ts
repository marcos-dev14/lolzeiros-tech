import styled, { css } from 'styled-components';

type ContainerProps = {
  // width: string;
  validated?: boolean;
  disabled: boolean;
  multipleElements: boolean;
}

type InputProps = {
  hasElements: boolean;
}

export const MainContainer = styled.div<{ width: string }>`
  display: grid;
  grid-template-columns: 1fr 6.71rem;
  gap: 0.75rem;
  /* flex-direction: column; */
  justify-content: space-between;
  height: 2rem;
  width: ${({ width }) => width};
  max-width: ${({ width }) => width};

  label {
    font-size: 0.5rem;
    text-transform: uppercase;
    font-family: "Roboto";
    font-weight: bold;
  }
`;

export const Container = styled.div<ContainerProps>`
  width: 100%;
  border-radius: 0.25rem;
  border-width: 1px;
  border-style: solid;
  
  border-color: ${({ theme: { colors }, validated }) =>
    validated ? colors.validatedBorder : colors.medium_gray };
  
  height: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.625rem;
  padding: 0 0.375rem;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  
  /* scrollbar-width: none; */
  /* -ms-overflow-style: none; */
  background-color: ${({ disabled, theme }) => disabled ? theme.colors.disabledBg : theme.colors.white};

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
  }

  ${({ multipleElements }) => multipleElements && css`
    overflow-y: scroll;
    padding: 0.375rem;
    justify-content: center;
  `}
`;

export const Tag = styled.div`
  /* display: inline-flex; */
  display: flex;
  flex: 0;
  background-color: #25CFA1;
  height: 1.25rem;
  border-radius: 0.25rem;
  padding: 0 0.625rem 0 0.5rem;
  color: #fbfbfd;
  align-items: center;
  font-size: 0.75rem;
  margin-right: auto;

  p {
    /* width: 100%; */
    max-width: 20.625rem;
    margin-right: 0.625rem;
    height: 1rem;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;

export const DeleteTag = styled.button`
  margin-right: auto;
  border: 0;
  border-radius: 0 0.25rem 0.25rem 0;
  transition: 0.2s;
  color: #fbfdfd;
  background-color: #25CFA1;
`;

export const Input = styled.input<InputProps>`
  height: 2rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
  
  background-color: ${({ disabled, theme }) => disabled ? theme.colors.disabledBg : theme.colors.white};
  width: 100%;
  
  border-radius: 0.25rem;
  
  border: 1px solid ${({ theme: { colors } }) => colors.medium_gray };
  
  height: 2rem;
  display: flex;
  padding-left: 0.375rem;

  /* ${({ hasElements }) => hasElements && css`
    margin-left: 0.75rem;
  `} */
`;