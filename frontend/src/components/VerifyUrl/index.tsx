import { InputProps } from '~/types/main';
import { Box } from '~styles/components/box';

import { ReactComponent as SeeIcon } from '~assets/view1.svg';

import { CopyContentBadge, CopyBoxInput } from './styles'

interface Props extends InputProps {
  action: Function;
}

export function VerifyUrl({
  name,
  value = '',
  validated = false,
  action,
  disabled,
  placeholder = "Digite aqui...",
  width = '13.375rem',
  ...rest
}: Props) {
  return (
    <Box>
      <label htmlFor={name}>{name}</label>
      <div>
        <CopyBoxInput
          id={name}
          validated={validated}
          placeholder={placeholder}
          width={width}
          isInput
          type="text"
          value={value}
          disabled={disabled}
          {...rest}
          />
        <CopyContentBadge
          validated={validated}
          // @ts-ignore
          onClick={action}
          disabled={disabled}
        >
          <SeeIcon />
        </CopyContentBadge>
      </div>
    </Box>
  );
}

