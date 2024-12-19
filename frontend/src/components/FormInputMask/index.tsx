import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useField } from '@unform/core';

import { Box } from '../../styles/components/box';
import { Input as BaseInput } from './styles';

import { FormInputProps } from '~/types/main';

export function FormInputMask({
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
    <Box fullW={fullW} noTitle={noTitle} style={style}>
      {!noTitle && <label htmlFor={name}>{title}</label>}
      <BaseInput
        id={name}
        disabled={disabled}
        validated={validated || !!isValidated}
        placeholder={placeholder}
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
    </Box>
  );
}

