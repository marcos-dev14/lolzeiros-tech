import styled, { css } from 'styled-components';
import { BoxBadge, BoxInput } from '../../styles/components/box';

type BoxInputProps = {
  hasBadge: boolean;
}

export const SiteBoxInput = styled(BoxInput)<BoxInputProps>`
  ${({ hasBadge }) => hasBadge && css`
    border-radius: 0;
  `};
`;

export const SiteBoxBadge = styled(BoxBadge)`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  padding: 0 0.75rem 0 0.625rem;
  width: 3.875rem;
`;

export const CopyContentBadge = styled(BoxBadge)`
  border-radius: 0;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  border-left-width: 0;
  min-width: 2rem;
`;