import { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as SortIcon } from '~assets/sort.svg';
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
  TableSortingHeader,
} from '~styles/components/tables';

import { api } from '~api';

import { MainProduct } from '~types/main';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { emptyFieldRegex, isNotEmpty, isOnSafari } from '~utils/validation';
import { useProduct } from '@/src/context/product';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { TableTagInput } from '@/src/components/TableTagInput';

export function Spam() {
  const { push } = useHistory();
      
  const [campaigns, setCampaigns] = useState([]);
  const [fullCampaigns, setFullCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([
    {
      id: 1,
      name: 'Paulo Brinquedos',
      subject: 'Pedido de revisão nas compras do dia 10/01/2022',
      created_at: '15 horas atrás'
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
    setFilteredCampaigns(campaigns.filter( // @ts-ignore
      (r) => r.name.toLowerCase().includes(search.toLowerCase())
    ));

    setHasSearch(isNotEmpty(search));
  }, [campaigns]);

  const handlePagination = useCallback(async (page: number) => {
    try {
      setLoading(true);

      const { data } = await api.get('');

      setFilteredCampaigns(campaigns);

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
      setFilteredCampaigns(campaigns.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if(type === 'string')
      setFilteredCampaigns(prev => sortByField(prev, value));
    else {
      setFilteredCampaigns(prev => sortNumberFields(prev, value));
    }
    setSortingField(value);
  }, [campaigns, sortingField]);

  const usingSafari = useMemo(() => isOnSafari, []);

  return (
    <>
      <Header route={['Email', 'SPAM']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <TableHeader>
            <Select
              title="Ação em Grupo"
              setValue={() => {}}
              customWidth="15rem"
              style={{
                marginRight: '2rem'
              }}
            />
            <SearchBox
              search={handleSearch}
              onClear={() => {
                handlePagination(1);
                setHasSearch(false);
              }}
            />
            <Button
              className="newProduct"
              onClick={() => push('/mail/new')}
              disabled={loading}
            >
              Compor Novo Email
            </Button>
          </TableHeader>
          <SectionTitle
            style={{
              marginTop: '1.25rem'
            }}
          >
            Spam
          </SectionTitle>
          {loading ?
            <LoadingContainer
              content="os emails"
            /> :
          <>
            <Table isOnSafari={usingSafari}>
            <colgroup>
              <col span={1} style={{ width: '25%' }} />
              <col span={1} style={{ width: '56%' }} />
              <col span={1} style={{ width: '08%' }} />
              <col span={1} style={{ width: '11%' }} />
            </colgroup>
            <thead>
              <th>
                <div style={{ display: 'flex' }}>
                  <strong
                    style={{
                      fontFamily: 'Roboto',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}
                  >
                    Email
                  </strong>
                </div>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('product') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'product' })}
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
                  Anexo
                  <SortIcon />
                </TableSortingHeader> 
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Tempo
                  <SortIcon />
                </TableSortingHeader>
              </th>
            </thead>
            <tbody>
              {filteredCampaigns.map(p => (
                <tr key={p.id}>
                  <td
                    style={{
                      fontFamily: 'Roboto',
                      fontWeight: 'bold',
                    }}
                  >
                    <div style={{ marginLeft: '-0.625rem' }}>
                      {p.name}
                    </div>
                  </td>
                  <td
                    style={{
                      fontFamily: 'Roboto',
                      fontWeight: 'bold',
                    }}
                  >
                    {p.subject}
                  </td>
                  <td>
                    <div style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
                      <AttachmentIcon />
                    </div>
                  </td>
                  <td>{p.created_at}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <TableFooter>
            {/* <button onClick={clearCampaigns}>Excluir</button> */}
            <p>1 Email para ler / Total de 974 Emails (234 MB) /&nbsp;
              <p
                onClick={() => alert('a')}
                style={{
                  display: 'inline',
                  cursor: 'pointer',
                  color: '#FF6F6F',
                  textDecoration: 'underline'
                }}
              >
                Exclua os email que não estão nos contatos (209 MB)
              </p>
            </p>
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
