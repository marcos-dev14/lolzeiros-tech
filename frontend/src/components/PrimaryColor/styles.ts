import styled from 'styled-components';
import { Box } from '~styles/components/box';

type Props = {
  squared: boolean;
}

export const Container = styled(Box)<Props>`
  height: ${({ squared }) => squared ? '10.5rem' : '3.125rem'};
`;

export const ColorInput = styled.div<Props>`
  width: 9.375rem;
  height: ${({ squared }) => squared ? '9.375rem' : '2.125rem'};  
  border-radius: 0.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.medium_gray};
`;
