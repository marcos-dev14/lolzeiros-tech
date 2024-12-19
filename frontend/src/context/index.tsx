import React from 'react';

import { Component } from '~types/main';
import { AuthProvider } from './auth';
import { ModalProvider } from './modal';
import { ProductProvider } from './product';
import { RegisterProvider } from './register';
import { OrderProvider } from './order';

export function ContextProvider({ children }: Component) {
  return (
    <AuthProvider>
      <OrderProvider>
        <ModalProvider>
          <ProductProvider>
            <RegisterProvider>
              {children}
            </RegisterProvider>
          </ProductProvider>
        </ModalProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

