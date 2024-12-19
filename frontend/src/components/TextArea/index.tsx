// @ts-nocheck
import { useCallback, useMemo, useState } from 'react';

import { TitleInputBox, Container } from './styles';

import { InputProps } from '~/types/main';
import { isNotEmpty } from '@/src/utils/validation';

export function TextArea({
  name,
  title,
  disabled,
  value = '',
  validated = false,
  placeholder = "Digite aqui...",
  width = '14.8125rem',
  height = '2rem',
  fullW = false,
  defaultValue,
  onChange = () => {},
  style = {},
  ...rest
}: InputProps) {
  const [isValidated, setIsValidated] = useState(validated || !!defaultValue);

  const boxHeight = useMemo(() => +height.replace('rem', ''), [height])

  return (
    <TitleInputBox
      fullW={fullW}
      style={{
        height: `${boxHeight + 1.125}rem`
      }}
    >
      <label htmlFor={name}>{title}</label>
      <Container
        id={name}
        disabled={disabled}
        validated={isValidated}
        placeholder={placeholder}
        width={width}
        defaultValue={defaultValue}
        isInput
        onBlur={(e) => setIsValidated(isNotEmpty(e.target.value))}
        onChange={onChange}
        type="text"
        style={{
          ...style,
          height
        }}
        {...rest}
      />
    </TitleInputBox>
  );
}

