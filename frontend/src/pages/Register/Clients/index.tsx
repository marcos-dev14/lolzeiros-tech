import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '~context/auth';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { ReactComponent as UsersIcon } from '~assets/contatos.svg';
import { ReactComponent as EditIcon } from '~assets/edit1.svg';
import { ReactComponent as BagIcon } from '~assets/bag1.svg';
import { ReactComponent as BagXIcon } from '~assets/bagx1.svg';
import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';
import { ReactComponent as CollapseIcon } from '~assets/collapse.svg'
import { ReactComponent as ExpandIcon } from '~assets/expand_gray.svg'
import { ReactComponent as DateIcon } from '~assets/date.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Pagination } from '~components/Pagination';
import { SearchBox } from '~components/SearchBox';

import { Container, Table, TableHeader, Button, DropdownRowContent, DropdownRowContentInfo, DropdownHeader, DropdownContent, ProfileClient } from './styles';
import { CardSupplierHeader, InputContainer, LabelListSupplier, MenuAndTableContainer } from '~styles/components';

import {
  TableFooter,
  TableActionButton,
  TableTitle,
  TableSortingHeader
} from '~styles/components/tables';

import { api } from '~api';

import { MainClient, DefaultValuePropsWithId, IBaseType, MainClientSupplier } from '~types/main';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { capitalizeContent, cnpjValidation, isNotEmpty, isOnSafari } from '~utils/validation';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { Input } from '@/src/components/Input';
import { useRegister } from '@/src/context/register';
import { FormSelect } from '@/src/components/FormSelect';
import { Modal } from '@/src/components/Modal';
import { StaticDateBox } from '@/src/components/StaticDateBox';
import { CheckBox } from '@/src/components/CheckBox';
import { FormInput } from '@/src/components/FormInput';
import { MultiSelect } from '@/src/components/MultiSelect';
import { FormInputCustomMask } from '@/src/components/FormInputCustomMask';
import { SuccessModal } from '@/src/components/SuccessModal';
import { TableDateBox } from '@/src/components/TableDateBox';

