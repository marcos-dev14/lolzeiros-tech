import React, { CSSProperties, useMemo } from 'react';

import { ReactComponent as AlertIcon } from '~assets/alerta-icon.svg';

import { Title, Description, Button, ConfirmationButton } from './styles';
import { Modal } from '~components/Modal';

type Props = {
  setIsModalOpen: () => void;
  action: () => void;
  clientName: string;
  style?: CSSProperties;
}

export function AlertModal({ style = {}, setIsModalOpen, action, clientName }: Props) {
  const modalStyle: CSSProperties = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    margin: 'auto 0',
    width: 603,
    height: 494,
    ...style
  }), [style])

  return (
    <Modal
      hasCloseButton
      isModalOpen={!!clientName}
      setIsModalOpen={setIsModalOpen}
      style={modalStyle}
    >
      <AlertIcon />
      <Title>Tem certeza?</Title>
      <Description>Ao alterar o perfil deste cliente, será também alterado o perfil de todos os clientes do mesmo grupo, sendo eles:&nbsp;<b>{clientName}</b></Description>
      <ConfirmationButton
        onClick={action}
      >
        Avançar
      </ConfirmationButton>
      <Button
        onClick={setIsModalOpen}
      >
        Cancelar
      </Button>
    </Modal>
  );
}
