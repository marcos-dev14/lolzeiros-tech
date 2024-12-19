import React, { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { ReactComponent as Logo } from '~assets/auge-logo.svg';

import { Container, Content, SubmitButton } from './styles';
import { FormInput } from '~components/FormInput';
import { emptyFieldRegex } from '@/src/utils/validation';
import { useAuth } from '@/src/context/auth';

export function Login() {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { signed } = useAuth();


  const handleSubmit = useCallback(async (data) => {
    try {

      const schema = Yup.object().shape({
        email: Yup.string().email().required().matches(emptyFieldRegex),
        password: Yup.string().required().matches(emptyFieldRegex),
      })

      await schema.validate(data);

      await signIn(data);
    } catch(err) {
      if(err instanceof Yup.ValidationError) 
        alert('Erro no login. Preencha os campos corretamente.')
    }
  }, [signIn]);

  return (
    <Container>
      <Content ref={formRef} onSubmit={handleSubmit}>
        <Logo style={{ marginTop: '2rem' }}/>
        <FormInput
          name="email"
          title="E-mail"
          placeholder="usuario@email.com"
          fullW
          width="100%"
          style={{ marginTop: '2.75rem' }}
        />
        <FormInput
          name="password"
          title="Senha"
          placeholder="******"
          type="password"
          fullW
          width="100%"
          style={{ marginTop: '0.75rem' }}
        />
        <SubmitButton type="submit">
          Entrar
        </SubmitButton>
      </Content>
    </Container>
  );
}

