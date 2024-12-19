import React, { CSSProperties, useMemo } from 'react';

import { ReactComponent as OkIcon } from '~assets/OK-icon.svg';

import { Title } from './styles';
import { Modal } from '~components/Modal';

type Props = {
  setIsModalOpen: () => void;
  message: string;
}

export function SuccessModal({ setIsModalOpen, message }: Props) {
  const modalStyle: CSSProperties = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    margin: 'auto 0',
    width: 573,
    height: 280,
    overflow: 'hidden',
  }), [])

  return (
    <Modal
      hasCloseButton
      isModalOpen={!!message}
      setIsModalOpen={setIsModalOpen}
      style={modalStyle}
    >
      <OkIcon />
      <Title>
        {message}
      </Title>
    </Modal>
  );
}
