import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as ViewIcon } from '~assets/view1.svg';
import { ReactComponent as BagIcon } from '~assets/bag1.svg';
import { ReactComponent as BagXIcon } from '~assets/bagx1.svg';
import { ReactComponent as SortIcon } from '~assets/sort.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Pagination } from '~components/Pagination';
import { TableDateBox } from '~components/TableDateBox';

import { Container, Table } from './styles';
import {
  MenuAndTableContainer,
  SectionTitle,
} from '~styles/components';

import {
  TableFooter,
  TableActionButton,
  TableSortingHeader
} from '~styles/components/tables';

import { Supplier } from '~types/main';
import { sortByField, sortNumberFields } from '~utils/sorting';
import { api } from '~api';
import { useProduct } from '~context/product';
import { isOnSafari } from '@/src/utils/validation';
import { LoadingContainer } from '@/src/components/LoadingContainer';

export function Products() {
  const { push } = useHistory();
  const { setSupplier } = useProduct();
  
  const [suppliers, setSuppliers] = useState<Supplier[]>([] as Supplier[]);
  const [error, setError] = useState('');
  const [sortingField, setSortingField] = useState('');
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  
  const [updatingAvailability, setUpdatingAvailability] = useState(-1);

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: {
          data: { data, meta: { last_page } }
        }
      } = await api.get('products/suppliers', {
        params: {
          paginated: true,
          page: currentPage
        }
      });

      setSuppliers(data);
      setLastPage(last_page);
    } catch (error) {
      console.log('error', error)
      // if(error.response) - verifique sua conexão com a internet
      setError('Aconteceu um erro');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if(sortingField.includes(value)) {
      setSuppliers(suppliers.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if(type === 'string')
      setSuppliers(prev => sortByField(prev, value));
    else {
      setSuppliers(prev => sortNumberFields(prev, value));
    }
    setSortingField(value);
  }, [suppliers, sortingField]);

  const handleSupplierAvailability = useCallback(async (id: number, status: boolean) => {
    try {
      setUpdatingAvailability(id);
      const upload = new FormData();

      upload.append('is_available', status ? '1' : '0');

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}?_method=PUT`, upload);

      const currentSupplierIndex = suppliers.findIndex(s => s.id === id);
      const tempSuppliers = [...suppliers];

      tempSuppliers[currentSupplierIndex] = data;
      setSuppliers(tempSuppliers);
    } catch(e) {
      console.log('e', e);
    } finally {
      setUpdatingAvailability(-1);
    }
  }, [suppliers]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const usingSafari = useMemo(() => isOnSafari, []);

  return (
    <>
      <Header route={['Loja Online', 'Produtos']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <SectionTitle>
            Selecione a Representada
          </SectionTitle>
          {loading ?
            <LoadingContainer
              content="as representadas"
            /> :
          <>
            <Table isOnSafari={usingSafari}>
            <colgroup>
              <col span={1} style={{ width: '34%' }} />
              <col span={1} style={{ width: '9%' }} />
              <col span={1} style={{ width: '9%' }} />
              <col span={1} style={{ width: '9%' }} />
              <col span={1} style={{ width: '15%' }} />
              <col span={1} style={{ width: '15%' }} />
              <col span={1} style={{ width: '9%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('name') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'name' })}
                  >
                    Representada
                    <SortIcon />
                  </TableSortingHeader>
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('categories_count') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'categories_count', type: 'number'})}
                  >
                    Categorias
                    <SortIcon />
                  </TableSortingHeader>
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('products_count') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'products_count', type: 'number' })}
                  >
                    Produtos
                    <SortIcon />
                  </TableSortingHeader>
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('products_available_count') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'products_available_count', type: 'number' })}
                  >
                    Disponível
                    <SortIcon />
                  </TableSortingHeader>
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('last_imported_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'last_imported_at' })}
                  >
                    Últ. Importação
                    <SortIcon />
                  </TableSortingHeader>
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Atualização
                    <SortIcon />
                  </TableSortingHeader>
                </th>
                <th>
                  Ação
                </th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) =>
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.categories_count}</td>
                  <td>{s.products_count}</td>
                  <td>{s.products_available_count}</td>
                  <td style={{ padding: '0 0.625rem' }}>
                    {!!s.last_imported_at ? 
                      <TableDateBox
                        name="Data da Última Importação"
                        width="8rem"
                        date={new Date(s.last_imported_at)}
                        onDateSelect={() => {}}
                        disabled
                        validated
                      /> :
                      '---'
                   }
                  </td>
                  <td style={{ padding: '0 0.625rem' }}>
                    <TableDateBox
                      name="Data de Atualização"
                      width="8rem"
                      date={new Date(s.updated_at)}
                      onDateSelect={() => {}}
                      disabled
                      validated
                    />
                  </td>
                  <td>
                    <div>
                      <TableActionButton
                        onClick={() => {
                          push('/store/products/details');
                          setSupplier({ name: s.name, id: s.id });
                        }}
                      >
                        <ViewIcon />
                      </TableActionButton>
                      <TableActionButton
                        onClick={() => handleSupplierAvailability(s.id, !s.is_available)}
                        disabled={updatingAvailability === s.id}
                      >
                        {s.is_available ? <BagIcon /> : <BagXIcon />}
                      </TableActionButton>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <TableFooter>
            <p>{suppliers.length} Representadas</p>
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              setCurrentPage={setCurrentPage}
            />
          </TableFooter>
          </>
          }
        </Container>
      </MenuAndTableContainer>
    </>
  );
}
