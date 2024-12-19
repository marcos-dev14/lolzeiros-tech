import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CustomSectionTitle } from '../../styles';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { ReactComponent as PlusIcon } from '~assets/plus_white.svg'
import { ReactComponent as TrashIcon } from '~assets/trash.svg'
import { ReactComponent as AlertIcon } from '~assets/alerta-icon.svg';

import { Header, Content, SearchProductsContainer } from './styles';

import { InputContainer } from '~styles/components';
import { MeasureBox } from '@/src/components/MeasureBox';
import { TableActionButton } from '@/src/styles/components/tables';
import { NoTitleSelect } from '@/src/components/NoTitleSelect';
import { SupplierTagInput } from '@/src/components/SupplierTagInput';
import { useRegister } from '~context/register';
import { api } from '~api';
import { DefaultValuePropsWithId, ICategory, IPromotion, IPromotionProps, ITag, MainProduct } from '~types/main';
import { StaticDateBox } from '@/src/components/StaticDateBox';
import { Input } from '@/src/components/Input';
import { NoTitleMultiSelect } from '@/src/components/NoTitleMultiSelect';
import { ErrorModal } from '@/src/components/ErrorModal';
import { Modal } from '@/src/components/Modal';
import { isNotEmpty } from '@/src/utils/validation';
import { isTaggedTemplateExpression } from 'typescript';
import { PromotionProductTagInput } from '@/src/components/PromotionProductTagInput';
import { TagInput } from '@/src/components/TagInput';
import {
  Title as ModalTitle,
  Description as ModalDescription,
  ConfirmationButton as ModalConfirmationButton,
  Button as ModalButton
} from '@/src/components/ConfirmationModal/styles';
import { VerticalTagInput } from '@/src/components/VerticalTagInput';

type Props = {
  data: IPromotion[];
}

type IProductID = {
  id: string;
  value: string;
}

type IPromotionProduct = {
  id: string;
  title: string;
}

