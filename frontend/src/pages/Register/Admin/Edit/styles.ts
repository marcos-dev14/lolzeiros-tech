import { darken } from 'polished';
import styled, { css, keyframes } from 'styled-components';
import { buttonStyle, MainContainer, SectionTitle } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1346px;
  width: 1346px;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Button = styled.button`
  ${buttonStyle}
  color: #0F1331;
  width: 8rem;
  margin-left: 1.25rem;

  &.validate {
    width: 9.375rem;
    color: #fff;
    background-color: #21D0A1;
  }

  &.updatePassword {
    width: 12.5rem;
  }

  &.save {
    width: 17.8125rem;
    margin-top: 1.25rem;
    margin-left: auto;
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

export const CustomSectionTitle = styled(SectionTitle)`
  margin-top: 1.25rem;
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

export const SystemsContainer = styled.div`
  display: flex;
  margin-top: 2rem;
`;

export const Quote = styled.div`
  border-radius: 1.25rem;
  background-color: #F3F4F7;
  width: 15.625rem;
  height: 9.375rem;
  text-transform: uppercase;
  font-size: 0.75rem;
  line-height: 2;
  margin-top: 2.625rem;
  padding: 1rem 2.25rem 1.25rem 1.25rem;
  font-family: "Roboto";
  font-weight: bold;
`;

export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.25rem;
  width: 15.125rem;
  margin-left: 4.625rem;

  border: 1px solid #dbdfeb;
`;

export const MenuOption = styled.div<{ selected?: boolean; sub?: boolean; }>`
  &:first-child {
    border-radius: 0.25rem 0.25rem 0 0;
  }

  &:last-child {
    border-radius: 0 0 0.25rem 0.25rem;
  }

  display: flex;
  align-items: center;
  font-size: 0.875rem;
  
  height: 2.25rem;
  padding-left: 1.25rem;
  
  ${({ sub }) => sub && css`
    padding-left: 2.5rem;
  `};
  
  ${({ selected }) => selected && css`
    background-color: #d2f6ec;
  `};

`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 23.75rem;
  margin-left: auto;

  button {
    width: 100%;
    height: 3.125rem;
    border-radius: 0.25rem;
    background-color: #DBDFEB;
    font-size: 1rem;
    color: #0F1331;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      margin-right: 0.25rem;
    }
    
    &.save {
      color: #fff;
      background-color: #25CFA1;
    }
    
    &.delete {
      color: #fff;
      background-color: #FF7373;
    }

    & + button {
      margin-top: 3.125rem;
    }
  }
`;

