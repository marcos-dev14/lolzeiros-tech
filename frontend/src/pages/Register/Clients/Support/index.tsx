import { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as ViewIcon } from '~assets/view1.svg'
import { ReactComponent as AttachmentIcon } from '~assets/attachment.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Pagination } from '~components/Pagination';
import { SearchBox } from '~components/SearchBox';
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
import { emptyFieldRegex, isNotEmpty, isOnSafari } from '~utils/validation';
import { useProduct } from '@/src/context/product';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { TableTagInput } from '@/src/components/TableTagInput';
import { ClientHeader } from '@/src/components/ClientHeader';
import { TableDateBox } from '@/src/components/TableDateBox';

export function ClientSupport() {
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
      <Header route={['Suporte']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Container>
          <TableHeader>
            <SearchBox
              search={handleSearch}
              onClear={() => {
                handlePagination(1);
                setHasSearch(false);
              }}
            />
          </TableHeader>
          <SectionTitle
            style={{
              marginTop: '1.25rem'
            }}
          >
            Suporte
          </SectionTitle>
          {loading ?
            <LoadingContainer
              content="as campanhas"
            /> :
          <>
            <Table isOnSafari={usingSafari}>
            <colgroup>
              <col span={1} style={{ width: '9%' }} />
              <col span={1} style={{ width: '13%' }} />
              <col span={1} style={{ width: '54%' }} />
              <col span={1} style={{ width: '7%' }} />
              <col span={1} style={{ width: '9%' }} />
              <col span={1} style={{ width: '4%' }} />
              <col span={1} style={{ width: '4%' }} />
            </colgroup>
            <thead>
              <th>
                Ticket
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('product') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'product' })}
                >
                  Estado
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Assunto
                  <SortIcon />
                </TableSortingHeader> 
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Atendimento
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Suporte
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                Anexo
              </th>
              <th>
                Ação
              </th>
            </thead>
            <tbody>
              {filteredTickets.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.ticket}
                  </td>
                  <td
                    style={{ color:
                      p.state === 'done' ? '#25CFA1' : '#FF6F6F'}
                    }
                  >
                    {p.state === 'done' ? 'Ticket resolvido': 'Para responder'}
                  </td>
                  <td>
                    <TableTitle fontSize="0.75rem" lineHeight="0.8125rem">
                      {p.subject}
                    </TableTitle>
                  </td>
                  <td>
                    <TableDateBox
                      name="etaSupplier"
                      title=""
                      width="7.5rem"
                      // @ts-ignore
                      date={p.date}
                      onDateSelect={() => {}}
                      disabled
                      validated={false}
                    />
                  </td>
                  <td>
                    {p.answered}
                  </td>
                  <td>
                    <div style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
                      <AttachmentIcon fill="#272E47" />
                    </div>
                  </td>
                  <td>
                    <div>
                      <TableActionButton
                        onClick={() => push('/register/clients/support/edit', { name: `Ticket ${p.ticket} - ${p.client}` })}
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
            {/* <button onClick={clearTickets}>Excluir</button> */}
            <p>28 suportes fechados</p>
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
