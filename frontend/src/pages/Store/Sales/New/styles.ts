import styled, { css } from 'styled-components';

import { buttonStyle, MainContainer, SectionTitle } from '~styles/components';

export const Container = styled(MainContainer)`
  width: 1160px;
  padding-bottom: 4.5rem;
`;

export const StatusList = styled.div`
  width: 13.375rem;
  height: 10rem;
  /* background-color: #f90; */
  position: absolute;
  top: 0.125rem;
  display: flex;
  flex-direction: column;

  > p {
    font-size: 0.5rem;
    text-transform: uppercase;
    font-family: "Roboto";
    font-weight: bold;
    margin-bottom: 0.4375rem;
  }
`;

export const Status = styled.div`
  width: 100%;
  height: 2rem;
  border-top: 1px solid #DBDFEB;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;

  > p {
    font-size: 0.75rem;
    color: #272E47
  }
  
  &:last-child {
    border-bottom: 1px solid #DBDFEB;
  }
`;

export const badgeColors = {
  'Todos': '#040C22',
  'Novo': '#FF9D25',
  'Recebido': '#43BDFF',
  'Liberado': '#43BDFF',
  'Transmitido': '#3699CF',
  'Faturado': '#21D0A1',
  'Pausado': '#B7BFC9',
  'Cancelado': '#FF6F6F',
}

export const Badge = styled.div<{ status: 'Todos' | 'Novo' | 'Recebido' | 'Transmitido' | 'Faturado' | 'Pausado' | 'Cancelado' | 'Liberado' }>`
  height: 1.25rem;
  max-height: 1.25rem;
  border-radius: 0.625rem;
  
  display: flex;
  margin: 0;
  align-items: center;
  justify-content: center;
  
  padding: 0 1rem;
  background-color: ${({ status }) => badgeColors[status]};

  p {
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.625rem;
    margin-top: 0.0625rem;
  }
  
  svg {
    width: 0.625rem;
    margin-right: 0.25rem;
    margin-bottom: 0.0625rem;
  }
`;

export const CustomSectionTitle = styled(SectionTitle)`
  margin-top: 1.25rem;
`;

export const EmptyElement = styled.div`
  width: 14.375rem;
`;

export const Button = styled.button`
  ${buttonStyle}
  background-color: #21D0A1;
  color: #fff;
  width: 9.375rem;

  &.sendMail {
    width: 12.5rem;
    align-self: flex-end;
    margin-left: auto;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.medium_gray};
  }
`;

export const ColumnInputContainer = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    &:not(:first-child){
      margin-top: .75rem;
    }
  }
`;

export const GoBackButton = styled.button`
  ${buttonStyle}
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6.25rem;
  background: none;
  border-radius: 0.5rem;
  border: 2px solid #272E47;
  color: #272E47;
  font-size: 0.75rem;
  text-transform: uppercase;
  margin-left: 1.25rem;
  font-weight: bold;

  svg {
    height: 0.6875rem;
    margin-right: 0.125rem;
    /* color: #272E47; */

    path {
      stroke: #272E47;
      stroke-width: 2.5;
    }
  }
`;

export const ProductsSectionTitle = styled.div`
  width: 100%;
  height: 2.875rem;
  margin-top: 1.25rem;
  padding: 0 1.25rem;
  border-radius: 0.25rem;
  background-color: #F4F5F8;
  display: flex;
  align-items: center;

  p {
    color: #272E47;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    font-weight: bold;
  }

  > div {
    background-color: #fff;
    border-radius: 15.325rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1.875rem;
    height: 1.875rem;
    margin-left: auto;

    p {
      letter-spacing: 0;
      margin-right: 1.25rem;
    }

    > div {
      display: grid;
      grid-template-columns: repeat(5, 0.9375rem);
      gap: 0.625rem;

      svg {
        width: 0.9375rem;
      }
    }
  }

  button, a {
    background-color: #040C22;
    border-radius: 0.9375rem;
    display: grid;
    place-items: center;
    text-align: center;
    height: 1.8125rem;
    color: #fff;
    font-weight: bold;
    margin-left: 2.5rem;
    padding: 0 1.875rem;
    text-transform: uppercase;
    font-size: 0.75rem;
  }
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 7% 20% 11% 9% 12% 12% 14% 15%;
  margin-top: 2rem;

  div {
    padding: 0.75rem 0.625rem;
    width: 100%;
    display: flex;
    align-items: center;
    color: #040C22;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: bold;
  }
`; 

export const TableContent = styled.div`
  display: grid;
  grid-template-columns: 7% 20% 11% 9% 12% 12% 14% 15%;
  border-top: 1px solid #D8D8D8;
  border-left: 1px solid #D8D8D8;
  border-right: 1px solid #D8D8D8;
  /* border-bottom: 0.5px solid #D8D8D8; */
  
  & + div {
    /* background-color: #390; */
    border-top-width: 0.5px;
  }
  
  &:first-child {
    margin-top: 0.75rem;
  }
  
  &:last-child {
    border-bottom: 1px solid #D8D8D8;
  }

  div {
    height: 4.1875rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #040C22;
    font-size: 0.75rem;
    padding-left: 0.625rem;

    p + p {
      margin-top: 0.25rem;
    }

    span {
      height: 1.3125rem;
      background-color: #65DACC;
      padding: 0 0.625rem;
      display: flex;
      align-self: flex-start;
      place-items: center;
      font-size: 0.75rem;
      border-radius: 0.75rem;
      color: #040C22;
      margin-top: 0.25rem;
    }

    img {
      width: 2.9375rem;
      height: 2.9375rem;
      border-radius: 0.5rem;
      border: 1px solid #F2F2F2;
      margin-left: 0.625rem;
    }
  }
`;

export const DeleteItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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