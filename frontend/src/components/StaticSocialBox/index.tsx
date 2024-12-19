import { CSSProperties, useMemo } from 'react';
import { Box, BoxBadge, BoxInput } from '../../styles/components/box';

import { ReactComponent as GoogleLogo } from '../../assets/product-category.svg';

import { InputProps, Badge } from '~/types/main';
import { StatusBadge } from './styles';

interface Props extends InputProps {
  type: 'email' | 'social';
  badge?: Badge;
  inputStyle?: CSSProperties;
}

export function StaticSocialBox({
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
  ...rest
}: Props) {
  
  const width = useMemo(() => 
    type === 'email' ? '13rem' : '16.125rem'
  , [type]);

  return (
    <Box style={style} noTitle={noTitle}>
      {!noTitle &&
        <div className="status">
          <label htmlFor={name}>{title}</label>
          {type === 'email' &&
            <StatusBadge status={validated}>{validated ? 'Validado' : 'Não Validado'}</StatusBadge>
          }
        </div>
      }
      <div
        title={title}
      >
        <BoxBadge
          validated={validated}
        >
          <Badge />
        </BoxBadge>
        <BoxInput
          id={name}
          disabled={disabled}
          validated={validated}
          placeholder={placeholder}
          width={width}
          isInput
          type="text"
          onBlur={onBlur}
          style={inputStyle}
          {...rest}
        />
      </div>
    </Box>
  );
}

