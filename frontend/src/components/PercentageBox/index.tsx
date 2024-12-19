import { Box, BoxBadge, BoxInputMask } from '../../styles/components/box';
import { ReactComponent as GoogleLogo } from '../../assets/product-category.svg';

import { InputMaskProps } from '../../types/main';

export function PercentageBox({
  name,
  disabled = false,
  validated,
  placeholder = '00',
  width = '3rem',
  ...rest
}: InputMaskProps) {
  return (
    <Box>
      <label htmlFor={name}>{name}</label>
      <div>
        <BoxBadge
          validated={validated}
        >
          <GoogleLogo />
        </BoxBadge>
        <BoxInputMask
          id={name}
          name={name}
          validated={validated}
          placeholder={placeholder}
          mask="99"
          width={width}
          {...rest}
        />
      </div>
    </Box>
  );
}

