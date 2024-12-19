import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '~styles/components/box';
import { Input as BaseInput } from './styles';

import { InputProps } from '~/types/main';

interface Props extends InputProps {
  noValueInput?: boolean;
  error?: boolean;
}

export function Input({
  name,
  disabled,
  validated = false,
  placeholder = "Digite aqui...",
  width = '14.8125rem',
  fullW = false,
  noTitle = false,
  style = {},
  value = '',
  defaultValue = '',
  onBlur = () => {},
  noValueInput = false,
  error = false,
  ...rest
}: Props) {
  const [isValidated, setIsValidated] = useState(!!defaultValue || !!value);

  // @ts-ignore
  const handleOnBlur = useCallback((e) => {
    setIsValidated(!!e.target.value)
    // @ts-ignore
    onBlur(e);
  }, [onBlur]);

  const hasDefaultValue = useMemo(() =>
    !!noValueInput ?
      { defaultValue: defaultValue } :
      { defaultValue: defaultValue, value: value }
  , [defaultValue, value, noValueInput]);

  return (
    <Box fullW={fullW} noTitle={noTitle} style={style}>
      {!noTitle && <label htmlFor={name}>{name}</label>}
      <BaseInput
        id={name}
        disabled={disabled}
        validated={validated || !!isValidated}
        // value={value}
        // defaultValue={defaultValue}
        {...hasDefaultValue}
        onBlur={(e) => handleOnBlur(e)}
        placeholder={placeholder}
        width={fullW ? '100%' : width}
        error={error}
        isInput
        type="text"
        {...rest}
      />
    </Box>
  );
}

