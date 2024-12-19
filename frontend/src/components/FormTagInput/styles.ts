import styled, { css } from 'styled-components';

type MainContainerProps = {
  noTitle: boolean;
  fullW: boolean;
}

type ContainerProps = {
  width: string;
  validated?: boolean;
}

type InputProps = {
  hasElements: boolean;
}

export const MainContainer = styled.div<MainContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: ${({ noTitle }) => noTitle ? '2rem' : '3.125rem'};

  ${({ fullW }) => fullW && css`
    width: 100%;
  `}

  label {
      font-size: 0.5rem;

    text-transform: uppercase;
    font-family: "Roboto";
    font-weight: bold;
  }
`;

export const Container = styled.div<ContainerProps>`
  width: ${({ width }) => width};
  border-radius: 0.25rem;
  border-width: 1px;
  border-style: solid;
  
  border-color: ${({ theme: { colors }, validated }) =>
    validated ? colors.validatedBorder : colors.medium_gray };
  
  height: 2rem;
  display: flex;
  align-items: center;
  padding-left: 0.375rem;
  overflow-x: scroll;
  
  scrollbar-width: none;
  -ms-overflow-style: none;

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
  }
`;

export const Tag = styled.div`
  /* display: inline-flex; */
  display: flex;
  flex-shrink: 0;
  background-color: #25CFA1;
  height: 1.25rem;
  border-radius: 0.25rem;
  padding: 0 0.625rem 0 0.5rem;
  color: #fbfbfd;
  align-items: center;
  font-size: 0.75rem;

  & + div {
    margin-left: 0.625rem;
  }
`;

export const DeleteTag = styled.button`
  margin-left: 0.625rem;
  border: 0;
  border-radius: 0 0.25rem 0.25rem 0;
  transition: 0.2s;
  color: #fbfdfd;
  background-color: #25CFA1;
`;

export const Input = styled.input<InputProps>`
  height: 1.25rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
  border: none;

  ${({ hasElements }) => hasElements && css`
    margin-left: 0.75rem;
  `}
`;