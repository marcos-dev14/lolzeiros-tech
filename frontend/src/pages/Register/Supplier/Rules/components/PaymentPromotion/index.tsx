import React, { useCallback, useMemo, useState } from 'react';
import { CustomSectionTitle } from '../../styles';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { ReactComponent as PlusIcon } from '~assets/plus_white.svg'
import { ReactComponent as TrashIcon } from '~assets/trash.svg'

import { Header, Content, Button } from './styles';

import { InputContainer } from '~styles/components';
import { MeasureBox } from '@/src/components/MeasureBox';
import { TableActionButton } from '@/src/styles/components/tables';
import { StaticDateBox } from '@/src/components/StaticDateBox';
import { IPaymentPromotion } from '~types/main';
import { useRegister } from '~context/register';
import { api } from '~api';
import { isNotEmpty } from '@/src/utils/validation';

type Props = {
  data: IPaymentPromotion[];
}

export function PaymentPromotion({ data = [] }: Props) {
  const { supplier, updateSupplier } = useRegister();
  const [currentData, setCurrentData] = useState(data);
  
  const [minOrder, setMinOrder] = useState('');
  const [paymentTerm, setPaymentTerm] = useState('');
  const [orderDeadline, setOrderDeadline] = useState('');
  
  const [addingPromotion, setAddingPromotion] = useState(false);
  const [deletingPromotion, setDeletingPromotion] = useState(1);

  const excludedDates = useMemo(() =>
    currentData.map(e => new Date(e.payment_term_start))
  , [currentData]);

  const handleAddPromotion = useCallback(async () => {
    try {
      setAddingPromotion(true);
      const { id } = supplier;

      const promotionData = {
        order_deadline: orderDeadline,
        min_value: minOrder,
        payment_term_start: paymentTerm
      }

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/payment_promotions`, promotionData);

      // @ts-ignore
      setOrderDeadline('Carregando');
      // @ts-ignore
      setOrderDeadline('');

      setMinOrder('');
      
      // @ts-ignore
      setPaymentTerm('Carregando');
      // @ts-ignore
      setPaymentTerm('');
      
      const payment_promotions = [...currentData, data];

      setCurrentData(payment_promotions);
      updateSupplier({ payment_promotions });
    } catch (e) {
      console.log('e', e);
    } finally {
      setAddingPromotion(false);
    }
  }, [supplier, updateSupplier, currentData, orderDeadline, minOrder, paymentTerm]);

  const handleEditPromotion = useCallback(async (order: IPaymentPromotion) => {
    try {
      const { id } = supplier;

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/payment_promotions/${order.id}?_method=PUT`, order);

      const payment_promotions = currentData.map(p => p.id === order.id ? data : p);

      setCurrentData(payment_promotions);
      updateSupplier({ payment_promotions });
    } catch (e) {
      console.log('e', e);
    }
  }, [supplier, updateSupplier, currentData]);

  const handleDeletePromotion = useCallback(async (promotionId: number) => {
    try {
      setDeletingPromotion(promotionId);
      
      const { id } = supplier;

      await api.delete(`/products/suppliers/${id}/payment_promotions/${promotionId}`);

      const payment_promotions = currentData.filter(p => p.id !== promotionId);

      setCurrentData(payment_promotions);
      updateSupplier({ payment_promotions });
      // find and update locally
    } catch (e) {
      console.log('e', e);
    } finally {
      setDeletingPromotion(-1);
    }
  }, [supplier, updateSupplier, currentData]);

  const handleShouldUpdate = useCallback(
    (oldValue: string, newValue: string, order: IPaymentPromotion) =>
      String(newValue) !== String(oldValue) && handleEditPromotion(order)
  , [handleEditPromotion]);

  return (
    <>
      <CustomSectionTitle>
        Promoção de Pagamento
      </CustomSectionTitle>
      <Header>
        <div>
          <strong>Data do limite do Pedido</strong>
        </div>
        <div>
          <strong>Valor mínimo do Pedido</strong>
        </div>
        <div>
          <strong>Início do Prazo de Pagamento</strong>
        </div>
        <div>
          <strong>Ação</strong>
        </div>
      </Header>
      {currentData.map((c: IPaymentPromotion) =>
        <Content key={c.id}>
          <div>
            <StaticDateBox
              name=""
              title=""
              width="8.75rem"
              // @ts-ignore
              date={c.order_deadline}
              // onDateSelect={(value) => {
              //   handleEditPromotion({...c, order_deadline: value })
              // }}
              disabled
              onDateSelect={() => {}}
              validated={false}
              noTitle
            />
          </div>
          <div>
            <MeasureBox
              name="minimum_order_value"
              title=""
              measure="R$"
              width="8.75rem"
              validated={false}
              defaultValue={c.min_value}
              // onBlur={({ target: { value: min_value } }) =>
              //   handleShouldUpdate(c.min_value, min_value, {...c, min_value })
              // }
              disabled
              noTitle
            />
          </div>
          <div>
            <StaticDateBox
              name=""
              title=""
              width="12.625rem"
              // @ts-ignore
              date={c.payment_term_start}
              // onDateSelect={(value) =>
              //   handleEditPromotion({...c, payment_term_start: value })
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
          {/* @ts-ignore */}
          {orderDeadline !== 'Carregando' ?
            <StaticDateBox
              name=""
              title=""
              width="8.75rem"
              // @ts-ignore
              // date={!!orderDeadline ? orderDeadline : new Date()}
              date={orderDeadline}
              // @ts-ignore
              onDateSelect={(value) => setOrderDeadline(value)}
              validated={false}
              noTitle
              disabled={!supplier.id}
            /> :
            <></>
          }
        </div>
        <div>
          <MeasureBox
            name="minimum_order_value"
            title=""
            measure="R$"
            width="8.75rem"
            validated={false}
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
            noTitle
            disabled={!supplier.id}
          />
        </div>
        <div>
          {/* @ts-ignore */}
          {paymentTerm !== 'Carregando' ?
            <StaticDateBox
              name=""
              title=""
              width="12.625rem"
              // @ts-ignore
              date={paymentTerm}
              // date={!!paymentTerm ? paymentTerm : new Date()}
              // @ts-ignore
              onDateSelect={(value) => setPaymentTerm(value)}
              validated={false}
              noTitle
              disabled={!supplier.id}
              excludeDates={excludedDates}
            /> :
            <></>
          }
        </div>
        <div>
          <TableActionButton
            disabled={
              !supplier.id || 
              addingPromotion || // @ts-ignore 
              !isNotEmpty(orderDeadline) ||
              !isNotEmpty(minOrder) ||  // @ts-ignore
              !isNotEmpty(paymentTerm)
            }
            onClick={handleAddPromotion}
          >
            {addingPromotion ? <LoadingIcon /> : <PlusIcon />}
          </TableActionButton>
        </div>
      </Content>
    </>
  );
}
