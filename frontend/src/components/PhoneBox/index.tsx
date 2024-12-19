import { isNotEmpty } from '@/src/utils/validation';
import { useState } from 'react';
import { InputMaskProps } from '~/types/main';
import { Box, BoxInputMask } from '../../styles/components/box';
import { CountryCodeSelect } from '../CountryCodeSelect';
import { Badge } from './styles';

export function PhoneBox({
  name,
  disabled,
  validated = false,
  width = '7.625rem',
  noTitle = false,
  defaultValue = '',
  mask = "(99) 99999-9999",
  placeholder = "(00) 00000-0000",
  ...rest
}: InputMaskProps) {
  const [isValidated, setIsValidated] = useState(validated || isNotEmpty(String(defaultValue)));

  return (
    <Box noTitle={noTitle}>
      {!noTitle && 
        <label htmlFor={name}>{name}</label>
      }
      <div>
        {/* <CountryCodeSelect
          setValue={() => {}}
          placeholder="Abc"
          validated
        /> */}
        <Badge
          validated={isValidated}
        >
          +55
        </Badge>
        {/* @ts-ignore */}
        <BoxInputMask
          id={name}
          disabled={disabled}
          validated={isValidated}
          placeholder={placeholder}
          width={width}
          mask={mask}
          type="text"
          defaultValue={defaultValue}
          onBlur={({ target: { value } }) => setIsValidated(!!value)}
          // @ts-ignore
          {...rest}
        />
      </div>
    </Box>
  );
}

