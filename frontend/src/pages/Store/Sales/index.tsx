import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as PrintIcon } from '~assets/print_black.svg';
import { ReactComponent as ViewIcon } from '~assets/eye.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { ReactComponent as NewIcon } from '~assets/new.svg';
import { ReactComponent as ReceivedIcon } from '~assets/received.svg';
import { ReactComponent as TruckIcon } from '~assets/truck.svg';
import { ReactComponent as PaidIcon } from '~assets/paid.svg';
import { ReactComponent as PausedIcon } from '~assets/paused.svg';
import { ReactComponent as CancelledIcon } from '~assets/cancelled.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Pagination } from '~components/Pagination';
import { SearchBox } from '~components/SearchBox';
import { CustomSelect as Select } from '~components/Select';

import {
  Container,
  Table,
  TableHeader,
  Button,
  SalesTableFooter,
  CustomSectionTitle,
  Badge
} from './styles';
import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { TableActionButton, TableSortingHeader, TableTitle } from '~styles/components/tables';

import { api } from '~api';

import { ISale } from '~types/main';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { emptyFieldRegex, isNotEmpty, isOnSafari } from '~utils/validation';
import { useProduct } from '@/src/context/product';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { TableTagInput } from '@/src/components/TableTagInput';
import { TableDateBox } from '@/src/components/TableDateBox';
import { MeasureBox } from '@/src/components/MeasureBox';
import { StaticDateBox } from '@/src/components/StaticDateBox';
import { formatToBrl } from '@/src/utils/format';
import { useRegister } from '@/src/context/register';
import { FormSelect } from '@/src/components/FormSelect';
import { FormHandles } from '@unform/core';
import { Modal } from '@/src/components/Modal';
import { Form } from '@unform/web';
import { Input } from '@/src/components/Input';

