import React, { useCallback, useEffect, useState } from 'react';
import { CustomSectionTitle } from '../../styles';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { ReactComponent as PlusIcon } from '~assets/plus_white.svg'
import { ReactComponent as TrashIcon } from '~assets/trash.svg'

import { Header, Content, DeleteItemsContainer } from './styles';

import { InputContainer } from '~styles/components';
import { MeasureBox } from '@/src/components/MeasureBox';
import { TableActionButton } from '@/src/styles/components/tables';
import { NoTitleSelect } from '@/src/components/NoTitleSelect';
import { useRegister } from '~context/register';
import { api } from '~api';
import { DefaultValuePropsWithId, IBaseType, IFractionation, IFractionationProps } from '~types/main';
import { Modal } from '@/src/components/Modal';
import { Input } from '@/src/components/Input';
import { ErrorModal } from '@/src/components/ErrorModal';

type Props = {
  data: IFractionation[];
}

export function FractionalBox({ data = [] }: Props) {
  const { supplier, updateSupplier } = useRegister();
  const [currentData, setCurrentData] = useState(data);
  const [profileOptions, setProfileOptions] = useState([]);
  const [profileOptionsById, setProfileOptionsById] = useState({});
  const [cleaning, setCleaning] = useState(false);

  const [error, setError] = useState('');
  
  const [client, setClient] = useState('');
  const [fractionalBox, setFractionalBox] = useState('Sim');
  
  const [clientProfile, setClientProfile] = useState('');
  const [isClientProfileModalOpen, setIsClientProfileModalOpen] = useState<'normal' | 'new' | ''>('');

  const [addingFractionalBox, setAddingFractionalBox] = useState(false);
  const [deletingFractionalBox, setDeletingFractionalBox] = useState(1);

  const handleAddFractionalBox = useCallback(async () => {
    try {
      setAddingFractionalBox(true);
      const { id } = supplier;

      // @ts-ignore
      const { id: client_profile_id } = profileOptions.find(p => p.value === client) 
      const fractionalBoxData = {
        client_profile_id,
        enable: fractionalBox === 'Sim'
      }

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/profile_fractionations`, fractionalBoxData);
      setCleaning(true);
      setProfileOptions(prev => prev.filter((s: DefaultValuePropsWithId) => s.value !== client));

      const profile_fractionations = [...currentData, data];

      setCurrentData(profile_fractionations);
      updateSupplier({ profile_fractionations });
    } catch (e) {
      console.log('e', e);
    } finally {
      setCleaning(false);
      setAddingFractionalBox(false);
    }
  }, [supplier, client, updateSupplier, currentData, profileOptions, fractionalBox]);

  const handleEditFractionalBox = useCallback(async (order: IFractionationProps) => {
    try {
      const { id } = supplier;

      const requestBody = {
        client_profile_id: order.client_profile_id,
        enable: order.enable
      }

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/profile_fractionations/${order.id}?_method=PUT`, requestBody);

      const profile_fractionations = currentData.map(p => p.id === order.id ? data : p);

      setCurrentData(profile_fractionations);
      updateSupplier({ profile_fractionations });
    } catch (e) {
      console.log('e', e);
    }
  }, [supplier, updateSupplier, currentData]);

  const handleDeleteFractionalBox = useCallback(async (fractionalBoxId: number, profile: IBaseType) => {
    try {
      setDeletingFractionalBox(fractionalBoxId);
      
      const { id } = supplier;

      await api.delete(`/products/suppliers/${id}/profile_fractionations/${fractionalBoxId}`);
      setCleaning(true);

      setProfileOptions( // @ts-ignore
        prev => [...prev, { id: profile.id, value: profile.name, label: profile.name }]
      )
      const profile_fractionations = currentData.filter(p => p.id !== fractionalBoxId);

      setCurrentData(profile_fractionations);
      updateSupplier({ profile_fractionations });
    } catch (e) {
      console.log('e', e);
    } finally {
      setCleaning(false);

      setDeletingFractionalBox(-1);
    }
  }, [supplier, currentData, updateSupplier]);

  const fetchProfiles = useCallback(async () => {
    try {
      if(!!profileOptions.length) return;

      const {
        data: { data: profilesData }
      } = await api.get('/clients/profiles');

      let profileSet = {};
      
      const currentProfileOptions = currentData.map(c => c.profile.id);
      const filteredProfileOptions =
        profilesData
          .map((s: IBaseType) => ({ id: s.id, value: s.name, label: s.name}))
          .filter((s: IBaseType) => !currentProfileOptions.includes(s.id));

      // @ts-ignore
      setProfileOptions([{ id: '-1', value: 'new', label: 'Novo' }, ...filteredProfileOptions]);
      
      // @ts-ignore
      profilesData.forEach((s) => profileSet[s.name] = s.id);
      
      // @ts-ignore
      setProfileOptionsById(profileSet)
    } catch (e) {
      console.log('e', e);
    }
  }, [currentData, profileOptions]);

  const handleAddClientProfile = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.post('/clients/profiles', { name: clientProfile });

      const newBankOption = {
        id: data.id,
        value: data.name,
        label: data.name,
      }

      // @ts-ignore
      setProfileOptions(prev => [...prev, newBankOption])

      setClientProfile('Carregando');
      setClientProfile(data.name);

      setIsClientProfileModalOpen('');
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar a representada.';

      setError(errorMessage);
    }
  }, [clientProfile, isClientProfileModalOpen]);

  const handleDeleteClientProfile = useCallback(async (id: number, value: string) => {
    try {
      await api.delete(`/clients/profiles/${id}`);

      // @ts-ignore
      setProfileOptions(prev => prev.filter(e => e.value !== value));

      setClientProfile('Carregando');
      setClientProfile('');
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar a representada.';

      setError(errorMessage);
    }
  }, [])

  const handleShouldUpdate = useCallback(
    (oldValue: string, newValue: string, order: IFractionationProps) =>
      String(newValue) !== String(oldValue) && handleEditFractionalBox(order)
  , [handleEditFractionalBox]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <>
      <CustomSectionTitle>
        Configuração de Fracionamento por Perfil
      </CustomSectionTitle>
      <Header>
        <div>
          <strong>Perfil do Cliente</strong>
        </div>
        <div>
          <strong>Fraciona Caixa</strong>
        </div>
        <div>
          <strong>Ação</strong>
        </div>
      </Header>
      {currentData.map((c) =>
        <Content key={c.id}>
          <div>
            {!cleaning ? 
              <NoTitleSelect
                placeholder="Selecione..."
                customWidth="13.5rem"
                setValue={() => {}}
                // @ts-ignore
                // setValue={(value) => // @ts-ignore
                //   value !== c.profile.name && // @ts-ignore
                //   handleEditFractionalBox({...c, client_profile_id: profileOptionsById[value]})
                // }
                disabled
                data={profileOptions}
                defaultValue={{
                  value: c.profile.name,
                  label: c.profile.name,
                }}
              /> : 
              <></>
              }
          </div>
          <div>
          <div>
            <NoTitleSelect
              placeholder="Selecione..."
              customWidth="6.375rem"
              setValue={() => {}}
              disabled
              // @ts-ignore
              // setValue={(value) => 
              //   Number(value === 'Sim') !== c.enable && // @ts-ignore
              //   handleEditFractionalBox({...c, client_profile_id: c.profile.id, enable: value === "Sim"})
              // }
              defaultValue={{
                value: !!c.enable ? "Sim" : "Não",
                label: !!c.enable ? "Sim" : "Não",
              }}
              data={[
                { value: 'Sim', label: 'Sim' },
                { value: 'Não', label: 'Não' }
              ]}
            />
          </div>
        </div>
          <div>
            <TableActionButton
              disabled={deletingFractionalBox === c.id}
              onClick={() => handleDeleteFractionalBox(c.id, c.profile)}
            >
              <TrashIcon />
            </TableActionButton>
          </div>
        </Content>
        )}
      <Content style={{ backgroundColor: '#f2f2f2' }}>
        <div>
          {!cleaning && clientProfile !== 'Carregando' ? 
            <NoTitleSelect
              placeholder="Selecione..."
              customWidth="13.5rem"
              // @ts-ignore
              setValue={() => {}}
              onChange={(value: string) => {
                value === 'new' ?
                  setIsClientProfileModalOpen('new') :
                  setClient(value)
              }}
              data={profileOptions}
              disabled={!supplier.id}
              defaultValue={{
                value: clientProfile,
                label: clientProfile
              }}
            /> :
            <></>
          }
        </div> 
        <div>
        {!cleaning ?
          <NoTitleSelect
            placeholder="Selecione..."
            customWidth="6.375rem"
            // @ts-ignore
            setValue={(value) => setFractionalBox(value)}
            defaultValue={{ value: 'Sim', label: 'Sim' }}
            data={[
              { value: 'Sim', label: 'Sim' },
              { value: 'Não', label: 'Não' }
            ]}
            disabled={!supplier.id}
          /> :
          <></>
        }
        </div>
        <div>
          <TableActionButton
            disabled={!supplier.id || addingFractionalBox || !client}
            onClick={handleAddFractionalBox}
          >
            {addingFractionalBox ? <LoadingIcon /> : <PlusIcon />}
          </TableActionButton>
        </div>
      </Content>
      <Modal
        title="Editar Perfis de Clientes"
        isModalOpen={!!isClientProfileModalOpen}
        customOnClose={() => setIsClientProfileModalOpen('')}
        style={{ width: 471 }}
      >
        <InputContainer style={{ alignItems: 'flex-end' }}>
          <Input
            name="Novo Banco"
            fullW
            value={clientProfile}
            onChange={(e) => setClientProfile(e.target.value)}
          />
          <TableActionButton
            onClick={handleAddClientProfile}
            style={{
              marginLeft: '1rem'
            }}
          >
            <PlusIcon />
          </TableActionButton>
        </InputContainer>
        <DeleteItemsContainer>
          {profileOptions.map((t: DefaultValuePropsWithId) => 
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
                onClick={() => handleDeleteClientProfile(t.id, t.value)}
                style={{ marginLeft: '1rem' }}
              >
                <TrashIcon />
              </TableActionButton>
            </div>  
          )}
        </DeleteItemsContainer>
        <ErrorModal
          error={error}
          setIsModalOpen={() => setError('')}
        />
      </Modal>
    </>
  );
}
