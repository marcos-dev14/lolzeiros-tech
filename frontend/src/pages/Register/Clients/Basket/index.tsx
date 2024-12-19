import React from 'react';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';

import { Container } from './styles';
import { MenuAndTableContainer, SectionTitle } from '~styles/components';

import { ClientHeader } from '@/src/components/ClientHeader';

export function Basket() {
  return (
    <>
      <Header route={['Cadastro', 'Cliente', 'Suporte']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Container>
          <ClientHeader
            ref={null}
            disabled={false}
          />
          <SectionTitle
            style={{
              marginTop: '1.25rem'
            }}
          >
            Cesto 943472
          </SectionTitle>
          
        </Container>
      </MenuAndTableContainer>
    </>
  );
}
