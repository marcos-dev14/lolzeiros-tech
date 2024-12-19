import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { ReactComponent as EditIcon } from '~assets/edit1.svg';
import { ReactComponent as BagIcon } from '~assets/bag1.svg';
import { ReactComponent as BagXIcon } from '~assets/bagx1.svg';
import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';
import { ReactComponent as CollapseIcon } from '~assets/collapse.svg'
import { ReactComponent as ExpandIcon } from '~assets/expand_gray.svg'

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Pagination } from '~components/Pagination';
import { TableDateBox } from '~components/TableDateBox';
import { MeasureBox } from '~components/MeasureBox';
import { SearchBox } from '~components/SearchBox';
import { Modal } from '~components/Modal';
import { CheckBox } from '~components/CheckBox';
import { RadioBox } from '~components/RadioBox';

import { Container, Table, TableHeader, Button, DropdownRowContent, DropdownRowContentInfo } from './styles';
import {
  MenuAndTableContainer,
  InputContainer,
  ColumnInputContainer
} from '~styles/components';

import {
  TableFooter,
  TableActionButton,
  TableTitle,
  TableSortingHeader
} from '~styles/components/tables';

import { api } from '~api';

import { ICategory, IBrand, MainSupplier } from '~types/main';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { emptyFieldRegex, isNotEmpty, isOnSafari } from '~utils/validation';
import { useProduct } from '@/src/context/product';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { Input } from '@/src/components/Input';
import { useRegister } from '@/src/context/register';
import { MultiSelect } from '@/src/components/MultiSelect';

