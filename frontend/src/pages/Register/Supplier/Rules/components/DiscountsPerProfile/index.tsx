import React, { useCallback, useEffect, useState } from 'react';
import { CustomSectionTitle } from '../../styles';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { ReactComponent as PlusIcon } from '~assets/plus_white.svg'
import { ReactComponent as TrashIcon } from '~assets/trash.svg'

import { Header, Content, DeleteItemsContainer } from './styles';

import { MeasureBox } from '@/src/components/MeasureBox';
import { TableActionButton } from '@/src/styles/components/tables';
import { NoTitleSelect } from '@/src/components/NoTitleSelect';
import { useRegister } from '~context/register';
import { api } from '~api';
import { DefaultValuePropsWithId, IBaseType, IProfileDiscount, IProfileDiscountProps } from '~types/main';
import { Modal } from '@/src/components/Modal';
import { Input } from '~components/Input';
import { InputContainer } from '~styles/components';
import { ErrorModal } from '@/src/components/ErrorModal';

type Props = {
  data: IProfileDiscount[];
}

export function DiscountsPerProfile({ data = [] }: Props) {
  const { supplier, updateSupplier } = useRegister();
  const [currentData, setCurrentData] = useState(data);
  const [profileOptions, setProfileOptions] = useState([]);
  const [profileOptionsById, setProfileOptionsById] = useState({});

  const [cleaning, setCleaning] = useState(false);
  const [error, setError] = useState('');

  const [client, setClient] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [augeCommission, setAugeCommission] = useState('');
  const [commercialCommission, setCommercialCommission] = useState('');
  
  const [addingProfileDiscount, setAddingProfileDiscount] = useState(false);
  const [deletingProfileDiscount, setDeletingProfileDiscount] = useState(1);

  const [clientProfile, setClientProfile] = useState('');
  const [isClientProfileModalOpen, setIsClientProfileModalOpen] = useState<'normal' | 'new' | ''>('');

  const handleAddProfileDiscount = useCallback(async () => {
    try {
      setAddingProfileDiscount(true);
      const { id } = supplier;

      // @ts-ignore
      const { id: client_profile_id } = profileOptions.find(p => p.value === client) 

      const profileDiscountData = {
        client_profile_id,
        discount_value: discountValue,
        auge_commission: augeCommission,
        commercial_commission: commercialCommission
      }

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/profile_discounts`, profileDiscountData);

      setCleaning(true);
      setProfileOptions(prev => prev.filter((s: DefaultValuePropsWithId) => s.value !== client));

      setDiscountValue('');
      setAugeCommission('');
      setCommercialCommission('');

      const profile_discounts = [...supplier.profile_discounts, data];

      setCurrentData([...currentData, data]);
      updateSupplier({ profile_discounts });
    } catch (e) {
      console.log('e', e);
    } finally {
      setCleaning(false);
      setAddingProfileDiscount(false);
    }
  }, [supplier, client, updateSupplier, currentData, profileOptions, discountValue, augeCommission, commercialCommission]);

  const handleEditProfileDiscount = useCallback(async (order: IProfileDiscountProps) => {
    try {
      const { id } = supplier;

      const requestBody = {
        client_profile_id: order.client_profile_id,
	      discount_value: String(order.discount_value),
	      auge_commission: String(order.auge_commission),
	      commercial_commission: String(order.commercial_commission),
      }

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/profile_discounts/${order.id}?_method=PUT`, requestBody);

      const profile_discounts = currentData.map(p => p.id === order.id ? data : p);

      setCurrentData(profile_discounts);
      updateSupplier({ profile_discounts });
    } catch (e) {
      console.log('e', e);
    }
  }, [supplier, updateSupplier, currentData]);

  const handleDeleteProfileDiscount = useCallback(async (profileDiscountId: number, profile: IBaseType) => {
    try {
      setDeletingProfileDiscount(profileDiscountId);
      
      const { id } = supplier;

      await api.delete(`/products/suppliers/${id}/profile_discounts/${profileDiscountId}`);
      setCleaning(true);
      setProfileOptions( // @ts-ignore
        prev => [...prev, { id: profile.id, value: profile.name, label: profile.name }]
      )
      const profile_discounts = supplier.profile_discounts.filter(p => p.id !== profileDiscountId);

      setCurrentData(prev => prev.filter(p => p.id !== profileDiscountId));
      updateSupplier({ profile_discounts });
    } catch (e) {
      console.log('e', e);
    } finally {
      setCleaning(false);

      setDeletingProfileDiscount(-1);
    }
  }, [supplier, updateSupplier]);

  const fetchProfiles = useCallback(async () => {
    try {
      if(!!profileOptions.length) return;

      const {
        data: { data: profilesData }
      } = await api.get('/clients/profiles');
      
      let profileSet = {};

      // const currentProfileOptions = currentData.map(c => c.profile.id);
      // @ts-ignore
      const currentProfileOptions = currentData.map(c => c.client_profile_id);
      const filteredProfileOptions =
        profilesData
          .map((s: IBaseType) => ({ id: s.id, value: s.name, label: s.name }))
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
    (oldValue: string, newValue: string, order: IProfileDiscountProps) =>
      String(newValue) !== String(oldValue) && handleEditProfileDiscount(order)
  , [handleEditProfileDiscount]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <>
      <CustomSectionTitle>
        Política Comercial - Descontos por perfil do cliente Auge
      </CustomSectionTitle>
      <Header>
        <div>
          <strong>Perfil do Cliente</strong>
        </div>
        <div>
          <strong>Desconto</strong>
        </div>
        <div>
          <strong>Comissão Auge</strong>
        </div>
        <div>
          <strong>Comissão Comercial</strong>
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
                data={profileOptions}
                setValue={() => {}}
                // onChange={(value: string) => // @ts-ignore
                //   value === 'new' ?
                //     setIsClientProfileModalOpen('normal') : // @ts-ignore
                //     value !== c.profile.name && handleEditProfileDiscount({...c, client_profile_id: profileOptionsById[value]})
                // }
                disabled
                defaultValue={{
                  value: !!c.profile ? c.profile.name : '',
                  label: !!c.profile ? c.profile.name : '',
                }}
              /> : 
              <></>
            }
          </div>
          <div>
            <MeasureBox
              name="discount_value"
              title=""
              measure="%"
              width="3rem"
              validated={false}
              defaultValue={c.discount_value}
              // onBlur={({ target: { value: discount_value } }) =>
              //   handleShouldUpdate(c.discount_value, discount_value, {...c, client_profile_id: c.profile.id, discount_value })
              // }
              disabled
              noTitle
            />
          </div>
          <div>
            <MeasureBox
              name="auge_commission"
              title=""
              measure="%"
              width="3rem"
              validated={false}
              defaultValue={c.auge_commission}
              // onBlur={({ target: { value: auge_commission } }) =>
              //   handleShouldUpdate(c.auge_commission, auge_commission, {...c, client_profile_id: c.profile.id, auge_commission })
              // }
              disabled
              noTitle
            />
          </div>
          <div>
            <MeasureBox
              name="commercial_commission"
              title=""
              measure="%"
              width="3rem"
              validated={false}
              defaultValue={c.commercial_commission}
              // onBlur={({ target: { value: commercial_commission } }) =>
              //   handleShouldUpdate(c.commercial_commission, commercial_commission, {...c, client_profile_id: c.profile.id, commercial_commission })
              // }
              disabled
              noTitle
            />
          </div>
          <div>
            <TableActionButton
              disabled={deletingProfileDiscount === c.id}
              onClick={() => handleDeleteProfileDiscount(c.id, c.profile)}
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
          <MeasureBox
            name="discount_value"
            title=""
            measure="%"
            width="3rem"
            validated={false}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            noTitle
            disabled={!supplier.id}
          />
        </div>
        <div>
          <MeasureBox
            name="auge_commission"
            title=""
            measure="%"
            width="3rem"
            validated={false}
            value={augeCommission}
            onChange={(e) => setAugeCommission(e.target.value)}
            noTitle
            disabled={!supplier.id}
          />
        </div>
        <div>
          <MeasureBox
            name="commercial_commission"
            title=""
            measure="%"
            width="3rem"
            validated={false}
            value={commercialCommission}
            onChange={(e) => setCommercialCommission(e.target.value)}
            noTitle
            disabled={!supplier.id}
          />
        </div>
        <div>
          <TableActionButton
            disabled={!supplier.id || addingProfileDiscount || !client || !discountValue || !augeCommission || !commercialCommission}
            onClick={handleAddProfileDiscount}
          >
            {addingProfileDiscount ? <LoadingIcon /> : <PlusIcon />}
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
      </Modal>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
