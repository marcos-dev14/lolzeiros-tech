import styled from 'styled-components';
import ReactInputMask from 'react-input-mask';

import { BoxInputProps, inputStyle } from '../../styles/components/box';

export const Input = styled(ReactInputMask)<BoxInputProps>`
  ${inputStyle}

  border-color: ${({ theme, validated }) =>
    validated ? theme.colors.validatedBorder : theme.colors.medium_gray};
  width: ${({ width }) => width};
  border-left-width: 1px;
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
`;