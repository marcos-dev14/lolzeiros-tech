import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { ReactComponent as PdfIcon } from '~assets/pdf-ico.svg';


import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';

import { Container, GoBackButton, EditButton, CancelButton } from './styles';
import { InputContainer, MenuAndTableContainer, SectionTitle } from '~styles/components';

import { api } from '~api';


import { sortByField, sortNumberFields } from '~utils/sorting';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { MeasureBox } from '~components/FormMeasureBox';

import { FormInput } from '@/src/components/FormInput';
import { DateBox } from '@/src/components/DateBox';
import { FormSelect } from '@/src/components/FormSelect';
import React from 'react';
import { Modal } from '@/src/components/Modal';
import { Order } from '../../Register/Clients/Order';
import { Pagination } from '@/src/components/Pagination';
import { TableActionButton, TableFooter, TableSortingHeader, TableTitle } from '@/src/styles/components/tables';
import { TableDateBox } from '@/src/components/TableDateBox';
import { Button, Table, TableHeader } from '../styles';
import { isNotEmpty, isOnSafari } from '@/src/utils/validation';
import { SearchBox } from '@/src/components/SearchBox';
import { useOrder } from '@/src/context/order';
import { OrderHeader } from '@/src/components/OrderHeader/OrderHeader';

interface NewInvoice {
  issuance_date: string;
  number: string;
  value: string;
  term_qty: string;
  percentage_commission: number;
  commercial_percentage: number;
  term_day?: string;
  first?: string;
};

interface Discount {
  auge_commission: string;
  commercial_commission: string;

};

interface OrderInterface {
  id: number;
  code: string;
  buyer_name: string;
  product_supplier_name: string;
  shipping_company_name: string;
  address_city: string;
  created_at: string;
  formated_date: string;
  total_value: string;
  current_status: string;
  discount: {
    auge_commission: string;
    commercial_commission: string;
  };
  seller: {
    id: number;
    name: string;
  };
}

