import { darken } from 'polished';
import styled, { css } from 'styled-components';

import { buttonStyle, MainContainer, SectionTitle } from '~styles/components';

export const Container = styled(MainContainer)`
  width: 1160px;
  padding-bottom: 4.5rem;
`;

export const CustomSectionTitle = styled(SectionTitle)`
  margin-top: 1.25rem;
`;

export const Button = styled.button`
  ${buttonStyle}
  background-color: #21D0A1;
  color: #fff;
  width: 10.125rem;
  margin-left: auto;
`;

export const GoBackButton = styled.button`
  ${buttonStyle}

  margin-left: auto;
  margin-top: 1.25rem;
  width: 6.25rem;
  background-color: #78C5F0;
  color: #fff;
  
  svg {
    margin-right: 0.25rem;
    width: 0.9375rem;
    height: 0.9375rem;
  }
  
  &:hover {
    transition: all 0.2s;
    background-color: ${darken('0.2', '#78C5F0')};
  }
`;
