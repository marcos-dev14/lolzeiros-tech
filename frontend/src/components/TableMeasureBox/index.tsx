import { BoxBadge, BoxInput } from '../../styles/components/box';

import { InputProps } from '~/types/main';

import { CustomBox, Measure } from './styles';

interface Props extends InputProps {
  measure: string;
  noTitle?: boolean;
}

export function MeasureBox({
  name,
  disabled,
  measure,
  noTitle = false,
  validated = false,
  width = '7.5rem',
  placeholder = "Digite aqui...",
  ...rest
}: Props) {
  return (
    <CustomBox noTitle={noTitle}>
      {!noTitle && <div className="status">
        <label htmlFor={name}>{name}</label>
      </div>}
      <div>
        <BoxBadge
          validated={validated}
        >
          <Measure>
            {measure}
          </Measure>
        </BoxBadge>
        <BoxInput
          id={name}
          disabled={disabled}
          validated={validated}
          placeholder={placeholder}
          width={width}
          isInput
          type="text"
          {...rest}
        />
      </div>
    </CustomBox>
  );
}

