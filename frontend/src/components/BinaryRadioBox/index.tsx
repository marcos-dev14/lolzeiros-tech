// @ts-nocheck
import { CSSProperties } from 'react';
import { Container, Title, BoxContainer, Box } from './styles';

interface Props {
  title: string;
  options?: string[];
  value: number;
  setValue: (value: number) => void;
  hasMargin?: boolean;
  customHeight?: boolean;
}

export const BinaryRadioBox = ({
  title,
  options = ['Sim', 'Não'],
  value,
  setValue,
  hasMargin = false,
  customHeight = false
}: Props) => (
  <Container hasMargin={hasMargin} customHeight={customHeight}>
    <Title>{title}</Title>
    <BoxContainer>
      {options.map((option, index) => 
        <Box key={option} onClick={() => setValue(Number(option === 'Sim'))}>
          <div>
          {((!!value && option === 'Sim') ||
            (!value && option === 'Não')) && 
          <span />}
          </div>
          <p>{option}</p>
        </Box>
      )}
    </BoxContainer>
  </Container>
  );

