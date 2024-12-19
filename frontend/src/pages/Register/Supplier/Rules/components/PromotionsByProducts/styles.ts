import styled from 'styled-components';
import { TableContent, TableHeader } from '../../styles';

export const Header = styled(TableHeader)`
  grid-template-columns: 56% 14% 11% 15% 4%;
  height: 2.75rem;
`;

export const Content = styled(TableContent)`
  grid-template-columns: 56% 14% 11% 15% 4%;
`;

export const SearchProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* background-color: #ff0; */
  margin-top: 1.875rem;
  
  > div {
    display: flex;
    height: 2.75rem;
    align-items: center;
    width: 100%;
    /* background-color: #f90; */

    &:first-child, & + div {
      border-top: 1px solid #ccc;
    }
    
    &:last-child {
      border-bottom: 1px solid #ccc;
    }

  }
`;