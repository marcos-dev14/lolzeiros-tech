import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Button, Container, GoBackButton, DeleteItemsContainer, BadgeContainer, Badge, DeleteClient } from './styles';

import { ReactComponent as EmailIcon } from '~assets/email.svg';
import { ReactComponent as PlusIcon } from '~assets/plus.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg'
import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';
import { ReactComponent as CloseIcon } from '~assets/close_white.svg';

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
import { ErrorModal } from '@/src/components/ErrorModal';
import { capitalizeContent, isMailValid, isNotEmpty } from '@/src/utils/validation';
import { SuccessModal } from '@/src/components/SuccessModal';
import { useRegister } from '@/src/context/register';

export function NewClientGroup() {
  const formRef = useRef<FormHandles>(null);
  const { goBack } = useHistory();
  const { clientGroup, setClientGroup } = useRegister();
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [clientsOptions, setClientsOptions] = useState([]);
  
  const [buyerOptions, setBuyerOptions] = useState<DefaultValuePropsWithId[]>([]);
  
  const [isBuyerDisabled, setIsBuyerDisabled] = useState(false);
  const [isClientDisabled, setIsClientDisabled] = useState(false);
  const [isDeletingClient, setIsDeletingClient] = useState(false);
  const [updatingName, setUpdatingName] = useState(false);
  
  const handleFetchClients = useCallback(async (value: string) => {    
    try { 
      setIsClientDisabled(true)
      const {
        data: {
          data
        }
      } = await api.get(`/clients?has_group=false&reference=${value}`);

      // @ts-ignore
      setClientsOptions(data.map(c => ({ id: c.id, value: c.company_name, label: `${c.company_name} - ${c.document}` })))
    } catch(e) {
      console.log('e', e)
    } finally {
      setIsClientDisabled(false)
    }
  }, []);

  const handleFetchBuyers = useCallback(async (value: string) => {    
    try {
      setIsBuyerDisabled(true)
      const {
        data: {
          data
        }
      } = await api.get(`buyers?has_group=false&name=${value}`);
      
      // @ts-ignore
      setBuyerOptions(data.map(b => ({ id: b.id, value: b.name, label: `${b.name} - ${b.email}` })))
    } catch(e) {
      console.log('e', e)
    } finally {
      setIsBuyerDisabled(false)
    }
  }, []);

  const handleAddClientGroup = useCallback(async () => {    
    try {
      const formData = formRef?.current?.getData()
      // @ts-ignore
      const request = { name: formData.name }
      
      const {
        data: {
          data
        }
      } = await api.post(`/clients/groups`, request);
      
      console.log('d', data)
      setClientGroup(data)
      // @ts-ignore
    } catch(e) {
      console.log('e', e)
    }
  }, [setClientGroup]);

  const handleAddClient = useCallback(async (id: string) => {    
    try {
      setIsClientDisabled(true)

      console.log("id", id);
      const request = {
        client_group_id: clientGroup.id
      }
      
      const {
        data: {
          data
        }
      } = await api.put(`/clients/${id}`, request);
      
      setClientGroup({...clientGroup, clients: [...clientGroup.clients, data]})
      // @ts-ignore
      setClientsOptions([])
      // @ts-ignore
    } catch(e) {
      console.log('e', e)
    } finally {
      setIsClientDisabled(false)
    }
  }, [clientGroup, setClientGroup]);

  const handleDeleteClient = useCallback(async (id: number) => {    
    try {
      setIsDeletingClient(true)
      const request = {
        client_group_id: null
      }
      
      await api.put(`/clients/${id}`, request);
      const formattedClients = 
        clientGroup.clients.filter(s => s.id !== id)
      
      setClientGroup({...clientGroup, clients: formattedClients })
      // @ts-ignore
    } catch(e) {
      console.log('e', e)
    } finally {
      setIsDeletingClient(false)
    }
  }, [clientGroup, setClientGroup]);

  const handleUpdateName = useCallback(async (name: string) => {    
    try {
      setUpdatingName(true)
      const request = {
        name
      }
    
      await api.post(`/clients/groups/${clientGroup.id}?_method=PUT`, request);
    
      // @ts-ignore
      setClientGroup({...clientGroup, name})

      formRef?.current?.setFieldValue('name', name)
      // console.log('d', data)
      // @ts-ignore
    } catch(e) {
      console.log('e', e)
    } finally {
      setUpdatingName(false)
    }
  }, [clientGroup, setClientGroup]);

  const handleAddBuyer = useCallback(async (buyerId: string, buyerName: string) => {    
    try {
      if (!!clientGroup) {
        const request = {
          name: clientGroup.name,
          buyer_id: buyerId
        }
      
        const {
          data: { data }
        } = await api.post(`/clients/groups/${clientGroup.id}?_method=PUT`, request);
      
        // @ts-ignore
        setClientGroup({...clientGroup, buyer: data.buyer})
      }

      formRef?.current?.setFieldValue('buyer', buyerName)
      // console.log('d', data)
      // @ts-ignore
    } catch(e) {
      console.log('e', e)
    }
  }, [clientGroup, setClientGroup]);

  const handleClearBuyer = useCallback(async () => {
    try {
      setIsBuyerDisabled(true)
      
      if(!!clientGroup) {
        const request = {
          name: clientGroup.name,
          buyer_id: null
        }
        
        await api.put(`/clients/groups/${clientGroup.id}`, request);
        // @ts-ignore
        setClientGroup({...clientGroup, buyer: []})
      }
      formRef?.current?.clearField('buyer')
      formRef?.current?.setFieldValue('buyer', '')

      setBuyerOptions([]);
    } catch (e) {
      console.log('e', e);
    } finally {
      setIsBuyerDisabled(false)
    }
  }, [clientGroup, setClientGroup])

  const formattedClientGroup = useMemo(() => {
    if(!clientGroup || !clientGroup.buyer) {
      return {
        buyer: ''
      }
    }
 
    return {
      ...clientGroup,
      buyer: !!Object.values(clientGroup.buyer).length ? clientGroup.buyer.name : '',
    };
  }, [clientGroup])

  console.log('clientGroup', clientGroup)

  return (
    <>
      <Header route={['Cadastro', 'Cliente', 'Grupo']} />
      <MenuAndTableContainer>
        <Menu />
        <Form
          ref={formRef}
          initialData={formattedClientGroup}
          onSubmit={() => {}}
        >
          <Container>
            <SectionTitle>
              Grupo de Cliente
            </SectionTitle>
            <InputContainer>
              <FormInput
                name="name"
                title="Nome"
                width="16.25rem"
                disabled={updatingName}
                validated={false}
                onBlur={e => !!clientGroup && handleUpdateName(e.target.value)}
              />
              {!!buyerOptions.length ?
                <FormSelect
                  name="buyer"
                  title="Comprador"
                  // @ts-ignore
                  // onChange={(value, id) => }
                  onChange={(value, id) =>
                    !value ? handleClearBuyer() : handleAddBuyer(id, value)
                  }
                  customWidth="16rem"
                  // @ts-ignore
                  data={buyerOptions}
                  isClearable
                  disabled={isBuyerDisabled}
                /> :
                <FormInput
                  name="buyer"
                  title="Comprador"
                  width="16rem"
                  defaultValue=""
                  disabled={!clientGroup || isBuyerDisabled}
                  // value={embedValue}
                  // onChange={(e) => setEmbedValue(e.target.value)}
                  onBlur={(e) =>
                    !e.target.value ? handleClearBuyer() :
                    !!clientGroup && handleFetchBuyers(e.target.value)
                  }
                  validated
                />
              }
              {isClientDisabled ? 
                <FormSelect
                  name="embed_title"
                  title="Adicionar clientes"
                  // @ts-ignore
                  onChange={() => {}}
                  placeholder="Razão Social"
                  customWidth="27.4375rem"
                  customDefaultValue={{
                    value: '', label: ''
                  }}
                  disabled
                />
              : !!clientsOptions.length ?
                <FormSelect
                  name="embed_title"
                  title="Adicionar clientes"
                  // @ts-ignore
                  onChange={(value, id) =>
                    !value ?
                      setClientsOptions([]) :
                      handleAddClient(id)
                  }
                  placeholder="Razão Social"
                  customWidth="27.4375rem"
                  customDefaultValue={{
                    value: '', label: ''
                  }}
                  // @ts-ignore
                  isClearable
                  data={clientsOptions}
                  disabled={isClientDisabled}
                /> :
                <FormInput
                  name="embed_title"
                  title="Adicionar clientes"
                  width="27.4375rem"
                  disabled={!clientGroup || isClientDisabled}
                  // value={embedValue}
                  // onChange={(e) => setEmbedValue(e.target.value)}
                  onBlur={(e) => !!clientGroup && handleFetchClients(e.target.value)}
                  validated
                />
              }
              <GoBackButton
                onClick={goBack}
                type="button"
                className="goBack"
              >
                <GoBackIcon />
                <p>Voltar</p>
              </GoBackButton>
            </InputContainer>
            {!clientGroup && 
              <InputContainer>
                <Button
                  onClick={handleAddClientGroup}
                  style={{ marginLeft: 0, width: '10rem' }}
                  type="button"
                >
                  Salvar
                </Button>
              </InputContainer>
            }
            <BadgeContainer>
              {/* <Badge>
                <strong>PAULO BRINQUEDOS LTDA</strong>
                <p>91.923.217/0001-29<br/>Av. Goiás Norte - Res. Recanto do Bosque<br/>Goiânia - Goiás<br/>74594-006</p>
              </Badge>
              <Badge>
                <strong>PAULO Papelaria LTDA</strong>
                <p>91.923.217/0001-29<br/>Av. Goiás Norte - Res. Recanto do Bosque<br/>Goiânia - Goiás<br/>74594-006</p>
              </Badge> */}
              {!!clientGroup && !!clientGroup.clients && !!clientGroup.clients.length && 
                clientGroup.clients.map(c =>
                  <Badge key={c.id} isDeletingClient={isDeletingClient}>
                    <strong>{c.company_name}</strong>
                    <b>{c.document}{!!c.main_address ? c.main_address.full_address.split('<br>').map(e => <p>{e}</p>) : ''}</b>
                    <DeleteClient
                      disabled={isDeletingClient}
                      onClick={() => handleDeleteClient(c.id)}
                    >
                      <CloseIcon />
                    </DeleteClient>
                  </Badge>
              )}
            </BadgeContainer>
          </Container>
        </Form>
      </MenuAndTableContainer>
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
