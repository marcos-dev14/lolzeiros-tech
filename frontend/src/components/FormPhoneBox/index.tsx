import { useEffect, useMemo, useRef, useState } from 'react';
import { useField } from '@unform/core';

import { isNotEmpty } from '@/src/utils/validation';
import { InputMaskProps } from '~/types/main';
import { Box, BoxInputMask } from '../../styles/components/box';
import { CountryCodeSelect } from '../CountryCodeSelect';
import { Badge } from './styles';

interface Props extends Omit<InputMaskProps, 'validated'> {
  validated?: boolean;
}

export function FormPhoneBox({
  name,
  title,
  disabled,
  validated = false,
  width = '7.625rem',
  mask= "(99) 99999-9999",
  placeholder = "(00) 00000-0000",
  noTitle = false,
  ...rest
}: Props) {
  const [isValidated, setIsValidated] = useState(validated);
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue: formDefaultValue, registerField, error } = useField(name!);

  const defaultValue = useMemo(() => {
    setIsValidated(!!formDefaultValue);

    return formDefaultValue;
  }, [formDefaultValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',

      setValue(ref, value) {
        ref.setInputValue(value);
      },

      clearValue(ref) {
        ref.setInputValue('');
      },
    });
  }, [fieldName, registerField]);

  return (
    <Box noTitle={noTitle}>
      {!noTitle && 
        <label htmlFor={name}>{title}</label>
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
          name={name}
          disabled={disabled}
          validated={isValidated}
          placeholder={placeholder}
          width={width}
          // @ts-ignore
          ref={inputRef}
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

