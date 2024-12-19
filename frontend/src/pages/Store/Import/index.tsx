import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';

import { ReactComponent as ViewIcon } from '~assets/view1.svg';
import { ReactComponent as UploadIcon } from '~assets/upload.svg';
import { ReactComponent as SortIcon } from '~assets/sort.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { SearchBox } from '~components/SearchBox';
import { Pagination } from '~components/Pagination';
import { TableDateBox } from '~components/TableDateBox';

import { MenuAndTableContainer } from '~styles/components';
import {
  TableFooter,
  TableActionButton,
  TableTitle,
  TableSortingHeader
} from '~styles/components/tables';

import { Container, TableHeader, Table, Button } from './styles';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { api } from '@/src/services/api';
import { ITemplate } from '@/src/types/main';
import { useAuth } from '@/src/context/auth';
import { isNotEmpty, isOnSafari } from '@/src/utils/validation';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { useProduct } from '@/src/context/product';

export function Import() {
  const { push } = useHistory();
  const { user } = useAuth();
  
  const { setCurrentImport } = useProduct();
  
  const [sortingField, setSortingField] = useState('');
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ITemplate[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  
  const [loading, setLoading] = useState(true);

  const handleSearch = useCallback((search: string) => {
    setFilteredTemplates(templates.filter(
      (r) => r.name.toLowerCase().includes(search.toLowerCase())
    ));
  }, [templates]);

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if(sortingField.includes(value)) {
      setFilteredTemplates(templates.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if(type === 'string') {
      // @ts-ignore
      setFilteredTemplates(prev => sortByField(prev, value));
    }
    else {
      // @ts-ignore
      setFilteredTemplates(prev => sortNumberFields(prev, value));
    }
    setSortingField(value);
  }, [templates, sortingField]);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: {
          data: { data, meta: { current_page, last_page } }
        }
      } = await api.get(`products/imports?paginated=true&page=${currentPage}`);
      
      setTemplates(data);
      setFilteredTemplates(data);
      
      setCurrentPage(current_page)
      setLastPage(last_page)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const usingSafari = useMemo(() => isOnSafari, []);

  const handleNewImport = useCallback((template?: ITemplate) => {
    if(!!template) {
      setCurrentImport(template);
    }

    push('/store/import/new');
  }, [push, setCurrentImport]);

  useEffect(() => {
    fetchTemplates();
    setCurrentImport(null as unknown as ITemplate)
  }, [fetchTemplates]);

  return (
    <>
      <Header route={["Loja Online", "Importação dos Produtos"]} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <TableHeader>
            <SearchBox
              search={handleSearch}
              onClear={() => setFilteredTemplates(templates)}
            />
            <div>
              <Button onClick={() => handleNewImport()}>
                Nova Importação
              </Button>
            </div>
          </TableHeader>
          {loading ?
          <LoadingContainer
            content="as importações"
          /> :
          <> 
          <Table isOnSafari={usingSafari}>
          <colgroup>
              <col span={1} style={{ width: '19%' }} />
              <col span={1} style={{ width: '19%' }} />
              <col span={1} style={{ width: '19%' }} />
              <col span={1} style={{ width: '11%' }} />
              <col span={1} style={{ width: '11%' }} />
              <col span={1} style={{ width: '15%' }} />
              <col span={1} style={{ width: '6%' }} />
            </colgroup>
            <thead>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('template') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'template' })}
                >
                  Template
                  <SortIcon />
                </TableSortingHeader> 
                </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('supplier') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'supplier' })}
                >
                  Representada
                  <SortIcon />
                </TableSortingHeader> 
                </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('date') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'date' })}
                >
                  Data da Importação
                  <SortIcon />
                </TableSortingHeader> 
                </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('products') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'products', type: 'number' })}
                >
                  Produtos
                  <SortIcon />
                </TableSortingHeader> 
                </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('errors') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'errors', type: 'number' })}
                >
                  Erros
                  <SortIcon />
                </TableSortingHeader> 
                </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('user') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'user' })}
                >
                  Usuário
                  <SortIcon />
                </TableSortingHeader> 
                </th>
              <th>
                Ação
              </th>
            </thead>
            <tbody>
              {filteredTemplates.map(t => (
                <tr key={`${t.name}-${String(t.updated_at)}`}>
                  <td>
                    <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                      {t.name}
                    </TableTitle>
                  </td>
                  <td>
                    <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                      {!!t.supplier ? t.supplier.name : ''}
                    </TableTitle>
                  </td>
                  <td style={{ padding: '0 0.625rem' }}>
                    <TableDateBox
                      name="importDate"
                      title="Data da Importação"
                      width="7rem"
                      // @ts-ignore
                      date={t.updated_at}
                      onDateSelect={() => {}}
                      disabled
                      validated={false}
                    />
                  </td>
                  <td style={{ padding: '0 0.625rem' }}>
                    {t.products_count}
                  </td>
                  <td style={{ color: !t.errors ? '#25CFA1' : '#FF6F6F'}}>
                    {!t.errors ? 'Sem erros' : t.errors}
                  </td>
                  <td>
                    {user.name}
                  </td>
                  <td>
                    <div>
                      <TableActionButton
                        onClick={() => handleNewImport(t)}
                      >
                        <UploadIcon />
                      </TableActionButton>
                      <TableActionButton
                        onClick={() => handleNewImport(t)}
                      >
                        <ViewIcon />
                      </TableActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <TableFooter>
            <p>{filteredTemplates.length} Importações</p>
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

