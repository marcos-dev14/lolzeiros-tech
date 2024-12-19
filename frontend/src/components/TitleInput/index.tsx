import { useCallback, useState } from 'react';

import { TitleInputBox, Input } from './styles';

import { InputProps } from '~/types/main';

interface TitleInputProps extends InputProps {
  min?: number;
  max?: number;
}

export function TitleInput({
  name,
  title,
  disabled,
  value = '',
  validated = false,
  placeholder = "Digite aqui...",
  width = '14.8125rem',
  fullW = false,
  min = 5,
  max = 65,
  defaultValue,
  ...rest
}: TitleInputProps) {

  const [isValidated, setIsValidated] = useState(validated || !!defaultValue);
  const [charactersCount, setCharactersCount] = useState(
    !!defaultValue ? String(defaultValue).length : 0 );

  const handleIsValidated = useCallback(() => {
    const length = String(value).length;

    setIsValidated(length < max && length > min);
  }, [value, min, max])

  return (
    <TitleInputBox fullW={fullW}>
      <div>
        <label htmlFor={name}>{title}</label>
        <p>{max - charactersCount} caracteres restantes</p>
      </div>
      <Input
        id={name}
        disabled={disabled}
        validated={isValidated}
        placeholder={placeholder}
        width={width}
        defaultValue={defaultValue}
        isInput
        onBlur={handleIsValidated}
        onChangeCapture={() => setCharactersCount(String(value).length)}
        type="text"
        maxLength={max}
        {...rest}
      />
    </TitleInputBox>
  );
}

