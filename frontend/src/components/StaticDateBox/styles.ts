import styled from 'styled-components';
import { Box, BoxBadge, BoxInputProps, inputStyle } from '../../styles/components/box';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

interface DateBoxInputProps extends BoxInputProps {
  selected?: any;
  onChange?: Function;
}

type CustomBoxProps = {
  noTitle: boolean;
}

export const CustomBox = styled(Box)<CustomBoxProps>`
  position: relative;
  
  height: ${({ noTitle }) => noTitle ? '2rem' : '3.125rem'};

  .react-datepicker {
    > p {
      display: none;
    }
  }
`;

export const DateBoxBadge = styled(BoxBadge)`
  min-width: 2rem;
  min-height: 2rem;
`;

export const DateBoxInput = styled(ReactDatePicker)<DateBoxInputProps>`
  padding: 0 0.375rem;
  ${inputStyle}
  background-color: #fff;
  border-color: ${({ theme, validated }) =>
    validated ? theme.colors.validatedBorder : theme.colors.medium_gray};
  width: ${({ width }) => width};
  max-width: ${({ width }) => width};
  text-align: left;

  &::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }

  p {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.75rem;
  }

  b {
    color: #B7BFC9;
  }
`;
