import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useField } from '@unform/core';

import { Box } from '../../styles/components/box';
import { TextArea } from './styles';

import { FormTextAreaProps } from '~/types/main';

export function FormTextArea({
  name,
  type,
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
}: FormTextAreaProps) {
  const [isValidated, setIsValidated] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { fieldName, defaultValue: formDefaultValue, registerField, error } = useField(name!)

  const defaultValue = useMemo(() => {
    let currentValue =
      !!customDefaultValue ? customDefaultValue : formDefaultValue;
    
    setIsValidated(!!currentValue);

    return currentValue;
  }, [customDefaultValue, formDefaultValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: textareaRef,

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

  return (
    <Box fullW={fullW} noTitle={noTitle} style={{...style, height: 'auto'}}>
      {!noTitle && <label htmlFor={name}>{title}</label>}
      <TextArea
        id={name}
        disabled={disabled}
        validated={validated || !!isValidated}
        placeholder={placeholder}
        width={width}
        ref={textareaRef}
        onBlur={handleOnBlur}
        defaultValue={defaultValue}
        isInput
        {...rest}
      />
    </Box>
  );
}

