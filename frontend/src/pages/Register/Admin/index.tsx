import { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as EditIcon } from '~assets/edit1.svg'
import { ReactComponent as BlockIcon } from '~assets/block1.svg'
import { ReactComponent as UnlockIcon } from '~assets/unlock1.svg';
import { ReactComponent as EmailIcon } from '~assets/email.svg';

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
import { capitalizeContent, isNotEmpty, isOnSafari } from '~utils/validation';

import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';

import { StaticSocialBox } from '@/src/components/StaticSocialBox';
import { SiteBox } from '@/src/components/SiteBox';

export function Admin() {
  const { push } = useHistory();
      
  const [tickets, setTickets] = useState([]);
  const [fullTickets, setFullTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([
    {
      id: 1,
      name: 'Claudino dos Santos',
      login: 'claudino@auge.app',
      access: true,
      tech: 'Personalizado',
      count: 17
    },
    {
      id: 2,
      name: 'Claudino dos Santos',
      login: 'claudino@auge.app',
      access: false,
      tech: 'Todos',
      count: 32
    },
  ]);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [error, setError] = useState('');

  const [sortingField, setSortingField] = useState('');  
  
  const [hasSearch, setHasSearch] = useState(false);

  const [updatingAvailability, setUpdatingAvailability] = useState(-1);

  const availabilityOptions = useMemo(() => [
    { value: 'Disponível', label: 'Disponível' },
    { value: 'Indisponível', label: 'Indisponível' },
    { value: 'Pré-venda', label: 'Pré-venda' },
    { value: 'Fora de linha', label: 'Fora de linha' }
  ], []);

  const handleSearch = useCallback((search: string) => {    
    setFilteredTickets(tickets.filter( // @ts-ignore
      (r) => r.ticket.toLowerCase().includes(search.toLowerCase())
    ));

    setHasSearch(isNotEmpty(search));
  }, [tickets]);

  const handlePagination = useCallback(async (page: number) => {
    try {
      setLoading(true);

      const { data } = await api.get('');

      setFilteredTickets(tickets);  

      setCurrentPage(1);
      setLastPage(1);
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [])

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if(sortingField.includes(value)) {
      setFilteredTickets(tickets.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if(type === 'string')
      setFilteredTickets(prev => sortByField(prev, value));
    else {
      setFilteredTickets(prev => sortNumberFields(prev, value));
    }
    setSortingField(value);
  }, [tickets, sortingField]);

  const usingSafari = useMemo(() => isOnSafari, []);

  return (
    <>
      <Header route={['Cadastro', 'Administrador']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <TableHeader>
            <SearchBox
              search={handleSearch}
              onClear={() => {
                handlePagination(1);
                setHasSearch(false);
              }}
            />
            <Button
              className="newProduct"
              onClick={() => {}}
              disabled={loading}
            >
              Novo Administrador
            </Button>
          </TableHeader>
          {loading ?
            <LoadingContainer
              content="os administradores"
            /> :
            <>
            <Table isOnSafari={usingSafari}>
              <colgroup>
                <col span={1} style={{ width: '25%' }} />
                <col span={1} style={{ width: '22%' }} />
                <col span={1} style={{ width: '15%' }} />
                <col span={1} style={{ width: '15%' }} />
                <col span={1} style={{ width: '15%' }} />
                <col span={1} style={{ width: '8%' }} />
              </colgroup>
              <thead>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('product') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'product' })}
                  >
                    Nome
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('product') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'product' })}
                  >
                    Login (email)
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('product') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'product' })}
                  >
                    Acesso
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Tecnologias
                    <SortIcon />
                  </TableSortingHeader> 
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Quantidade
                    <SortIcon />
                  </TableSortingHeader> 
                </th>
                <th>
                  Ação
                </th>
              </thead>
              <tbody>
                {filteredTickets.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <TableTitle
                        fontSize="0.75rem"
                        lineHeight="0.8125rem"
                        title={capitalizeContent(p.name)}
                      >
                        {capitalizeContent(p.name)}
                      </TableTitle>
                    </td>
                    <td>
                      <StaticSocialBox
                        name="email"
                        type="social"
                        title=""
                        noTitle
                        badge={EmailIcon}
                        disabled
                        defaultValue={p.login}
                        inputStyle={{ textTransform: 'lowercase' }}
                        validated
                      />
                    </td>
                    <td
                      style={{
                        color: p.access ? '#25CFA1' : '#FF6F6F'
                      }}
                    >
                      {p.access ? 'Liberado' : 'Bloqueado'}
                    </td>
                    <td>
                     {p.tech}
                    </td>
                    <td>
                      {p.count}/32 Sistemas
                    </td>
                    <td>
                      <div>
                        <TableActionButton
                          onClick={() => push('/register/admin/edit')}
                        >
                          <EditIcon />
                        </TableActionButton>
                        <TableActionButton
                          onClick={() => {}}
                        >
                          {p.access ? <BlockIcon /> : <UnlockIcon />}
                        </TableActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
             <TableFooter>
             {/* <button onClick={clearTickets}>Excluir</button> */}
             <p>16 Administradores</p>
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
