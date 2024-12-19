import React from 'react';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { Container } from './styles';

type Props = {
  content: string;
}

export function TableLoadingContainer({ content }: Props) {
  return (
    <Container>
      <LoadingIcon />
      <span>Carregando {content}...</span>
    </Container>
  );
}