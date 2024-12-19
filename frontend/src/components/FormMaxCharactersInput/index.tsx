import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useField } from '@unform/core';

import { Box } from '~styles/components/box';
import { Input, MaxCharacters } from './styles';

import { FormInputProps } from '~/types/main';
import { isNotEmpty } from '~/utils/validation';

export function FormMaxCharactersInput({
  name,
  title,
  disabled,
  placeholder = "Digite aqui...",
  width = '14.8125rem',
  fullW = false,
  noTitle = false,
  defaultValue: customDefaultValue,
  validated = false,
  showCharsWord = false,
  customOnBlur = () => {},
  style = {},
  ...rest
}: FormInputProps) {
  // se vier preenchido, inicializa o count e value
  const [isValidated, setIsValidated] = useState('');

  const { fieldName, defaultValue, registerField, error } = useField(name!)
  
  const currentDefaultValue = useMemo(() => 
    !!customDefaultValue ? customDefaultValue : defaultValue
  , [customDefaultValue, defaultValue]);

  const [charactersCount, setCharactersCount] = useState(
    () => !!currentDefaultValue ? String(currentDefaultValue).length : 0 );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(isValidated !== '') return;
    if(!currentDefaultValue) return;
    // @ts-ignore
    setIsValidated(currentDefaultValue.length < 30);
  }, [currentDefaultValue, isValidated])

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

  const handleOnBlur = useCallback((value: string) => {
    // @ts-ignore
    setIsValidated(value.length < 30 && isNotEmpty(value));
    customOnBlur(value);
  }, [customOnBlur]);

  return (
    <Box fullW={fullW} noTitle={noTitle} style={style}>
      {!noTitle && <label htmlFor={name}>{title}</label>}
      <MaxCharacters>
        <Input
          id={name}
          disabled={disabled}
          validated={validated || !!isValidated}
          placeholder={placeholder}
          width={fullW ? '100%' : width}
          isInput
          ref={inputRef}
          defaultValue={currentDefaultValue}
          onBlur={(e) => handleOnBlur(e.target.value)}
          onChangeCapture={() => setCharactersCount(inputRef!.current!.value.length)}
          type="text"
          {...rest}
        />
        <p>{charactersCount}/30{showCharsWord && ` caracteres`}</p>
      </MaxCharacters>
    </Box>
  );
}

