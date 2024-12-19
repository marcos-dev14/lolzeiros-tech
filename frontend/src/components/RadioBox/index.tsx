// @ts-nocheck
import { CSSProperties } from 'react';
import { Container, Title, BoxContainer, Box } from './styles';

interface Props {
  title: string;
  options?: string[];
  value: string;
  setValue: (value: string) => void;
  hasMargin?: boolean;
  customHeight?: boolean;
}

export function RadioBox({
  title,
  options = ['Sim', 'Não'],
  value,
  setValue,
  hasMargin = false,
  customHeight = false
}: Props) {
  return (
    <Container hasMargin={hasMargin} customHeight={customHeight}>
      <Title>{title}</Title>
      <BoxContainer>
        {options.map(option => 
          <Box
            key={option}
            onClick={() => setValue(option)}
          >
           <div>{value === option && <span />}</div>
           <p>{option}</p>
          </Box>
        )}
      </BoxContainer>
    </Container>
  );
}
