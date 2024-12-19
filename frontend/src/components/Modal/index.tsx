import { CSSProperties, useCallback } from "react";

import { Component } from "~types/main";
import { ReactComponent as CloseIcon } from "~assets/close_white.svg";

import { Background, Container } from './styles'

import {
  ModalTitle,
  CloseModal
} from '~styles/components/modal';

interface ModalProps extends Component {
  title?: string;
  hasCloseButton?: boolean;
  isModalOpen: boolean;
  setIsModalOpen?: (value: boolean) => void;
  customOnClose?: () => void;
  style?: CSSProperties;
}

export function Modal({
  children,
  hasCloseButton = false,
  isModalOpen,
  setIsModalOpen,
  customOnClose = () => {},
  title = '',
  style = {}
}: ModalProps) {
  const handleCloseModal = useCallback(() => {
    customOnClose();
    if(!!setIsModalOpen) setIsModalOpen(false);
  }, [customOnClose, setIsModalOpen]);

  if (isModalOpen) {
    return (
      <Background onClick={handleCloseModal}>
        <Container onClick={(e) => e.stopPropagation()} style={style}>
          {!!title && 
            <>
              <ModalTitle>{title}</ModalTitle>
              <CloseModal onClick={handleCloseModal}>
                <CloseIcon />
              </CloseModal>
            </>
          }
          {!!hasCloseButton && 
            <CloseModal onClick={handleCloseModal}>
              <CloseIcon />
            </CloseModal>
          }
          {children}
        </Container>
      </Background>
    );
  }

  return <></>;
}
