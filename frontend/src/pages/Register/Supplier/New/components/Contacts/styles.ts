import styled from 'styled-components';

import { buttonStyle, SectionTitle } from '~styles/components';
import { TableContent, TableHeader } from '../../../Rules/styles';

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
