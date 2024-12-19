import React, { useCallback, useEffect, useState } from 'react';
import { InputContainer } from '~styles/components';
import { TableActionButton } from '~styles/components/tables';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { ReactComponent as TrashIcon } from '~assets/trash.svg'
import { ReactComponent as PlusIcon } from '~assets/plus.svg';
import { ReactComponent as EmailIcon } from '~assets/email.svg';

import { Input } from '~components/Input';
import { CustomSelect as Select } from '~components/Select';
import { NoTitleSelect } from '@/src/components/NoTitleSelect';
import { PhoneBox } from '@/src/components/PhoneBox';

import {
  CustomSectionTitle,
  Header as TableHeader,
  Content as TableContent,
  TableContentWrapper,
  Button,
  DeleteItemsContainer
} from './styles';
import { useRegister } from '@/src/context/register';
import { api } from '@/src/services/api';
import { DefaultValuePropsWithId, IBaseType, IContact } from '@/src/types/main';
import { ConfirmationModal } from '@/src/components/ConfirmationModal';
import { Modal } from '@/src/components/Modal';
import { StaticSocialBox } from '@/src/components/StaticSocialBox';
import { capitalizeContent, isMailValid, landlineIsValid, phoneIsValid } from '@/src/utils/validation';
import { ErrorModal } from '@/src/components/ErrorModal';

type Props = {
  contacts: IContact[];
}

