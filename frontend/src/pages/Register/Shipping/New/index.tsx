import { useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from '@unform/web';

import { ReactComponent as EmailIcon } from '~assets/email.svg';
import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';

import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { FormInput } from '~components/FormInput';
import { FormSelect } from '~components/FormSelect';

import {
  Button,
  Container,
  CustomSectionTitle,
  GoBackButton,
} from './styles';
import { api } from '@/src/services/api';
import { useRegister } from '@/src/context/register';
import { FormPhoneBox } from '@/src/components/FormPhoneBox';
import { IShipping } from '@/src/types/main';
import { StaticSocialBox } from '@/src/components/StaticSocialBox';
import { FormInputCustomMask } from '@/src/components/FormInputCustomMask';
import { capitalizeContent, isEmpty, isMailValid, landlineIsValid, phoneIsValid } from '@/src/utils/validation';
import { ErrorModal } from '@/src/components/ErrorModal';
import { SuccessModal } from '@/src/components/SuccessModal';
import { useHistory } from 'react-router';

export function NewShipping() {
  const { shippingCompany, setShippingCompany } = useRegister();
  const { goBack } = useHistory();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [states, setStates] = useState([]);
  const [stateId, setStateId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');

  // @ts-ignore
  const [formRef, setFormRef] = useState(null);
  const updateFormRef = useCallback(node => !!node && !formRef && setFormRef(node), [formRef]);

  const formattedData = useMemo<IShipping>(() => {      
    if(!shippingCompany) return {} as unknown as IShipping;

    setEmail(!!shippingCompany.email ? shippingCompany.email : '');
    setState(
      !!shippingCompany.country_state ? shippingCompany.country_state.name : ''
    );
    setStateId(
      !!shippingCompany.country_state ? String(shippingCompany.country_state.id) : ''
    );

    const formattedShippingCompanyData = {
      ...shippingCompany
    }

    setLoading(false);
    return formattedShippingCompanyData;
  }, [shippingCompany]);

  const handleRegisterShipping = useCallback(async () => {
    try {
      setSaving(true);
  
      // @ts-ignore
      const data = formRef.getData();
      
      if(isEmpty(data.company_name)) {
        setError('Preencha o nome da transportadora.');
        return;
      }

      if(!isMailValid(email)) {
        setError('Preencha um email válido.');
        return;
      }

      if(!phoneIsValid(data.cellphone)) {
        setError('Preencha um número de celular válido');
        return;
      }

      // @ts-ignore
      if(!phoneIsValid(data.whatsapp)) {
        setError('Preencha um número de WhatsApp válido');
        return;
      }

      // @ts-ignore
      if(!landlineIsValid(data.phone)) {
        setError('Preencha um telefone fixo válido');
        return;
      }

      const request = {...data, email, country_state_id: Number(stateId) };
      // @ts-ignore
      delete request.state;
     
      if (!!shippingCompany) {
        await api.put(`/shipping_companies/${shippingCompany.id}`, request);
      } else await api.post('/shipping_companies', request);
      // const { data } = 
      // setShippingCompany({...request, id: data.id})
      setMessage('Salvo com sucesso');
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar o cliente.';

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  }, [formRef, email, stateId, shippingCompany]);

  const fetchData = useCallback(async () => {
    try {
      const {
        data: {
          data
        }
      } = await api.get('/country_states');

      // @ts-ignore
      setStates(data.map(s => ({ id: s.id, value: s.name, label: s.name })))
    } catch (e) {
      console.log('e', e);
    } 
  }, []);

  const handleUpdate = useCallback((field: string, value: string) => {    
    const updatedValue = capitalizeContent(value);
    // @ts-ignore
    formRef.setFieldValue(field, updatedValue)
  }, [formRef]);

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>
      <Header route={['Cadastro', 'Transportadora', 'Editar Transportadora']} />
      <MenuAndTableContainer>
        <Menu  />
        <Form
          ref={updateFormRef}
          onSubmit={() => {}}
          initialData={formattedData}
        >
        <Container>
          <CustomSectionTitle style={{ marginTop: 0 }}>
            Transportadora
          </CustomSectionTitle>
          <GoBackButton
            onClick={goBack} 
          >
            <GoBackIcon />
            <p>Voltar</p>
          </GoBackButton>
          <InputContainer>
            <FormInput
              name="company_name"
              title="Nome da Transportadora"
              width="16.25rem"
              validated={false}
              onBlur={e => handleUpdate('company_name', e.target.value)}
            />
            <FormInput
              name="name"
              title="Nome do Contato"
              width="16.25rem"
              validated={false}
              onBlur={e => handleUpdate('name', e.target.value)}
            />
            <FormPhoneBox
              name="phone"
              title="Telefone Fixo"
              mask="(99) 9999-9999"
              placeholder="(00) 0000-0000"
              width="8.8125rem"
            />
            <FormPhoneBox
              name="cellphone"
              title="Celular"
              width="8.8125rem"
            />
            <FormPhoneBox
              name="whatsapp"
              title="Whatsapp"
              width="8.8125rem"
            />
          </InputContainer>
          <InputContainer>
            <FormInputCustomMask
              name="document"
              title="CNPJ"
              width="16.25rem"
              mask="99.999.999/9999-99"
            />
            <StaticSocialBox
              name="email"
              type="social"
              badge={EmailIcon}
              validated
              width="14.25rem"
              title="Email Corporativo"
              value={email.toLowerCase()}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => setEmail(e.target.value.toLowerCase())}
              inputStyle={{ textTransform: 'lowercase' }}
            />
            <FormSelect
              name="state"
              title="Estado"
              customWidth="10.875rem"
              data={states}
              onChange={(v: string, id: string) => setStateId(id)}
              customDefaultValue={{
                value: state,
                label: state,
              }}
            />
            <Button
              onClick={handleRegisterShipping}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </InputContainer>
          </Container>
        </Form>
      </MenuAndTableContainer>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
      <SuccessModal
        message={message}
        setIsModalOpen={() => setMessage('')}
      />
    </>
  );
}
