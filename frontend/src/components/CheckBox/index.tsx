// @ts-nocheck
import { CSSProperties } from 'react';
import { Container } from './styles';

interface Props {
  value: boolean;
  setValue: (value: boolean) => void;
  content: string;
  style?: CSSProperties;
}

export function CheckBox({ value, setValue, content, style }: Props) {
// export function CheckBox({ content }: Props) {
  // const [value, setValue] = useState(false)

  return (
    <Container
      onClick={() => setValue((v) => !v)}
      style={style}
    >
     <div>
      {value && <span />}
     </div>
     <p>{content}</p>
    </Container>
  );
}
