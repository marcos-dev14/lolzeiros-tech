import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Button, ButtonsContainer, Container, CustomSectionTitle, GoBackButton, MenuContainer, MenuOption, Quote, SystemsContainer } from './styles';

import { ReactComponent as EmailIcon } from '~assets/email.svg';
import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { InputContainer, MenuAndTableContainer, SectionTitle } from '@/src/styles/components';
import { FormInput } from '@/src/components/FormInput';
import { SocialBox } from '@/src/components/SocialBox';
import { FormSelect } from '@/src/components/FormSelect';
import { FormPhoneBox } from '@/src/components/FormPhoneBox';

export function EditAdmin() {
  const { goBack } = useHistory();
  const formRef = useRef<FormHandles>(null)

  return (
    <>
      <Header route={['Cadastro', 'Administrador', 'Editar Administrador']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Form ref={formRef} onSubmit={() => {}}>
          <Container>
            <SectionTitle>
              Administrador
            </SectionTitle>
            <InputContainer>
              <FormInput
                name="name"
                title="Nome"
                width="12.5rem"
                validated={false}
              />
              <FormInput
                name="job"
                title="Cargo"
                width="8.75rem"
                validated={false}
              />
              <SocialBox
                name="personal_email"
                title="Login (Email)"
                type="email"
                validated
                badge={EmailIcon}
                width="13rem"
                inputStyle={{ textTransform: 'lowercase' }}
              />
              <Button
                className="validate"
                onClick={() => {}}
              >
                Validar Email
              </Button>
              <FormInput
                name="password"
                title="Senha"
                width="9.375rem"
                validated={false}
              />
              <FormInput
                name="confirm_password"
                title="Repetir Senha"
                width="9.375rem"
                validated={false}
              />
              <GoBackButton
                onClick={goBack}
                type="button"
                className="goBack"
              >
                <GoBackIcon />
                <p>Voltar</p>
              </GoBackButton>
            </InputContainer>
            <InputContainer>
              <FormPhoneBox
                name="phone"
                title="Telefone"
                width="8.125rem"
              />
              <FormPhoneBox
                name="cellphone"
                title="Celular"
                width="8.125rem"
              />
              <FormPhoneBox
                name="whatsapp"
                title="Whatsapp"
                width="8.125rem"
              />
            </InputContainer>
            <CustomSectionTitle>
              Sistemas
            </CustomSectionTitle>
            <SystemsContainer>
              <div style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                <FormSelect
                  name="location"
                  title="Acesso Autorizado"
                  placeholder="Selecione..."
                  customWidth="15.625rem"
                />
                <Quote>
                  Se deseja personalizar os sistemas para o acesso autorizado basta clicar em cima do link.
                </Quote>
              </div>
              <MenuContainer>
                <MenuOption>Dashboard</MenuOption>
                <MenuOption selected>Email</MenuOption>
                <MenuOption selected sub>Caixa de Entrada</MenuOption>
                <MenuOption selected sub>Enviados</MenuOption>
                <MenuOption selected sub>SPAM</MenuOption>
                <MenuOption>Cadastro</MenuOption>
                <MenuOption sub>Cliente</MenuOption>
                <MenuOption selected sub>Representada</MenuOption>
                <MenuOption sub>vCard</MenuOption>
                <MenuOption sub>Banner (Publicidade)</MenuOption>
                <MenuOption sub>Testemunho</MenuOption>
                <MenuOption sub>Administrador</MenuOption>
                <MenuOption>Blog</MenuOption>
                <MenuOption sub>Postagem</MenuOption>
                <MenuOption sub>Autor da Postagem</MenuOption>
                <MenuOption sub>Categoria da Postagem</MenuOption>
                <MenuOption>Loja Online</MenuOption>
                <MenuOption sub>Vendas</MenuOption>
                <MenuOption sub>Produto</MenuOption>
                <MenuOption sub>Categoria do Produto</MenuOption>
                <MenuOption sub>Marca do Produto</MenuOption>
                <MenuOption sub>Opcional</MenuOption>
                <MenuOption sub>Atributo</MenuOption>
                <MenuOption sub>CBACK</MenuOption>
                <MenuOption sub>Promoção Temporária</MenuOption>
                <MenuOption>Newsletter</MenuOption>
                <MenuOption sub>Campanha</MenuOption>
                <MenuOption sub>Subscrito</MenuOption>
                <MenuOption>Relatório</MenuOption>
                <MenuOption sub>Google Analytics</MenuOption>
                <MenuOption sub>Vendas</MenuOption>
                <MenuOption>Financeiro</MenuOption>
                <MenuOption>Suporte</MenuOption>
                <MenuOption>Configuração</MenuOption>
                <MenuOption sub>Info do Site</MenuOption>
                <MenuOption sub>Links do Site</MenuOption>
              </MenuContainer>
              <ButtonsContainer>
                  <button
                    className="save"
                    onClick={() => {}}
                  >
                    Salvar Administrador
                  </button>
                  <button
                    className="delete"
                    onClick={() => {}}
                  >
                    Excluir Administrador
                  </button>
              </ButtonsContainer>
            </SystemsContainer>
          </Container>
        </Form>
      </MenuAndTableContainer>
    </>
  );
}
