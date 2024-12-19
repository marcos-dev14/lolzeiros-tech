import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { FormHandles } from '@unform/core';

import { ReactComponent as EditIcon } from '~assets/edit1.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg';
import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';
import { ReactComponent as CollapseIcon } from '~assets/collapse.svg'
import { ReactComponent as ExpandIcon } from '~assets/expand_gray.svg'

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Pagination } from '~components/Pagination';
import { SearchBox } from '~components/SearchBox';

import { Container, Table, TableHeader, Button, DropdownRowContent, DropdownRowContentInfo, TagContainer, Tag } from './styles';
import { MenuAndTableContainer } from '~styles/components';

import {
  TableFooter,
  TableActionButton,
  TableTitle,
  TableSortingHeader
} from '~styles/components/tables';

import { api } from '~api';

import { IShipping, MainClient } from '~types/main';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { capitalizeContent, isNotEmpty, isOnSafari } from '~utils/validation';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { useRegister } from '@/src/context/register';
import { Input } from '@/src/components/Input';

export function Shipping() {
  const { push } = useHistory();
  
  const { setShippingCompany } = useRegister();
    
  const [shippingCompanies, setShippingCompanies] = useState<IShipping[]>([]);
  const [filteredShippingCompanies, setFilteredShippingCompanies] = useState<IShipping[]>([]);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(50);
  
  const [searchCurrentPage, setSearchCurrentPage] = useState<number>(1);
  const [searchLastPage, setSearchLastPage] = useState<number>(1);
  
  const [isOpen, setIsOpen] = useState(-1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [loadingShippingCompany, setLoadingShippingCompany] = useState(-1);
  const [isDeleting, setIsDeleting] = useState(-1);

  const [sortingField, setSortingField] = useState('');
  
  const [search, setSearch] = useState('');

  const handleSearch = useCallback(async (search: string) => {    
    try {
      setLoading(true);

      const {
        data: {
          data: { data: shipping_companies, meta: { current_page, last_page } }
        }
      } =  await api.get(`/shipping_companies?paginated=true&perPage=${perPage}`, {
        params: {
          name: search.toLowerCase()
        }
      });

      const formattedShippingCompanies = !!sortingField ? sortByField(shipping_companies, sortingField) : shipping_companies;

      setFilteredShippingCompanies(formattedShippingCompanies);

      setSearchCurrentPage(current_page);
      setSearchLastPage(last_page);

      setSearch(search);
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { // @ts-ignore
        data: {
          data: { data: fullShippingCompanies, meta: { current_page, last_page } }
        }
      } = await api.get(`shipping_companies?paginated=true&per_page=${perPage}`);

      setShippingCompanies(fullShippingCompanies); // pro delete
      setFilteredShippingCompanies(fullShippingCompanies); // pro delete

      setCurrentPage(+current_page);
      setLastPage(+last_page);
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [perPage]);

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
          data: { data: shipping_companies, meta: { current_page, last_page } }
        }
      } = await api.get(`shipping_companies?paginated=true&page=${page}&per_page=${perPage}`, request);

      const formattedShippingCompanies = !!sortingField ? sortByField(shipping_companies, sortingField) : shipping_companies;

      setFilteredShippingCompanies(formattedShippingCompanies);
      
      if (isNotEmpty(search)) {
        setSearchCurrentPage(+current_page);
        setSearchLastPage(+last_page);  
      }
      else {
        setShippingCompanies(formattedShippingCompanies)
        setCurrentPage(+current_page);
        setLastPage(+last_page);
      }
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [sortingField, search, perPage])

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setShippingCompany(null as unknown as IShipping);
  }, []);

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if(sortingField.includes(value)) {
      setFilteredShippingCompanies(shippingCompanies.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if(type === 'string') 
      setFilteredShippingCompanies(prev => sortByField(prev, value));
    else 
      setFilteredShippingCompanies(prev => sortNumberFields(prev, value));

    setSortingField(value);
  }, [shippingCompanies, sortingField]);

  const handleEditShippingCompany = useCallback(async (company: IShipping) => {
    try {
      setLoadingShippingCompany(company.id);
      // const {
      //   data: { data }
      // } = await api.get(`/shipping_companies/${company.id}`);
      
      // setShippingCompany(data);
      setShippingCompany(company);
      push('/register/shipping/new');
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoadingShippingCompany(-1);
    }
  }, [setShippingCompany, push]);

  const handleDeleteShippingCompany = useCallback(async (id: number) => {
    try {          
      setIsDeleting(id);
      
      await api.delete(`/shipping_companies/${id}`);
      let updatedShippingCompanies = 
        shippingCompanies.filter(s => s.id !== id);

      setShippingCompanies(updatedShippingCompanies);
      setFilteredShippingCompanies(updatedShippingCompanies);
    } catch(e) {
      console.log('e', e);
    } finally {
      setIsDeleting(-1);
    }
  }, [shippingCompanies]);

  const usingSafari = useMemo(() => isOnSafari, []);

  useEffect(() => {
    setShippingCompany(null as unknown as IShipping);
  }, [])

  const { currentPageValue, lastPageValue } = useMemo(() => ({
    currentPageValue: isNotEmpty(search) ? searchCurrentPage : currentPage,
    lastPageValue: isNotEmpty(search) ? searchLastPage : lastPage,
  }), [search, searchCurrentPage, currentPage, lastPage, searchLastPage])

  return (
    <>
      <Header route={['Cadastro', 'Transportadora']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <TableHeader>
            <SearchBox
              search={handleSearch}
              onClear={() => {
                setSearch('');
                setFilteredShippingCompanies(shippingCompanies);
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
                onClick={() => push('/register/shipping/new')}
                disabled={loading}
                >
                Nova Transportadora
              </Button>
              </div>
          </TableHeader>
          {loading ?
            <LoadingContainer
              content="as transportadoras"
            /> :
          <>
            <Table isOnSafari={usingSafari}>
            <colgroup>
              <col span={1} style={{ width: '24%' }} />
              <col span={1} style={{ width: '13%' }} />
              <col span={1} style={{ width: '13%' }} />
              <col span={1} style={{ width: '19%' }} />
              <col span={1} style={{ width: '23%' }} />
              <col span={1} style={{ width: '8%' }} />
            </colgroup>
            <thead>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('company_name') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'company_name' })}
                >
                  Nome da Transportadora
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('phone') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'phone' })}
                >
                  Fixo
                  <SortIcon />
                </TableSortingHeader>
                </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('cellphone') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'cellphone' })}
                >
                  Celular
                  <SortIcon />
                </TableSortingHeader>
                </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('email') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'email' })}
                >
                  E-mail
                  <SortIcon />
                </TableSortingHeader>
                </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('country_state_name') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'country_state_name' })}
                >
                  Estado
                  <SortIcon />
                </TableSortingHeader>
                </th>
              <th>Ação</th>
            </thead>
            <tbody>
              {filteredShippingCompanies.map(p => (
                <tr
                  key={p.id}
                  style={{
                    backgroundColor:
                      isOpen === p.id ? '#F4F5F8' : '#fff'
                  }}
                >
                  <td>{capitalizeContent(p.company_name)}</td>
                  <td>{p.phone ?? '---'}</td>
                  <td>{p.cellphone ?? '---'}</td>
                  <td>{p.email ?? '---'}</td>
                  <td style={{ padding: '0 0.625rem' }}>
                    {!!p.country_state ? p.country_state.name : ''}
                  </td>
                  <td>
                    <div>
                      <TableActionButton
                        onClick={() => handleEditShippingCompany(p)}
                        loading={loadingShippingCompany === p.id}
                      >
                        {loadingShippingCompany === p.id ?
                          <LoadingIcon /> : 
                          <EditIcon />
                        }
                      </TableActionButton>
                      <TableActionButton
                        onClick={() => handleDeleteShippingCompany(p.id)}
                        disabled={isDeleting === p.id}
                      >
                        <TrashIcon />
                      </TableActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <TableFooter>
            {/* <button onClick={clearProducts}>Excluir</button> */}
            <p>{isNotEmpty(search) ? filteredShippingCompanies.length : shippingCompanies.length} Transportadoras</p>
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
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
