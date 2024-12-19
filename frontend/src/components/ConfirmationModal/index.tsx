import React, { CSSProperties, useMemo } from 'react';

import { ReactComponent as AlertIcon } from '~assets/alerta-icon.svg';

import { Title, Description, Button, ConfirmationButton } from './styles';
import { Modal } from '~components/Modal';

type Props = {
  setIsModalOpen: () => void;
  action: () => void;
  category: string;
  style?: CSSProperties;
}

export function ConfirmationModal({ style = {}, setIsModalOpen, action, category }: Props) {
  const modalStyle: CSSProperties = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    margin: 'auto 0',
    width: 573,
    height: 494,
    ...style
  }), [style])

  return (
    <Modal
      hasCloseButton
      isModalOpen={!!category}
      setIsModalOpen={setIsModalOpen}
      style={modalStyle}
    >
      <AlertIcon />
      <Title>
        Tem certeza?
      </Title>
      <Description>
        Você não poderá recuperar essa <b>{category}!</b>
      </Description>
      <ConfirmationButton onClick={action}>Sim, quero excluir!</ConfirmationButton>
      <Button onClick={setIsModalOpen}>Cancelar</Button>
    </Modal>
  );
}
