import React, { useCallback, useEffect, useState } from 'react';
import { InputContainer } from '~styles/components';
import { TableActionButton } from '~styles/components/tables';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { ReactComponent as PlusIcon } from '~assets/plus.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg'

import { Input } from '~components/Input';
import { NoTitleSelect } from '@/src/components/NoTitleSelect';

import {
  CustomSectionTitle,
  TableContentWrapper,
  AddressTableHeader,
  AddressTableContent,
  DeleteItemsContainer
} from './styles';
import { useRegister } from '@/src/context/register';
import { api, viaCep } from '@/src/services/api';
import { DefaultValuePropsWithId, IBaseType, IAddress } from '@/src/types/main';
import { ConfirmationModal } from '@/src/components/ConfirmationModal';
import { Modal } from '@/src/components/Modal';
import { ErrorModal } from '@/src/components/ErrorModal';
import { isNotEmpty, isZipcodeValid } from '@/src/utils/validation';

type Props = {
  addresses: IAddress[];
}

export function Addresses({ addresses }: Props) {
  const { supplier, updateSupplier } = useRegister();
  
  const [zipcode, setZipcode] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [district, setDistrict] = useState('');
  const [countryState, setCountryState] = useState('');
  const [city, setCity] = useState('');
  const [cityName, setCityName] = useState('');
  const [type, setType] = useState('');
  const [cleaning, setCleaning] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [addressFound, setAddressFound] = useState(false);

  const [error, setError] = useState('');

  const [cityOptions, setCityOptions] = useState<DefaultValuePropsWithId[]>([]);
  const [countryOptions, setCountryOptions] = useState<DefaultValuePropsWithId[]>([]);
  const [typeOptions, setTypeOptions] = useState<DefaultValuePropsWithId[]>([]);

  const [addingAddress, setAddingAddress] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState(-1);

  const [addressType, setAddressType] = useState('');
  const [isNewAddressTypeModalOpen, setIsNewAddressTypeModalOpen] = useState<'normal' | 'new' | ''>('');

  const [countryStateOption, setCountryStateOption] = useState('');
  const [isNewCountryStateModalOpen, setIsNewCountryStateModalOpen] = useState<'normal' | 'new' | ''>('');

  const [currentData, setCurrentData] = useState<IAddress[]>(addresses);

  const handleAddAddress = useCallback(async () => {
    try {
      setAddingAddress(true);
      const { id } = supplier;

      if(!isNotEmpty(type)) {
        setError('Preencha o tipo de endereço');
        return;
      }

      const addressData = {
        zipcode,
        street,
        number,
        complement,
        district,
        country_state_id: countryState,
        country_city_id: city,
        address_type_id: type,
      }

      const {
        data: {
          data
        }
      } = await api.post(`/products/suppliers/${id}/addresses`, addressData);

      setCleaning(true);
      setZipcode('');
      setStreet('');
      setNumber('');
      setComplement('');
      setDistrict('');
      setCountryState('');
      setCity('');
      setType('');
      
      const addresses = [...currentData, data];

      setCurrentData(addresses);
      updateSupplier({ addresses });
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar a representada.';

      setError(errorMessage);
    } finally {
      setAddingAddress(false);
      setCleaning(false);
    }
  }, [
      currentData,
      supplier,
      updateSupplier,
      zipcode,
      street,
      number,
      complement,
      district,
      countryState,
      city,
      type,
    ]);

  const handleEditAddress = useCallback(async (order) => {
    try {
      const { id } = supplier;

      // @ts-ignore
      delete order.type;
      // @ts-ignore
      delete order.state;

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/addresses/${order.id}?_method=PUT`, order);

      // @ts-ignore
      const addresses = currentData.map(p => p.id === order.id ? data : p);
      setUpdating(true);

      setCurrentData(addresses);
      updateSupplier({ addresses });
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar a representada.';

      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [supplier, updateSupplier, currentData]);

  const handleDeleteAddress = useCallback(async () => {
    try {      
      const { id } = supplier;

      await api.delete(`/products/suppliers/${id}/addresses/${deletingAddress}`);

      // @ts-ignore
      const addresses = currentData.filter(p => p.id !== deletingAddress);

      setCurrentData(addresses);
      updateSupplier({ addresses });
      // find and update locally
    } catch (e) {
      console.log('e', e);
    } finally {
      setDeletingAddress(-1);
    }
  }, [supplier, updateSupplier, currentData, deletingAddress]);

  const fetchCities = useCallback(async (id: string, city?: string) => {
    try {
      setCleaning(true);
      const {
        data: {
          data
        }
      } = await api.get(`/country_cities/${id}`);

      setCityOptions(data.map((r: IBaseType) => ({ id: r.id, value: r.name, label: r.name })))
      if(!!city) {
        // @ts-ignore
        const currentCity = data.find(e => e.name === city);
        if(!!currentCity) setCity(currentCity.id);
      }
    } catch (e) {
      console.log('e', e);
    } finally {
      setCleaning(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [typesResponse, countriesResponse] = await Promise.all([
        api.get('/address_types'),
        api.get('/country_states')
      ])
      
      const {
        data: {
          data: types
        }
      } = typesResponse;

      const {
        data: {
          data: countries
        }
      } = countriesResponse;

      setTypeOptions([{ value: 'new', label: 'Editar Tipos de Endereço' }, ...types.map((r: IBaseType) => ({ id: r.id, value: r.name, label: r.name }))])
      // @ts-ignore
      setCountryOptions([{ value: 'new', label: 'Editar Estados' }, ...countries.map((r: IBaseType) => ({ id: r.id, value: r.code, label: r.code }))])
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const handleShouldUpdate = useCallback(
    (oldValue: string, newValue: string, order: IAddress) =>
      String(newValue) !== String(oldValue) && handleEditAddress(order)
  , [handleEditAddress]);

  const handleAddAddressType = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.post('/address_types', { name: addressType });

      const newAddressType = {
        id: data.id,
        value: data.name,
        label: data.name,
      }

      // @ts-ignore
      setTypeOptions(prev => [...prev, newAddressType])

      setAddressType(isNewAddressTypeModalOpen === 'new' ? 'CarregandoNew' : 'Carregando');
      setAddressType(data.name);

      setIsNewAddressTypeModalOpen('');
    } catch (e) {
      console.log('e', e);
    }
  }, [addressType, isNewAddressTypeModalOpen]);

  const handleDeleteAddressType = useCallback(async (id: number, value: string) => {
    try {
      await api.delete(`/address_types/${id}`);

      // @ts-ignore
      setTypeOptions(prev => prev.filter(e => e.value !== value));
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  const handleAddCountryState = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.post('/country_states', { name: countryStateOption });

      const newCountryState = {
        id: data.id,
        value: data.name,
        label: data.name,
      }

      // @ts-ignore
      setCountryOptions(prev => [...prev, newCountryState])

      setCountryStateOption(isNewCountryStateModalOpen === 'new' ? 'CarregandoNew' : 'Carregando');
      setCountryStateOption(data.name);

      setIsNewCountryStateModalOpen('');
    } catch (e) {
      console.log('e', e);
    }
  }, [countryStateOption, isNewCountryStateModalOpen]);

  const handleDeleteCountryState = useCallback(async (id: number, value: string) => {
    try {
      await api.delete(`/country_states/${id}`);

      // @ts-ignore
      setCountryOptions(prev => prev.filter(e => e.value !== value));
    } catch (e) {
      console.log('e', e);
    }
  }, []);

  const loadAddress = useCallback(async (code: string) => {
    try {
      const { data: response } = await viaCep.get(`${code}/json`);
      
      const {
        logradouro,
        complemento,
        bairro,
        localidade,
        uf
      } = response;
      
      setStreet(logradouro);
      setComplement(complemento);
      setDistrict(bairro);
      setCityName('CarregandoNew');
      setCityName(localidade);
      setCountryStateOption('CarregandoNew');
      setCountryStateOption(uf);
      setAddressFound(true);

      const currentState = countryOptions.find(e => e.value === uf)
      
      if(!!currentState) {
        fetchCities(String(currentState.id), localidade);
        setCountryState(String(currentState.id));
      }
    } catch (e) {
      console.log('e', e);
    }
  }, [countryOptions]);

  const handleStateChange = useCallback(async (address: IAddress, id: string) => {      
    await Promise.all([ // @ts-ignore
      handleEditAddress({...address, country_state_id: id, address_type_id: a.type.id }),
      fetchCities(id)
    ])  
  }, [fetchCities, handleEditAddress]);

  const handleStateNewOption = useCallback((id: string) => { 
    setCountryState(id);
    fetchCities(id);
  }, [fetchCities]);

  return (
    <>
      <CustomSectionTitle>
        Endereços
      </CustomSectionTitle>
      <AddressTableHeader>
        <div>
          <strong>CEP</strong>
        </div>
        <div>
          <strong>Endereço</strong>
        </div>
        <div>
          <strong>Número</strong>
        </div>
        <div>
          <strong>Complemento</strong>
        </div>
        <div>
          <strong>Bairro</strong>
        </div>
        <div>
          <strong>UF</strong>
        </div>
        <div>
          <strong>Cidade</strong>
        </div>
        <div>
          <strong>Tipo de Endereço</strong>
        </div>
        <div>
          <strong>Ação</strong>
        </div>
      </AddressTableHeader>
      {currentData.map((a) =>
        <TableContentWrapper key={a.id}>
          <AddressTableContent>
            <div>
              <Input
                name="zipcode"
                noTitle
                width="6rem"
                validated={false}
                defaultValue={a.zipcode}
                noValueInput
                disabled
                onBlur={({ target: { value: zipcode } }) =>
                  isZipcodeValid(zipcode) &&
                  handleShouldUpdate(a.zipcode, zipcode, {
                    ...a,
                    zipcode, // @ts-ignore
                    address_type_id: a.type.id, // @ts-ignore
                    country_state_id: a.state.id
                  })
                }
                maxLength={8}
              />
            </div>
            <div>
              <Input
                name="street"
                noTitle
                width="15rem"
                validated={false}
                defaultValue={a.street}
                noValueInput
                disabled
                onBlur={({ target: { value: street } }) =>
                  handleShouldUpdate(a.street, street, {
                    ...a,
                    street, // @ts-ignore
                    address_type_id: a.type.id, // @ts-ignore
                    country_state_id: a.state.id
                  })
                }
              />
            </div>
            <div>
              <Input
                name="number"
                noTitle
                width="3.75rem"
                validated={false}
                defaultValue={a.number}
                noValueInput
                disabled
                onBlur={({ target: { value: number } }) =>
                  handleShouldUpdate(a.number, number, {
                    ...a,
                    number, // @ts-ignore
                    address_type_id: a.type.id, // @ts-ignore
                    country_state_id: a.state.id
                  })
                }
              />
            </div>
            <div>
              <Input
                name="complement"
                noTitle
                width="6.75rem"
                validated={false}
                defaultValue={a.complement}
                noValueInput
                disabled
                onBlur={({ target: { value: complement } }) =>
                  handleShouldUpdate(a.complement, complement, {
                    ...a,
                    complement, // @ts-ignore
                    address_type_id: a.type.id, // @ts-ignore
                    country_state_id: a.state.id
                  })
                }
              />
            </div>
            <div>
              <Input
                name="district"
                noTitle
                width="10.25rem"
                validated={false}
                defaultValue={a.district}
                noValueInput
                disabled
                onBlur={({ target: { value: district } }) =>
                  handleShouldUpdate(a.district, district, {
                    ...a,
                    district, // @ts-ignore
                    address_type_id: a.type.id, // @ts-ignore
                    country_state_id: a.state.id
                  })
                }
              />
            </div>
            <div>
              <NoTitleSelect
                placeholder="Selecione..."
                customWidth="4.625rem"
                data={countryOptions}
                setValue={() => {}}
                disabled
                onChange={(value: string, id: string) => 
                  value === 'new' ?
                    setIsNewCountryStateModalOpen('normal') :
                    handleStateChange(a, id)
                }
                defaultValue={{ // @ts-ignore
                  value: !!a.state ? a.state.name : '', // @ts-ignore
                  label: !!a.state ? a.state.name : ''
                }}
              />
            </div>
            <div>
              <NoTitleSelect
                placeholder="Selecione..."
                customWidth="12.75rem"
                data={cityOptions}
                setValue={() => {}}
                disabled
                onChange={(value: string, id: string) => // @ts-ignore
                  handleEditAddress({ // @ts-ignore
                    ...a, address_type_id: a.type.id, country_state_id: a.state.id, country_city_id: id
                  })                
                }
                defaultValue={{ // @ts-ignore
                  value: !!a.city ? a.city.name : '', // @ts-ignore
                  label: !!a.city ? a.city.name : ''
                }}
              />
            </div>
            <div>
              <NoTitleSelect
                placeholder="Selecione..."
                customWidth="8rem"
                data={typeOptions}
                setValue={() => {}}
                disabled
                onChange={(value: string, id: string) => 
                  value === 'new' ?
                    setIsNewAddressTypeModalOpen('normal') : // @ts-ignore
                    handleEditAddress({...a, address_type_id: id, country_state_id: a.state.id })
                }
                defaultValue={{
                  value:  // @ts-ignore
                    !!a.type ? a.type.name : '',
                  label: // @ts-ignore
                    !!a.type ? a.type.name : '',
                }}
              />
            </div>
            <div>
              <TableActionButton
                onClick={() => setDeletingAddress(a.id)}
                // @ts-ignore
                disabled={!!a.type && a.type.name === 'Principal' }
              >
                <TrashIcon />
              </TableActionButton>
            </div>
          </AddressTableContent>
        </TableContentWrapper>
      )}
      <TableContentWrapper>
        <AddressTableContent>
          <div>
            <Input
              name="zipcode"
              noTitle
              width="6rem"
              validated={false}
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              onBlur={({ target: { value } }) =>
                !isNotEmpty(value) ? setAddressFound(false) :
                isZipcodeValid(value) && loadAddress(value)
              }
              maxLength={8}
            />
          </div>
          <div>
            <Input
              name="street"
              noTitle
              width="15rem"
              validated={false}
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              disabled={addressFound}
            />
          </div>
          <div>
            <Input
              name="number"
              noTitle
              width="3.75rem"
              validated={false}
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <div>
            <Input
              name="complement"
              noTitle
              width="6.75rem"
              validated={false}
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
            />
          </div>
          <div>
            <Input
              name="district"
              noTitle
              width="10.25rem"
              validated={false}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={addressFound}
            />
          </div>
          <div>
            {!cleaning && countryStateOption !== 'CarregandoNew' ? 
              <NoTitleSelect
                placeholder="Selecione..."
                customWidth="4.625rem"
                data={countryOptions}
                setValue={() => {}}
                onChange={(value: string, id: string) => 
                  value === 'new' ?
                    setIsNewCountryStateModalOpen('new') :
                    handleStateNewOption(id)
                }
                defaultValue={{
                  value: countryStateOption,
                  label: countryStateOption
                }}
                disabled={addressFound}
              /> :
              <></>
            }
          </div>
          <div>
            {cityName !== 'CarregandoNew' ?
              <NoTitleSelect
                placeholder="Selecione..."
                customWidth="12.75rem"
                data={cityOptions}
                setValue={() => {}}
                onChange={(_: string, id: string) =>
                  setCity(id)
                }
                defaultValue={{
                  value: cityName,
                  label: cityName
                }}
                disabled={addressFound}
              /> :
              <></>
              }
          </div>
          <div>
            {!cleaning && addressType !== 'CarregandoNew' ?
              <NoTitleSelect
                placeholder="Selecione..."
                customWidth="8rem"
                data={typeOptions}
                setValue={() => {}}
                onChange={(value: string, id: string) => 
                  value === 'new' ?
                    setIsNewAddressTypeModalOpen('new') :
                    setType(id)
                }
                defaultValue={{
                  value: addressType,
                  label: addressType
                }}
              /> :
              <></>
            }
          </div>
          <div>
          <TableActionButton
            disabled={addingAddress}
            onClick={handleAddAddress}
          >
            {addingAddress ? <LoadingIcon /> : <PlusIcon />}
          </TableActionButton>
          </div>
        </AddressTableContent>
      </TableContentWrapper>
      <Modal
        title="Editar Tipos de Endereço"
        isModalOpen={!!isNewAddressTypeModalOpen}
        customOnClose={() => setIsNewAddressTypeModalOpen('')}
        style={{ width: 471 }}
      >
        <InputContainer style={{ alignItems: 'flex-end' }}>
          <Input
            name="Novo Tipo de Endereço"
            fullW
            value={addressType}
            onChange={(e) => setAddressType(e.target.value)}
          />
          <TableActionButton
            onClick={handleAddAddressType}
            style={{
              marginLeft: '1rem'
            }}
          >
            <PlusIcon />
          </TableActionButton>
        </InputContainer>
        <DeleteItemsContainer>
          {typeOptions.map((t: DefaultValuePropsWithId) => 
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
                onClick={() => handleDeleteAddressType(t.id, t.value)}
                style={{ marginLeft: '1rem' }}
              >
                <TrashIcon />
              </TableActionButton>
            </div>  
          )}
        </DeleteItemsContainer>
      </Modal>
      <Modal
        title="Editar Estados"
        isModalOpen={!!isNewCountryStateModalOpen}
        customOnClose={() => setIsNewCountryStateModalOpen('')}
        style={{ width: 471 }}
      >
        <InputContainer style={{ alignItems: 'flex-end' }}>
          <Input
            name="Novo Estado"
            fullW
            value={countryStateOption}
            onChange={(e) => setCountryStateOption(e.target.value)}
          />
          <TableActionButton
            onClick={handleAddCountryState}
            style={{
              marginLeft: '1rem'
            }}
          >
            <PlusIcon />
          </TableActionButton>
        </InputContainer>
        <DeleteItemsContainer>
          {countryOptions.map((t: DefaultValuePropsWithId) => 
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
                onClick={() => handleDeleteCountryState(t.id, t.value)}
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
      <ConfirmationModal
        category={deletingAddress !== -1 ? 'Endereço' : ''}
        action={handleDeleteAddress}
        style={{ marginTop: 0 }}
        setIsModalOpen={() => 
          setDeletingAddress(-1)
        }
      />
    </>
  );
}
