import styled, { keyframes } from 'styled-components';

import { buttonStyle, MainContainer, SectionTitle } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1346px;
  width: 1346px;
  padding-bottom: 4.5rem;
`;

export const CustomSectionTitle = styled(SectionTitle)`
  margin-top: 1.25rem;
`;

export const Button = styled.button`
  ${buttonStyle}
  width: 10.625rem;

  .save {
    ${buttonStyle}
    background-color: #21D0A1;
    color: #fff;
    width: 12.375rem;
    margin-left: 1.25rem;
  }
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 5% 42% 13% 13% 10% 13% 4%;
  width: 100%;
  border-radius: 0.25rem 0.25rem 0 0;
  background-color: #F4F5F8;
  height: 1.875rem;
  margin-top: 1.25rem;

  strong {
    font-size: 0.75rem;
    font-family: "Roboto";
    font-weight: bold;
    text-transform: uppercase;
  }

  > div {
    display: flex;
    align-items: center;
    padding: 0 0.625rem;

    &:not(:first-child) {
      border-left: 1px solid ${({ theme }) => theme.colors.medium_gray};
    }

    &:last-child {
      justify-content: space-between;
    }
  }
`;

export const TableContent = styled.div`
  display: grid;
  grid-template-columns: 5% 42% 13% 13% 10% 13% 4%;
  width: 100%;
  background-color: #fff;
  height: 2.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.medium_gray};
    
  &:nth-child(2) {
    /* background-color: #f09; */
    border-top: 1px solid ${({ theme }) => theme.colors.medium_gray};
  }

  > div {
    display: flex;
    align-items: center;
    padding: 0 0.625rem;

    &:not(:first-child) {
      border-left: 1px solid ${({ theme }) => theme.colors.medium_gray};
    }

    &:last-child {
      justify-content: space-between;
    }
  }
`;

const rotate = keyframes` /** widtwidtwidth: 840px;h: 840px;h: 840px;animação para rotacionar o icon. */
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const RulesButton = styled.button`
  ${buttonStyle};
  width: 10rem;
  
  svg {
    stroke: ${({ theme }) => theme.colors.text};
    width: 1.25rem;
    height: 1.25rem;
    animation: ${rotate} 2s linear infinite;
  }

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const DeleteItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* background-color: #ff0; */
  margin-top: 1.875rem;
  max-height: 20rem;
  overflow-y: scroll;
  
  > div {
    display: flex;
    height: 2.75rem;
    align-items: center;
    width: 100%;
    margin-top: 0.25rem;
    padding-top: 0.25rem;
    /* background-color: #f90; */

    &:first-child, & + div {
      border-top: 1px solid #ccc;
    }
    
    &:last-child {
      border-bottom: 1px solid #ccc;
    }

  }
`;