export function CurrentSuppliers() {
  const { push } = useHistory();
  
  const { setSupplier } = useRegister();
  
  const formRef = useRef<FormHandles>(null)
  const filterFormRef = useRef<FormHandles>(null)
  
  const [suppliers, setSuppliers] = useState<MainSupplier[]>([]);
  const [fullSuppliers, setFullSuppliers] = useState<MainSupplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<MainSupplier[]>([]);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(50);
  
  const [searchCurrentPage, setSearchCurrentPage] = useState<number>(1);
  const [searchLastPage, setSearchLastPage] = useState<number>(1);
  
  const [isOpen, setIsOpen] = useState(-1);

  const [currentViewingProduct, setCurrentViewingProduct] = useState<MainSupplier>({} as MainSupplier);
  const [loading, setLoading] = useState(true);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [error, setError] = useState('');

  const [sortingField, setSortingField] = useState('');

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isViewProductModalOpen, setIsViewProductModalOpen] = useState(false);
  
  const [active, setActive] = useState('Sim');
  const [outOfSales, setOutOfSales] = useState('Sim');
  const [with_related, setWithRelated] = useState(false);
  const [with_embed, setWithEmbed] = useState(false);
  
  const [search, setSearch] = useState('');

  const [updatingAvailability, setUpdatingAvailability] = useState(-1);

  const availabilityOptions = useMemo(() => [
    { value: 'Disponível', label: 'Disponível' },
    { value: 'Indisponível', label: 'Indisponível' },
    { value: 'Pré-venda', label: 'Pré-venda' },
    { value: 'Fora de linha', label: 'Fora de linha' }
  ], []);

  // const handleSearch = useCallback((search: string) => {    
  //   // setFilteredSuppliers(suppliers.filter(
  //   //   (r) => r.reference.toLowerCase().includes(search.toLowerCase())
  //   // ));

  //   setHasSearch(isNotEmpty(search));
  // }, [suppliers]);
  const handleSearch = useCallback(async (search: string) => {    
    try {
      setLoading(true);

      const {
        data: {
          data: { data: clients, meta: { current_page, last_page } }
        }
      } =  await api.get(`/products/suppliers?paginated=true&per_page=${perPage}&all=${true}`, {
        params: {
          reference: search.toLowerCase()
        }
      });

      setFilteredSuppliers(clients);

      setSearchCurrentPage(current_page);
      setSearchLastPage(last_page);

      setSearch(search);
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  const fetchSupplierData = useCallback(async () => {
    try {
      setLoading(true);
      const [fullSuppliersResponse] = await Promise.all([
        api.get(`/products/suppliers?paginated=true&per_page=${perPage}&all=${true}`),
      ]);

      const {
        data: {
          data: { data: fullSuppliers, meta: { current_page, last_page } }
        }
      } = fullSuppliersResponse;

      setSuppliers(fullSuppliers);
      setFullSuppliers(fullSuppliers);
      setFilteredSuppliers(fullSuppliers);
      setCurrentPage(+current_page);
      setLastPage(+last_page);
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  const handlePagination = useCallback(async (page: number) => {
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
          data: { data: suppliers, meta: { current_page, last_page } }
        }
      } = await api.get(`products/suppliers?paginated=true&page=${page}&per_page=${perPage}&all=${true}`, request);

      const formattedSuppliers = !!sortingField ? sortByField(suppliers, sortingField) : suppliers;

      setFilteredSuppliers(formattedSuppliers);

      console.log(filteredSuppliers);
      

      setCurrentPage(+current_page);
      setLastPage(+last_page);
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [search, perPage])

  const handleFilterStatus = useCallback(async () => {
    if(!hasFiltered) {
      setIsFilterModalOpen(true)
      return;
    }
    
    setActive('Sim');
    setOutOfSales('Sim');
    setWithRelated(false);
    setWithEmbed(false);
    
    // await handlePagination(1);
    
    setHasFiltered(false);
  }, [hasFiltered])

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const handleFilterSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const data = filterFormRef?.current?.getData();

      const params = {};

      // @ts-ignore
      const { by_category, by_brand } = data;
      
      // @ts-ignore
      params['by_supplier'] = supplier.id;

      if(active) // @ts-ignore
        params['active'] = !active;

      if(with_related) // @ts-ignore
        params['with_related'] = !with_related;
      
      if(outOfSales) // @ts-ignore
        params['outOfSales'] = outOfSales;
      
      if(with_embed) // @ts-ignore
        params['with_embed'] = !with_embed;

      if(isNotEmpty(search)) { // @ts-ignore
        params['reference'] = search.toLowerCase()
      }
      
      // @ts-ignore
      params['availability'] = data.availability;

      const {
        data: {
          data: { data: suppliers, meta: { current_page, last_page } }
        }
      } = await api.get(`products/suppliers?paginated=true&per_page=${perPage}`, {
        params: params
      });

      setFilteredSuppliers(suppliers);
      setHasFiltered(true);
      setIsFilterModalOpen(false)
      
      if (isNotEmpty(search)) {
        setSearchCurrentPage(+current_page);
        setSearchLastPage(+last_page);  
      }
      else {
        setSuppliers(suppliers)
        setCurrentPage(+current_page);
        setLastPage(+last_page);
      }

    } catch (error) {
      // @ts-ignore
      console.log('e', error.response.data.message);

      // @ts-ignore
      setError(error.response.data.message)
    } finally {
      setLoading(false);
    }
  }, [
      perPage,
      search,
      active,
      outOfSales,
      with_related,
      with_embed
    ]);

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if(sortingField.includes(value)) {
      setFilteredSuppliers(suppliers.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if(type === 'string')
      setFilteredSuppliers(prev => sortByField(prev, value));
    else 
      setFilteredSuppliers(prev => sortNumberFields(prev, value));
    
    setSortingField(value);
  }, [suppliers, sortingField]);

  const handleEditSupplier = useCallback(async (supplier: MainSupplier) => {
    try {
      const {
        data: { data }
      } = await api.get(`/products/suppliers/${supplier.id}`);
      
      setSupplier(data);
      push('/register/suppliers/new');
    } catch (e) {
      console.log('e', e);
    }
  }, [setSupplier, push]);

  const handleSupplierAvailability =
    useCallback(async (id: number, is_available: boolean) => {
      try {
        setUpdatingAvailability(id);
        const upload = new FormData();

        // @ts-ignore
        upload.append('is_available', is_available)
    
        const {
          data: { data }
        } = await api.post(`/products/suppliers/${id}?_method=PUT`, upload);

        const currentProductIndex = filteredSuppliers.findIndex(p => p.id === id);
        const tempSuppliers = [...filteredSuppliers];
    
        tempSuppliers[currentProductIndex] = data;
        setFilteredSuppliers(tempSuppliers);
      } catch(e) {
        console.log('e', e);
      } finally {
        setUpdatingAvailability(-1);
      }
  }, [filteredSuppliers]);

  const usingSafari = useMemo(() => isOnSafari, []);

  useEffect(() => {
    setSupplier(null as unknown as MainSupplier);
  }, [])

  return (
    <>
      <Header route={['Cadastro', 'Representada']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <TableHeader>
            <SearchBox
              search={handleSearch}
              onClear={() => {
                handlePagination(1);
                setSearch('');
              }}
            />
            <div>
              <Input
                name="Total de Resultados"
                width="10rem"
                style={{ marginRight: '1.25rem' }}
                value={perPage}
                // @ts-ignore
                onChange={(e)=> setPerPage(e.target.value)}
                // @ts-ignore
                onBlur={(e)=> (e.target.value <= 0 || isNaN(e.target.value)) && setPerPage(50)}
              />
              <Button
                onClick={handleFilterStatus}
                disabled={loading}
              >
                {hasFiltered ? 'Limpar Filtro' : 'Filtro'}
              </Button>
              <Button
                className="newProduct"
                onClick={() => push('/register/suppliers/new')}
                disabled={loading}
              >
                Nova Representada
              </Button>
            </div>
          </TableHeader>
          {loading ?
            <LoadingContainer
              content="as representadas"
            /> :
          <>
            <Table isOnSafari={usingSafari}>
            <colgroup>
              <col span={1} style={{ width: '21%' }} />
              <col span={1} style={{ width: '13%' }} />
              <col span={1} style={{ width: '13%' }} />
              <col span={1} style={{ width: '13%' }} />
              <col span={1} style={{ width: '16%' }} />
              <col span={1} style={{ width: '16%' }} />
              <col span={1} style={{ width: '8%' }} />
            </colgroup>
            <thead>
              <th>
               Representada
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('product') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'product' })}
                >
                  Produtos
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('category') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'category' })}
                >
                  Com estoque
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Sem estoque
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Última Venda
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Total em Vendas
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>                
                Ação
              </th>
            </thead>
            <tbody>
              {filteredSuppliers.map(p => (
                <tr
                  style={{
                    backgroundColor:
                      isOpen === p.id ? '#F4F5F8' : '#fff'
                  }}
                >
                  <td>
                    <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                      {!!p.company_name ? p.company_name : p.name}
                    </TableTitle>
                  </td>
                  <td>{p.products_count}</td>
                  <td>{p.products_available_count}</td>
                  <td>{p.products_count - p.products_available_count}</td>
                  <td style={{ padding: '0 0.625rem' }}>
                    <TableDateBox
                      name="etaSupplier"
                      title="Previsão de Chegada da Representada"
                      width="7.5rem"
                      noTitle
                      // @ts-ignore
                      date={p.created_at}
                      onDateSelect={() => {}}
                      disabled
                      validated={false}
                    />
                  </td>
                  <td style={{ padding: '0 0.625rem' }}>
                    <MeasureBox
                      name="anything"
                      title="Previsão de Chegada da Representada"
                      measure="R$"
                      width="7.5rem"
                      defaultValue="250,00"
                      validated
                      noTitle
                      disabled
                    />
                  </td>
                  <td>
                    <div>
                      <TableActionButton
                        onClick={() => handleEditSupplier(p)}
                      >
                        <EditIcon />
                      </TableActionButton>
                      <TableActionButton
                        onClick={() => handleSupplierAvailability(p.id, !p.is_available)}
                        disabled={updatingAvailability === p.id}
                      >
                        {p.is_available ? <BagIcon /> : <BagXIcon />}
                      </TableActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <TableFooter>
            {/* <button onClick={clearSuppliers}>Excluir</button> */}
            <p>{isNotEmpty(search) || hasFiltered ? filteredSuppliers.length : fullSuppliers.length} Representadas</p>
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
      <Modal
        title="Filtro de Representadas"
        isModalOpen={isFilterModalOpen}
        setIsModalOpen={setIsFilterModalOpen}
        style={{ width: '30rem' }}
      >
        <Form ref={filterFormRef} onSubmit={() => {}}>
          <InputContainer style={{ marginTop: '1.875rem' }}>
            <MultiSelect
              title="Estados que atua"
              placeholder="Selecione..."
              customWidth="100%"
              setValue={() => {}}
            />
          </InputContainer>
          <InputContainer>
            <MultiSelect
              title="Região em que atua"
              placeholder="Selecione..."
              customWidth="100%"
              setValue={() => {}}
            />
          </InputContainer>
          <InputContainer>
            <RadioBox
              title="Ativo"
              value={active}
              setValue={setActive}
            />
            <RadioBox
              title="Fora de Venda"
              value={outOfSales}
              setValue={setOutOfSales}
            />
          </InputContainer>
          <Button onClick={handleFilterSuppliers} type="button" style={{ marginTop: '3.125rem', width: '100%' }}>
            {loading ? <LoadingIcon className="load" /> : 'Filtrar Representadas'}
          </Button>
        </Form>
      </Modal>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
