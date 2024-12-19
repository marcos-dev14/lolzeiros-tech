import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useField } from '@unform/core';

import { TableActionButton } from '@/src/styles/components/tables';
import { FormInputProps } from '~/types/main';
import { Box, BoxInput } from '../../styles/components/box';
import { CountryCodeSelect } from '../CountryCodeSelect';

import { ReactComponent as PlusIcon } from '~assets/plus.svg';

import { Badge } from './styles';

export function MultiplePhoneBox({
  name,
  title,
  disabled,
  validated = false,
  placeholder = "Digite aqui...",
  width = '14.8125rem',
  fullW = false,
  defaultValue: customDefaultValue = '',
  noTitle = false,
  style = {},
  onBlur = () => {},
  ...rest
}: FormInputProps) {
  const [isValidated, setIsValidated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null)

  const [value, setValue] = useState('');

  const { fieldName, defaultValue: formDefaultValue, registerField, error } = useField(name!)
  
  const defaultValue = useMemo(() => {
    let currentValue =
      !!customDefaultValue ? customDefaultValue : formDefaultValue;
    
    setValue(currentValue);
    setIsValidated(!!currentValue);

    return currentValue;
  }, [customDefaultValue, formDefaultValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,

      getValue: ref => {
        return ref.current.value
      },

      setValue: (ref, value) => {
        ref.current.value = value
      },

      clearValue: ref => {
        ref.current.value = ''
      },
    })
  }, [fieldName, registerField]);

  // @ts-ignore
  const handleOnBlur = useCallback((e) => {
    // @ts-ignore
    setIsValidated(!!e.target.value)
    // @ts-ignore
    onBlur(e);
  }, [onBlur]);

  const handleOnChange = useCallback((e) => {
    // @ts-ignore
    e.preventDefault();
    setValue(e.target.value.replace(/[^0-9\.]/gi, ''))
  }, [])

  return (
    <Box>
      <label htmlFor={name}>{name}</label>
      <div>
        <Badge
          validated={validated}
        >
          +55
        </Badge>
        <BoxInput
          id={name}
          disabled={disabled}
          validated={validated || !!isValidated}
          placeholder="(00) 0000 00 00"
          width={width}
          ref={inputRef}
          onBlur={handleOnBlur}
          defaultValue={defaultValue}
          isInput
          value={value}
          onChange={handleOnChange}
          type="text"
          {...rest}
        />
        <TableActionButton
          onClick={() => {}}
          style={{ marginLeft: '0.625rem' }}
        >
          <PlusIcon />
        </TableActionButton>
      </div>
    </Box>
  );
}

