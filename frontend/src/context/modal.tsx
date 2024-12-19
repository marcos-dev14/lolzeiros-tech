import { createContext, ReactNode, useContext, useState } from 'react';

type ModalContextData = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

type Props = {
  children: ReactNode;
}

const ModalContext = createContext({} as ModalContextData);

export function ModalProvider({ children }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext);
  
  if(!context) {
    throw new Error('This hook must be invoked inside an Modal Provider.')
  }

  return context;
}