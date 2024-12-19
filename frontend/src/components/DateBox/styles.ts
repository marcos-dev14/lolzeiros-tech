import styled, { css } from 'styled-components';
import { Box, BoxInputProps, inputStyle } from '~styles/components/box';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

interface DateBoxInputProps extends BoxInputProps {
  selected?: any;
  onChange?: Function;
onFieldChange?: Function;
}

export const Measure = styled.p`
  font-size: 0.75rem;
  text-transform: uppercase;
  font-family: "Roboto";
  font-weight: bold;

  color: ${({ theme }) => theme.colors.primary};
`;

export const CustomBox = styled(Box)`
  .react-datepicker-wrapper{
   .react-datepicker__close-icon {
     right: 5px;
     
     &::after{
       font-size: 20px;
       width: 16px;
       height: 16px;
       display: flex;
       align-items: center;
       justify-content: center;
       padding: 2px 2px 3px 3px;
     }
   }
  }
`;

export const DateBoxInput = styled(ReactDatePicker)<DateBoxInputProps>`
  padding: 0;
  ${inputStyle}
  padding-bottom: 0.0625rem;
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
    font-size: 0.875rem;
  }
`;
