import { Box, BoxBadge, BoxInputMask } from '../../styles/components/box';
import { ReactComponent as GoogleLogo } from '../../assets/product-category.svg';

import { InputMaskProps } from '../../types/main';

export function PriceBox({
  name,
  disabled = false,
  validated,
  placeholder = '00,00',
  width = '5.5rem',
  ...rest
}: InputMaskProps) {
  // remover mask e aplicar formatOnBlur

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
          mask="999.999,99"
          maskPlaceholder={null}
          width={width}
          {...rest}
        />
      </div>
    </Box>
  );
}

