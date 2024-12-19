import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Badge, BadgeContainer, Button,Container, GoBackButton } from './styles';

import { ReactComponent as EmailIcon } from '~assets/email.svg';
import { ReactComponent as PlusIcon } from '~assets/plus.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg'
import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { InputContainer, MenuAndTableContainer, SectionTitle } from '@/src/styles/components';
import { FormInput } from '@/src/components/FormInput';
import { SocialBox } from '@/src/components/SocialBox';
import { FormSelect } from '@/src/components/FormSelect';
import { FormPhoneBox } from '@/src/components/FormPhoneBox';
import { Input } from '~components/Input';
import { TableActionButton } from '~styles/components/tables';
import { DefaultValuePropsWithId, IBaseType, IBuyer } from '@/src/types/main';
import { api } from '@/src/services/api';
import { Modal } from '@/src/components/Modal';
import { DeleteItemsContainer } from '../../Clients/New/styles';
import { ErrorModal } from '@/src/components/ErrorModal';
import { capitalizeContent, isMailValid, isNotEmpty } from '@/src/utils/validation';
import { SuccessModal } from '@/src/components/SuccessModal';

export function NewBuyer() {
  const formRef = useRef<FormHandles>(null);
  const { goBack } = useHistory();
  
  const [cellphone, setCellphone] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [roleName, setRoleName] = useState('');
  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);

  const [rolesOptions, setRolesOptions] = useState<DefaultValuePropsWithId[]>([]);

  const handleRegisterBuyer = useCallback(async () => {
    try {
      // @ts-ignore
      const data = formRef.current?.getData();
      
      // @ts-ignore
      if(!isMailValid(data.email)) {
        setError('Preencha um email válido');
        return;
      }

      let request = {
        ...data
      }

      // @ts-ignore
      if (data.password.length < 6 || (isNotEmpty(data.password) && (data.password !== data.password_confirmation))) {
        setError('As senhas não conferem'); // @ts-ignore
      } else if (!isNotEmpty(data.password)){
        // @ts-ignore
        delete request.password;
        // @ts-ignore
        delete request.password_confirmation;
      }
      
      // @ts-ignore
      delete request.role;
      
      // @ts-ignore
      if(!!data.role) {
        // @ts-ignore
        const { id } = rolesOptions.find(e => e.value === data.role);
        // @ts-ignore
        request['role_id'] = id;
      }
    
      const {
        data: response
      } = await api.post('/buyers', request);

      setMessage('Salvo com sucesso');
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar o cliente.';

      setError(errorMessage);
    }
  }, [rolesOptions]);

  const fetchRoles = useCallback(async () => {
    try {
      const {
        data: {
          data
        }
      } = await api.get('/roles');

      setRolesOptions([{ value: 'new', label: 'Editar Cargo' }, ...data.map((r: IBaseType) => ({ id: r.id, value: r.name, label: r.name }))])
    } catch (e) {
      console.log('e', e);
    }
  }, []);

  const handleAddNewRole = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.post('/roles', { name: roleName });

      const newRole = {
        id: data.id,
        value: data.name,
        label: data.name,
      }

      // @ts-ignore
      setRolesOptions(prev => [...prev, newRole])

      setRoleName('Carregando');
      setRoleName(data.name);

      setIsNewRoleModalOpen(false);
    } catch (e) {
      console.log('e', e);
    }
  }, [roleName]);

  const handleDeleteRole = useCallback(async (id: number, value: string) => {
    try {
      await api.delete(`/roles/${id}`);

      // @ts-ignore
      setRolesOptions(prev => prev.filter(e => e.value !== value));
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  useEffect(() => {
    fetchRoles();
  }, [])

  const handleUpdate = useCallback((field: string, value: string) => {    
    const updatedValue = capitalizeContent(value);
    formRef.current?.setFieldValue(field, updatedValue)
  }, []);

  return (
    <>
      <Header route={['Cadastro', 'Comprador']} />
      <MenuAndTableContainer>
        <Menu />
        <Form ref={formRef} onSubmit={() => {}}>
          <Container>
            <SectionTitle>
              Comprador
            </SectionTitle>
            <InputContainer>
              <FormInput
                name="name"
                title="Nome"
                width="16.25rem"
                validated={false}
                onBlur={e => handleUpdate('name', e.target.value)}
              />
              {roleName !== 'Carregando' ?
                <FormSelect
                  name="role"
                  title="Cargo na Empresa"
                  placeholder="Selecione..."
                  customWidth="10rem"
                  data={rolesOptions}
                  onChange={(value: string, id: string) => 
                    value === 'new' && setIsNewRoleModalOpen(true)
                  }
                /> :
                <></>
              }
              <FormPhoneBox
                name="cellphone"
                title="Celular"
                width="8.125rem"
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
              <SocialBox
                name="email"
                title="Email Corporativo"
                type="email"
                badge={EmailIcon}
                width="14.25rem"
                inputStyle={{ textTransform: 'lowercase' }}
              />
              <FormInput
                name="password"
                title="Senha"
                width="10rem"
                type="password"
              />
              <FormInput
                name="password_confirmation"
                title="Repetir Senha"
                width="10.125rem"
                type="password"
              />
              <FormInput
                name="group_name"
                title="Grupo"
                width="12.75rem"
                validated={false}
                onBlur={e => handleUpdate('group_name', e.target.value)}
              />
              <Button
                onClick={handleRegisterBuyer}
              >
                Salvar
              </Button>
            </InputContainer> 
          </Container>
        </Form>
      </MenuAndTableContainer>
      <Modal
        title="Editar Cargos"
        isModalOpen={isNewRoleModalOpen}
        setIsModalOpen={setIsNewRoleModalOpen}
        customOnClose={() => {}}
        style={{ width: 471 }}
      >
        <InputContainer style={{ alignItems: 'flex-end' }}>
          <Input
            name="Novo Cargo"
            fullW
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
          <TableActionButton
            onClick={handleAddNewRole}
            style={{
              marginLeft: '1rem'
            }}
          >
            <PlusIcon />
          </TableActionButton>
        </InputContainer>
        <DeleteItemsContainer>
          {rolesOptions.map((t: DefaultValuePropsWithId) => 
            t.value !== 'new' &&
            <div key={t.id}>
              <Input
                name=""
                noTitle
                disabled
                width="100%"
                fullW
                value={t.value}
                validated
              />
              <TableActionButton
                onClick={() => handleDeleteRole(t.id, t.value)}
                style={{ marginLeft: '1rem' }}
              >
                <TrashIcon />
              </TableActionButton>
            </div>  
          )}
        </DeleteItemsContainer>
      </Modal>
      <SuccessModal
        message={message}
        setIsModalOpen={() => setMessage('')}
      />
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
