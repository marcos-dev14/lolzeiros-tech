import { useRef } from "react";
import { FormHandles } from '@unform/core';
import { Form } from "@unform/web";

import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';

import { Header } from "@/src/components/Header";
import { Menu } from "@/src/components/Menu";
import { InputContainer, MenuAndTableContainer, SectionTitle } from "@/src/styles/components";
import { FormInput } from "@/src/components/FormInput";

import { Button, Container } from "../styles";
import { GoBackButton } from "./styles";
import { useHistory } from "react-router";

export function EditSeller() {
  const formRef = useRef<FormHandles>(null);
  const { goBack } = useHistory();

  return (
    <>
      <Header route={[]} />
      <MenuAndTableContainer>
        <Menu />

        <Form ref={formRef} onSubmit={() => {}} >
          <Container>
            <SectionTitle>
              Comercial
            </SectionTitle>

            <InputContainer>
              <FormInput
                name="name"
                title="Nome"
                placeholder="Digite aqui..."
                style={{ textAlign: "left" }}
              />

              <FormInput
                name="email"
                title="Email"
                placeholder="Digite aqui..."
                style={{ textAlign: "left" }}
              />

              <FormInput
                name="phone"
                title="Celular"
                placeholder="Digite aqui..."
                style={{ textAlign: "left" }}
              />

              <FormInput
                name="phone"
                title="Telefone fixo"
                placeholder="Digite aqui..."
                style={{ textAlign: "left" }}
              />
            </InputContainer>

            <InputContainer>
              <FormInput
                name="updatedAt"
                title="Cadastro na auge"
                placeholder="Digite aqui..."
                style={{ textAlign: "left" }}
              />
            </InputContainer>

            <InputContainer>
              <GoBackButton
                onClick={goBack}
                type="button"
                className="goBack"
              >
                <GoBackIcon />
                <p>Voltar</p>
              </GoBackButton>

              <Button
                onClick={() => {}}
              >
                Salvar
              </Button>
            </InputContainer>
          </Container>
        </Form>
      </MenuAndTableContainer>
    </>
  )
}