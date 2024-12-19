import React, { CSSProperties, useMemo } from 'react';

import { ReactComponent as AlertIcon } from '~assets/alerta-icon.svg';

import { Title, Description } from './styles';
import { Modal } from '~components/Modal';

type Props = {
  setIsModalOpen: () => void;
  error: string;
}

export function ErrorModal({ setIsModalOpen, error }: Props) {
  const modalStyle: CSSProperties = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    margin: 'auto 0',
    width: 573,
    height: 394,
    overflow: 'hidden',
  }), [])

  return (
    <Modal
      hasCloseButton
      isModalOpen={!!error}
      setIsModalOpen={setIsModalOpen}
      style={modalStyle}
    >
      <AlertIcon />
      <Title>
        Alerta de Erro
      </Title>
      <Description>
        {error}
      </Description>
    </Modal>
  );
}
