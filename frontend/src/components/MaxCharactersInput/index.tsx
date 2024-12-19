import { useCallback, useRef, useState } from 'react';

import { Box } from '~styles/components/box';
import { Input, MaxCharacters } from './styles';

import { InputProps } from '~/types/main';

interface MaxCharactersInputProps extends InputProps {
  customOnBlur?: (value: string) => void
}

export function MaxCharactersInput({
  name,
  disabled,
  placeholder = "Digite aqui...",
  width = '14.8125rem',
  fullW = false,
  noTitle = false,
  defaultValue = '',
  validated = false,
  customOnBlur = () => {},
  style = {},
  ...rest
}: MaxCharactersInputProps) {
  // se vier preenchido, inicializa o count e value
  const inputRef = useRef<HTMLInputElement>(null);

  const [isValidated, setIsValidated] = useState(!!defaultValue);
  const [charactersCount, setCharactersCount] = useState(
    !!defaultValue ? String(defaultValue).length : 0 );

  const handleOnBlur = useCallback((value: string) => {
    setIsValidated(value.length < 30);
    customOnBlur(value);
  }, [customOnBlur])

  return (
    <Box fullW={fullW} noTitle={noTitle} style={style}>
      {!noTitle && <label htmlFor={name}>{name}</label>}
      <MaxCharacters>
        <Input
          id={name}
          disabled={disabled}
          validated={validated || isValidated}
          placeholder={placeholder}
          width={fullW ? '100%' : width}
          isInput
          defaultValue={defaultValue}
          ref={inputRef}
          onBlur={(e) => handleOnBlur(e.target.value)}
          onChangeCapture={() => setCharactersCount(inputRef!.current!.value.length)}
          type="text"
          {...rest}
        />
        <p>{charactersCount}/30</p>
      </MaxCharacters>
    </Box>
  );
}

