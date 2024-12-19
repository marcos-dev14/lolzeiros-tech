import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { ReactComponent as ViewIcon } from '~assets/view1.svg';
import { ReactComponent as EditIcon } from '~assets/edit1.svg';
import { ReactComponent as BagIcon } from '~assets/bag1.svg';
import { ReactComponent as BagXIcon } from '~assets/bagx1.svg';
import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Pagination } from '~components/Pagination';
import { TableDateBox } from '~components/TableDateBox';
import { SearchBox } from '~components/SearchBox';
import { Modal } from '~components/Modal';
import { CheckBox } from '~components/CheckBox';
import { RadioBox } from '~components/RadioBox';
import { FormInput } from '~components/FormInput';
import { FormInputMask } from '~components/FormInputMask';
import { FormSelect } from '~components/FormSelect';
import { FormTitleInput } from '~components/FormTitleInput';
import { DetailsRelatedProduct } from '~components/DetailsRelatedProduct';
import { CustomSelect as Select } from '~components/Select';

import { Container, Table, TableHeader, Button } from './styles';
import {
  MenuAndTableContainer,
  InputContainer,
  ColumnInputContainer
} from '~styles/components';

import {
  TableFooter,
  TableActionButton,
  TableTitle,
  TableSortingHeader,
} from '~styles/components/tables';

import { api } from '~api';

import { ICategory, IBrand, MainProduct } from '~types/main';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { emptyFieldRegex, isNotEmpty, isOnSafari } from '~utils/validation';
import { useProduct } from '@/src/context/product';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { Input } from '@/src/components/Input';

