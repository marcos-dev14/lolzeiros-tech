import React from 'react';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { Container } from './styles';

type Props = {
  content: string;
}

export function LoadingContainer({ content }: Props) {
  return (
    <Container>
      <LoadingIcon />
      <p>Carregando {content}...</p>
    </Container>
  );
}

