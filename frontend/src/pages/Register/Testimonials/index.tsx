import { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as EditIcon } from '~assets/edit1.svg'
import { ReactComponent as TrashIcon } from '~assets/trash.svg'
import { ReactComponent as StarIcon } from '~assets/Star1.svg';
import { ReactComponent as StarOffIcon } from '~assets/Star2.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { SearchBox } from '~components/SearchBox';

import { Container, Table, TableHeader, Button, StarsContainer } from './styles';
import { MenuAndTableContainer } from '~styles/components';

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
import { Pagination } from '@/src/components/Pagination';

export function Testimonials() {
  const { push } = useHistory();
      
  const [isOpen, setIsOpen] = useState(false);

  const [testimonials, setTestimonials] = useState([]);
  const [fullTestimonials, setFullTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([
    {
      id: 1,
      name: 'Claudino dos Santos',
      location: 'Lisboa',
      testimonial: 'Tinha bastante dores nas costas e resolvi experimentar o spa. Fui',
      rating: 5,
    },
    {
      id: 2,
      name: 'Claudino dos Santos',
      location: 'Lisboa',
      testimonial: 'Tinha bastante dores nas costas e resolvi experimentar o spa. Fui',
      rating: 3,
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
    setFilteredTestimonials(testimonials.filter( // @ts-ignore
      (r) => r.ticket.toLowerCase().includes(search.toLowerCase())
    ));

    setHasSearch(isNotEmpty(search));
  }, [testimonials]);

  const handlePagination = useCallback(async (page: number) => {
    try {
      setLoading(true);

      const { data } = await api.get('');

      setFilteredTestimonials(testimonials);  

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
      setFilteredTestimonials(testimonials.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if(type === 'string')
      setFilteredTestimonials(prev => sortByField(prev, value));
    else {
      setFilteredTestimonials(prev => sortNumberFields(prev, value));
    }
    setSortingField(value);
  }, [testimonials, sortingField]);

  const usingSafari = useMemo(() => isOnSafari, []);

  return (
    <>
      <Header route={['Cadastro', 'Testemunho']} />
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
              onClick={() => push('/register/testimonials/edit')}
              disabled={loading}
            >
              Novo Testemunho
            </Button>
          </TableHeader>
          {loading ?
            <LoadingContainer
              content="os testimonials"
            /> :
            <>
              <Table isOnSafari={usingSafari}>
              <colgroup>
                <col span={1} style={{ width: '19%' }} />
                <col span={1} style={{ width: '17%' }} />
                <col span={1} style={{ width: '42%' }} />
                <col span={1} style={{ width: '14%' }} />
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
                    Localidade
                    <SortIcon />
                  </TableSortingHeader>
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('product') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'product' })}
                  >
                    Testemunho
                    <SortIcon />
                  </TableSortingHeader>
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Avaliação
                    <SortIcon />
                  </TableSortingHeader>
                </th>
                <th>
                  Ação
                </th>
              </thead>
              <tbody>
                {filteredTestimonials.map((p) => (
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
                      <TableTitle
                        fontSize="0.75rem"
                        lineHeight="0.8125rem"
                        title={capitalizeContent(p.location)}
                      >
                        {capitalizeContent(p.location)}
                      </TableTitle>
                    </td>
                    <td>
                      <TableTitle fontSize="0.75rem" lineHeight="0.8125rem">
                        {p.testimonial}
                      </TableTitle>
                    </td>
                    <td>
                      <StarsContainer>
                        {Array(p.rating).fill(1).map(s =>
                          <StarIcon />
                        )}
                        {Array(5 - p.rating).fill(1).map(s =>
                          <StarOffIcon fill="#f90" color="#F90" />
                        )}
                      </StarsContainer>
                    </td>
                    <td>
                      <div>
                        <TableActionButton
                          onClick={() => push("/register/testimonials/edit")}
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
                {/* <button onClick={clearProducts}>Excluir</button> */}
                <p>{hasSearch || hasFiltered ? filteredTestimonials.length : fullTestimonials.length} Testemunhos</p>
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
