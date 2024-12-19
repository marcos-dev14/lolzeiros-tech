import { Box } from '../../styles/components/box';
import { Badge } from '~types/main';
import { ReactComponent as CopyIcon } from '~assets/copy.svg';

import { CopyContentBadge, SiteBoxBadge, SiteBoxInput } from './styles'
import { useState } from 'react';
import { isNotEmpty } from '@/src/utils/validation';

type Props = {
  name: string;
  disabled?: boolean;
  validated: boolean;
  noTitle?: boolean;
  placeholder?: string;
  width?: string;
  badge?: boolean;
  defaultValue?: string;
  title?: string;
}

export function SiteBox({
  name,
  disabled,
  validated,
  placeholder = "Digite aqui...",
  width = '13.375rem',
  badge = false,
  noTitle = false,
  defaultValue = '',
  ...rest
}: Props) {
  const [isValidated, setIsValidated] = useState(validated || (isNotEmpty(defaultValue) && !!defaultValue));

  return (
    <Box noTitle={noTitle}>
      {!noTitle &&
        <label htmlFor={name}>
          {name}
        </label>
      }
      <div>
        <SiteBoxBadge
          validated={isValidated}
        >
          https://
        </SiteBoxBadge>
        <SiteBoxInput
          id={name}
          disabled={disabled}
          validated={isValidated}
          placeholder={placeholder}
          width={width}
          isInput
          type="text"
          hasBadge={!!badge}
          defaultValue={defaultValue}
          onBlur={({ target: { value } }) => setIsValidated(isNotEmpty(value))}
          {...rest}
        />
        {!!badge &&
          <CopyContentBadge
            validated={false}
          >
            <CopyIcon />
          </CopyContentBadge>
        }
      </div>
    </Box>
  );
}

