import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, BoxBadge, BoxInput } from '../../styles/components/box';
import { useField } from '@unform/core';

import { ReactComponent as GoogleLogo } from '../../assets/product-category.svg';

import { InputProps, Badge } from '~/types/main';
import { StatusBadge } from './styles';
import { isNotEmpty } from '@/src/utils/validation';

interface Props extends InputProps {
  type: 'email' | 'social';
  badge?: Badge;
  width?: string;
  inputStyle?: CSSProperties;
}

export function SocialBox({
  name,
  title,
  disabled,
  validated = false,
  type = 'email',
  placeholder = "Digite aqui...",
  badge: Badge = GoogleLogo,
  style = {},
  inputStyle = {},
  onBlur = () => {},
  noTitle = false,
  width = '16.125rem',
}: Props) {
  const { fieldName, defaultValue, registerField, error } = useField(name!);
  
  const [isValidated, setIsValidated] = useState(validated || (isNotEmpty(defaultValue) && !!defaultValue));
  
  const currentWidth = useMemo(() => 
     width !== '16.125rem' ? width :
      type === 'email' ? '13rem' :
      width
  , [width, type]);

  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <Box style={style}>
      {!noTitle &&
        <div className="status">
          <label htmlFor={name}>{title}</label>
          {type === 'email' && !isValidated &&
            <StatusBadge status={false}>Não Validado</StatusBadge>
          }
        </div>
      }
      <div>
        <BoxBadge
          validated={isValidated}
        >
          <Badge />
        </BoxBadge>
        <BoxInput
          id={name}
          disabled={disabled}
          validated={isValidated}
          placeholder={placeholder}
          width={currentWidth}
          ref={inputRef}
          defaultValue={defaultValue}
          isInput
          type="text"
          onBlur={handleOnBlur}
          style={inputStyle}
        />
      </div>
    </Box>
  );
}