export function ProductsDetails() {
  const { push } = useHistory();
  
  const { setProduct, supplier, resetProductAttributes } = useProduct();
  
  const formRef = useRef<FormHandles>(null)
  const filterFormRef = useRef<FormHandles>(null)
  
  const [products, setProducts] = useState<MainProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<MainProduct[]>([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(50);

  const [searchCurrentPage, setSearchCurrentPage] = useState<number>(1);
  const [searchLastPage, setSearchLastPage] = useState<number>(1);

  const [currentViewingProduct, setCurrentViewingProduct] = useState<MainProduct>({} as MainProduct);
  const [loading, setLoading] = useState(true);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [error, setError] = useState('');
  
  const [loadingProduct, setLoadingProduct] = useState(-1);

  const [sortingField, setSortingField] = useState('');

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isViewProductModalOpen, setIsViewProductModalOpen] = useState(false);
  
  const [with_image, setWithImage] = useState(false);
  const [has_promotion, setHasPromotion] = useState(false);
  const [with_related, setWithRelated] = useState(false);
  const [with_embed, setWithEmbed] = useState(false);
  const [with_ncm, setDoesntHasNcm] = useState(false);
  const [with_ipi, setDoesntHasIpi] = useState(false);
  
  const [search, setSearch] = useState('');

  const [updatingAvailability, setUpdatingAvailability] = useState(-1);

  const handleSearch = useCallback(async (search: string) => {
    try {
      setLoading(true);

      const {
        data: {
          data: {
            data
          }
        }
      } =  await api.get('/products', {
        params: {
          reference: search.toLowerCase(),
          // title: search.toLowerCase(),
          by_supplier: supplier.id
        }
      });

      setFilteredProducts(data);

      setSearch(search);
    } catch (e) {
      console.log('e', e);
    } finally {
      setLoading(false);
    }
  }, [supplier]);

  const fetchSupplierData = useCallback(async () => {
    try {
      if(!supplier) return;
      setLoading(true);
      const { id } = supplier;
      const [fullProductsResponse, productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
        api.get(`products?by_supplier=${id}`),
        api.get(`products?by_supplier=${id}&paginated=true&per_page=${perPage}&page=${currentPage}`),
        api.get(`products/suppliers/${id}/categories`),
        api.get('products/brands', {
          params: { has_supplier: id }
        }), 
      ]);

      const {
        data: {
          data: { data: fullProducts }
        }
      } = fullProductsResponse;

      const {
        data: {
          data: { data: products, meta: { current_page, last_page } }
        }
      } = productsResponse;

      const {
        data: {
          data: categories
        }
      } = categoriesResponse;

      const {
        data: {
          data: brands 
        }
      } = brandsResponse;

      setProducts(fullProducts);
      setFilteredProducts(products);

      setCurrentPage(+current_page);
      setLastPage(+last_page);

      setCategories(categories.map((c: ICategory) => ({ id: c.id, value: c.name, label: c.name })));
      setBrands(brands.map((b: IBrand) => ({ id: b.id, value: b.name, label: b.name })));
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [perPage, supplier, currentPage]);

  const handlePagination = useCallback(async (page: number, search: string) => {
    try {
      if(!supplier) return;

      setLoading(true);

      const { id } = supplier;

      const request = isNotEmpty(search) ? 
        { 
          params: {
            reference: search.toLowerCase()
          }
        } :
      {};

      const {
        data: {
          data: { data: results, meta: { current_page, last_page } }
        }
      } = await api.get(`products?by_supplier=${id}&paginated=true&per_page=${perPage}&page=${page}`, request);

      const formattedResults = !!sortingField ? sortByField(results, sortingField) : results;
      
      setFilteredProducts(formattedResults);

      if (isNotEmpty(search)) {
        setSearchCurrentPage(+current_page);
        setSearchLastPage(+last_page);  
      }
      else {
        setProducts(formattedResults)
        setCurrentPage(+current_page);
        setLastPage(+last_page);
      }
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [sortingField, perPage, supplier])

  const handleFilterStatus = useCallback(async () => {
    if(!hasFiltered) {
      setIsFilterModalOpen(true)
      return;
    }
    
    setWithImage(false);
    setHasPromotion(false);
    setWithRelated(false);
    setWithEmbed(false);
    
    setFilteredProducts(products)
    
    setHasFiltered(false);
  }, [hasFiltered, products])

  useEffect(() => {
    fetchSupplierData();
    setProduct(null as unknown as MainProduct)
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

  const handleRegisterProduct = useCallback(async () => {
    try{
      setLoading(true);
      const data = formRef?.current?.getData();
      // @ts-ignore
      if(data.ean13.length !== 13) {
        setError('Preencha o EAN13 corretamente');
        return;
      }

      await schema.validate(data);
      // @ts-ignore
      const { id: category_id, label: category } = categories.find((c: ICategory) => c.label === data.category_id);
      // @ts-ignore
      const { id: brand_id, label: brand } = brands.find((b: IBrand) => b.label === data.brand_id);

      const productWithId = {
        ...data,
        id: -1,
        supplier_id: supplier.id,
        category_id,
        brand_id,
      };

      const {
        data: { data: response }
      } = await api.post('/products', productWithId);

      setProduct({
        ...response,
        category_id: category,
        brand_id: brand,
        supplier_id: supplier.name,
        seoTags: []
      } as unknown as MainProduct);

      resetProductAttributes();
      push('/store/product');
    } catch(err) {
      if(err instanceof Yup.ValidationError) 
        alert('Preencha todos os campos.')

      console.log('e', err);  
    } finally {
      setLoading(false);
    }
  }, [categories, brands, supplier, schema, formRef, push, setProduct, resetProductAttributes]);
  
  const handleFilterProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = filterFormRef?.current?.getData();

      // @ts-ignore
      const { origin, availability ,by_category, by_brand } = data;

      const params = {
        origin,
        availability
      };
      
      // @ts-ignore
      const category = categories.find(c => c.label === by_category);
      
      // @ts-ignore
      const brand = brands.find(b => b.label === by_brand);
      
      if(!!category) { // @ts-ignore
        params['by_category'] = category.id;
      }

      if(!!brand) { // @ts-ignore
        params['by_brand'] = brand.id;
      }
      
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

      if(isNotEmpty(search)) { // @ts-ignore
        params['reference'] = search.toLowerCase()
      }
      
      // @ts-ignore
      params['with_ncm'] = with_ncm;
      
      // @ts-ignore
      params['with_ipi'] = with_ipi;

      const {
        data: {
          data: { data: products, meta: { current_page, last_page } }
        }
      } = await api.get(`products?paginated=true&per_page=${perPage}`, {
        params
      });

      setFilteredProducts(products);
      setHasFiltered(true);
      setIsFilterModalOpen(false);

      setSearchCurrentPage(+current_page);
      setSearchLastPage(+last_page);  
    
    

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
      perPage,
      search,
      with_ipi,
      with_ncm,
      categories,
      brands,
      supplier,
      with_image,
      with_related,
      has_promotion,
      with_embed,
    ]);

  const handleViewProduct = useCallback((p: MainProduct) => {
    setCurrentViewingProduct(p);
    setIsViewProductModalOpen(true);
  }, []);

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if(sortingField.includes(value)) {
      setFilteredProducts(products.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if(type === 'string')
      setFilteredProducts(prev => sortByField(prev, value));
    else {
      setFilteredProducts(prev => sortNumberFields(prev, value));
    }
    setSortingField(value);
  }, [products, sortingField]);

  const handleEditProduct = useCallback(async (product: MainProduct) => {
    try {
      setLoadingProduct(product.id);
      const {
        data: {
          data: updatedProduct
        }
      } = await api.get(`/products/${product.id}`);
      
      setProduct(null as unknown as MainProduct);

      setProduct(updatedProduct);
      resetProductAttributes();
      push('/store/product');
    } catch(e) {
      console.log('e', e);
    } finally {
      setLoadingProduct(-1);
    }
  }, [setProduct, push, resetProductAttributes]);

  const handleSupplierAvailability = useCallback(async (id: number, status: string) => {
    try {
      setUpdatingAvailability(id);
      // const upload = new FormData();
  
      const availability =
        status === 'Disponível' ? 'Indisponível' : 'Disponível';
      // upload.append('is_available', status ? '1' : '0');
      const {
        data: { data }
      } = await api.put(`/products/${id}`, {
        availability
      });

      const currentProductIndex = filteredProducts.findIndex(p => p.id === id);
      const tempProducts = [...filteredProducts];
  
      tempProducts[currentProductIndex] = data;
      setFilteredProducts(tempProducts);
    } catch(e) {
      console.log('e', e);
    } finally {
      setUpdatingAvailability(-1);
    }
  }, [filteredProducts]);

  const usingSafari = useMemo(() => isOnSafari, []);

  const routeName = useMemo(() =>
    !!supplier ? ['Loja Online', 'Produtos', supplier.name] :
    ['Loja Online', 'Produtos']
  , [supplier])

  const { currentPageValue, lastPageValue } = useMemo(() => ({
    currentPageValue: hasFiltered || isNotEmpty(search) ? searchCurrentPage : currentPage,
    lastPageValue: hasFiltered || isNotEmpty(search) ? searchLastPage : lastPage,
  }), [hasFiltered, search, searchCurrentPage, currentPage, lastPage, searchLastPage])

  return (
    <>
      <Header route={routeName} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <TableHeader>
            <SearchBox
              search={handleSearch}
              onClear={() => {
                setSearch('');
                setFilteredProducts(products)
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
                onClick={() => setIsNewProductModalOpen(true)}
                disabled={loading}
              >
                Novo Produto
              </Button>
            </div>
          </TableHeader>
          {loading ?
            <LoadingContainer
              content="os produtos"
            /> :
          <>
            <Table isOnSafari={usingSafari}>
            <colgroup>
              <col span={1} style={{ width: '11%' }} />
              <col span={1} style={{ width: '39%' }} />
              <col span={1} style={{ width: '29%' }} />
              <col span={1} style={{ width: '9%' }} />
              <col span={1} style={{ width: '12%' }} />
            </colgroup>
            <thead>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('product') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'product' })}
                >
                  <div style={{ display: 'flex' }}>
                    <strong
                      style={{
                        fontFamily: 'Roboto',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}
                    >
                      Código
                    </strong>
                  </div>
                  <SortIcon />
                </TableSortingHeader>  
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Produto
                  <SortIcon />
                </TableSortingHeader> 
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Categoria
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'updated_at' })}
                >
                  Estoque
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                Ação
              </th>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-0.625rem' }}>
                      {p.reference}
                    </div>
                  </td>
                  <td>
                    <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                      {p.title}
                    </TableTitle>
                  </td>
                  <td>/ {!!p.category ? p.category.name : ''}</td>
                  <td
                    style={{ color:
                      p.availability === 'Disponível' ? '#25CFA1' : '#FF6F6F'}
                    }
                  >
                    {p.availability}
                  </td>
                  <td>
                    <div>
                      <TableActionButton
                        onClick={() => handleViewProduct(p)}
                      >
                        <ViewIcon />
                      </TableActionButton>
                      <TableActionButton
                        onClick={() => handleEditProduct(p)}
                        loading={loadingProduct === p.id}
                      >
                        {loadingProduct === p.id ?
                          <LoadingIcon /> : 
                          <EditIcon />  
                        }
                      </TableActionButton>
                      <TableActionButton
                        onClick={() => handleSupplierAvailability(p.id, p.availability)}
                        disabled={updatingAvailability === p.id}
                      >
                        {p.availability === 'Disponível' ? <BagIcon /> : <BagXIcon />}
                      </TableActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <TableFooter>
            {/* <button onClick={clearProducts}>Excluir</button> */}
            <p>{(isNotEmpty(search) || hasFiltered) ? filteredProducts.length : products.length} Produtos</p>
            <Pagination
              currentPage={currentPageValue}
              lastPage={lastPageValue}
              setCurrentPage={(page: number) => handlePagination(page, search)}
            />
          </TableFooter>
          </>
          }
        </Container>
      </MenuAndTableContainer>
      <Modal
        title="Filtro de Produtos"
        isModalOpen={isFilterModalOpen}
        setIsModalOpen={setIsFilterModalOpen}
      >
        <Form ref={filterFormRef} onSubmit={() => {}}>
          <InputContainer style={{ marginTop: '1.875rem' }}>
            <FormSelect
              name="by_category"
              title="Categoria"
              placeholder="Selecione..."
              customWidth="26.25rem"
              data={categories}
            />
          </InputContainer>
          <InputContainer>
            <FormSelect
              name="by_brand"
              title="Marca"
              placeholder="Selecione..."
              customWidth="12.5rem"
              data={brands}
            />
            <FormSelect
              name="by_supplier"
              title="Representada"
              customDefaultValue={{ value: supplier.name, label: supplier.name }}
              customWidth="12.5rem"
              disabled
            />
          </InputContainer>
          <InputContainer>
            <CheckBox
              content="Sem foto"
              value={with_image}
              setValue={setWithImage}
            />
            <CheckBox
              content="Sem Relacionados"
              value={with_related}
              setValue={setWithRelated}
            />
            <CheckBox
              content="Sem Looping"
              value={with_embed}
              setValue={setWithEmbed}
            />
            </InputContainer>
            <InputContainer>
              <CheckBox
                content="Promoção"
                value={has_promotion}
                setValue={setHasPromotion}
              />
              <CheckBox
                content="Sem NCM"
                value={with_ncm}
                setValue={setDoesntHasNcm}
              />
              <CheckBox
                content="Sem IPI"
                value={with_ipi}
                setValue={setDoesntHasIpi}
              />
            </InputContainer>
            <InputContainer>
              <FormSelect
                name="origin"
                title="Origem"
                customWidth="12.5rem"
                data={[
                  { value:'Nacional', label:'Nacional' },
                  { value:'Importado', label: 'Importado' }
                ]}
              />
              <FormSelect
                name="availability"
                title="Estoque"
                customWidth="12.5rem"
                data={[
                  { value:'Disponível', label:'Disponível' },
                  { value:'Indisponível', label: 'Indisponível' },
                  { value:'Pré-Venda', label: 'Pré-Venda' },
                  { value:'Em Cadastro', label: 'Em Cadastro' },
                  { value:'Fora de Linha', label: 'Fora de Linha' }
                ]}
              />
            </InputContainer>
          <Button onClick={handleFilterProducts} type="button" style={{ marginTop: '3.125rem', width: '100%' }}>
            {loading ? <LoadingIcon className="load" /> : 'Filtrar Produtos'}
          </Button>
        </Form>
      </Modal>
      <Modal
        title="Novo Produto"
        isModalOpen={isNewProductModalOpen}
        setIsModalOpen={setIsNewProductModalOpen}
      >
        <Form ref={formRef} onSubmit={() => {}}>
          <InputContainer style={{ marginTop: '2.25rem' }}>
            <FormTitleInput
              name="title"
              title="Título do Produto (Ideal entre 15 e 65 caracteres)"
              width="26.25rem"
              validated={false}
            />
          </InputContainer>
          <InputContainer>
            <FormSelect
              name="category_id"
              title="Categoria do Produto"
              data={categories}
              placeholder="Selecione..."
              customWidth="26.25rem"
            />
          </InputContainer>
          <InputContainer>
            <FormSelect
              name="supplier"
              title="Representada"
              placeholder="Selecione..."
              customWidth="12.5rem"
              disabled
              customDefaultValue={{ value: supplier.name, label: supplier.name }}
            />
            <FormSelect
              name="brand_id"
              title="Marca"
              data={brands}
              placeholder="Selecione..."
              customWidth="12.5rem"
            />
          </InputContainer>
          <InputContainer>
            <FormInput
              name="reference"
              title="Referência"
              width="12.5rem"
              validated={false}
            />
            <FormInputMask
              name="ean13"
              title="EAN13 (Código do Produto)"
              width="12.5rem"
              validated={false}
              maxLength={13}
            />
          </InputContainer>
          <Button
            type="button"
            style={{ marginTop: '1.875rem', width: '100%' }}
            onClick={handleRegisterProduct}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
          </Button>
        </Form>
      </Modal>
      <Modal
        isModalOpen={isViewProductModalOpen}
        setIsModalOpen={setIsViewProductModalOpen}
        style={{ padding: 0 }}
      >
        <DetailsRelatedProduct
          withBorder={false}
          product={currentViewingProduct}
          closeAction={() => setIsViewProductModalOpen(false)}
        />
      </Modal>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
