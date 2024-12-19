import { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { InputProps } from '~/types/main';
import { Box } from '~styles/components/box';

import { ReactComponent as ViewIcon } from '~assets/view_white.svg';

import { ViewBadge, UrlBoxInput } from './styles'

interface Props extends InputProps {
  hasIcon?: boolean;
}

export function StaticUrlBox({
  name,
  validated = false,
  hasIcon = true,
  placeholder = "Digite aqui...",
  width = '13.375rem',
  defaultValue,
  ...rest
}: Props) {
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
          defaultValue={defaultValue}
          hasIcon={hasIcon}
          {...rest}
        />
        {hasIcon && 
          <ViewBadge
            validated={validated}
          >
            <ViewIcon />
          </ViewBadge>
        }
      </div>
    </Box>
  );
}

