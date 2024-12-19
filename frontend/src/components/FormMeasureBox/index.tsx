// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from 'react';
import { useField } from '@unform/core';
import { BoxBadge, BoxInput } from '~styles/components/box';

import { FormInputProps } from '~/types/main';

import { CustomBox, Measure } from './styles';

interface Props extends FormInputProps {
  name: string;
  measure: string;
  noTitle?: boolean;
}

export function MeasureBox({
  name,
  title,
  disabled,
  measure,
  noTitle = false,
  validated = false,
  width = '7.5rem',
  onBlur = () => {},
  placeholder = "Digite aqui...",
  ...rest
}: Props) {
  const [isValidated, setIsValidated] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { fieldName, defaultValue, registerField, error } = useField(name!);
  
  const [value, setValue] = useState(defaultValue);

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
    onBlur(e);
    // @ts-ignore
    setIsValidated(!!e.target.value)
  }, [onBlur]);

  useEffect(() => {
    if(isValidated !== '') return;
    // @ts-ignore
    setIsValidated(!!defaultValue);
  }, [defaultValue, isValidated])

  const handleOnChange = useCallback((e) => {
    // @ts-ignore
    e.preventDefault();
    setValue(e.target.value.replace(/[^0-9\.]/gi, ''))
  }, [])

  return (
    <CustomBox noTitle={noTitle}>
      {!noTitle && <div className="status">
        <label htmlFor={name}>{title}</label>
      </div>}
      <div>
        <BoxBadge
          validated={validated || !!isValidated}
        >
          <Measure>
            {measure}
          </Measure>
        </BoxBadge>
        <BoxInput
          id={name}
          disabled={disabled}
          validated={validated || !!isValidated}
          placeholder={disabled ? '' : placeholder}
          width={width}
          ref={inputRef}
          defaultValue={defaultValue}
          onBlur={handleOnBlur}
          value={value}
          onChange={handleOnChange}
          isInput
          type="text"
          {...rest}
        />
      </div>
    </CustomBox>
  );
}

