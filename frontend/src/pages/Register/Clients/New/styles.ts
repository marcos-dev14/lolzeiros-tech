import styled, { css } from 'styled-components';

import { buttonStyle, MainContainer, SectionTitle } from '~styles/components';
import { TableContent, TableHeader } from '../../Supplier/Rules/styles';

type TableContentWrapperProps = {
  contactOpened: boolean;
}

export const Container = styled(MainContainer)`
  max-width: 1346px;
  padding-bottom: 4.5rem;
`;

export const CustomSectionTitle = styled(SectionTitle)`
  margin-top: 1.25rem;
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

export const Header = styled(TableHeader)`
  grid-template-columns: 15% 15% 17% 14% 14% 14% 7% 4%;
  height: 2.75rem;
`;

export const TableContentWrapper = styled.div`
  display: grid;
  grid-template-rows: 2.75rem;
  background-color: #fff;
  gap: 0.875rem 0;
`;

export const Content = styled(TableContent)`
  grid-template-columns: 15% 15% 17% 14% 14% 14% 7% 4%;
  background: 0;
`;

export const TableExpandedContent = styled.div`
  display: grid;
  grid-template-columns: 7.5rem 7.5rem 9.375rem 9.375rem 14.6875rem;
  gap: 0 1.25rem;
  padding-left: 0.625rem;
`;

export const AddressTableHeader = styled(Header)`
  grid-template-columns: 9% 20% 6% 10% 12.5% 9.5% 17% 12% 4%;
`;

export const AddressTableContent = styled(Content)`
  grid-template-columns: 9% 20% 6% 10% 12.5% 9.5% 17% 12% 4%;
`;


export const BankAccountTableContentWrapper = styled(TableContentWrapper)<TableContentWrapperProps>`
  ${({ contactOpened }) => contactOpened && css`
    grid-template-rows: 2.75rem 3.125rem;
    background-color: #f4f5f8;
    padding-bottom: 0.625rem;
  `};
`;

export const BankAccountTableHeader = styled(Header)`
  grid-template-columns: 17% 13% 21% 11% 7% 7% 17% 7%;
`;

export const BankAccountTableContent = styled(TableContent)<TableContentWrapperProps>`
  grid-template-columns: 17% 13% 21% 11% 7% 7% 17% 7%;

  ${({ contactOpened }) => contactOpened && css`
    border-bottom: none;
    background-color: #f4f5f8;

    border-top: 1px solid ${({ theme }) => theme.colors.medium_gray};
    
    > div {

      &:not(:first-child) {
        border-left: none;
      }
    }
  `};
`;

export const BankAccountTableExpandedContent = styled(TableExpandedContent)`
  grid-template-columns: 11.875rem 10.5rem 9.375rem 13.125rem;
`;