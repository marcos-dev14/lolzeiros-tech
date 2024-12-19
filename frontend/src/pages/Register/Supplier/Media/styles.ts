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
  width: 8.75rem;
  margin-left: 1.25rem;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 5% 65% 10% 13% 7%;
  width: 100%;
  border-radius: 0.25rem 0.25rem 0 0;
  background-color: #F4F5F8;
  height: 2.75rem;
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
  grid-template-columns: 5% 65% 10% 13% 7%;
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

export const MediaTagContainer = styled.div`
  display: grid;
  margin-top: 1.25rem;
  width: 100%;
  grid-template-columns: repeat(4, 16.875rem);
  gap: 1.25rem;
`;

export const MediaTag = styled.div`
  display: grid;
  width: 16.875rem;
  height: 12.75rem;
  border-radius: 0.5rem;
  border: 1px solid #dbdfeb;
  grid-template-rows: 2rem 8.75rem;
  gap: 0.625rem;
  padding: 0.625rem;

  img {
    height: 100%;
    width: 100%;
    border-radius: 0.5rem;
    object-fit: cover;
  }
`;

export const MediaTagActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.625rem;
  width: 100%;
  max-width: 15.625rem;
  height: 2rem;

  > div {
    display: flex;
  }
  
  button {
    background-color: #F3F4F7;
    width: 2rem;
    height: 2rem;
    border-radius: 0.25rem;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    & + button {
      margin-left: 0.625rem;
    }
  }
`;