export function PromotionsByProducts({ data }: Props) {
  const { supplier, updateSupplier } = useRegister();
  const [currentData, setCurrentData] = useState(data);
  const [productOptions, setProductOptions] = useState([]);

  const [content, setContent] = useState('');
  const [productId, setProductId] = useState<IProductID[]>([]);
  const [discountValue, setDiscountValue] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [cleaning, setCleaning] = useState(false);
  const [updatingPromotion, setUpdatingPromotion] = useState(-1);
  const [lookingUpProduct, setLookingUpProduct] = useState('-1');
  const [newPromotionProduct, setNewPromotionProduct] = useState<IPromotionProduct>(null as unknown as IPromotionProduct);

  const [searchProducts, setSearchProducts] = useState<MainProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  
  const [tags, setTags] = useState<ITag[]>([])

  const [currentProduct, setCurrentProduct] =
    useState<IPromotion>(null as unknown as IPromotion);
  
  const [addingPromotion, setAddingPromotion] = useState(false);
  const [deletingPromotion, setDeletingPromotion] = useState(1);

  const isAddingDisabled = useMemo(() => 
    !supplier.id ||
    addingPromotion ||
    !isNotEmpty(content) ||
    !isNotEmpty(discountValue) ||
    !isNotEmpty(validUntil) ||
    !isNotEmpty(minQuantity)
  , [supplier, addingPromotion, content, discountValue, minQuantity, validUntil]);

  const currentPromotionProducts = useMemo(() => // @ts-ignore
    currentData.map(e => e.products.map(p => p.name).join(',')).join(',')
  , [currentData]);

  const handleAddPromotion = useCallback(async () => {
    try {
      setAddingPromotion(true);
      const { id } = supplier;

      const requestBody = {
	      discount_value: discountValue,
	      min_quantity: minQuantity,
        valid_until: validUntil,
        type: "products",
        items: productId.map(e => e.id, '').join(','),
      }

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/promotions`, requestBody);

      setContent('');
      setProductId([]);
      setDiscountValue('');
      setMinQuantity('');
      setValidUntil('Carregando');
      setValidUntil('');
      setCleaning(true);

      const currentPromotions = [...currentData, data];
      const supplierPromotions = !!supplier.promotions ? supplier.promotions : []
      const promotions = [...supplierPromotions, data]

      setCurrentData(currentPromotions);
      updateSupplier({ promotions });
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar a regra.';

      setError(errorMessage);
    } finally {
      setAddingPromotion(false);
      setCleaning(false);
    }
  }, [
      productId,
      supplier,
      updateSupplier,
      currentData,
      discountValue,
      minQuantity,
      validUntil
    ]);

  const handleEditPromotion = useCallback(async (order: IPromotion) => {
    try {
      setUpdatingPromotion(order.id);
      const { id } = supplier;

      // const requestBody = !order.items ?
      //   {...order, items: order.products.map(e => e.id).join(',')} :
      //   order;
      // const requestBody = order;
      
      // @ts-ignore
      delete order.products;

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/promotions/${order.id}?_method=PUT`, order);

      const currentPromotions = currentData.map(p => p.id === order.id ? data : p);
      const promotions = supplier.promotions.map(p => p.id === order.id ? data : p);

      setCurrentData(currentPromotions);
      updateSupplier({ promotions });
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar o cliente.';

      setError(errorMessage);
    } finally {
      setUpdatingPromotion(-1);
    }
  }, [supplier, currentData, updateSupplier]);

  const handleDeletePromotion = useCallback(async (promotionId: number) => {
    try {
      setDeletingPromotion(promotionId);
      
      const { id } = supplier;

      await api.delete(`/products/suppliers/${id}/promotions/${promotionId}`);

      const currentPromotions = currentData.filter(p => p.id !== promotionId);
      const promotions = supplier.promotions.filter(p => p.id !== promotionId);

      setCurrentData(currentPromotions);
      updateSupplier({ promotions });
      // find and update locally
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar o cliente.';

      setError(errorMessage);
    } finally {
      setDeletingPromotion(-1);
    }
  }, [supplier, currentData, updateSupplier]);

  const handleLookupProduct = useCallback(async (value: string) => {
    try {
      const {
        data: {
          data
        }
      } = await api.get(`/products`, {
        params: {
          reference: value,
          by_supplier: supplier.id,
          paginated: false
        }
      });
      
      if (!data.length) {
        setError('Nenhum produto foi encontrado.');
        return;
      }

      setSearchProducts(data);
      setIsModalOpen(true);
    } catch(e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar o cliente.';

      setError(errorMessage);
    } finally {
      setLookingUpProduct('-1');
    }
  }, [supplier]);

  const handleProductName = useCallback((id: string, title: string) => {
    setContent(prev => !!prev.length ? `${prev},${title}` : `${title}`); // array de nomes
    setProductId(prev => [...prev, { id, value: title }]) // array de ids
    setIsModalOpen(false);
  }, [handleEditPromotion])

  const handleDeleteProductName = useCallback((value: string) => {
    setContent(content.split(',').filter(e => e !== value).join(',')); // array de nomes
    setProductId(productId.filter(e => e.value !== value)) // array de ids
  }, [content, productId, handleEditPromotion])

  const fetchData = useCallback(async () => {
    try {
      if(!!productOptions.length || !supplier || (!!supplier && !supplier.id)) return;

      const {
        data: {
          data: productsData
        }
      } = await api.get(`products?by_supplier=${supplier.id}&paginated=false`);
      
      // @ts-ignore
      setProductOptions(productsData.map((p) => ({ id: p.id, value: p.title, label: p.title })));
    } catch (e) {
      console.log('e', e);
    }
  }, [supplier, productOptions]);

  const handleShouldUpdate = useCallback(
    (oldValue: string, newValue: string, order: IPromotion) =>
      String(newValue) !== String(oldValue) && handleEditPromotion(order)
  , [handleEditPromotion]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <CustomSectionTitle>
        Promoções por produtos para quantidade comprada
      </CustomSectionTitle>
      <Header>
        <div>
          <strong>Produtos</strong>
        </div>
        <div>
          <strong>Qt Mínima</strong>
        </div>
        <div>
          <strong>Desconto</strong>
        </div>
        <div>
          <strong>Validade</strong>
        </div>
        <div>
          <strong>Ação</strong>
        </div>
      </Header>
      {currentData.map(c => 
        <Content key={c.id}>
          <div>
            <PromotionProductTagInput // @ts-ignore
              tags={c.products.map(e => e.name).join(',')}
              disabled
              customOnBlur={() => {}}
              deleteTag={() => {}}
            />
          </div>
          <div>
            <Input
              name="min_q"
              noTitle
              width="6.375rem"
              validated={false}
              defaultValue={c.min_quantity}
              // onBlur={({ target: { value: min_quantity } }) =>
              //   handleShouldUpdate(String(c.min_quantity), min_quantity, {...c, min_quantity })
              // }
              disabled
              noValueInput
            />
          </div>
          <div>
            <MeasureBox
              name="discount_value"
              title=""
              measure="%"
              width="4.625rem"
              validated={false}
              defaultValue={c.discount_value}
              // onBlur={({ target: { value: discount_value } }) =>
              //   handleShouldUpdate(String(c.discount_value), discount_value, {...c, discount_value })
              // }
              disabled
              noTitle
            />
          </div>
          <div>
            <StaticDateBox
              name="valid_until"
              title=""
              width="6.625rem"
              // @ts-ignore
              date={c.valid_until}
              // onDateSelect={(value) =>
              //   handleEditPromotion({...c, valid_until: value })
              // }
              disabled
              onDateSelect={() => {}}
              validated={false}
              noTitle
            />
          </div>
          <div>
            <TableActionButton
              disabled={deletingPromotion === c.id}
              onClick={() => handleDeletePromotion(c.id)}
            >
              <TrashIcon />
            </TableActionButton>
          </div>
        </Content>
      )}
      <Content style={{ backgroundColor: '#f2f2f2' }}>
        <div>
          {/* <Input
            name="product"
            noTitle
            width="31rem"
            validated={false}
            value={lookingUpProduct === 'new' ? 'Aguarde...' : content}
            disabled={lookingUpProduct === 'new'}
            onChange={(e) => setContent(e.target.value)}
            onBlur={({ target: { value } }) => {
              if (isNotEmpty(value)) {
                setLookingUpProduct('new')
                handleLookupProduct(value);
              } 
            }
            }
          />  */}
          <VerticalTagInput
            tags={content}
            customOnBlur={(value: string) => {
              if (isNotEmpty(value)) {
                setLookingUpProduct('new')
                handleLookupProduct(value);
              }
            }
            }
            deleteTag={handleDeleteProductName}
            placeholder="Digite a referência para encontrar o produto desejado"
            width="40.25rem"
          />
          {/* <PromotionProductTagInput
            tags=""
            customOnBlur={(value: string) => {
              if (isNotEmpty(value)) {
                setLookingUpProduct('new')
                handleLookupProduct(value);
              }
            }
            }
            deleteTag={handleDeleteProductName}
            placeholder="Digite a referência para encontrar o produto desejado"
            width="10.75rem"
            style={{
              marginLeft: '0.5rem'
            }} 
          />
            */}
        </div> 
        <div>
          <Input
            name="min_q"
            noTitle
            width="6.375rem"
            validated={false}
            value={minQuantity}
            onChange={(e) => setMinQuantity(e.target.value)}
            disabled={!supplier.id}
          />
        </div>
        <div>
          <MeasureBox
            name="discount_value"
            title=""
            measure="%"
            width="4.625rem"
            validated={false}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            noTitle
            disabled={!supplier.id}
          />
        </div>
        <div>
          {validUntil !== 'Carregando' ?
            <StaticDateBox
              name=""
              title=""
              width="6.625rem"
              // @ts-ignore
              date={validUntil}
              onDateSelect={(value) => setValidUntil(value)}
              validated={false}
              noTitle
              disabled={!supplier.id}
            /> :
            <></>
          }
        </div>
        <div>
          <TableActionButton
            disabled={isAddingDisabled}
            onClick={handleAddPromotion}
          >
            {addingPromotion ? <LoadingIcon /> : <PlusIcon />}
          </TableActionButton>
        </div>
      </Content>
      <Modal
        title="Selecione o produto"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        customOnClose={() => {}}
        style={{ width: 471 }}
      >
        <SearchProductsContainer>
          {searchProducts.map((p) => 
            <div key={p.id}>
              <Input
                name=""
                noTitle
                disabled
                width="100%"
                fullW
                value={p.title}
                validated
              />
              <TableActionButton
                onClick={() =>
                  currentPromotionProducts.includes(p.title) ? 
                  setNewPromotionProduct({ id: String(p.id), title: p.title }) :
                  handleProductName(String(p.id), p.title)
                }
                style={{ marginLeft: '1rem' }}
              >
                <PlusIcon />
              </TableActionButton>
            </div>
          )}
        </SearchProductsContainer>
      </Modal>
      <Modal
        hasCloseButton
        isModalOpen={!!newPromotionProduct}
        setIsModalOpen={() => 
          setNewPromotionProduct(null as unknown as IPromotionProduct)
        }
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          margin: 'auto 0',
          width: 603,
          height: 494,
        }}
      >
        <AlertIcon />
        <ModalTitle>Atenção</ModalTitle>
        <ModalDescription
          style={{
            height: 'auto'
          }}
        >
          O produto selecionado para esta nova regra já está presente em outra regra desta seção. Deseja continuar e aplicar mais uma regra ao mesmo produto?
        </ModalDescription>
        <ModalConfirmationButton
          onClick={() => {
            handleProductName(newPromotionProduct.id, newPromotionProduct.title);
            setNewPromotionProduct(null as unknown as IPromotionProduct)
          }}
          style={{
            marginTop: '2rem'
          }}
        >
          Avançar
        </ModalConfirmationButton>
        <ModalButton
          onClick={() => 
            setNewPromotionProduct(null as unknown as IPromotionProduct)
          }
        >
          Cancelar
        </ModalButton>

      </Modal>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
