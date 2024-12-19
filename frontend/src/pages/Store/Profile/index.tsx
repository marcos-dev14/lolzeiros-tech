import React, { useCallback, useRef, useState } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { Container, Content, Avatar, SubmitButton } from './styles';
import { FormInput } from '~components/FormInput';
import { emptyFieldRegex } from '@/src/utils/validation';
import { useAuth } from '@/src/context/auth';
import { Header } from '~components/Header';
import { useDropzone } from 'react-dropzone';
import { api } from '@/src/services/api';

export function Profile() {
  const formRef = useRef<FormHandles>(null);

  const { user, avatar, setUser } = useAuth();

  const [picture, setPicture] = useState('');

  const handleSubmit = useCallback(async (data) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required().matches(emptyFieldRegex),
        password: Yup.string().required().matches(emptyFieldRegex),
        password_confirmation:
          Yup.string().when('password', (password, field) =>
            password ? field.oneOf([Yup.ref('password')]) : field),
      })

      await schema.validate(data);
      
      const upload = new FormData()
      
      upload.append('name', data.name);
      upload.append('password', data.password);
      upload.append('password_confirmation', data.password_confirmation);
      
      if(!!picture){
        const file = await fetch(picture).then(r => r.blob());
        upload.append('avatar', file);
      }

      const { data: response } = await api.post(`/users/${user.id}?_method=PUT`, upload);

      alert("Dados atualizados com sucesso!");
      
      setUser({ ...user, name: data.name });
    } catch(err) {
      if(err instanceof Yup.ValidationError) {
        alert('Erro na atualização. Preencha os campos corretamente.')
        return;
      }

      // @ts-ignore
      const errors = Object.values(err.response.data.data);
      // @ts-ignore
      const message = errors.reduce((acc: string, e: string[]) => 
        acc + e.join('\n') + '\n'
      , '');

      alert(message);
    }
  }, [picture, user, setUser]);

  const validator = useCallback((file) => {
    const { type } = file;
    const acceptedExtensions = ['jpeg', 'jpg', 'png'];

    const[, extension] = type.split('/')

    if(!acceptedExtensions.includes(extension)) {
      return {
        code: "name-too-large",
        message: `Name is larger than characters`
      };
    }

    return null;
  }, []);

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    try{
      const url = URL.createObjectURL(acceptedFiles[0]);
      setPicture(url);
    } catch(e) {
      console.log('err', e)
    }
  }, [setPicture]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    validator,
    accept: 'image/jpeg, image/jpg, image/png'
  });

  return (
    <>
    <Header route={['Loja Online', 'Painel do Usuário']} />
    <Container>
      <Content ref={formRef} onSubmit={handleSubmit}>
        <Avatar src={!!picture ? picture : avatar} alt="Avatar" {...getRootProps()} />
        <input {...getInputProps()}/>
        <FormInput
          name="name"
          defaultValue={user.name}
          title="Nome"
          width="24rem"
          style={{ marginTop: '1.75rem' }}
        />
        <FormInput
          name="password"
          title="Senha"
          placeholder="******"
          type="password"
          width="24rem"
          style={{ marginTop: '0.75rem' }}
        />
        <FormInput
          name="password_confirmation"
          title="Confirmar Senha"
          placeholder="******"
          type="password"
          width="24rem"
          style={{ marginTop: '0.75rem' }}
        />
        <SubmitButton type="submit">
          Atualizar
        </SubmitButton>
      </Content>
    </Container>
    </>
  );
}

