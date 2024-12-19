import { InputProps } from '~/types/main';
import { Box } from '~styles/components/box';

import { ReactComponent as CopyIcon } from '~assets/copy.svg';

import { CopyContentBadge, CopyBoxInput } from './styles'

export function CopyBox({
  name,
  value = '',
  validated = false,
  placeholder = "Digite aqui...",
  width = '13.375rem',
  noTitle = false,
  ...rest
}: InputProps) {
  return (
    <Box>
      {!noTitle && 
        <label htmlFor={name}>
          {name}
        </label>
      }
      <div>
        <CopyBoxInput
          id={name}
          validated={validated}
          placeholder={placeholder}
          width={width}
          isInput
          type="text"
          value={value}
          {...rest}
        />
        <CopyContentBadge
          validated={validated}
          onClick={() => navigator.clipboard.writeText(String(value))}
        >
          <CopyIcon />
        </CopyContentBadge>
      </div>
    </Box>
  );
}

