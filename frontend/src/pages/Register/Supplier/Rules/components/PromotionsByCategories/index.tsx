import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CustomSectionTitle, RulesButton } from '../../styles';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { ReactComponent as PlusIcon } from '~assets/plus_white.svg'
import { ReactComponent as TrashIcon } from '~assets/trash.svg'

import { Header, Content } from './styles';

import { InputContainer } from '~styles/components';
import { MeasureBox } from '@/src/components/MeasureBox';
import { TableActionButton } from '@/src/styles/components/tables';
import { NoTitleSelect } from '@/src/components/NoTitleSelect';
import { SupplierTagInput } from '@/src/components/SupplierTagInput';
import { TableDateBox } from '@/src/components/TableDateBox';
import { useRegister } from '~context/register';
import { api } from '~api';
import { DefaultValueProps, DefaultValuePropsWithId, ICategory, IPromotion } from '~types/main';
import { StaticDateBox } from '@/src/components/StaticDateBox';
import { Input } from '@/src/components/Input';
import { NoTitleMultiSelect } from '@/src/components/NoTitleMultiSelect';
import { isNotEmpty } from '@/src/utils/validation';

type Props = {
  data: IPromotion[];
}

export function PromotionsByCategories({ data }: Props) {
  const { supplier, updateSupplier } = useRegister();
  const [currentData, setCurrentData] = useState(data);
  const [categoryOptions, setCategoryOptions] = useState<DefaultValueProps[]>([]);

  const [content, setContent] = useState<DefaultValuePropsWithId[]>([]);
  const [discountValue, setDiscountValue] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [cleaning, setCleaning] = useState(false);

  const [addingPromotion, setAddingPromotion] = useState(false);
  const [deletingPromotion, setDeletingPromotion] = useState(1);

  const isAddingDisabled = useMemo(() => 
    !supplier.id ||
    addingPromotion ||
    !content.length ||
    !isNotEmpty(validUntil) ||
    !isNotEmpty(discountValue) ||
    !isNotEmpty(minQuantity)
  , [supplier, addingPromotion, content, discountValue, minQuantity, validUntil]);

  const handleAddPromotion = useCallback(async () => {
    try {
      setAddingPromotion(true);
      const { id } = supplier;

      const items = content.map(s => s.id).join(',');

      const requestBody = {
	      discount_value: discountValue,
	      min_quantity: minQuantity,
        valid_until: validUntil,
        type: "categories",
        items,
      }

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/promotions`, requestBody);

      setContent([]);
      setDiscountValue('');
      setMinQuantity('');
      setValidUntil('Carregando');
      setValidUntil('');
      setCleaning(true);

      const promotions = [...currentData, data];
      const currentPromotions = [...supplier.promotions, data]

      // filter remove categorias

      setCurrentData(promotions);
      updateSupplier({ promotions: currentPromotions });
    } catch (e) {
      console.log('e', e);
    } finally {
      setAddingPromotion(false);
      setCleaning(false);
    }
  }, [
      supplier,
      updateSupplier,
      content,
      currentData,
      discountValue,
      minQuantity,
      validUntil
    ]);

  const handleEditPromotion = useCallback(async (order: IPromotion) => {
    try {
      const { id } = supplier;

      // filter remove categorias

      const requestBody = !order.items ?
        {...order, items: order.categories.map(e => e.id).join(',')} :
        order;
      
      // @ts-ignore
      delete order.categories;

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/promotions/${order.id}?_method=PUT`, requestBody);

      const currentPromotions = currentData.map(p => p.id === order.id ? data : p);
      const promotions = supplier.promotions.map(p => p.id === order.id ? data : p);

      setCurrentData(currentPromotions);
      updateSupplier({ promotions });
    } catch (e) {
      console.log('e', e);
    }
  }, [supplier, currentData, updateSupplier]);

  const handleDeletePromotion = useCallback(async (promotionId: number) => {
    try {
      setDeletingPromotion(promotionId);
      
      // push categorias

      const { id } = supplier;

      await api.delete(`/products/suppliers/${id}/promotions/${promotionId}`);

      const currentPromotions = currentData.filter(p => p.id !== promotionId);
      const promotions = supplier.promotions.filter(p => p.id !== promotionId);

      setCurrentData(currentPromotions);
      updateSupplier({ promotions });
      // find and update locally
    } catch (e) {
      console.log('e', e);
    } finally {
      setDeletingPromotion(-1);
    }
  }, [supplier, currentData, updateSupplier]);

  const fetchData = useCallback(async () => {
    try {
      if(!!categoryOptions.length || !supplier || (!!supplier && !supplier.id)) return;

      const {
        data: {
          data: categoriesData
        }
      } = await api.get(`products/suppliers/${supplier.id}/categories`);
      
      // @ts-ignore
      const selectedCategories = currentData.reduce((acc, item) => [...acc, ...item.categories], []).map(e => e.id)
      
      setCategoryOptions(
        categoriesData // @ts-ignore
          .map((p) => ({ id: p.id, value: p.name, label: p.name })) // @ts-ignore
          .filter(e => !selectedCategories.includes(e.id))
      );
    } catch (e) {
      console.log('e', e);
    }
  }, [supplier, categoryOptions, currentData]);

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
        Promoções por categorias para quantidade comprada
      </CustomSectionTitle>
      <Header>
        <div>
          <strong>Categorias</strong>
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
            {!cleaning ? 
              <NoTitleMultiSelect
                placeholder="Selecione..."
                customWidth="31rem"
                data={categoryOptions}
                setValue={() => {}}
                // @ts-ignore
                // setValue={(value) => {
                //   // @ts-ignore
                //   handleEditPromotion({...c, items: value.map(e => e.id).join(',') });
                //   handleCategoryOptions(value);
                // }
                // }
                disabled
                // @ts-ignore
                defaultValue={c.categories.map((c: ICategory) => ({ id: c.id, value: c.name, label: c.name }))}
              /> : 
              <></>
            }
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
              onDateSelect={() => {}}
              disabled
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
          {!cleaning ?
            <NoTitleMultiSelect
              placeholder="Selecione..."
              customWidth="31rem"
              // @ts-ignore
              setValue={setContent}
              data={categoryOptions}
              disabled={!supplier.id}
            /> :
            <></>
            }
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
          {validUntil !== 'Carregando'?
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
    </>
  );
}