export const formatDateString = (originalDateString: any) => {
  const originalDate = new Date(originalDateString);

  const year = originalDate.getFullYear();
  const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
  const day = originalDate.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function NewInvoice() {

  const { goBack } = useHistory();
  const [formValues, setFormValues] = useState({
    number: '',
    term_qty: '',
    auge_commission: '',
    commercial_commission: '',
    term_day: '',
    value: '',
    first: '',
  });

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orderValue, setOrderValue] = useState<string>('');
  const [isAnyCheckboxSelected, setIsAnyCheckboxSelected] = useState(false);
  const { orderData, setOrderData } = useOrder()



  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hasSearch, setHasSearch] = useState(false);
  const { id } = useParams<{ id: string }>();

  const [orders, setOrders] = useState<OrderInterface>();
  const [discount, setDiscount] = useState<Discount>();
  const formRef = useRef<FormHandles>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderInterface[]>([]);



  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const { value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };


  useEffect(() => {
    const fetchData = async () => {

      try {
        setLoading(true);
        const { data } = await api.get(`/invoices/order/${id}`);
        setOrders(data.order);
        setDiscount(data.discount);
        console.log(data)
        setFormValues({
          number: '',
          term_qty: data.parcelas,
          auge_commission: data.discount.auge,
          commercial_commission: data.discount.commercial,
          term_day: '30',
          value: parseFloat(data.noInvoiceValue).toFixed(2),
          first: '15',
        });
        setSelectedDate(formatDateString(new Date().toDateString()))
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);





  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [error, setError] = useState('');

  const [sortingField, setSortingField] = useState('');


  const [updatingAvailability, setUpdatingAvailability] = useState(-1);

  const availabilityOptions = useMemo(() => [
    { value: 'Disponível', label: 'Disponível' },
    { value: 'Indisponível', label: 'Indisponível' },
    { value: 'Pré-venda', label: 'Pré-venda' },
    { value: 'Fora de linha', label: 'Fora de linha' }
  ], []);



  const newFreeInvoices = async () => {
    try {
      const response = await api.post(
        `invoices/create/free/${id}`,
        null,
        {
          params: {
            issuance_date: formatDateString(selectedDate),
            number: formValues.number,
            value: formValues.value,
            term_qty: formValues.term_qty,
            percentage_commission: formValues.auge_commission,
            commercial_percentage: formValues.commercial_commission,
            term_day: formValues.term_day,
            first: formValues.first,
          },
        }
      );
      setOrderData(null);
      // eslint-disable-next-line no-restricted-globals
      goBack()
      return response.data;
    } catch (error) {
      console.error('Erro na requisição:', error);

      throw new Error('Erro na requisição');
    }
  };

  const newInvoices = async () => {
    try {
      const response = await api.post(
        `invoices/create/${id}`);

      // eslint-disable-next-line no-restricted-globals
      setOrderData(null);
      goBack()
      return response.data;
    } catch (error) {
      console.error('Erro na requisição:', error);

      throw new Error('Erro na requisição');
    }
  };


  const usingSafari = useMemo(() => isOnSafari, []);


  const formattedData = useMemo(() => ({
    order_date: new Date().toISOString(),
    auge_register: new Date().toISOString()
  }), []);

  return (
    <>
      <Header route={['Financeiro', 'Novo Faturamento']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Form ref={formRef} onSubmit={() => { }} initialData={formattedData}>
          <Container >
            {
              // @ts-ignore
              <OrderHeader id={orders?.id} />
            }
            <div style={{ padding: '1rem', backgroundColor: 'rgb(220 240 251)', marginTop: '3rem', marginBottom: '4rem' }}>

              <SectionTitle style={{ marginTop: '2rem' }}>
                Novo Faturamento
              </SectionTitle>
              <InputContainer style={{ alignItems: 'center' }}>
                <FormInput
                  name="NFe"
                  title="NF-e"
                  width="4.8125rem"
                  value={formValues.number}
                  onChange={(event) => handleInputChange(event, 'number')}
                />
                <DateBox
                  name="order_date"
                  title="Data do Faturamento"
                  width="7rem"
                  validated={true}
                  noMinDate={true}
                  hasHour={false}
                  initialDate={selectedDate !== null ? selectedDate : ''}
                  onDateChange={(value) => setSelectedDate(value)}
                />


                <MeasureBox
                  name="value"
                  title="Valor do Faturamento"
                  measure="R$"
                  width="6rem"
                  value={formValues?.value}
                  placeholder='--------'
                  onChange={(event) => handleInputChange(event, 'value')}
                />

                <MeasureBox
                  name="percentage_commission"
                  title="Comissão Auge"
                  measure="%"
                  width="3.125rem"
                  value={formValues.auge_commission}
                  onChange={(event) => handleInputChange(event, 'auge_commission')}

                />
                <EditButton
                  type="button"
                  className="Edit"
                  style={{ fontSize: '0.7rem' }}
                  onClick={() => newFreeInvoices()}
                  disabled={!formValues.number || !selectedDate || !formValues.term_qty || !formValues.auge_commission || !formValues.commercial_commission || !formValues.term_day || !formValues.first || formValues.value === '0'}
                >
                  <p>Criar Faturamento </p>
                </EditButton>

              </InputContainer>
              <InputContainer style={{ alignItems: 'center' }}>
                <FormInput
                  name="term_qty"
                  title="Parcelas"
                  width="6.125rem"
                  value={formValues.term_qty}
                  onChange={(event) => handleInputChange(event, 'term_qty')}
                />
                <FormInput
                  name="term_day"
                  title="Itervalo Parcelas"
                  width="7.125rem"
                  value={formValues.term_day}
                  onChange={(event) => handleInputChange(event, 'term_day')}
                />

                <FormInput
                  name="first"
                  title="Primeiro Pagamento"
                  width="7.125rem"
                  value={formValues.first}
                  onChange={(event) => handleInputChange(event, 'first')}

                />
                <MeasureBox
                  name="commercial_percentage"
                  title="Comissão Comercial"
                  measure="%"
                  width="5rem"
                  value={formValues.commercial_commission}
                  onChange={(event) => handleInputChange(event, 'commercial_commission')}
                />





              </InputContainer>
              <InputContainer>
                <FormInput
                  name="observation"
                  title="Observação"
                  width="39.875rem"
                  onChange={(event) => handleInputChange(event, 'observation')}
                />
              </InputContainer>
            </div>

            <Modal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              customOnClose={() => {
                setIsModalOpen(false)
              }}
            >
              <h2>Criar novo Faturamento?</h2>
              <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto' }}>
                <EditButton
                >
                  Confirmar
                </EditButton>
                <CancelButton onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </CancelButton>
              </div>
            </Modal>
          </Container>
        </Form>
      </MenuAndTableContainer >
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
