import styled from 'styled-components';
import { BoxBadge, BoxInput } from '../../styles/components/box';

export const CopyBoxInput = styled(BoxInput)`
  border-radius: 0;
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  border-left-width: 1px;
`;

export const CopyContentBadge = styled(BoxBadge)`
  border-radius: 0;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  border-left-width: 0;
  cursor: pointer;
`;