export function Clients() {
  const { user, token } = useAuth();
  const { push } = useHistory();

  const { setClient } = useRegister();

  const formRef = useRef<FormHandles>(null)
  const filterFormRef = useRef<FormHandles>(null)

  const [clients, setClients] = useState<MainClient[]>([]);
  const [fullClients, setFullClients] = useState<MainClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<MainClient[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(50);

  const [searchCurrentPage, setSearchCurrentPage] = useState<number>(1);
  const [searchLastPage, setSearchLastPage] = useState<number>(1);

  const [isOpen, setIsOpen] = useState(-1);

  const [inactive, setInactive] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingSup, setLoadingSup] = useState(true);

  const [hasFiltered, setHasFiltered] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [allowedSuppliers, setAllowedSuppliers] = useState([]);
  const [blockedSuppliers, setBlockedSuppliers] = useState([]);
  const [initialDate, setInitialDate] = useState<Date | string | null>(null);
  const [finishDate, setFinishDate] = useState<Date | string | null>(null);
  const [supl, setSupl] = useState<MainClientSupplier[]>();
  const [sortingField, setSortingField] = useState('');
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [search, setSearch] = useState('');

  const [updatingAvailability, setUpdatingAvailability] = useState(-1);
  const [revalidating, setRevalidating] = useState(-1);

  const [sellerOptions, setSellerOptions] = useState([]);
  const [groupsOptions, setGroupsOptions] = useState([]);
  const [pdvsOptions, setPdvsOptions] = useState([]);
  const [profilesOptions, setProfilesOptions] = useState([]);
  const [buyerOptions, setBuyerOptions] = useState([]);
  const commercialStatusOptions = useMemo(() => [
    { id: 0, value: 'Indefinido', label: 'Indefinido' },
    { id: 1, value: 'Ativo', label: 'Ativo' },
    { id: 2, value: 'Inativo', label: 'Inativo' },
    { id: 3, value: 'Bloqueado', label: 'Bloqueado' },
    { id: 4, value: 'Prospecção', label: 'Prospecção' },
  ], []);
  const [suppliersOptions, setSuppliersOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState<DefaultValuePropsWithId[]>([]);
  const [cityOptions, setCityOptions] = useState<DefaultValuePropsWithId[]>([]);

  const availabilityOptions = useMemo(() => [
    { value: 'Disponível', label: 'Disponível' },
    { value: 'Indisponível', label: 'Indisponível' },
    { value: 'Pré-venda', label: 'Pré-venda' },
    { value: 'Fora de linha', label: 'Fora de linha' }
  ], []);

  // const handleSearch = useCallback((search: string) => {    
  //   // setFilteredClients(clients.filter(
  //   //   (r) => r.reference.toLowerCase().includes(search.toLowerCase())
  //   // ));

  //   setHasSearch(isNotEmpty(search));
  // }, [clients]);


  const handleGetSuplier = useCallback(async (clientId: number) => {
    try {
      setLoadingSup(true);
      setIsOpen(isOpen === clientId ? -1 : clientId);
      if (isOpen !== clientId) {

        const rest = await api.get(`/clients/${clientId}/suppliers`);
        setSupl(rest.data.data);

      }
    } catch (e) {
      setLoadingSup(false);
      console.log('e', e);
    } finally {
      setLoadingSup(false);
    }

  }, [isOpen]);

  const handleSearch = useCallback(async (search: string) => {
    try {
      setLoading(true);

      const {
        data: {
          data: { data: clients, meta: { current_page, last_page } }
        }
      } = await api.get(`/clients?paginated=true&per_page=${perPage}`, {
        params: {
          reference: search.toLowerCase()
        }
      });

      setFilteredClients(clients);
      setSearchCurrentPage(current_page);
      setSearchLastPage(last_page);

      setSearch(search);
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  const handleFilterClients = useCallback(async () => {
    try {
      setLoading(true);
      const data = filterFormRef?.current?.getData();
      console.log('d', {
        ...data,
        // without_blocked_suppliers: allowedSuppliers.join(','),
        // with_blocked_suppliers: blockedSuppliers.join(','),
        // register_up: initialDate.toISOString(),
        // register_down: finishDate.toISOString()
      })
      // @ts-ignore
      const { by_seller, by_client_group, by_client_pdv, by_client_profile, last_order, by_buyer, commercial_status, by_state, by_city } = data;

      const params = {};

      // @ts-ignore
      const seller = sellerOptions.find(c => c.label === by_seller);
      // @ts-ignore
      const client_group = groupsOptions.find(c => c.label === by_client_group);
      // @ts-ignore
      const client_pdv = pdvsOptions.find(c => c.label === by_client_pdv);
      // @ts-ignore
      const client_profile = profilesOptions.find(c => c.label === by_client_profile);
      // @ts-ignore
      const buyer = buyerOptions.find(c => c.label === by_buyer);
      // @ts-ignore
      const commercialStatus = commercialStatusOptions.find(c => c.label === commercial_status);
      // @ts-ignore
      const state = countryOptions.find(c => c.label === by_state);
      // @ts-ignore
      const city = cityOptions.find(c => c.label === by_city);

      if (!!seller) { // @ts-ignore
        params['by_seller'] = seller.id;
      }

      if (!!client_group) { // @ts-ignore
        params['by_client_group'] = client_group.id;
      }

      if (!!client_pdv) { // @ts-ignore
        params['by_client_pdv'] = client_pdv.id;
      }

      if (!!client_profile) { // @ts-ignore
        params['by_client_profile'] = client_profile.id;
      }

      if (!!client_profile) { // @ts-ignore
        params['by_client_profile'] = client_profile.id;
      }

      if (!!client_profile) { // @ts-ignore
        params['by_client_profile'] = client_profile.id;
      }

      if (!!by_buyer) { // @ts-ignore
        params['by_buyer'] = buyer.id;
      }

      if (!!last_order) { // @ts-ignore
        params['last_order'] = last_order;
      }

      if (!!commercial_status) { // @ts-ignore
        params['commercial_status'] = commercialStatus.label;
      }

      if (!!allowedSuppliers.length) { // @ts-ignore
        params['without_blocked_suppliers'] = allowedSuppliers.map(s => s.id).join(',')
      }

      if (!!blockedSuppliers.length) { // @ts-ignore
        params['with_blocked_suppliers'] = blockedSuppliers.map(s => s.id).join(',')
      }

      if (!!initialDate) { // @ts-ignore
        params['register_up'] = initialDate.toISOString()
      }

      if (!!finishDate) { // @ts-ignore
        params['register_down'] = finishDate.toISOString()
      }

      if (!!state) { // @ts-ignore
        params['by_state'] = state.id
      }

      if (!!city) { // @ts-ignore
        params['by_city'] = city.id
      }

      if (isNotEmpty(search)) { // @ts-ignore
        params['reference'] = search.toLowerCase()
      }

      // @ts-ignore
      params['unavailable'] = inactive;

      const {
        data: {
          data: { data: results, meta: { current_page, last_page }
          }
        }
      } = await api.get(`clients?paginated=true&per_page=${perPage}`, {
        params
      });

      setFilteredClients(results);
      setHasFiltered(true);
      setIsFilterModalOpen(false);

      setSearchCurrentPage(+current_page);
      setSearchLastPage(+last_page);

    } catch (error) {
      // @ts-ignore
      console.log('e', error)
      // @ts-ignore
      console.log('e', error.response.data.message);

      // @ts-ignore
      setError(error.response.data.message)
    } finally {
      setLoading(false);
    }
  }, [
    perPage,
    inactive,
    sellerOptions,
    groupsOptions,
    pdvsOptions,
    profilesOptions,
    buyerOptions,
    commercialStatusOptions,
    allowedSuppliers,
    blockedSuppliers,
    initialDate,
    finishDate,
    search,
    cityOptions,
    countryOptions
  ]);

  const handlePagination = useCallback(async (page: number) => {
    try {
      setLoading(true);

      const request = isNotEmpty(search) ?
        {
          params: {
            reference: search.toLowerCase()
          }
        } :
        {};

      const {
        data: {
          data: { data: results, meta: { current_page, last_page } }
        }
      } = await api.get(`clients?paginated=true&per_page=${perPage}&page=${page}`, request);

      const formattedResults = !!sortingField ? sortByField(results, sortingField) : results;

      setFilteredClients(formattedResults);
      if (isNotEmpty(search) || hasFiltered) {
        setSearchCurrentPage(+current_page);
        setSearchLastPage(+last_page);
      }
      else {
        setClients(formattedResults)
        setCurrentPage(+current_page);
        setLastPage(+last_page);
      }
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [hasFiltered, sortingField, perPage, search])

  const handleFilterStatus = useCallback(async () => {
    if (!hasFiltered) {
      setIsFilterModalOpen(true)
      return;
    }

    setHasFiltered(false);
  }, [hasFiltered])

  const handleRegisterClient = useCallback(async () => {
    try {
      setLoading(true);
      const data = formRef?.current?.getData();
      // @ts-ignore
      if (!cnpjValidation(data.document)) {
        setError('Preencha um CNPJ válido.');
        return;
      }

      const {
        data: { data: response } // @ts-ignore
      } = await api.post('/clients', { document: data.document });


      setClient(response as unknown as MainClient);

      push('/register/clients/new');
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao registrar o cliente.';

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [push, setClient]);

  useEffect(() => {
    fetchData();

    console.log(user, token);
  }, []);

  const { currentPageValue, lastPageValue } = useMemo(() => ({
    currentPageValue: hasFiltered || isNotEmpty(search) ? searchCurrentPage : currentPage,
    lastPageValue: hasFiltered || isNotEmpty(search) ? searchLastPage : lastPage,
  }), [hasFiltered, search, searchCurrentPage, currentPage, lastPage, searchLastPage])

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if (sortingField.includes(value)) {
      setFilteredClients(clients.reverse());

      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if (type === 'string')
      setFilteredClients(prev => sortByField(prev, value));
    else {
      setFilteredClients(prev => sortNumberFields(prev, value));
    }
    setSortingField(value);
  }, [clients, sortingField]);

  const handleEditClient = useCallback(async (client: MainClient) => {
    try {
      const {
        data: { data }
      } = await api.get(`/clients/${client.id}`);

      setClient(data);
      push('/register/clients/new');
    } catch (e) {

      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao editar o cliente.';

      setError(errorMessage);
    }
  }, [setClient, push]);

  const handleSupplierAvailability = useCallback(async (id: number, status: string) => {
    try {
      setUpdatingAvailability(id);
      // const upload = new FormData();

      const availability =
        status === 'Ativo' ? 'Inativo' : 'Ativo';
      // upload.append('is_available', status ? '1' : '0');
      const {
        data: { data }
      } = await api.put(`/clients/${id}`, {
        commercial_status: availability
      });

      const currentProductIndex = filteredClients.findIndex(p => p.id === id);
      const tempProducts = [...filteredClients];

      tempProducts[currentProductIndex] = data;
      setFilteredClients(tempProducts);
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao atualizar o cliente.';

      setError(errorMessage);
    } finally {
      setUpdatingAvailability(-1);
    }
  }, [filteredClients]);

  const handleRevalidate = useCallback(async (id: number) => {
    try {
      setRevalidating(id);
      // const upload = new FormData();

      const {
        data: { message }
      } = await api.post(`/clients/${id}/revalidates`);
      // const currentProductIndex = filteredClients.findIndex(p => p.id === id);
      // const tempProducts = [...filteredClients];

      // tempProducts[currentProductIndex] = data;
      // setFilteredClients(tempProducts);
      setMessage(message);
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao revalidar o cliente.';

      setError(errorMessage);
    } finally {
      setRevalidating(-1);
    }
  }, []);

  const handleOpenLoginBySellerLink = (id: number) => {
    const baseUrl = 'https://augeapp.com.br/vendedor/login';

    window.open(`${baseUrl}?client_id=${id}&email=${user.email}&token=${token}`, '_blank');
  }

  const usingSafari = useMemo(() => isOnSafari, []);

  const fetchCities = useCallback(async (id: string, city?: string) => {
    try {
      setLoadingCities(true);
      const {
        data: {
          data
        }
      } = await api.get(`/country_cities/${id}`);

      setCityOptions(data.map((r: IBaseType) => ({ id: r.id, value: r.name, label: r.name })))
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        clientsResponse,
        sellerResponse,
        groupsResponse,
        pdvsResponse,
        profilesResponse,
        buyersResponse,
        suppliersResponse,
        countriesResponse
      ] = await Promise.all([
        api.get(`clients?paginated=true&per_page=${perPage}`),
        api.get('/sellers'),
        api.get('/clients/groups'),
        api.get('/clients/pdvs'),
        api.get('/clients/profiles'),
        api.get('/buyers'),
        api.get('/products/suppliers'),
        api.get('/country_states')
      ])

      const { // @ts-ignore
        data: {
          data: { data: fullClients, meta: { current_page, last_page } }
        }
      } = clientsResponse;

      setClients(fullClients);
      setFullClients(fullClients);
      setFilteredClients(fullClients);

      setCurrentPage(current_page);
      setLastPage(last_page);

      const {
        data: { data: profiles }
      } = profilesResponse;

      const {
        data: { data: groups }
      } = groupsResponse;

      const {
        data: { data: pdvs }
      } = pdvsResponse;

      const {
        data: { data: sellers }
      } = sellerResponse;

      const {
        data: { data: suppliersData }
      } = suppliersResponse;

      const {
        data: {
          data: countries
        }
      } = countriesResponse;

      const {
        data: {
          data: buyers
        }
      } = buyersResponse;

      // @ts-ignore
      setProfilesOptions(profiles.map((a: string) => ({ id: a.id, value: a.name, label: a.name })))

      // @ts-ignore
      setGroupsOptions(groups.map((a: string) => ({ id: a.id, value: a.name, label: a.name })))

      // @ts-ignore
      setPdvsOptions(pdvs.map((a: string) => ({ id: a.id, value: a.name, label: a.name })))

      // @ts-ignore
      setBuyerOptions(buyers.map((a: string) => ({ id: a.id, value: a.name, label: a.name })))

      // @ts-ignore
      setSellerOptions(sellers.map((a: string) => ({ id: a.id, value: a.name, label: a.name })))

      // @ts-ignore
      setSuppliersOptions(suppliersData.map((a: string) => ({ id: a.id, value: a.name, label: a.name })));

      // @ts-ignore
      setCountryOptions(countries.map((r: IBaseType) => ({ id: r.id, value: r.code, label: r.code })))
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  const formatAddress = useCallback((p) => {
    // @ts-ignore
    // const stateName = !!p.state ? `${p.state.name} - ` : '';
    // @ts-ignore
    const stateCode = !!p.state ? p.state.code : '';
    // @ts-ignore
    const cityName = !!p.city ? `${p.city.name} - ` : '';

    return `${cityName}${stateCode}`;
  }, []);

  useEffect(() => {
    setClient(null as unknown as MainClient);
  }, [])

  const formatDate = useCallback((date: string) => {
    if (!date) {
      return ['', ''];  // Se a data for nula, retorna strings vazias
    }

    let currentDate: Date;

    if (typeof date === 'string') {
      currentDate = new Date(date);
    } else {
      currentDate = date;
    }

    const formattedDate = currentDate.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });

    return formattedDate;
  }, []);

  return (
    <>
      <Header route={['Cadastro', 'Cliente']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <TableHeader>
            <SearchBox
              search={handleSearch}
              onClear={() => {
                setSearch('');
                setFilteredClients(clients)
              }}
            />
            <div>
              <Input
                name="Total de Resultados"
                width="10rem"
                style={{ marginRight: '1.25rem' }}
                value={perPage}
                // @ts-ignore
                onChange={(e) => setPerPage(e.target.value)}
                // @ts-ignore
                onBlur={(e) => (e.target.value <= 0 || isNaN(e.target.value)) && setPerPage(50)}
              />
              <Button
                onClick={handleFilterStatus}
                disabled={loading}
              >
                {hasFiltered ? 'Limpar Filtro' : 'Filtro'}
              </Button>
              <Button
                className="newProduct"
                onClick={() => setIsNewClientModalOpen(true)}
                disabled={loading}
              >
                Novo Cliente
              </Button>
            </div>
          </TableHeader>
          {loading ?
            <LoadingContainer
              content="os clientes"
            /> :
            <>
              <Table isOnSafari={usingSafari}>
                <colgroup>
                  <col span={1} style={{ width: '22%' }} />
                  <col span={1} style={{ width: '11%' }} />
                  <col span={1} style={{ width: '13%' }} />
                  <col span={1} style={{ width: '24%' }} />
                  <col span={1} style={{ width: '16%' }} />
                  <col span={1} style={{ width: '14%' }} />
                </colgroup>
                <thead>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('company_name') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'company_name' })}
                    >
                      Razão Social
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('document') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'document' })}
                    >
                      CNPJ
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('group_name') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'group_name' })}
                    >
                      Grupo
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('seller_name') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'seller_name' })}
                    >
                      Comercial
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('address_state_city') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'address_state_city' })}
                    >
                      Estado
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('created_at') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'created_at' })}
                    >
                      Cadastro/Login/CA
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('commercial_status') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'commercial_status' })}
                    >
                      Status
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>
                    Ação
                  </th>
                </thead>
                <tbody>
                  {filteredClients.map(p => (
                    <Fragment key={p.id}>
                      <tr
                        style={{
                          backgroundColor:
                            isOpen === p.id ? '#F4F5F8' : '#fff'
                        }}
                      >
                        <td>{capitalizeContent(!!p.company_name ? p.company_name : '---')}</td>
                        <td>
                          <TableTitle style={{ width: '8rem' }} fontSize="0.6875rem" lineHeight="0.8125rem">
                            {p.document}
                          </TableTitle>
                        </td>
                        <td>{!!p.group ? !!p.group.name && isNotEmpty(p.group.name) ? capitalizeContent(p.group.name) : '---' : ''}</td>
                        <td style={{ padding: '0 0.625rem' }}>
                          {!!p.seller ? !!p.seller.name && isNotEmpty(p.seller.name) ? capitalizeContent(p.seller.name) : '---' : ''}
                        </td>
                        <td style={{ padding: '0 0.625rem' }}>
                          <TableTitle
                            fontSize="0.6875rem"
                            lineHeight="0.8125rem"
                            title={!!p.main_address ? formatAddress(p.main_address) : ''}
                          >
                            {!!p.main_address ? formatAddress(p.main_address) : ''}
                          </TableTitle>
                        </td>
                        <td>
                          <TableDateBox
                            name=""
                            title=""
                            width="7.5rem"
                            // @ts-ignore
                            showTime={false}
                            date={p.created_at}
                            onDateSelect={() => { }}
                            disabled
                            validated={false}
                          />
                          <TableDateBox
                            name=""
                            title=""
                            width="7.5rem"
                            // @ts-ignore
                            showTime={false}
                            date={p.last_login ?? new Date()}
                            onDateSelect={() => { }}
                            disabled
                            validated={false}
                          />

                        </td>
                        <td>{p.commercial_status ?? 'Indefinido'}</td>
                        <td>
                          <div>
                            <TableActionButton
                              // disabled={!p.cart && !p.orders.last_order}
                              onClick={() => handleGetSuplier(p.id)}
                            >
                              {isOpen === p.id ? <CollapseIcon /> : <ExpandIcon />}
                            </TableActionButton>
                            <TableActionButton
                              onClick={() => handleEditClient(p)}
                              disabled={revalidating === p.id}
                            >
                              <EditIcon />
                            </TableActionButton>
                            <TableActionButton
                              onClick={() => handleSupplierAvailability(p.id, p.commercial_status)}
                              disabled={updatingAvailability === p.id}
                            >
                              {(p.commercial_status === 'Ativo' || p.commercial_status === 'Prospeccao') ? <BagIcon /> : <BagXIcon />}
                            </TableActionButton>
                            <TableActionButton
                              onClick={() => handleRevalidate(p.id)}
                              disabled={revalidating === p.id}
                              loading={revalidating === p.id}
                            >
                              <LoadingIcon stroke="#767778" style={{ height: '1.25rem', marginTop: '0.25rem' }} height="24px" />
                            </TableActionButton>

                            {p.buyer_id !== null && (
                              <TableActionButton
                                onClick={() => handleOpenLoginBySellerLink(p.id)}
                                disabled={revalidating === p.id}
                              >
                                <UsersIcon stroke="#767778" style={{ height: '1.25rem', marginTop: '0.25rem' }} height="24px" />
                              </TableActionButton>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isOpen === p.id &&
                        <tr>
                          <td
                            colSpan={8}
                            style={{
                              width: '100%',
                              // height: '4.875rem',
                              backgroundColor: "#F4F5F8",
                              padding: '1.25rem 0.625rem 0.625rem 0.75rem',
                              boxSizing: 'border-box'
                            }}
                          >
                            <DropdownRowContent>
                                <DropdownContent>
                                  {!!p.orders && !!p.orders.count_orders &&
                                    <DropdownHeader>
                                      <h4>Últimas atualizações</h4>
                                        <div>
                                          <span>Total de compras:</span>
                                          {p.orders.count_orders}
                                        </div>
                                    </DropdownHeader>
                                  }
                                  
                                  <DropdownRowContentInfo>
                                    {!!p.orders.last_order &&
                                      <div style={{ marginTop: '0.5rem' }}>
                                        <span style={{ backgroundColor: '#21D0A1' }} />
                                        <p>
                                          <strong style={{ color: '#21D0A1' }}>
                                            Encomenda
                                          </strong>&nbsp;em {p.orders.last_order.formated_date_time}&nbsp;
                                          <b>R$ {p.orders.last_order.total_value_with_ipi}</b>&nbsp;{p.orders.last_order.count_products} produtos, {p.orders.last_order.supplier_name},&nbsp;
                                          <strong style={{ color: '#21D0A1' }}>Vendedor&nbsp;<b>{p.orders.last_order.seller_name}</b></strong>
                                        </p>
                                      </div>
                                    }
                                    {!!p.cart &&
                                      <div>
                                        <span style={{ backgroundColor: '#FE726E' }} />
                                        <p>
                                          <strong style={{ color: '#FE726E' }}>
                                            Cesto Abandonado
                                          </strong>&nbsp;em {p.cart.last_update}&nbsp;
                                          <b>R$ {p.cart.subtotal_with_ipi}</b>&nbsp;{p.cart.products_count} produtos
                                        </p>
                                      </div>
                                    }
                                  </DropdownRowContentInfo>
                                </DropdownContent>

                              {!!p.profile &&  
                                <ProfileClient>
                                  <span>Perfil do cliente:</span> {p.profile.name}
                                </ProfileClient>    
                              } 
                              
                            </DropdownRowContent>
                            {!!supl &&
                              <div
                                style={{
                                  width: '100%',
                                  marginTop: '1rem',
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: '1rem'
                                }}
                              >
                                {loadingSup ?
                                  <LoadingContainer
                                    content="os Fornecedores"
                                  /> :
                                  supl.map((s) =>
                                    <div
                                      key={s.name}
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '.6rem',
                                        width: 'calc((100% - 2rem) / 3)',
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        gap: '1rem',
                                      }}
                                    >
                                      <CardSupplierHeader>
                                        <h2 style={{ color: '#0C5DA7', fontSize: '1rem' }}>{s.name}</h2>

                                        {/* <TableDateBox
                                          name="Ultima Compra"
                                          title="Ultima Compra"
                                          width="6rem"
                                          height="2rem"
                                          // @ts-ignore
                                          showTime={false}
                                          date={s.last_order}
                                          disabled
                                          validated={false}
                                        /> */}
                                        <div
                                          style={{ borderRadius: '0.3rem', border: '1px solid #ECEFF6', padding: '0.5rem', display: 'flex', gap: '0.5rem' }}
                                        >
                                          <DateIcon />

                                          <p>
                                            {s.last_order ? (
                                              <span><strong>Última compra:</strong> {formatDate(s.last_order)}</span>
                                            ) : (
                                              "Nenhuma compra realizada"
                                            )}
                                          </p>

                                        </div>
                                      </CardSupplierHeader>
                                      <LabelListSupplier>
                                        <label>Desconto perfil cliente <span>{s.profile_discount}</span></label>
                                        <label>ICMS entre estados <span>{s.icms}</span></label>
                                        <label>Caixa fracionada <span>{s.fractional_box === 1 ? "Permite" : "Não Permite"}</span></label>
                                        <label>Comissão comercial <span>{s.commercial_commission}</span></label>
                                      </LabelListSupplier>
                                    </div>
                                  )}
                              </div>}
                          </td>
                        </tr>
                      }
                    </Fragment>
                  ))}
                </tbody>
              </Table>
              <TableFooter>
                {/* <button onClick={clearProducts}>Excluir</button> */}
                <p>{(isNotEmpty(search) || hasFiltered) ? filteredClients.length : fullClients.length} Clientes</p>
                {!hasFiltered &&
                  <Pagination
                    currentPage={currentPageValue}
                    lastPage={lastPageValue}
                    setCurrentPage={handlePagination}
                  />}
              </TableFooter>
            </>
          }
        </Container>
      </MenuAndTableContainer>
      <Modal
        title="Filtro de Clientes"
        isModalOpen={isFilterModalOpen}
        setIsModalOpen={setIsFilterModalOpen}
      >
        <Form ref={filterFormRef} onSubmit={() => { }}>
          <InputContainer style={{ marginTop: '1.875rem' }}>
            <FormSelect
              name="by_seller"
              title="Comercial"
              placeholder="Selecione..."
              customWidth="11.875rem"
              data={sellerOptions}
            />
            <FormSelect
              name="by_client_group"
              title="Grupo do Cliente"
              placeholder="Selecione..."
              customWidth="11.875rem"
              data={groupsOptions}
            />
          </InputContainer>
          <InputContainer>
            <FormSelect
              name="by_client_pdv"
              title="Tipo de PDV"
              placeholder="Selecione..."
              customWidth="11.875rem"
              data={pdvsOptions}
            />
            <FormSelect
              name="by_client_profile"
              title="Perfil do Cliente"
              placeholder="Selecione..."
              customWidth="11.875rem"
              data={profilesOptions}
            />
          </InputContainer>
          <InputContainer style={{ alignItems: 'center' }}>
            <FormInput
              name="last_order"
              title="Última Compra"
              placeholder="Selecione..."
              width="11.875rem"
              onInput={(e) => (e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1").replace(/^0[^.]/, "0"))}
            />
            <CheckBox
              content="Inatividade"
              value={inactive}
              setValue={setInactive}
              style={{ marginTop: '1rem' }}
            />
          </InputContainer>
          <InputContainer>
            <FormSelect
              name="by_buyer"
              title="Comprador"
              placeholder="Selecione..."
              customWidth="11.875rem"
              data={buyerOptions}
            />
            <FormSelect
              name="commercial_status"
              title="Status Comercial"
              placeholder="Selecione..."
              customWidth="11.875rem"
              data={commercialStatusOptions}
            />
          </InputContainer>
          <InputContainer>
            <MultiSelect
              title="Representada Liberada"
              placeholder="Selecione..."
              customWidth="25rem"
              // @ts-ignore
              setValue={(e) => // @ts-ignore
                setAllowedSuppliers(e)
              }
              data={suppliersOptions}
            />
          </InputContainer>
          <InputContainer>
            <MultiSelect
              title="Representada Bloqueada"
              placeholder="Selecione..."
              customWidth="25rem"
              // @ts-ignore
              setValue={(e) => // @ts-ignore
                setBlockedSuppliers(e)
              }
              data={suppliersOptions}
            />
          </InputContainer>
          <InputContainer>
            <FormSelect
              name="by_state"
              title="Estado"
              placeholder="Selecione..."
              customWidth="11.875rem"
              data={countryOptions}
              disabled={loadingCities}
              // @ts-ignore
              onChange={(_, id) => fetchCities(id)}
            />
            <FormSelect
              name="by_city"
              title="Cidade"
              placeholder="Selecione..."
              customWidth="11.875rem"
              disabled={loadingCities}
              data={cityOptions}
            />
          </InputContainer>
          <InputContainer>
            <StaticDateBox
              name="register_up"
              title="Clientes Cadastrados - Inicial"
              width="9.875rem"
              // @ts-ignore
              date={initialDate}
              onDateSelect={(d) => setInitialDate(new Date(d))}
              validated={false}
            />
            <StaticDateBox
              name="register_down"
              title="Clientes Cadastrados - Final"
              width="9.875rem"
              // @ts-ignore
              date={finishDate}
              onDateSelect={(d) => setFinishDate(new Date(d))}
              validated={false}
            />
          </InputContainer>
          <Button
            onClick={handleFilterClients}
            type="button"
            style={{ marginTop: '3.125rem', width: '100%' }}
            disabled={loading || loadingCities}
          >
            {loading ? <LoadingIcon className="load" /> : 'Filtrar Clientes'}
          </Button>
        </Form>
      </Modal>
      <Modal
        title="Novo Cliente"
        isModalOpen={isNewClientModalOpen}
        setIsModalOpen={setIsNewClientModalOpen}
        style={{ width: '30rem' }}
      >
        <Form ref={formRef} onSubmit={() => { }}>
          <InputContainer>
            <FormInputCustomMask
              name="document"
              title="CNPJ"
              fullW
              width="100%"
              mask="99.999.999/9999-99"
            />
          </InputContainer>
          <Button
            type="button"
            style={{ marginTop: '1.875rem', width: '100%' }}
            onClick={handleRegisterClient}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Cliente'}
          </Button>
        </Form>
      </Modal>
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
