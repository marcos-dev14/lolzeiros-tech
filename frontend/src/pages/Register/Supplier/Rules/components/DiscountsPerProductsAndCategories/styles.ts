import styled from 'styled-components';
import { TableContent, TableHeader } from '../../styles';

export const Header = styled(TableHeader)`
  grid-template-columns: 18% 35% 11% 08% 11% 13% 04%;
  height: 2.75rem;
`;

export const Content = styled(TableContent)`
  grid-template-columns: 18% 35% 11% 08% 11% 13% 04%;
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