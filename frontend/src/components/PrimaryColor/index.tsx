// @ts-nocheck
import { Container, ColorInput } from './styles';

type Props = {
  color: string;
  onClick: Function;
  title?: string;
  squared?: boolean;
};

export function PrimaryColor({
  title = 'Cor Predominante',
  color,
  onClick,
  squared = false
}: Props) {
  return (
    <Container onClick={onClick} squared={squared}>
      <label htmlFor="cor">{title}</label>
      <ColorInput
        id="cor"
        style={{ backgroundColor: color }}
        squared={squared}
      />
    </Container>
  );
}

