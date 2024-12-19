import { rotate } from '@/src/components/LoadingContainer/styles';
import styled, { css } from 'styled-components';

import { buttonStyle, MainContainer, SectionTitle } from '~styles/components';
import { TableContent, TableHeader } from '../Rules/styles';

type TableContentWrapperProps = {
  contactOpened: boolean;
}

export const Container = styled(MainContainer)`
  max-width: 1346px;
  padding-bottom: 4.5rem;
`;

export const PhotoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

export const EmptyElement = styled.div`
  width: 12.5rem;
`;

export const CustomSectionTitle = styled(SectionTitle)`
  margin-top: 1.25rem;
`;

export const Button = styled.button`
  ${buttonStyle}
  background-color: #21D0A1;
  color: #fff;
  width: 12.375rem;
  margin-left: 1.25rem;
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

export const Header = styled(TableHeader)`
  grid-template-columns: 16% 16% 19% 16% 16% 10% 7%;
  height: 2.75rem;
`;

export const TableContentWrapper = styled.div<TableContentWrapperProps>`
  display: grid;
  grid-template-rows: 2.75rem;
  background-color: #fff;
  gap: 0.875rem 0;
  
  ${({ contactOpened }) => contactOpened && css`
    grid-template-rows: 2.75rem 3.125rem;
    background-color: #f4f5f8;
    padding-bottom: 0.625rem;
  `};
`;

export const Content = styled(TableContent)<TableContentWrapperProps>`
  grid-template-columns: 16% 16% 19% 16% 16% 10% 7%;
  background: 0;
  
  ${({ contactOpened }) => contactOpened && css`
    border-bottom: none;

    border-top: 1px solid ${({ theme }) => theme.colors.medium_gray};
    
    > div {

      &:not(:first-child) {
        border-left: none;
      }
    }
  `};
`;

export const TableExpandedContent = styled.div`
  display: grid;
  grid-template-columns: 7.5rem 7.5rem 9.375rem 9.375rem 14.6875rem;
  gap: 0 1.25rem;
  padding-left: 0.625rem;
`;

export const AddressTableHeader = styled(Header)`
  grid-template-columns: 10% 25% 6% 12% 17% 16% 7% 7%;
`;

export const AddressTableContent = styled(Content)`
  grid-template-columns: 10% 25% 6% 12% 17% 16% 7% 7%;
`;

export const AddressTableExpandedContent = styled(TableExpandedContent)`
  grid-template-columns: 13.625rem 12.5rem 10.5rem 9.375rem 13.125rem;
`;

export const BankAccountTableHeader = styled(Header)`
  grid-template-columns: 17% 13% 21% 11% 7% 7% 17% 7%;
`;

export const BankAccountTableContent = styled(Content)`
  grid-template-columns: 17% 13% 21% 11% 7% 7% 17% 7%;
`;

export const BankAccountTableExpandedContent = styled(TableExpandedContent)`
  grid-template-columns: 11.875rem 10.5rem 9.375rem 13.125rem;
`;
