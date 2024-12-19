import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { ReactComponent as EditIcon } from '~assets/edit1.svg';
import { ReactComponent as BagIcon } from '~assets/bag1.svg';
import { ReactComponent as BlockIcon } from '~assets/block1.svg';
import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';
import { ReactComponent as CollapseIcon } from '~assets/collapse.svg'
import { ReactComponent as ExpandIcon } from '~assets/expand_gray.svg'
import { ReactComponent as EmailIcon } from '~assets/email.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Pagination } from '~components/Pagination';
import { TableDateBox } from '~components/TableDateBox';
import { CustomSearchBox } from '~components/CustomSearchBox';

import { Container, Table, TableHeader, Button, DropdownRowContent, DropdownRowContentInfo, TagContainer, Tag } from './styles';
import { InputContainer, MenuAndTableContainer } from '~styles/components';

import {
  TableFooter,
  TableActionButton,
  TableTitle,
  TableSortingHeader
} from '~styles/components/tables';

import { api } from '~api';

import { IAuthor } from '~types/main';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { emptyFieldRegex, isNotEmpty, isOnSafari } from '~utils/validation';
import { useProduct } from '@/src/context/product';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { Input } from '@/src/components/Input';
import { useRegister } from '@/src/context/register';
import { FormSelect } from '@/src/components/FormSelect';
import { Modal } from '@/src/components/Modal';
import { StaticDateBox } from '@/src/components/StaticDateBox';
import { StaticSocialBox } from '@/src/components/StaticSocialBox';

export function BlogAuthor() {
  const { push } = useHistory();
  
  const { setAuthor } = useRegister();
  
  const [authors, setAuthors] = useState<IAuthor[]>([]);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);

  const [currentViewingProduct, setCurrentViewingProduct] = useState<IAuthor>({} as IAuthor);
  const [loading, setLoading] = useState(false);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [error, setError] = useState('');

  const [sortingField, setSortingField] = useState('');
  
  const [search, setSearch] = useState('');

  const filteredAuthors = useMemo(() => isNotEmpty(search) ?
     authors.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())) :
     authors
  , [authors, search]);

  const handlePagination = useCallback(async (page: number) => {
    try {
      setLoading(true);

      const {
        data: {
          data: { data: results, meta: { current_page, last_page } }
        }
      } = await api.get(`clients`);


      const formattedResults = !!sortingField ? sortByField(results, sortingField) : results;


      setAuthors(formattedResults);

      setCurrentPage(current_page);
      setLastPage(last_page);
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [sortingField])

  const handleViewClient = useCallback((author: IAuthor) => {
    setCurrentViewingProduct(author);
  }, []);

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if(sortingField.includes(value)) {
      // setFilteredAuthors(clients.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    // if(type === 'string')
      // setFilteredAuthors(prev => sortByField(prev, value));
    // else {
      // setFilteredAuthors(prev => sortNumberFields(prev, value));
    // }
    setSortingField(value);
  }, [authors, sortingField]);

  // const handleEditClient = useCallback(async (client: MainClient) => {
  //   try {
  //     const {
  //       data: { data }
  //     } = await api.get(`/clients/${client.id}`);
      
  //     setClient(data);
  //     push('/register/clients/new');
  //   } catch (e) {
  //     console.log('e', e);
  //   }
  // }, [setClient, push]);

  const usingSafari = useMemo(() => isOnSafari, []);

  const fetchAuthors = useCallback(async () => {
    try {
      const {
        data: {
          data
        }
      } = await api.get('blogs/authors');

      setAuthors(data);
    } catch(e) {
      console.log('e', e);
    }
  }, []);

  const handleEditAuthor = useCallback(async (id: number) => {
    try {
      const {
        data: { data }
      } = await api.get(`/blogs/authors/${id}`);
      
      setAuthor(data);
      push('/blog/author/edit');
    } catch (e) {
      console.log('e', e);
    }
  }, [setAuthor, push]);

  useEffect(() => {
    setAuthor(null as unknown as IAuthor);
  }, [])

  useEffect(() => {
    fetchAuthors();
  }, []);

  return (
    <>
      <Header route={['Blog', 'Autor da Postagem']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <TableHeader>
            <CustomSearchBox
              search={search}
              setSearch={setSearch}
              onClear={() => {}}
            />
            <div>
              <Button
                className="newProduct"
                onClick={() => push('/blog/author/edit')}
                disabled={loading}
              >
                Novo Autor
              </Button>
            </div>
          </TableHeader>
          {loading ?
            <LoadingContainer
              content="os autores"
            /> :
          <>
            <Table isOnSafari={usingSafari}>
            <colgroup>
              <col span={1} style={{ width: '27%' }} />
              <col span={1} style={{ width: '16%' }} />
              <col span={1} style={{ width: '16%' }} />
              <col span={1} style={{ width: '16%' }} />
              <col span={1} style={{ width: '21%' }} />
              <col span={1} style={{ width: '4%' }} />
            </colgroup>
            <thead>
              <th>
               Autor
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('category') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'category' })}
                >
                  Instagram
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Facebook
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  YouTube
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
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
              {filteredAuthors.map(a => (
                <tr
                  key={a.id}
                >
                  <td title={a.name}>
                    <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                      {a.name}
                    </TableTitle>
                  </td>
                  <td title={a.instagram}>
                    <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                      {a.instagram}
                    </TableTitle>
                  </td>
                  <td title={a.facebook}>
                    <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                      {a.facebook}
                    </TableTitle>
                  </td>
                  <td title={a.youtube}>
                    <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                      {a.youtube}
                    </TableTitle>
                  </td>
                  <td>
                    <StaticSocialBox
                      name="email"
                      type="social"
                      noTitle
                      badge={EmailIcon}
                      disabled
                      defaultValue={a.email}
                      validated
                      width="10rem"
                      title={a.email}
                    />
                  </td>
                  <td>
                    <div>
                      <TableActionButton
                        onClick={() => handleEditAuthor(a.id)}
                      >
                        <EditIcon />
                      </TableActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <TableFooter>
            {/* <p>{isNotEmpty(search) || hasFiltered ? filteredAuthors.length : fullAuthors.length} Autores</p> */}
            <p>{authors.length} Autores</p>
            {!hasFiltered &&
              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                setCurrentPage={handlePagination}
              />
            }
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
