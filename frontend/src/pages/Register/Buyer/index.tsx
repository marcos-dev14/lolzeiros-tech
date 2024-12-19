import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as EditIcon } from '~assets/edit1.svg'
import { ReactComponent as BagIcon } from '~assets/bag1.svg';
import { ReactComponent as BagXIcon } from '~assets/bagx1.svg';
import { ReactComponent as EmailIcon } from '~assets/email.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg'

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Pagination } from '~components/Pagination';
import { SearchBox } from '~components/SearchBox';
import { PhoneBox } from '~components/PhoneBox';
import { CustomSelect as Select } from '~components/Select';

import { Container, Table, TableHeader, Button } from './styles';
import { MenuAndTableContainer, SectionTitle } from '~styles/components';

import {
  TableFooter,
  TableActionButton,
  TableTitle,
  TableSortingHeader
} from '~styles/components/tables';

import { api } from '~api';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { capitalizeContent, isNotEmpty, isOnSafari, validatePhone } from '~utils/validation';

import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';

import { StaticSocialBox } from '@/src/components/StaticSocialBox';
import { SiteBox } from '@/src/components/SiteBox';
import { IBuyer } from '@/src/types/main';
import { ConfirmationModal } from '@/src/components/ConfirmationModal';
import { useRegister } from '@/src/context/register';
import { Input } from '@/src/components/Input';

