import { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as ViewIcon } from '~assets/view1.svg';
import { ReactComponent as EditIcon } from '~assets/edit1.svg';
import { ReactComponent as ReportIcon } from '~assets/report1.svg';

// import { ReactComponent as ReportIcon } from '~assets/report.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg';

import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Pagination } from '~components/Pagination';
import { TableDateBox } from '~components/TableDateBox';
import { SearchBox } from '~components/SearchBox';

import { Container, Table, TableHeader, Button } from './styles';
import { MenuAndTableContainer } from '~styles/components';

import {
  TableFooter,
  TableActionButton,
  TableTitle,
  TableSortingHeader
} from '~styles/components/tables';

import { api } from '~api';

import { MainProduct } from '~types/main';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { capitalizeContent, emptyFieldRegex, isNotEmpty, isOnSafari } from '~utils/validation';
import { useProduct } from '@/src/context/product';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';

export function Campaign() {
  const { push } = useHistory();
      
  const [campaigns, setCampaigns] = useState([]);
  const [fullCampaigns, setFullCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([
    {
      id: 1,
      name: 'Lançamento da coleção Barbie 2021',
      subscribers: 1.974,
      status: 'wait',
      delivered: 0,
      opened: 0,
      clicked: 0,
      cancelled: 0,
      isChild: false
    },
    {
      id: 2,
      name: 'Promoção Dia da Criança',
      subscribers: 1.974,
      status: 'sent',
      delivered: 0,
      opened: 0,
      clicked: 0,
      cancelled: 0,
      isChild: true
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
      <Header route={['Newsletter', 'Campanha']} />
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
            <div>
              <Button
                className="newProduct"
                onClick={() => {}}
                disabled={loading}
              >
                Nova Campanha
              </Button>
            </div>
          </TableHeader>
          {loading ?
            <LoadingContainer
              content="as campanhas"
            /> :
          <>
            <Table isOnSafari={usingSafari}>
            <colgroup>
              <col span={1} style={{ width: '30%' }} />
              <col span={1} style={{ width: '12%' }} />
              <col span={1} style={{ width: '09%' }} />
              <col span={1} style={{ width: '11%' }} />
              <col span={1} style={{ width: '10%' }} />
              <col span={1} style={{ width: '10%' }} />
              <col span={1} style={{ width: '12%' }} />
              <col span={1} style={{ width: '06%' }} />
            </colgroup>
            <thead>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('ref') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'ref' })}
                >
                  Nome da Campanha
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('product') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'product' })}
                >
                  Subscritos
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('category') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'category' })}
                >
                  Status
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Entregues
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Abriram
                  <SortIcon />
                </TableSortingHeader> 
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Clicaram
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Cancelaram
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                Ação
              </th>
            </thead>
            <tbody>
              {filteredCampaigns.map(p => (
                <tr key={p.id}>
                  <td>
                    <TableTitle
                      fontSize="0.6875rem"
                      lineHeight="0.8125rem"
                      title={capitalizeContent(p.name)}
                    >
                      {capitalizeContent(p.name)}
                    </TableTitle>
                  </td>
                  <td>{p.subscribers}</td>
                  <td
                    style={{ color:
                      p.status === 'sent' ? '#25CFA1' : '#FF6F6F'}
                    }
                  >
                    {p.status === 'sent' ? 'Enviado': 'Aguarde'}
                  </td>
                  <td>{p.delivered}</td>
                  <td>{p.opened}</td>
                  <td>{p.clicked}</td>
                  <td
                    style={{
                      color: '#FF6F6F'
                    }}
                  >{p.cancelled}</td>
                  <td>
                    <div>
                      {p.isChild ?
                        <TableActionButton
                          onClick={() => {}}
                        >
                          <ReportIcon />
                        </TableActionButton>
                        :
                        <>
                          <TableActionButton
                            onClick={() => {}}
                          >
                            <EditIcon />
                          </TableActionButton>
                          <TableActionButton
                            onClick={() => {}}
                            disabled={updatingAvailability === p.id}
                          >
                            <TrashIcon />
                          </TableActionButton>
                      </>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <TableFooter>
            {/* <button onClick={clearCampaigns}>Excluir</button> */}
            <p>{hasSearch || hasFiltered ? filteredCampaigns.length : fullCampaigns.length} Promoção Temporária</p>
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
