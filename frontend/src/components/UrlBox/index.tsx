import { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { InputProps } from '~/types/main';
import { Box } from '~styles/components/box';

import { ReactComponent as ViewIcon } from '~assets/view_white.svg';

import { ViewBadge, UrlBoxInput } from './styles'

export function UrlBox({
  name,
  validated = false,
  placeholder = "Digite aqui...",
  width = '13.375rem',
  defaultValue,
  ...rest
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const { fieldName, /*defaultValue,*/ registerField, error } = useField(name!)

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

  return (
    <Box noTitle>
      <div>
        <UrlBoxInput
          id={name}
          validated={validated}
          placeholder={placeholder}
          width={width}
          isInput
          type="text"
          ref={inputRef}
          defaultValue={defaultValue}
          {...rest}
        />
        <ViewBadge
          validated={validated}
        >
          <ViewIcon />
        </ViewBadge>
      </div>
    </Box>
  );
}

