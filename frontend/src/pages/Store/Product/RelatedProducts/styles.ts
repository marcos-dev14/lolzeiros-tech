import { rotate } from '@/src/components/LoadingContainer/styles';
import { TableActionButton } from '@/src/styles/components/tables';
import styled from 'styled-components';

import { MainContainer, SectionTitle } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1346px;
  padding-bottom: 4.5rem;
  min-height: 52rem;
`;

export const CustomSectionTitle = styled(SectionTitle)`
  margin-top: 1.25rem;
`;

export const SelectContainer = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 1.25rem;
`;

export const ProductsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 29.375rem);
  gap: 2.5rem;
  margin-top: 2.5rem;
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

export const AddingRelatedProduct = styled(TableActionButton)`
  margin-left: 1rem;
  
  &[disabled] {
    svg {
      height: 1rem;
      width: 1rem;
      margin-top: 0.175rem;
      stroke: #393939;
      animation: ${rotate} 2s linear infinite;
    }
  }
`;