export function Buyer() {
  const { setBuyer } = useRegister();
  const { push } = useHistory();
      
  const [buyers, setBuyers] = useState<IBuyer[]>([]);
  const [filteredBuyers, setFilteredBuyers] = useState<IBuyer[]>([]);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(50);

  const [searchCurrentPage, setSearchCurrentPage] = useState<number>(1);
  const [searchLastPage, setSearchLastPage] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(-1);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [error, setError] = useState('');

  const [updatingAvailability, setUpdatingAvailability] = useState(-1);
  const [deletingBuyer, setDeletingBuyer] = useState(-1);

  const [sortingField, setSortingField] = useState('');  
  
  const [search, setSearch] = useState('');

  const handleSearch = useCallback(async (search: string) => {
    try {
      setLoading(true);

      const {
        data: {
          data: { data: buyers, meta: { current_page, last_page } }
        }
      } =  await api.get(`/buyers?paginated=true&per_page=${perPage}`, {
        params: {
          name: search.toLowerCase(),
        }
      });

      const formattedBuyers = !!sortingField ? sortByField(buyers, sortingField) : buyers;

      setFilteredBuyers(formattedBuyers);

      setSearchCurrentPage(current_page);
      setSearchLastPage(last_page);

      setSearch(search);
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoading(false);
    }
  }, [sortingField, perPage]);

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
      } = await api.get(`/buyers?paginated=true&per_page=${perPage}&page=${page}`, request);

      const formattedData = !!sortingField ? sortByField(data, sortingField) : data;

      setFilteredBuyers(formattedData);

      if (isNotEmpty(search)) {
        setSearchCurrentPage(+current_page);
        setSearchLastPage(+last_page);  
      }
      else {
        setBuyers(formattedData)
        setCurrentPage(+current_page);
        setLastPage(+last_page);
      }
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [sortingField, perPage]);

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if(sortingField.includes(value)) {
      setFilteredBuyers(buyers.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if(type === 'string') {
      setFilteredBuyers(prev => sortByField(prev, value));
      setBuyers(prev => sortByField(prev, value));
    }
    else {
      setFilteredBuyers(prev => sortNumberFields(prev, value));
      setBuyers(prev => sortNumberFields(prev, value));
    }
    setSortingField(value);
  }, [buyers, sortingField]);

  const handleEditProduct = useCallback(async (buyer: IBuyer) => {
    try {
      setLoadingProduct(buyer.id);
      const {
        data: {
          data: updatedBuyer
        }
      } = await api.get(`/buyers/${buyer.id}`);
      
      setBuyer(updatedBuyer);
      push('/register/buyers/edit');
    } catch(e) {
      console.log('e', e);
    } finally {
      setLoadingProduct(-1);
    }
  }, [push, setBuyer]);

  const handleDeleteBuyer = useCallback(async (id: number) => {
    try {
      setDeletingBuyer(id);
      await api.delete(`/buyers/${id}`);

      // @ts-ignore
      setFilteredBuyers(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      console.log('e', e);
    } finally {
      setDeletingBuyer(-1);
    }
  }, []);

  const handleSupplierAvailability = useCallback(async (id: number, active: number) => {
    try {
      setUpdatingAvailability(id);

      const {
        data: { data }
      } = await api.put(`/buyers/${id}`, {
        active
      });

      const currentProductIndex = filteredBuyers.findIndex(p => p.id === id);
      const tempProducts = [...filteredBuyers];
  
      tempProducts[currentProductIndex] = data;
      setFilteredBuyers(tempProducts);
    } catch(e) {
      console.log('e', e);
    } finally {
      setUpdatingAvailability(-1);
    }
  }, [filteredBuyers]);

  const usingSafari = useMemo(() => isOnSafari, []);

  const fetchBuyers = useCallback(async (setPerPage?: string) => {
    try {
      const {
        data: {
          data: { data: buyers, meta: { current_page, last_page } }
        }
      } = await api.get(`/buyers?paginated=true&per_page=${setPerPage ?? perPage}`);
      console.log('d', buyers);
      setFilteredBuyers(buyers);
      setBuyers(buyers);

      setCurrentPage(+current_page);
      setLastPage(+last_page);
    } catch (e) {
      console.log('e', e);
    }
  }, [perPage]);

  useEffect(() => {
    fetchBuyers();
    setBuyer(null as unknown as IBuyer)
  }, [])

  const { currentPageValue, lastPageValue } = useMemo(() => ({
    currentPageValue: isNotEmpty(search) ? searchCurrentPage : currentPage,
    lastPageValue: isNotEmpty(search) ? searchLastPage : lastPage,
  }), [search, searchCurrentPage, currentPage, lastPage, searchLastPage])

  return (
    <>
      <Header route={['Cadastro', 'Comprador']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <TableHeader>
            <SearchBox
              search={handleSearch}
              onClear={() => {
                setSearch('');
                setFilteredBuyers(buyers)
              }}
            />
            <div style={{ marginLeft: 'auto' }}>
              <Select
                title="Total de Resultados"
                customWidth="12rem"
                style={{ marginLeft: 'auto', marginRight: '1.25rem' }}
                defaultValue={{ value: '50', label: '50' }}
                // @ts-ignore
                setValue={(value)=> fetchBuyers(value)}
                data={[
                  { value: '10', label: '10' },
                  { value: '25', label: '25' },
                  { value: '50', label: '50' },
                  { value: '100', label: '100' }
                ]}
              />
              <Button
                className="newProduct"
                onClick={() => push('/register/buyers/new')}
                disabled={loading}
                >
                Novo Comprador
              </Button>
              </div>
          </TableHeader>
          {loading ?
            <LoadingContainer
              content="os compradores"
            /> :
            <>
            <Table isOnSafari={usingSafari}>
              <colgroup>
                <col span={1} style={{ width: '31%' }} />
                <col span={1} style={{ width: '15%' }} />
                <col span={1} style={{ width: '21%' }} />
                <col span={1} style={{ width: '25%' }} />
                <col span={1} style={{ width: '08%' }} />
              </colgroup>
              <thead>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('name') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'name' })}
                  >
                    Nome do Comprador
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
                    dir={sortingField.includes('product') ? sortingField : 'asc'}
                    // onClick={() => handleSortingByField({ value: 'product' })}
                    onClick={() => {}}
                  >
                    Grupo
                    {/* <SortIcon /> */}
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('email') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'email' })}
                  >
                    Email
                    <SortIcon />
                  </TableSortingHeader> 
                </th>
                <th>
                  Ação
                </th>
              </thead>
              <tbody>
                {filteredBuyers.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <TableTitle fontSize="0.75rem" lineHeight="0.8125rem">
                        {capitalizeContent(p.name)}
                      </TableTitle>
                    </td>
                    <td>
                      {!!p.cellphone ? validatePhone(p.cellphone) : '---'}
                    </td>
                    <td>
                      {!!p.group ? p.group.name : '---'}
                    </td>
                    <td>
                      <TableTitle fontSize="0.75rem" lineHeight="0.8125rem">
                        {p.email}
                      </TableTitle>
                    </td>
                    <td>
                      <div>
                        <TableActionButton
                          // onClick={() => push()}
                          onClick={() => handleEditProduct(p)}
                          loading={loadingProduct === p.id}
                        >
                          {loadingProduct === p.id ?
                            <LoadingIcon /> : 
                            <EditIcon />  
                          }
                        </TableActionButton>
                        <TableActionButton
                          onClick={() => handleSupplierAvailability(p.id, Number(!p.active))}
                          disabled={updatingAvailability === p.id}
                        >
                          {!!p.active ? <BagIcon /> : <BagXIcon />}
                        </TableActionButton>
                        {!!p.can_be_deleted &&
                          <TableActionButton
                            onClick={() => 
                              setDeletingBuyer(p.id)
                            }
                            disabled={deletingBuyer === p.id}
                          >
                            <TrashIcon />
                          </TableActionButton>
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <TableFooter>
              <p>{(isNotEmpty(search) || hasFiltered) ? filteredBuyers.length : buyers.length} Compradores</p>
              <Pagination
                currentPage={currentPageValue}
                lastPage={lastPageValue}
                setCurrentPage={(page: number) => handlePagination(page, search)}
              />
            </TableFooter>
           </>
          }
        </Container>
      </MenuAndTableContainer>
      <ConfirmationModal
        category={deletingBuyer !== -1 ? 'conta' : ''}
        action={() => handleDeleteBuyer(deletingBuyer)}
        style={{ marginTop: 0 }}
        setIsModalOpen={() => 
          setDeletingBuyer(-1)
        }
      />
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
