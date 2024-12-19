import styled, { css } from 'styled-components';
import { BoxInput } from '../../styles/components/box';

export const Input = styled(BoxInput)`
  border-radius: 0.25rem;
  border-left-width: 1px;
  padding-left: 0.625rem;

  ${({ error }) => error && css`
    border-color: ${({ theme }) => theme.colors.secondary}
  `};
`;