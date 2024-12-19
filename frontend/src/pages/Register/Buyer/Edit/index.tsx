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
import { capitalizeContent, isMailValid, isNotEmpty, phoneIsValid } from '@/src/utils/validation';
import { SuccessModal } from '@/src/components/SuccessModal';
import { useRegister } from '@/src/context/register';

export function EditBuyer() {
  const formRef = useRef<FormHandles>(null);
  const { buyer } = useRegister();
  const { goBack } = useHistory();

  const formattedBuyer = useMemo(() => {
    return {
      ...buyer,
      role_name: !!buyer.role ? buyer.role.name : '',
      client_group_id: !!buyer.group ? buyer.group.name : '',
    };
  }, [buyer])
  
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

      // @ts-ignore
      if(!phoneIsValid(data.cellphone)) {
        setError('Preencha um número de celular válido');
        return;
      }

      let request = {
        ...data
      }

      // @ts-ignore
      if (isNotEmpty(data.password) && (data.password !== data.password_confirmation)) {
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
      } = await api.post(`/buyers/${buyer.id}?_method=PUT`, request);

      setMessage('Salvo com sucesso');
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar o cliente.';

      setError(errorMessage);
    }
  }, [buyer, rolesOptions]);

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
        <Form ref={formRef} onSubmit={() => {}} initialData={formattedBuyer}>
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
              {!!formattedBuyer && roleName !== 'Carregando' ?
                <FormSelect
                  name="role"
                  title="Cargo na Empresa"
                  placeholder="Selecione..."
                  customWidth="10rem"
                  data={rolesOptions}
                  onChange={(value: string, id: string) => 
                    value === 'new' && setIsNewRoleModalOpen(true)
                  }
                  customDefaultValue={{
                    value: !!roleName ? roleName : formattedBuyer.role_name,
                    label: !!roleName ? roleName : formattedBuyer.role_name
                  }}
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
                title="Preencher a Senha se for alterar"
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
                name="client_group_id"
                title="Grupo"
                width="12.75rem"
                validated={false}
                disabled
              />
              <Button
                onClick={handleRegisterBuyer}
              >
                Salvar
              </Button>
            </InputContainer>
            <BadgeContainer>
              {/* <Badge>
                <strong>PAULO BRINQUEDOS LTDA</strong>
                <p>91.923.217/0001-29<br/>Av. Goiás Norte - Res. Recanto do Bosque<br/>Goiânia - Goiás<br/>74594-006</p>
              </Badge>
              <Badge>
                <strong>PAULO Papelaria LTDA</strong>
                <p>91.923.217/0001-29<br/>Av. Goiás Norte - Res. Recanto do Bosque<br/>Goiânia - Goiás<br/>74594-006</p>
              </Badge> */}
              {buyer.clients.map(c =>
                <Badge key={c.id}>
                  <strong>{c.company_name}</strong>
                  <p>{c.document}{!!c.main_address ? c.main_address.full_address.split('<br>').map(e => <p>{e}</p>) : ''}</p>
                </Badge>  
              )}
            </BadgeContainer>
            
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
