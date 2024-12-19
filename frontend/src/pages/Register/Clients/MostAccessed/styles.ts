import styled from 'styled-components';
import { SectionTitle, MainContainer } from '~styles/components';

type SectionTitleProps = {
  bg: string;
}

export const Container = styled(MainContainer)`
  max-width: 1346px;
  min-height: 1068px;
`;

export const CustomSectionTitle = styled(SectionTitle)<SectionTitleProps>`
  margin-top: 1.875rem;
  background-color: ${({ bg }) => bg};
  color: #fff;
`;

export const FavoriteProductsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.875rem;
  margin-top: 1.25rem;
`;