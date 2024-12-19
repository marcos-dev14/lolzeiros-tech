import { useCallback, useEffect, useRef, useState } from 'react';
import { useField } from '@unform/core';

import { TitleInputBox, Input } from './styles';

import { InputProps } from '~/types/main';

export function FormTitleInput({
  name,
  title,
  disabled,
  validated = false,
  placeholder = "Digite aqui...",
  width = '14.8125rem',
  fullW = false,
  maxLength = 65,
  ...rest
}: InputProps) {
  const [isValidated, setIsValidated] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, registerField, error } = useField(name!)

  const [charactersCount, setCharactersCount] = useState(
    !!defaultValue ? String(defaultValue).length : 0 );

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

  const handleIsValidated = useCallback(() => {
    const length = inputRef!.current!.value.length;

    // @ts-ignore
    setIsValidated(length < 65 && length > 15);
  }, [inputRef])

  useEffect(() => {
    if(isValidated !== '') return;
    // @ts-ignore
    setIsValidated(!!defaultValue ? defaultValue.length <= 65 && defaultValue.length >= 15 : false);
  }, [defaultValue, isValidated])

  return (
    <TitleInputBox fullW={fullW}>
      <div>
        <label htmlFor={name}>{title}</label>
        <p>{maxLength - charactersCount} caracteres restantes</p>
      </div>
      <Input
        id={name}
        disabled={disabled}
        validated={validated || !!isValidated}
        placeholder={placeholder}
        width={width}
        ref={inputRef}
        defaultValue={defaultValue}
        isInput
        onBlur={handleIsValidated}
        onChangeCapture={() => setCharactersCount(inputRef!.current!.value.length)}
        type="text"
        maxLength={maxLength}
        {...rest}
      />
    </TitleInputBox>
  );
}

