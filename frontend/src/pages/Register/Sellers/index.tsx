import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as EditIcon } from '~assets/edit1.svg';
import { ReactComponent as BagIcon } from '~assets/bag1.svg';
import { ReactComponent as BagXIcon } from '~assets/bagx1.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg'
import { ReactComponent as PlusIcon } from '~assets/plus.svg';
import { ReactComponent as EmailIcon } from '~assets/email.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';

import { Container, Table } from './styles';
import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { TableActionButton, TableTitle } from '~styles/components/tables';

import { api } from '~api';

import {
  capitalizeContent,
  isMailValid,
  isNotEmpty,
  isOnSafari,
  landlineIsValid,
  phoneIsValid
} from '~utils/validation';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { Input } from '@/src/components/Input';
import { SectionTitle } from '~styles/components';
import { StaticSocialBox } from '@/src/components/StaticSocialBox';
import { PhoneBox } from '@/src/components/PhoneBox';

type ISeller = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  cellphone?: string;
}

export function Sellers() {
  const { push } = useHistory();
    
  const [sellers, setSellers] = useState<ISeller[]>([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cellphone, setCellphone] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  const [addingSeller, setAddingSeller] = useState(false);
  const [deletingSeller, setDeletingSeller] = useState(-1);
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { // @ts-ignore
        data: {
          data
        }
      } = await api.get('sellers');

      setSellers(data);
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSeller = useCallback(async () => {
    try {
      setAddingSeller(true);
      const request = {
        name,
        email,
        phone,
        cellphone
      }


      if(!isNotEmpty(name)) {
        setError('O nome é obrigatório.');
        return;
      }

      if(!isNotEmpty(email)) {
        setError('O email é obrigatório.');
        return;
      }

      if(!isMailValid(email)) {
        setError('Preencha um email válido');
        return;
      }

      // @ts-ignore
      if(!phoneIsValid(cellphone)) {
        setError('Preencha um número de celular válido');
        return;
      }

      // @ts-ignore
      if(!landlineIsValid(phone)) {
        setError('Preencha um telefone fixo válido');
        return;
      }

      const {
        data: {
          data
        }
      } = await api.post('sellers', request);

      setSellers(prev => [data, ...prev]);
      setName('');
      setEmail('');
      setPhone('');
      setCellphone('');
    } catch(e) {
      // @ts-ignore
      setError(e.response.data.message)
      console.log('e', e);
    } finally {
      setAddingSeller(false);
    }
  }, [name, email, phone, cellphone]);

  const handleEditSeller = useCallback(async (seller: ISeller, updatingEmail: boolean) => {
    try {
      setDeletingSeller(seller.id);

      if(!isNotEmpty(seller.email)) {
        setError('O email é obrigatório.');
        return;
      }

      if(!isMailValid(seller.email)) {
        setError('Preencha um email válido');
        return;
      }

      // @ts-ignore
      if(!updatingEmail) delete seller.email;

      const {
        data: {
          data
        }
      } = await api.post(`/sellers/${seller.id}?_method=PUT`, seller);

      setLoading(true);
      // @ts-ignore
      const updatedSellers = sellers.map(s => s.id === seller.id ? data : s);


      setSellers(updatedSellers);
    } catch(e) {
      // @ts-ignore
      setError(e.response.data.message)
      console.log('e', e);
    } finally {
      setDeletingSeller(-1);
      setLoading(false);
    }
  }, [sellers]);

  const handleDeleteSeller = useCallback(async (id: number) => {
    try {
      setDeletingSeller(id);
      await api.delete(`/sellers/${id}`);

      setSellers(prev => prev.filter(e => e.id !== id));
      
    } catch (e) {
      console.log('e', e);
    } finally {
      setDeletingSeller(-1);
    }
  }, []);

  const handleShouldUpdate = useCallback(
    (oldValue: string, newValue: string, seller: ISeller, updatingEmail = false) =>
      String(newValue) !== String(oldValue) && handleEditSeller(seller, updatingEmail)
  , [handleEditSeller]);


  const usingSafari = useMemo(() => isOnSafari, []);

  return (
    <>
      <Header route={['Cadastro', 'Comercial']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <SectionTitle>
            Comercial
          </SectionTitle>
          {loading ?
            <LoadingContainer
              content="as comerciais"
            /> :
          <>
            <Table isOnSafari={usingSafari}>
            <colgroup>
              <col span={1} style={{ width: '17%' }} />
              <col span={1} style={{ width: '23%' }} />
              <col span={1} style={{ width: '19%' }} />
              <col span={1} style={{ width: '35%' }} />
              <col span={1} style={{ width: '6%' }} />
            </colgroup>
            <thead>
              <th>Nome</th>
              <th>Email</th>
              <th>Celular</th>
              <th>Telefone Fixo</th>
              <th>Ação</th>
            </thead>
            <tbody>
              {sellers.map(p => (
                <tr key={p.id}>
                  <td>
                    <Input
                      name="name"
                      noTitle
                      width="10.9375rem"
                      validated={false}
                      onBlur={({ target: { value: name } }) =>
                        isNotEmpty(name) &&  
                        handleShouldUpdate(p.name, name, {...p, name: capitalizeContent(name) })
                      }
                      defaultValue={capitalizeContent(p.name)}
                      noValueInput
                    />
                  </td>
                  <td style={{ padding: '0 0.625rem' }}>
                    <StaticSocialBox
                      name="email"
                      type="social"
                      noTitle
                      badge={EmailIcon}
                      validated
                      width="13rem"
                      title=""
                      defaultValue={p.email}
                      inputStyle={{ textTransform: 'lowercase' }}
                      onBlur={({ target: { value: email } }) =>
                        handleShouldUpdate(p.email, email, {...p, email }, true)
                      }
                    />
                  </td>
                  <td style={{ padding: '0 0.625rem' }}>
                    <PhoneBox
                      name="a"
                      width="10.5rem"
                      noTitle
                      validated
                      defaultValue={p.cellphone}
                      onBlur={({ target: { value: cellphone } }) =>
                        phoneIsValid(cellphone) &&
                        handleShouldUpdate(!!p.cellphone ? p.cellphone : '', cellphone, {...p, cellphone })
                      }
                    />
                  </td>
                  <td style={{ padding: '0 0.625rem' }}>
                    <PhoneBox
                      name="a"
                      width="10.5rem"
                      noTitle
                      validated
                      mask="(99) 9999-9999"
                      placeholder="(00) 0000-0000"
                      defaultValue={p.phone}
                      onBlur={({ target: { value: phone } }) =>
                        landlineIsValid(phone) &&
                        handleShouldUpdate(!!p.phone ? p.phone : '', phone, {...p, phone })
                      }
                    />
                  </td>
                  <td>
                    <div>
                      <TableActionButton
                        onClick={() => handleDeleteSeller(p.id)}
                        disabled={deletingSeller === p.id}
                        loading={deletingSeller === p.id}
                      >
                        {deletingSeller === p.id ? <LoadingIcon /> : <TrashIcon />}
                      </TableActionButton>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <Input
                    name="min_q"
                    noTitle
                    width="10.9375rem"
                    validated={false}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </td>
                <td style={{ padding: '0 0.625rem' }}>
                  <StaticSocialBox
                    name="email"
                    type="social"
                    noTitle
                    badge={EmailIcon}
                    validated
                    width="13rem"
                    title=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    inputStyle={{ textTransform: 'lowercase' }}
                  />
                </td>
                <td style={{ padding: '0 0.625rem' }}>
                  <PhoneBox
                    name="a"
                    width="10.5rem"
                    noTitle
                    validated
                    value={cellphone}
                    onChange={(e) => setCellphone(e.target.value)}
                  />
                </td>
                <td style={{ padding: '0 0.625rem' }}>
                  <PhoneBox
                    name="a"
                    width="10.5rem"
                    noTitle
                    validated
                    value={phone}
                    mask="(99) 9999-9999"
                    placeholder="(00) 0000-0000"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </td>
                <td>
                  <div>
                    <TableActionButton
                      disabled={addingSeller}
                      onClick={() => handleAddSeller()}
                      loading={addingSeller}
                    >
                      {addingSeller ? <LoadingIcon /> : <PlusIcon />}
                    </TableActionButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
          </>
          }
        </Container>
      </MenuAndTableContainer>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