export function Contacts({ contacts }: Props) {
  const { supplier, updateSupplier } = useRegister();
  
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [branch, setBranch] = useState('');
  const [cleaning, setCleaning] = useState(false);
  
  const [error, setError] = useState('');

  const [roleName, setRoleName] = useState('');
  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState<'normal' | 'new' | ''>('');

  const [rolesOptions, setRolesOptions] = useState<DefaultValuePropsWithId[]>([]);

  const [addingContact, setAddingContact] = useState(false);
  const [deletingContact, setDeletingContact] = useState(-1);

  const [currentData, setCurrentData] = useState<IContact[]>(contacts);

  const handleAddContact = useCallback(async () => {
    try {
      setAddingContact(true);
      const { id } = supplier;

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
      if(!phoneIsValid(whatsapp)) {
        setError('Preencha um número de WhatsApp válido');
        return;
      }

      // @ts-ignore
      if(!landlineIsValid(phone)) {
        setError('Preencha um telefone fixo válido');
        return;
      }

      const contactData = {
        name: capitalizeContent(name),
        role_id: role,
        cellphone,
        email: email.toLowerCase(),
        whatsapp,
        phone,
        phone_branch: branch
      }

      const {
        data: {
          data
        }
      } = await api.post(`/products/suppliers/${id}/contacts`, contactData);

      setCleaning(true);
      setName('');
      setRole('');
      setCellphone('');
      setEmail('');
      setWhatsapp('');
      setPhone('');
      setBranch('');
      
      const contacts = [...currentData, data];

      setCurrentData(contacts);
      updateSupplier({ contacts });
    } catch (e) {
      console.log('e', e);
    } finally {
      setAddingContact(false);
      setCleaning(false);
    }
  }, [
      supplier,
      updateSupplier,
      currentData,
      name,
      role,
      cellphone,
      email,
      whatsapp,
      phone,
      branch,
    ]);

  const handleEditContact = useCallback(async (order) => {
    try {
      const { id } = supplier;

      if(!isMailValid(order.email)) {
        setError('Preencha um email válido');
        return;
      }

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/contacts/${order.id}?_method=PUT`, order);

      // @ts-ignore
      const contacts = currentData.map(p => p.id === order.id ? data : p);

      setCurrentData(contacts);
      updateSupplier({ contacts });
    } catch (e) {
      console.log('e', e);
    }
  }, [supplier, updateSupplier, currentData]);

  const handleDeleteContact = useCallback(async () => {
    try {      
      const { id } = supplier;

      await api.delete(`/products/suppliers/${id}/contacts/${deletingContact}`);

      // @ts-ignore
      const contacts = currentData.filter(p => p.id !== deletingContact);

      setCurrentData(contacts);
      updateSupplier({ contacts });
      // find and update locally
    } catch (e) {
      console.log('e', e);
    } finally {
      setDeletingContact(-1);
    }
  }, [supplier, updateSupplier, currentData, deletingContact]);

  const fetchRoles = useCallback(async () => {
    try {
      const {
        data: {
          data
        }
      } = await api.get('/roles');

      setRolesOptions([
        { value: 'new', label: 'Editar Cargo' },
        ...data.map((r: IBaseType) => ({
          id: r.id,
          value: capitalizeContent(r.name),
          label: capitalizeContent(r.name) }))
      ])
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleShouldUpdate = useCallback(
    (oldValue: string, newValue: string, order: IContact) =>
      String(newValue) !== String(oldValue) && handleEditContact(order)
  , [handleEditContact]);

  const handleAddNewRole = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.post('/roles', { name: capitalizeContent(roleName) });

      const newRole = {
        id: data.id,
        value: capitalizeContent(data.name),
        label: capitalizeContent(data.name),
      }

      // @ts-ignore
      setRolesOptions(prev => [...prev, newRole])

      setRoleName(isNewRoleModalOpen === 'new' ? 'CarregandoNew' : 'Carregando');
      setRoleName(capitalizeContent(data.name));

      setIsNewRoleModalOpen('');
    } catch (e) {
      console.log('e', e);
    }
  }, [roleName, isNewRoleModalOpen]);

  const handleDeleteRole = useCallback(async (id: number, value: string) => {
    try {
      await api.delete(`/roles/${id}`);

      // @ts-ignore
      setRolesOptions(prev => prev.filter(e => e.value !== value));
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  return (
    <>
      <CustomSectionTitle>
        Contatos
      </CustomSectionTitle>
      <TableHeader>
        <div>
          <strong>Contato</strong>
        </div>
        <div>
          <strong>Cargo</strong>
        </div>
        <div>
          <strong>Email</strong>
        </div>
        <div>
          <strong>Celular</strong>
        </div>
        <div>
          <strong>Whatsapp</strong>
        </div>
        <div>
          <strong>Telefone Fixo</strong>
        </div>
        <div>
          <strong>Ramal</strong>
        </div>
        <div>
          <strong>Ação</strong>
        </div>
      </TableHeader>
      {currentData.map((c) =>
        <TableContentWrapper
          key={c.id}
        >
          <TableContent>
            <div>
              <Input
                name="name"
                noTitle
                width="10.9375rem"
                validated={false}
                onBlur={({ target: { value: name } }) =>
                  handleShouldUpdate(c.name, name, {...c, name: capitalizeContent(name) })
                }
                defaultValue={capitalizeContent(c.name)}
                noValueInput
              />
            </div>
            <div>
               {roleName !== 'Carregando' ?
                <NoTitleSelect
                  placeholder="Selecione..."
                  customWidth="11.1875rem"
                  data={rolesOptions}
                  setValue={() => {}}
                  onChange={(value: string, id: string) => 
                    value === 'new' ?
                      setIsNewRoleModalOpen('normal') :
                      handleEditContact({...c, role_id: id})
                  }
                  defaultValue={{ 
                    value: !!roleName ? // @ts-ignore
                      roleName : !!c.role ? capitalizeContent(c.role.name) : '',
                    label: !!roleName ? // @ts-ignore
                      roleName : !!c.role ? capitalizeContent(c.role.name) : '',
                  }}
                /> :
                <></>
              }
            </div>
            <div>
              <StaticSocialBox
                name="email"
                type="social"
                noTitle
                badge={EmailIcon}
                validated
                width="10.25rem"
                title=""
                inputStyle={{ textTransform: 'lowercase' }}
                defaultValue={c.email.toLowerCase()}
                onBlur={({ target: { value: email } }) =>
                  isMailValid(email) &&
                  handleShouldUpdate(c.email.toLowerCase(), email.toLowerCase(), {...c, email: email.toLowerCase() })
                }
              />
            </div>
            <div>
              <PhoneBox
                name="a"
                width="8rem"
                noTitle
                validated
                defaultValue={c.cellphone}
                onBlur={({ target: { value: cellphone } }) =>
                  phoneIsValid(cellphone) &&
                  handleShouldUpdate(c.cellphone, cellphone, {...c, cellphone })
                }
              />
            </div>
            <div>
              <PhoneBox
                name="a"
                width="8.125rem"
                noTitle
                validated
                defaultValue={c.whatsapp}
                onBlur={({ target: { value: whatsapp } }) =>
                  phoneIsValid(whatsapp) &&
                  handleShouldUpdate(c.whatsapp, whatsapp, {...c, whatsapp })
                }
              />
            </div>
            <div>
              <PhoneBox
                name="a"
                width="8.125rem"
                noTitle
                validated
                mask="(99) 9999-9999"
                placeholder="(00) 0000-0000"
                defaultValue={c.phone}
                onBlur={({ target: { value: phone } }) =>
                  landlineIsValid(phone) &&
                  handleShouldUpdate(c.phone, phone, {...c, phone })
                }
              />
            </div>
            <div>
              <Input
                name="min_q"
                noTitle
                width="4.5rem"
                validated={false}
                defaultValue={c.phone_branch}
                noValueInput
                onBlur={({ target: { value: phone_branch } }) =>
                  handleShouldUpdate(c.phone_branch, phone_branch, {...c, phone_branch })
                }
              />
            </div>
            <div>
              <TableActionButton
                disabled={deletingContact === c.id}
                onClick={() => setDeletingContact(c.id)}
              >
                <TrashIcon />
              </TableActionButton>
            </div>
          </TableContent>
        </TableContentWrapper>
      )}
      <TableContentWrapper>
        <TableContent>
          <div>
            <Input
              name="min_q"
              noTitle
              width="10.9375rem"
              validated={false}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={(e) => setName(capitalizeContent(e.target.value))}
            />
          </div>
          <div>
            {!cleaning && roleName !== 'CarregandoNew' ?
              <NoTitleSelect
                placeholder="Selecione..."
                customWidth="11.1875rem"
                data={rolesOptions}
                setValue={() => {}}
                onChange={(value: string, id: string) => 
                  value === 'new' ? setIsNewRoleModalOpen('new') : setRole(id)
                }
                defaultValue={{
                  value: roleName,
                  label: roleName
                }}
              /> :
              <></>
            }
          </div>
          <div>
            <StaticSocialBox
              name="email"
              type="social"
              noTitle
              badge={EmailIcon}
              validated
              width="10.25rem"
              title=""
              value={email.toLowerCase()}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => setEmail(e.target.value.toLowerCase())}
              inputStyle={{ textTransform: 'lowercase' }}
            />
          </div>
          <div>
            <PhoneBox
              name="a"
              width="8rem"
              noTitle
              validated
              value={cellphone}
              onChange={(e) => setCellphone(e.target.value)}
            />
          </div>
          <div>
            <PhoneBox
              name="a"
              width="8.125rem"
              noTitle
              validated
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
          <div>
            <PhoneBox
              name="a"
              width="8.125rem"
              noTitle
              validated
              mask="(99) 9999-9999"
              placeholder="(00) 0000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <Input
              name="min_q"
              noTitle
              width="4.5rem"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>
          <div>
            <TableActionButton
              disabled={addingContact}
              onClick={handleAddContact}
            >
              {addingContact ? <LoadingIcon /> : <PlusIcon />}
            </TableActionButton>
          </div>
        </TableContent>
      </TableContentWrapper>
      <Modal
        title="Editar Cargos"
        isModalOpen={!!isNewRoleModalOpen}
        customOnClose={() => setIsNewRoleModalOpen('')}
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
      <ConfirmationModal
        category={deletingContact !== -1 ? 'Contato' : ''}
        action={handleDeleteContact}
        style={{ marginTop: 0 }}
        setIsModalOpen={() => 
          setDeletingContact(-1)
        }
      />
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
