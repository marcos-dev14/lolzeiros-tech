import { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as EditIcon } from '~assets/edit1.svg'
import { ReactComponent as TrashIcon } from '~assets/trash.svg'
import { ReactComponent as AttachmentIcon } from '~assets/attachment.svg';
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

import { MainProduct } from '~types/main';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { capitalizeContent, emptyFieldRegex, isNotEmpty, isOnSafari, validatePhone } from '~utils/validation';
import { useProduct } from '@/src/context/product';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { TableTagInput } from '@/src/components/TableTagInput';
import { ClientHeader } from '@/src/components/ClientHeader';
import { TableDateBox } from '@/src/components/TableDateBox';
import { StaticSocialBox } from '@/src/components/StaticSocialBox';
import { SiteBox } from '@/src/components/SiteBox';

export function VCard() {
  const { push } = useHistory();
      
  const [isOpen, setIsOpen] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [fullTickets, setFullTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([
    {
      id: 1,
      ticket: '943472',
      client: 'João Botelho Brinquedos LTDA',
      state: 'pending',
      subject: 'Meus produtos do pedido 738366B ainda não chegaram',
      date: new Date().toISOString(),
      answered: '2 dias',
    },
    {
      id: 2,
      ticket: '943471',
      client: 'João Botelho Brinquedos LTDA',
      state: 'done',
      subject: 'Meus produtos do pedido 738366B ainda não chegaram',
      date: new Date().toISOString(),
      answered: '2 dias',
    }
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
      <Header route={['Cadastro', 'vCard']} />
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
              onClick={() => push('/register/vcard/edit')}
              disabled={loading}
            >
              Novo vCard
            </Button>
          </TableHeader>
          {loading ?
            <LoadingContainer
              content="os vCards"
            /> :
          <>
            <Table isOnSafari={usingSafari}>
            <colgroup>
              <col span={1} style={{ width: '20%' }} />
              <col span={1} style={{ width: '20%' }} />
              <col span={1} style={{ width: '23%' }} />
              <col span={1} style={{ width: '29%' }} />
              <col span={1} style={{ width: '08%' }} />
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
                  Celular
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('product') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'product' })}
                >
                  Email
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Link do VCard
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
                    <TableTitle fontSize="0.75rem" lineHeight="0.8125rem">
                      {capitalizeContent(p.subject)}
                    </TableTitle>
                  </td>
                  <td>
                    <PhoneBox
                      name="a"
                      width="100%"
                      defaultValue={validatePhone("(31) 99318-2412")}
                      noTitle
                      disabled
                      validated
                    />
                  </td>
                  <td>
                    <StaticSocialBox
                      name="email"
                      type="social"
                      title=""
                      noTitle
                      badge={EmailIcon}
                      disabled
                      defaultValue="contato@auge.app"
                      validated
                      inputStyle={{ textTransform: 'lowercase' }}
                    />
                  </td>
                  <td>
                    <SiteBox
                      name=""
                      width="100%"
                      validated
                      defaultValue="https://augeapp.com/vcard/9288"
                      title="https://augeapp.com/vcard/9288"
                      disabled
                      noTitle
                      badge
                    />
                  </td>
                  <td>
                    <div>
                      <TableActionButton
                        onClick={() => push('/register/vcard/edit')}
                      >
                        <EditIcon />
                      </TableActionButton>
                      <TableActionButton
                        onClick={() => {}}
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
            {/* <button onClick={clearTickets}>Excluir</button> */}
            <p>16 vCard</p>
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
