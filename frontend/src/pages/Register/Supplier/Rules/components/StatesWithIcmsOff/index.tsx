import React, { useCallback, useEffect, useState } from 'react';
import { CustomSectionTitle } from '../../styles';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { ReactComponent as PlusIcon } from '~assets/plus_white.svg'
import { ReactComponent as TrashIcon } from '~assets/trash.svg'

import { Header, Content } from './styles';

import { InputContainer } from '~styles/components';
import { MeasureBox } from '@/src/components/MeasureBox';
import { NoTitleMultiSelect } from '@/src/components/NoTitleMultiSelect';
import { TableActionButton } from '@/src/styles/components/tables';
import { useRegister } from '~context/register';
import { api } from '~api';
import { DefaultValuePropsWithId, DefaultValueProps, ICountryState, IStateDiscount } from '~types/main';
import { isNotEmpty } from '@/src/utils/validation';

type Props = {
  data: IStateDiscount[];
}

export function StatesWithIcmsOff({ data = [] }: Props) {
  const { updateSupplier, supplier } = useRegister();
  const [currentData, setCurrentData] = useState(data);
  
  const [discountValue, setDiscountValue] = useState('');
  const [additionalValue, setAdditionalValue] = useState('');
  const [states, setStates] = useState<DefaultValuePropsWithId[]>([]);

  const [valueModifierDisabled, setValueModifierDisabled] = useState('');
  
  const [addingStateDiscount, setAddingStateDiscount] = useState(false);
  const [deletingStateDiscount, setDeletingStateDiscount] = useState(-1);
  
  const [countryStates, setCountryStates] = useState<DefaultValueProps[]>([]);

  const [cleaning, setCleaning] = useState(false);

  const fetchStates = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.get('/country_states');
      // @ts-ignore
      const registeredStates =
        currentData // @ts-ignore
          .reduce((acc, value) => [...acc, ...value.states], []).map(e => e.id)

      const currentStates = data.map((s: ICountryState) => ({ id: s.id, value: s.code, label: s.code }));
      // @ts-ignore
      setCountryStates(currentStates.filter(e => !registeredStates.includes(e.id)));
    } catch (e) {
      console.log('e', e);
    }
  }, [currentData]);

  const handleAddStateDiscount = useCallback(async () => {
    try {
      setCleaning(true);
      setAddingStateDiscount(true);
      const { id } = supplier;

      const formattedStates = states.map(s => s.id).join(',');

      const icmsOffData = {
        discount_value: discountValue,
        additional_value: additionalValue,
        states: formattedStates
      }

      const { 
        data: { data }
      } = await api.post(`/products/suppliers/${id}/state_discounts`, icmsOffData);

      setDiscountValue('');
      setAdditionalValue('');
      setStates([]);

      const state_discounts = [...currentData, data];

      setCurrentData(state_discounts);
      updateSupplier({ state_discounts });
    } catch (e) {
      console.log('e', e);
    } finally {
      setCleaning(false);
      setAddingStateDiscount(false);
    }
  }, [supplier, updateSupplier, currentData, discountValue, additionalValue, states]);

  const handleEditStateDiscount = useCallback(async (order: IStateDiscount) => {
    try {
      const { id } = supplier;

      const formattedStates = order.states.map(s => s.id).join(',');

      const requestBody = {
        ...order,
        states: formattedStates
      };

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/state_discounts/${order.id}?_method=PUT`, requestBody);

      const state_discounts = currentData.map(p => p.id === order.id ? data : p);

      setCurrentData(state_discounts);
      updateSupplier({ state_discounts });
    } catch (e) {
      console.log('e', e);
    }
  }, [supplier, currentData, updateSupplier]);

  const handleDeleteStateDiscount = useCallback(async (stateDiscountId: number) => {
    try {
      setDeletingStateDiscount(stateDiscountId);
      
      const { id } = supplier;

      await api.delete(`/products/suppliers/${id}/state_discounts/${stateDiscountId}`);

      const state_discounts = currentData.filter(p => p.id !== stateDiscountId);

      setCurrentData(state_discounts);
      updateSupplier({ state_discounts });
      
      // find and update locally
    } catch (e) {
      console.log('e', e);
    } finally {
      setDeletingStateDiscount(-1);
    }
  }, [supplier, updateSupplier, currentData]);

  const handleShouldUpdate = useCallback(
    (oldValue: string, newValue: string, order: IStateDiscount) =>
      String(newValue) !== String(oldValue) && handleEditStateDiscount(order)
  , [handleEditStateDiscount]);

  const handleStateOptions = useCallback((value: DefaultValuePropsWithId[]) => {
    if (states.length < value.length) {
      const { label } = value[value.length - 1];
      setCleaning(true);
      setCountryStates(prev => prev.filter(e => e.label !== label));
      setCleaning(false);
    }
    if (states.length > value.length) {
      setCleaning(true);
      const currentElement = states.filter(s => !value.includes(s));
      // @ts-ignore
      setCountryStates(prev => prev.concat(currentElement));
      setCleaning(false);

    }
  }, [states])

  useEffect(() => {
    fetchStates();
  }, [])

  return (
    <>
      <CustomSectionTitle>
        Política Comercial - Desconto por diferenças de ICMS entre Estados
      </CustomSectionTitle>
      <Header>
        <div>
          <strong>Estados com Desconto ICMS</strong>
        </div>
        <div>
          <strong>Desconto</strong>
        </div>
        <div>
          <strong>Acréscimo</strong>
        </div>
        <div>
          <strong>Ação</strong>
        </div>
      </Header>
      {currentData.map((c: IStateDiscount) =>
        <Content key={c.id}>
          <div>
            {!cleaning ? 
              <NoTitleMultiSelect
                placeholder="Selecione..."
                customWidth="100%"
                setValue={() => {}}
                // @ts-ignore
                // setValue={(value) => {
                //   handleEditStateDiscount({...c, states: value});
                //   handleStateOptions(value);
                // }}
                disabled
                data={countryStates}
                defaultValue={c.states.map((s: ICountryState) => ({ id: s.id, value: s.code, label: s.code }))}
              /> :
              <></>
              }
          </div>
          <div>
            <MeasureBox
              name="discount_value"
              title=""
              measure="%"
              width="3rem"
              validated={false}
              defaultValue={c.discount_value}
              // onBlur={({ target: { value: discount_value } }) =>
              //   handleShouldUpdate(c.discount_value, discount_value, {...c, discount_value })
              // }
              disabled
              noTitle
            />
          </div>
          <div>
            <MeasureBox
              name="additional_value"
              title=""
              measure="%"
              width="3rem"
              validated={false}
              defaultValue={c.additional_value}
              // onBlur={({ target: { value: additional_value } }) =>
              //   handleShouldUpdate(c.additional_value, additional_value, {...c, additional_value })
              // }
              disabled
              noTitle
            />
          </div>
          <div>
            <TableActionButton
              disabled={deletingStateDiscount === c.id}
              onClick={() => handleDeleteStateDiscount(c.id)}
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
              customWidth="100%"
              // @ts-ignore
              setValue={(value) => {
                setStates(value);
                handleStateOptions(value);
              }}
              data={countryStates}
              disabled={!supplier.id}
            /> :
            <></>
          }
        </div>
        <div>
          <MeasureBox
            name="discount_value"
            title=""
            measure="%"
            width="3rem"
            validated={false}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            noTitle
            onBlur={({ target: { value } }) =>
              setValueModifierDisabled(!!value ? 'additional_value' : '') 
             }
            disabled={!supplier.id || valueModifierDisabled === 'discount_value'}
          />
        </div>
        <div>
          <MeasureBox
            name="additional_value"
            title=""
            measure="%"
            width="3rem"
            validated={false}
            value={additionalValue}
            onChange={(e) => setAdditionalValue(e.target.value)}
            noTitle
            onBlur={({ target: { value } }) =>
              setValueModifierDisabled(!!value ? 'discount_value' : '') 
             }
            disabled={!supplier.id || valueModifierDisabled === 'additional_value'}
          />
        </div>
        <div>
          <TableActionButton
            onClick={handleAddStateDiscount}
            disabled={
              !supplier.id ||
              addingStateDiscount ||
              (!states.length ||
                (!isNotEmpty(discountValue) && !isNotEmpty(additionalValue))
              )
            }
          >
            {addingStateDiscount ? <LoadingIcon /> : <PlusIcon />}
          </TableActionButton>
        </div>
      </Content>
    </>
  );
}
