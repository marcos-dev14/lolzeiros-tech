import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { ReactComponent as EditIcon } from '~assets/edit1.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg';
import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Pagination } from '~components/Pagination';
import { SearchBox } from '~components/SearchBox';
import { CustomSelect as Select } from '~components/Select';

import { Container, Table, TableHeader, Button } from './styles';
import { InputContainer, MenuAndTableContainer } from '~styles/components';

import {
  TableFooter,
  TableActionButton,
  TableTitle,
  TableSortingHeader
} from '~styles/components/tables';

import { api } from '~api';

import { MainClientGroup, DefaultValuePropsWithId, IBaseType } from '~types/main';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { isNotEmpty, isOnSafari } from '~utils/validation';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { Input } from '@/src/components/Input';
import { useRegister } from '@/src/context/register';
import { Modal } from '@/src/components/Modal';
import { CheckBox } from '@/src/components/CheckBox';
import { SuccessModal } from '@/src/components/SuccessModal';
import { ConfirmationModal } from '@/src/components/ConfirmationModal';

export function ClientGroups() {
  const { push } = useHistory();
  
  const { setClientGroup } = useRegister();
  
  const formRef = useRef<FormHandles>(null)
  const filterFormRef = useRef<FormHandles>(null)
  
  const [clients, setClients] = useState<MainClientGroup[]>([]);
  const [fullClients, setFullClients] = useState<MainClientGroup[]>([]);
  const [filteredClients, setFilteredClients] = useState<MainClientGroup[]>([]);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(50);
  
  const [searchCurrentPage, setSearchCurrentPage] = useState<number>(1);
  const [searchLastPage, setSearchLastPage] = useState<number>(1);
  
  const [isOpen, setIsOpen] = useState(-1);

  const [hasBuyer, setHasBuyer] = useState("Todos");
  
  const [loading, setLoading] = useState(true);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [sortingField, setSortingField] = useState('');

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [deletingAddress, setDeletingAddress] = useState(-1)
  
  
  const [search, setSearch] = useState('');

  // const handleSearch = useCallback((search: string) => {    
  //   // setFilteredClients(clients.filter(
  //   //   (r) => r.reference.toLowerCase().includes(search.toLowerCase())
  //   // ));

  //   setHasSearch(isNotEmpty(search));
  // }, [clients]);

  const handleSearch = useCallback(async (search: string) => {    
    try {
      setLoading(true);

      const {
        data: {
          data: { data: clients, meta: { current_page, last_page } }
        }
      } =  await api.get(`/clients/groups?paginated=true&per_page=${perPage}`, {
        params: {
          search: search.toLowerCase()
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

      const params = {};

      if(isNotEmpty(search)) { // @ts-ignore
        params['reference'] = search.toLowerCase()
      }
       
      if(hasBuyer !== 'Todos') { // @ts-ignore
        params['has_buyer'] = hasBuyer === 'Sim';
      }
      // @ts-ignore
      console.log('params', params)
   
      const {
        data: {
          data: { data: results, meta: { current_page, last_page }
        }
      }
      } = await api.get(`clients/groups?paginated=true&per_page=${perPage}`, {
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
  }, [perPage, hasBuyer, search]);

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
      } = await api.get(`clients/groups?paginated=true&per_page=${perPage}&page=${page}`, request);

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
    if(!hasFiltered) {
      setIsFilterModalOpen(true)
      return;
    }
    await handlePagination(1)
    setHasFiltered(false);
  }, [hasFiltered])

  useEffect(() => {
    fetchData();
  }, []);

  const { currentPageValue, lastPageValue } = useMemo(() => ({
    currentPageValue: hasFiltered || isNotEmpty(search) ? searchCurrentPage : currentPage,
    lastPageValue: hasFiltered || isNotEmpty(search) ? searchLastPage : lastPage,
  }), [hasFiltered, search, searchCurrentPage, currentPage, lastPage, searchLastPage])

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if(sortingField.includes(value)) {
      setFilteredClients(clients.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if(type === 'string')
      setFilteredClients(prev => sortByField(prev, value));
    else {
      setFilteredClients(prev => sortNumberFields(prev, value));
    }
    setSortingField(value);
  }, [clients, sortingField]);

  const handleEditClient = useCallback(async (client: MainClientGroup) => {
    try {
      const {
        data: { data }
      } = await api.get(`/clients/groups/${client.id}`);
      
      setClientGroup(data);
      push('/register/clients/groups/new');
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao editar o cliente.';

      setError(errorMessage);
    }
  }, [setClientGroup, push]);

  const handleDeleteClientGroup = useCallback(async () => {
    try {
      await api.delete(`/clients/groups/${deletingAddress}`);
  
      setFilteredClients(prev => prev.filter(g => g.id !== deletingAddress));
    } catch(e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao atualizar o cliente.';

      setError(errorMessage);
    } finally {
      setDeletingAddress(-1);
    }
  }, [deletingAddress]);

  const usingSafari = useMemo(() => isOnSafari, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: {
          data: { data: fullClients, meta: { current_page, last_page } }
        }
      } = await api.get(`/clients/groups?paginated=true&per_page=${perPage}`);

      setClients(fullClients);
      setFullClients(fullClients);
      setFilteredClients(fullClients);

      setCurrentPage(current_page);
      setLastPage(last_page);
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  useEffect(() => {
    setClientGroup(null as unknown as MainClientGroup);
  }, [])

  console.log("f", filteredClients)

  return (
    <>
      <Header route={['Cadastro', 'Cliente', 'Grupos']} />
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
                onChange={(e)=> setPerPage(e.target.value)}
                // @ts-ignore
                onBlur={(e)=> (e.target.value <= 0 || isNaN(e.target.value)) && setPerPage(50)}
              />
              <Button
                onClick={handleFilterStatus}
                disabled={loading}
                // disabled
              >
                {hasFiltered ? 'Limpar Filtro' : 'Filtro'}
              </Button>
              <Button
                className="newProduct"
                onClick={() => push('/register/clients/groups/new')}
                disabled={loading}
              >
                Novo Grupo
              </Button>
            </div>
          </TableHeader>
          {loading ?
            <LoadingContainer
              content="os grupos"
            /> :
          <>
            <Table isOnSafari={usingSafari}>
            <colgroup>
              <col span={1} style={{ width: '36%' }} />
              <col span={1} style={{ width: '20%' }} />
              <col span={1} style={{ width: '20%' }} />
              <col span={1} style={{ width: '16%' }} />
              <col span={1} style={{ width: '8%' }} />
            </colgroup>
            <thead>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('name') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'name' })}
                >
                  Nome do Grupo
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('document') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'document' })}
                >
                  Nome do Comprador
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('document') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'document' })}
                >
                  Email do Comprador
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('count_clients') ? sortingField : 'asc'}
                  onClick={() =>
                    handleSortingByField({ value: 'count_clients', type: 'number' })
                  }
                >
                  Total de Clientes
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
                  <td>
                    <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                      {p.name}
                    </TableTitle>
                  </td>
                  <td>
                    <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                      {!!Object.values(p.buyer).length ? p.buyer.name : ''}
                    </TableTitle>
                  </td>
                  <td>
                    <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                      {!!Object.values(p.buyer).length ? p.buyer.email : ''}
                    </TableTitle>
                  </td>
                  <td>
                    <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                      {p.count_clients}
                    </TableTitle>
                  </td>
                  <td>
                    <div>
                      <TableActionButton
                        onClick={() => handleEditClient(p)}
                        // disabled={revalidating === p.id}
                      >
                        <EditIcon />
                      </TableActionButton>
                      <TableActionButton
                        onClick={() => setDeletingAddress(p.id)}
                        // disabled={updatingAvailability === p.id}
                        disabled={!!p.count_clients}
                      >
                        <TrashIcon />
                      </TableActionButton>
                      {/* <TableActionButton
                        onClick={() => handleRevalidate(p.id)}
                        disabled={revalidating === p.id}
                        loading={revalidating === p.id}
                      >
                        <LoadingIcon stroke="#767778" style={{ height: '1.25rem', marginTop: '0.25rem' }} height="24px"/>
                      </TableActionButton> */}
                    </div>
                  </td>
                </tr>
                </Fragment>
              ))}
            </tbody>
          </Table>
          <TableFooter>
            {/* <button onClick={clearProducts}>Excluir</button> */}
            <p>{(isNotEmpty(search) || hasFiltered) ? filteredClients.length : fullClients.length} Grupos</p>
            <Pagination
              currentPage={currentPageValue}
              lastPage={lastPageValue}
              setCurrentPage={handlePagination}
            />
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
        <Form ref={filterFormRef} onSubmit={() => {}}>
          <InputContainer style={{ marginTop: '1.875rem' }}>
            <Select
              title="Tem comprador"
              placeholder="Selecione..."
              customWidth="12.5rem"
              defaultValue={
                { value: 'Todos', label: 'Todos' }
              }
              data={[
                { value: 'Todos', label: 'Todos' },
                { value: 'Sim', label: 'Sim' },
                { value: 'Não', label: 'Não' }
              ]}
              // @ts-ignore
              setValue={(v) => setHasBuyer(v)}
            />
          </InputContainer>
          <Button
            onClick={handleFilterClients}
            type="button"
            style={{ marginTop: '3.125rem', width: '100%' }}
            disabled={loading}
          >
            {loading ? <LoadingIcon className="load" /> : 'Filtrar Grupos'}
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
      <ConfirmationModal
        category={deletingAddress !== -1 ? 'Grupo' : ''}
        action={handleDeleteClientGroup}
        style={{ marginTop: 0 }}
        setIsModalOpen={() => 
          setDeletingAddress(-1)
        }
      />
    </>
  );
}
