import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { ReactComponent as EditIcon } from '~assets/edit1.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg';
import { ReactComponent as BagXIcon } from '~assets/bagx1.svg';
import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';
import { ReactComponent as CollapseIcon } from '~assets/collapse.svg'
import { ReactComponent as ExpandIcon } from '~assets/expand_gray.svg'
import { ReactComponent as EmailIcon } from '~assets/email.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Pagination } from '~components/Pagination';
import { TableDateBox } from '~components/TableDateBox';
import { SearchBox } from '~components/SearchBox';
import { NoTitleSelect } from '~components/NoTitleSelect';

import { Container, Table, TableHeader, Button, DropdownRowContent, DropdownRowContentInfo, TagContainer, Tag } from './styles';
import { InputContainer, MenuAndTableContainer } from '~styles/components';

import {
  TableFooter,
  TableActionButton,
  TableTitle,
  TableSortingHeader
} from '~styles/components/tables';

import { api } from '~api';

import { ICategory, IBrand, MainClient } from '~types/main';

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
import { MaxCharactersInput } from '@/src/components/MaxCharactersInput';
import { TableTagInput } from '@/src/components/TableTagInput';
import { MeasureBox } from '@/src/components/TableMeasureBox';

export function Coupon() {
  const { push } = useHistory();
  
  const { setClient } = useRegister();
  
  const formRef = useRef<FormHandles>(null)
  const filterFormRef = useRef<FormHandles>(null)
  
  const [clients, setClients] = useState<MainClient[]>([]);
  const [fullClients, setFullClients] = useState<MainClient[]>([]);
  const [filteredClients, setFilteredClients] = useState([
    {
      id: 1,
      cback: 10,
      coupon: 'TUDO10',
      type: 'Todas as Categorias',
      related: 'Barão/Bandeirante',
      count: '11.911 produtos'
    }
  ]);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(-1);

  const [currentViewingProduct, setCurrentViewingProduct] = useState<MainClient>({} as MainClient);
  const [loading, setLoading] = useState(false);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [error, setError] = useState('');

  const [sortingField, setSortingField] = useState('');

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isViewProductModalOpen, setIsViewProductModalOpen] = useState(false);
  
  const [with_image, setWithImage] = useState(false);
  const [has_promotion, setHasPromotion] = useState(false);
  const [with_related, setWithRelated] = useState(false);
  const [with_embed, setWithEmbed] = useState(false);
  
  const [hasSearch, setHasSearch] = useState(false);

  const [updatingAvailability, setUpdatingAvailability] = useState(-1);

  const availabilityOptions = useMemo(() => [
    { value: 'Disponível', label: 'Disponível' },
    { value: 'Indisponível', label: 'Indisponível' },
    { value: 'Pré-venda', label: 'Pré-venda' },
    { value: 'Fora de linha', label: 'Fora de linha' }
  ], []);

  const handleSearch = useCallback((search: string) => {    
    // setFilteredClients(clients.filter(
    //   (r) => r.reference.toLowerCase().includes(search.toLowerCase())
    // ));

    setHasSearch(isNotEmpty(search));
  }, [clients]);

  const handleFilterClients = useCallback(async () => {
    try {
      setLoading(true);
      const data = filterFormRef?.current?.getData();

      const params = {};
      // setCurrentPage(current_page);
      // setLastPage(last_page);

    } catch (error) {
      // @ts-ignore
      console.log('e', error.response.data.message);

      // @ts-ignore
      setError(error.response.data.message)
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePagination = useCallback(async (page: number) => {
    try {
      setLoading(true);

      const {
        data: {
          data: { data: products, meta: { current_page, last_page } }
        }
      } = await api.get(`clients`);

      setFilteredClients(products);

      setCurrentPage(current_page);
      setLastPage(last_page);
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [])

  const handleFilterStatus = useCallback(async () => {
    if(!hasFiltered) {
      setIsFilterModalOpen(true)
      return;
    }
        
    await handlePagination(1);
    
    setHasFiltered(false);
  }, [handlePagination, hasFiltered])

  useEffect(() => {
  }, []);

  const schema = useMemo(() => 
    Yup.object().shape({
      title: Yup.string().matches(emptyFieldRegex),
      supplier: Yup.string().matches(emptyFieldRegex),
      brand_id: Yup.string().matches(emptyFieldRegex),
      category_id: Yup.string().matches(emptyFieldRegex),
      reference: Yup.string().matches(emptyFieldRegex),
      ean13: Yup.string().matches(emptyFieldRegex),
  }), []);

  const handleFilterProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = filterFormRef?.current?.getData();

      const params = {};

      // @ts-ignore
      const { by_category, by_brand } = data;
      
      // @ts-ignore
      params['by_supplier'] = supplier.id;

      if(with_image) // @ts-ignore
        params['with_image'] = !with_image;

      if(with_related) // @ts-ignore
        params['with_related'] = !with_related;
      
      if(has_promotion) // @ts-ignore
        params['has_promotion'] = has_promotion;
      
      if(with_embed) // @ts-ignore
        params['with_embed'] = !with_embed;
      
      // @ts-ignore
      params['availability'] = data.availability;

      const {
        data: {
          data: products
        }
      } = await api.get('products', {
        params: params
      });

      setFilteredClients(products);
      setHasFiltered(true);
      setIsFilterModalOpen(false)

      // setCurrentPage(current_page);
      // setLastPage(last_page);

    } catch (error) {
      // @ts-ignore
      console.log('e', error.response.data.message);

      // @ts-ignore
      setError(error.response.data.message)
    } finally {
      setLoading(false);
    }
  }, [
      with_image,
      has_promotion,
      with_related,
      with_embed
    ]);

  const handleViewClient = useCallback((c: MainClient) => {
    setCurrentViewingProduct(c);
    setIsViewProductModalOpen(true);
  }, []);

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if(sortingField.includes(value)) {
      // setFilteredClients(clients.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if(type === 'string')
      setFilteredClients(prev => sortByField(prev, value));
    else {
      setFilteredClients(prev => sortNumberFields(prev, value));
    }
    setSortingField(value);
  }, [clients, sortingField]);

  const handleEditClient = useCallback(async (client: MainClient) => {
    try {
      const {
        data: { data }
      } = await api.get(`/clients/${client.id}`);
      
      setClient(data);
      push('/clients/new');
    } catch (e) {
      console.log('e', e);
    }
  }, [setClient, push]);

  const handleSupplierAvailability = useCallback(async (id: number, status: string) => {
    try {
      setUpdatingAvailability(id);
      // const upload = new FormData();
  
      const availability =
        status === 'Ativo' ? 'Inativo' : 'Ativo';
      // upload.append('is_available', status ? '1' : '0');
      const {
        data: { data }
      } = await api.put(`/clients/${id}`, {
        status: availability
      });

      const currentProductIndex = filteredClients.findIndex(p => p.id === id);
      const tempProducts = [...filteredClients];
  
      tempProducts[currentProductIndex] = data;
      setFilteredClients(tempProducts);
    } catch(e) {
      console.log('e', e);
    } finally {
      setUpdatingAvailability(-1);
    }
  }, [filteredClients]);

  const usingSafari = useMemo(() => isOnSafari, []);

  useEffect(() => {
    setClient(null as unknown as MainClient);
  }, [])

  return (
    <>
      <Header route={['Loja Online', 'Cupom']} />
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
                Novo CBACK
              </Button>
            </div>
          </TableHeader>
          {loading ?
            <LoadingContainer
              content="os opcionais"
            /> :
          <>
            <Table isOnSafari={usingSafari}>
            <colgroup>
              <col span={1} style={{ width: '8%' }} />
              <col span={1} style={{ width: '10%' }} />
              <col span={1} style={{ width: '17%' }} />
              <col span={1} style={{ width: '48%' }} />
              <col span={1} style={{ width: '12%' }} />
              <col span={1} style={{ width: '5%' }} />
            </colgroup>
            <thead>
              <th>
               Cback
              </th>
              <th>
               Cupom
              </th>
              <th>
                Tipo
              </th>
              <th>
                Relacionado
              </th>
              <th>
                Quantidade
              </th>
              <th>                
                Ação
              </th>
            </thead>
            <tbody>
              {filteredClients.map(p => (
                <tr key={p.id}>
                  <td style={{ padding: '0 0.625rem' }}>
                    <MeasureBox
                      name="etaSupplier"
                      title=""
                      noTitle
                      validated
                      measure="%"
                      defaultValue={p.cback}
                      width="2rem"
                      disabled
                    />
                  </td>
                  <td>
                    <Input
                      name=""
                      noTitle
                      value={p.coupon}
                      title={p.coupon}
                      width="4.5rem"
                      validated
                    />
                  </td>
                  <td>
                    <NoTitleSelect
                      placeholder="Selecione..."
                      setValue={() => {}}
                      customWidth="20rem"
                      defaultValue={{
                        value: p.related,
                        label: p.related
                      }}
                    />
                  </td>
                  <td>
                    <NoTitleSelect
                      placeholder="Selecione..."
                      setValue={() => {}}
                      customWidth="20rem"
                      defaultValue={{
                        value: p.related,
                        label: p.related
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      name=""
                      noTitle
                      value={p.count}
                      title={p.count}
                      disabled
                      width="4.5rem"
                      validated
                    />
                  </td>
                  <td>
                    <div>
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
            <p>{hasSearch || hasFiltered ? filteredClients.length : fullClients.length} Postagens</p>
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
        title="Filtro de Clientes"
        isModalOpen={isFilterModalOpen}
        setIsModalOpen={setIsFilterModalOpen}
      >
        <Form ref={filterFormRef} onSubmit={() => {}}>
          <InputContainer style={{ marginTop: '1.875rem' }}>
            <FormSelect
              name="Comercial"
              title="Comercial"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
            <FormSelect
              name="Grupo do Cliente"
              title="Grupo do Cliente"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
          </InputContainer>
          <InputContainer>
            <FormSelect
              name="Tipo de PDV"
              title="Tipo de PDV"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
            <FormSelect
              name="Perfil do Cliente"
              title="Perfil do Cliente"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
          </InputContainer>
          <InputContainer>
            <FormSelect
              name="Última Compra"
              title="Última Compra"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
            <FormSelect
              name="Newsletter"
              title="Newsletter"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
          </InputContainer>
          <InputContainer>
            <FormSelect
              name="Representada Liberada"
              title="Representada Liberada"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
            <FormSelect
              name="Status"
              title="Status"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
          </InputContainer>
          <InputContainer>
            <FormSelect
              name="Cidade"
              title="Cidade"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
            <FormSelect
              name="Região"
              title="Região"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
          </InputContainer>
          <InputContainer>
            <StaticDateBox
              name=""
              title="Período Inicial"
              width="8.75rem"
              // @ts-ignore
              date={new Date()}
              onDateSelect={() => {}}
              validated={false}
            />
            <StaticDateBox
              name=""
              title="Período Final"
              width="8.75rem"
              // @ts-ignore
              date={new Date()}
              onDateSelect={() => {}}
              validated={false}
            />
          </InputContainer>
          <Button onClick={handleFilterClients} type="button" style={{ marginTop: '3.125rem', width: '100%' }}>
            {loading ? <LoadingIcon className="load" /> : 'Filtrar Clientes'}
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