export function Sales() {
  const { push } = useHistory();

  const { setSale } = useRegister();

  const filterFormRef = useRef<FormHandles>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [sales, setSales] = useState<ISale[]>([]);
  const [filteredSales, setFilteredSales] = useState<ISale[]>([]);

  const [loadingSale, setLoadingSale] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(50);

  const [searchCurrentPage, setSearchCurrentPage] = useState<number>(1);
  const [searchLastPage, setSearchLastPage] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [error, setError] = useState('');

  const [suppliersOptions, setSuppliersOptions] = useState([]);
  const [sellersOptions, setSellersOptions] = useState([]);
  const [groupsOptions, setGroupsOptions] = useState([]);
  const [statesOptions, setStatesOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const [supplierId, setSupplierId] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');

  const [loadingCities, setLoadingCities] = useState(false);

  const [startPeriod, setStartPeriod] = useState<Date | null>(null);
  const [endPeriod, setEndPeriod] = useState<Date | null>(null);
  const [currentStatus, setCurrentStatus] = useState('Todos');

  const [search, setSearch] = useState('');

  const [sortingField, setSortingField] = useState('');
  const [hasSearch, setHasSearch] = useState(false);

  const [totalEarned, setTotalEarned] = useState('');
  const [filteredEarned, setFilteredEarned] = useState('');

  const handleSearch = useCallback(async (search: string) => {
    try {
      if (!isNotEmpty(search)) return;

      setLoading(true);

      const {
        data: {
          data: { data, meta: { current_page, last_page } }
        }
      } = await api.get(`/orders?paginated=true&per_page=${perPage}`, {
        params: {
          code: search.toLowerCase()
        }
      });

      setFilteredSales(data);
      setSearchCurrentPage(current_page);
      setSearchLastPage(last_page);

      setSearch(search);
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  const handleFilterProducts = useCallback(async () => {
    try {
      setLoading(true);

      let params = {};

      if (!!supplierId) { // @ts-ignore
        params['by_product_supplier'] = supplierId;
      }

      if (!!sellerId) { // @ts-ignore
        params['by_seller'] = sellerId;
      }

      if (!!groupId) { // @ts-ignore
        params['by_client_group'] = groupId;
      }

      if (!!stateId) { // @ts-ignore
        params['by_country_state'] = stateId;
      }

      if (!!cityId) { // @ts-ignore
        params['by_country_city'] = cityId;
      }

      if (!!startPeriod) { // @ts-ignore
        params['start_date'] = startPeriod;
      }

      if (!!endPeriod) { // @ts-ignore
        params['end_date'] = endPeriod;
      }

      if (currentStatus !== 'Todos') { // @ts-ignore
        params['current_status'] = currentStatus;
      }

      if (isNotEmpty(search)) { // @ts-ignore
        params['code'] = search.toLowerCase()
      }

      const {
        data: {
          data: { data: results, meta: { current_page, last_page }
          }
        } } = await api.get(`/orders?paginated=true&per_page=${perPage}`, {
          params
        });

      setIsFilterModalOpen(false);
      setSupplierId('');
      setSellerId('');
      setGroupId('');
      setStateId('');
      setCityId('');

      setFilteredSales(results);

      if (isNotEmpty(search)) {
        setSearchCurrentPage(+current_page);
        setSearchLastPage(+last_page);
      }
      else {
        setSales(sales)
        setCurrentPage(+current_page);
        setLastPage(+last_page);
      }
      setHasFiltered(true);
      // @ts-ignore
      setFilteredEarned(formatToBrl(data.reduce((a, v) => a + +v.total_value, 0).toFixed(2)))
    } catch (error) {
      // @ts-ignore
      console.log('e', error.response.data.message);

      // @ts-ignore
      setError(error.response.data.message)
    } finally {
      setLoading(false);
    }
  }, [
    perPage,
    sales,
    startPeriod,
    endPeriod,
    currentStatus,
    supplierId,
    sellerId,
    groupId,
    stateId,
    cityId,
    search
  ]);

  const handleEditSale = useCallback(async (sale: ISale) => {
    try {
      setLoadingSale(sale.code!);

      const {
        data: { data }
      } = await api.get(`/orders/${sale.code}`);

      setSale(data);
      push('/store/sales/new');
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoadingSale('');
    }
  }, [setSale, push]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        ordersResponse,
        suppliersResponse,
        sellersResponse,
        groupsResponse,
        statesResponse,
      ] = await Promise.all([
        api.get(`/orders?paginated=true&per_page=${perPage}`),
        api.get('/products/suppliers'),
        api.get('sellers'),
        api.get('/clients/groups'),
        api.get('/country_states'),
      ])

      const {
        data: {
          data: { data: orders, meta: { current_page, last_page } }
        }
      } = ordersResponse;

      const {
        data: {
          data: suppliers
        }
      } = suppliersResponse;

      const {
        data: {
          data: sellers
        }
      } = sellersResponse;

      const {
        data: {
          data: groups
        }
      } = groupsResponse;

      const {
        data: {
          data: states
        }
      } = statesResponse;

      // @ts-ignore
      setSuppliersOptions(suppliers.map(s => ({ id: s.id, value: s.name, label: s.name })));
      // @ts-ignore
      setSellersOptions(sellers.map(s => ({ id: s.id, value: s.name, label: s.name })));
      // @ts-ignore
      setGroupsOptions(groups.map(s => ({ id: s.id, value: s.name, label: s.name })));
      // @ts-ignore
      setStatesOptions(states.map(s => ({ id: s.id, value: s.name, label: s.name })));

      setSales(orders);
      setFilteredSales(orders);
      // @ts-ignore
      setTotalEarned(formatToBrl(orders.reduce((a, v) => a + +v.total_value, 0).toFixed(2)))
      setCurrentPage(+current_page);
      setLastPage(+last_page);

      // setCurrentPage(+current_page);
      // setLastPage(+last_page);
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  const fetchCities = useCallback(async (id: string) => {
    try {
      setLoadingCities(true);
      setStateId(id)

      const {
        data: {
          data
        }
      } = await api.get(`/country_cities/${id}`);

      console.log('a', data);
      // @ts-ignore
      setCityOptions(data.map(s => ({ id: s.id, value: s.name, label: s.name })));
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoadingCities(false);
    }
  }, []);

  const handlePagination = useCallback(async (page: number, search: string) => {
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
          data: { data, meta: { current_page, last_page } }
        }
      } = await api.get(`/orders?paginated=true&page=${page}&per_page=${perPage}`, request);

      const formattedData = !!sortingField ? sortByField(data, sortingField) : data;


      setFilteredSales(formattedData);
      if (isNotEmpty(search)) {
        setSearchCurrentPage(+current_page);
        setSearchLastPage(+last_page);
      }
      else {
        setSales(formattedData)
        setCurrentPage(+current_page);
        setLastPage(+last_page);
      }
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [perPage, sales])

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if (sortingField.includes(value)) {
      setFilteredSales(sales.reverse());

      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if (type === 'string')
      setFilteredSales(prev => sortByField(prev, value));
    else {
      setFilteredSales(prev => sortNumberFields(prev, value));
    }
    setSortingField(value);
  }, [sales, sortingField]);

  const currentIcon = useCallback((status: string) => {
    switch (status) {
      case 'Novo':
        return <NewIcon />;
      case 'Recebido':
        return <ReceivedIcon />;
      case 'Transmitido':
        return <NewIcon />;
      case 'Faturado':
        return <PaidIcon />;
      case 'Pausado':
        return <PausedIcon />;
      case 'Cancelado':
        return <CancelledIcon style={{ height: '0.5rem' }} />;
      default:
        return <TruckIcon />
    }
  }, [])

  const handleFilterStatus = useCallback(async () => {
    if (!hasFiltered) {
      setIsFilterModalOpen(true);
      return;

    }
    setFilteredEarned(totalEarned);
    setStartPeriod(null);
    setEndPeriod(null);

    setFilteredSales(sales)

    setHasFiltered(false);
  }, [sales, totalEarned, hasFiltered]);

  const usingSafari = useMemo(() => isOnSafari, []);

  const filterMessage = useMemo(() => {
    let message = '';

    if (hasFiltered && !!startPeriod && !endPeriod) {
      message = ` | DESDE ${new Date(startPeriod).toLocaleDateString('pt-BR')}`;
    }

    if (hasFiltered && !!endPeriod && !startPeriod) {
      message = ` | ATÉ ${new Date(endPeriod).toLocaleDateString('pt-BR')}`;
    }

    if (hasFiltered && !!startPeriod && !!endPeriod) { // @ts-ignore
      message = ` | ${new Date(startPeriod).toLocaleDateString('pt-BR')} - ${new Date(endPeriod).toLocaleDateString('pt-BR')}`;
    }

    return message;
  }, [hasFiltered, startPeriod, endPeriod]);

  useEffect(() => {
    fetchData();
  }, [])

  const { currentPageValue, lastPageValue } = useMemo(() => ({
    currentPageValue: isNotEmpty(search) ? searchCurrentPage : currentPage,
    lastPageValue: isNotEmpty(search) ? searchLastPage : lastPage,
  }), [search, searchCurrentPage, currentPage, lastPage, searchLastPage])

  return (
    <>
      <Header route={['Loja Online', 'Vendas']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <TableHeader>
            <SearchBox
              search={handleSearch}
              placeholder="Informe o código da compra..."
              onClear={() => {
                setSearch('');
                setFilteredSales(sales)
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
            </div>
          </TableHeader>
          <CustomSectionTitle>
            {filteredSales.length} Vendas (TODOS){filterMessage}
          </CustomSectionTitle>
          {loading ?
            <LoadingContainer content="as vendas" /> :
            <>
              <Table isOnSafari={usingSafari}>
                <colgroup>
                  <col span={1} style={{ width: '8%' }} />
                  <col span={1} style={{ width: '12%' }} />
                  <col span={1} style={{ width: '18%' }} />
                  <col span={1} style={{ width: '15%' }} />
                  <col span={1} style={{ width: '15%' }} />
                  <col span={1} style={{ width: '14%' }} />
                  <col span={1} style={{ width: '10%' }} />
                  <col span={1} style={{ width: '8%' }} />
                </colgroup>
                <thead>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('code') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'code' })}
                    >
                      Código
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('client_name') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'client_name' })}
                    >
                      Cliente
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('supplier_name') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'supplier_name' })}
                    >
                      Fornecedor
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('address_city') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'address_city' })}
                    >
                      Cidade
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('formated_date') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'formated_date' })}
                    >
                      Data
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('total_value') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'total_value' })}
                    >
                      Valor
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('status') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'status' })}
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
                  {filteredSales.map((p) => (
                    <tr key={p.code}>
                      <td
                        style={{ padding: '0 0.625rem' }}
                      >
                        <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                          {p.code ?? '---'}
                        </TableTitle>
                      </td>
                      <td
                        style={{ padding: '0 0.625rem' }}
                      >
                        <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                          {p.client_name ?? '---'}
                        </TableTitle>
                      </td>
                      <td>
                        <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                          {p.supplier_name ?? '---'}
                        </TableTitle>
                      </td>
                      <td>
                        <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                          {p.address_city ?? '---'}
                        </TableTitle>
                      </td>
                      <td>
                        <TableDateBox
                          name=""
                          title=""
                          width="8rem"
                          // @ts-ignore
                          date={p.date}
                          onDateSelect={() => { }}
                          disabled
                          validated={false}
                        />
                      </td>
                      <td style={{ padding: '0 0.625rem' }}>
                        <MeasureBox
                          name="etaSupplier"
                          title=""
                          noTitle
                          validated
                          measure="R$"
                          // @ts-ignore
                          defaultValue={formatToBrl(p.total_value).substring(3)}
                          width="7.5rem"
                          disabled
                        />
                      </td>
                      <td>
                        <Badge status={p.current_status}>
                          {currentIcon(p.current_status)}
                          <p>{p.current_status === 'Recebido' ? 'Liberado' : p.current_status}</p>
                        </Badge>
                      </td>
                      <td>
                        <div>
                          <TableActionButton
                            onClick={() => handleEditSale(p)}
                            loading={loadingSale === p.code}
                          >
                            {loadingSale === p.code ?
                              <LoadingIcon /> :
                              <ViewIcon />
                            }
                          </TableActionButton>
                          <TableActionButton onClick={() => { }}>
                            <PrintIcon />
                          </TableActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <SalesTableFooter>
                {/* <button onClick={clearCampaigns}>Excluir</button> */}
                <p>{filteredSales.length} vendas&nbsp;<p>{hasFiltered ? filteredEarned : totalEarned}</p>&nbsp;/ {sales.length} vendas no total&nbsp;<p>{totalEarned}</p></p>
                <Pagination
                  currentPage={currentPageValue}
                  lastPage={lastPageValue}
                  setCurrentPage={(page: number) => handlePagination(page, search)}
                />
              </SalesTableFooter>
            </>
          }
        </Container>
      </MenuAndTableContainer>
      <Modal
        title="Filtro de Vendas"
        isModalOpen={isFilterModalOpen}
        setIsModalOpen={setIsFilterModalOpen}
      >
        <Form ref={filterFormRef} onSubmit={() => { }}>
          <InputContainer style={{ marginTop: '1.875rem' }}>
            <Select
              title="Representada"
              placeholder="Selecione..."
              customWidth="12.5rem"
              data={suppliersOptions}
              setValue={(value: string, id: string) => setSupplierId(id)}
            />
            <Select
              title="Vendedor"
              customWidth="12.5rem"
              data={sellersOptions}
              setValue={(value: string, id: string) => setSellerId(id)}
            />
          </InputContainer>
          <InputContainer>
            <Select
              title="Grupo"
              placeholder="Selecione..."
              customWidth="12.5rem"
              data={groupsOptions}
              setValue={(value: string, id: string) => setGroupId(id)}
            />

            <FormSelect
              name="current_status"
              title="Status do Pedido"
              placeholder="Selecione..."
              customWidth="12.375rem"
              badge
              data={[
                { value: 'Todos', label: 'Todos' },
                { value: 'Novo', label: 'Novo' },
                { value: 'Recebido', label: 'Liberado' },
                { value: 'Transmitido', label: 'Transmitido' },
                { value: 'Faturado', label: 'Faturado' },
                { value: 'Pausado', label: 'Pausado' },
                { value: 'Cancelado', label: 'Cancelado' },
              ]}
             onChange={(value: string) =>setCurrentStatus(value)}
            />
            
          </InputContainer>
          <InputContainer>
            <StaticDateBox
              name=""
              title="Período Inicial"
              width="10.5rem"
              // @ts-ignore
              date={startPeriod}
              // @ts-ignore
              onDateSelect={setStartPeriod}
              validated={false}
              noMinDate
            />
            <StaticDateBox
              name=""
              title="Período Final"
              width="10.5rem"
              // @ts-ignore
              date={endPeriod}
              // @ts-ignore
              onDateSelect={setEndPeriod}
              validated={false}
              noMinDate
            />
          </InputContainer>
          <InputContainer>
            <Select
              title="Estados"
              customWidth="12.5rem"
              data={statesOptions}
              disabled={loadingCities}
              setValue={(value: string, id: string) => fetchCities(id)}
            />
            <Select
              title="Cidade"
              placeholder="Selecione..."
              customWidth="12.5rem"
              disabled={!stateId || loadingCities}
              data={cityOptions}
              setValue={(value: string, id: string) => setCityId(id)}
            />

          </InputContainer>
          <Button
            type="button"
            onClick={handleFilterProducts}
            style={{ marginTop: '3.125rem', width: '100%' }}
          >
            {loading ? <LoadingIcon className="load" /> : 'Filtrar Vendas'}
          </Button>
        </Form>
      </Modal>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
