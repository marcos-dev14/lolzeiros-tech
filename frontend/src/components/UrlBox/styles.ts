import styled from 'styled-components';
import { BoxBadge, BoxInput } from '../../styles/components/box';

export const UrlBoxInput = styled(BoxInput)`
  border-radius: 0;
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  border-left-width: 1px;
`;

export const ViewBadge = styled(BoxBadge)`
  border-radius: 0;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  border-left-width: 0;

  svg {
    height: 99%;
    width: 99%;
  }
`;