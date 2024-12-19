import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { ReactComponent as ViewIcon } from '~assets/plus.svg'
import { ReactComponent as CloseIcon } from '~assets/trash.svg';
import 'react-tabs/style/react-tabs.css';



import { Header } from '~components/Header';
import { Menu } from '~components/Menu';


import { Container, GoBackButton, EditButton, CancelButton } from './styles';
import { InputContainer, MenuAndTableContainer, SectionTitle } from '~styles/components';

import { api } from '~api';

import { MainProduct, PDFFile } from '~types/main';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { emptyFieldRegex, isNotEmpty, isOnSafari } from '~utils/validation';
import { useProduct } from '@/src/context/product';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { MeasureBox } from '~components/FormMeasureBox';

import { FormInput } from '@/src/components/FormInput';
import { DateBox } from '@/src/components/DateBox';
import { FormSelect } from '@/src/components/FormSelect';
import React from 'react';
import { TableActionButton } from '@/src/styles/components/tables';
import { formatDateString } from '../NewInvoice';
import { useOrder } from '@/src/context/order';
import { Discount, Order, OrderHeader } from '@/src/components/OrderHeader/OrderHeader';
import InvoiceTabs from '@/src/components/TabInvoiceService/TabInvoiceService';
import { Modal } from '@/src/components/Modal';


export interface InvoiceBillet {
  id: number;
  number: string;
  due_date: string;
  paid_at: string;
  value: number;
  commission: string;
  discounted_price: string;
  discount: string;
  percentage_commission: string;
  commercial_commission: string;
  commercial_percentage: string;
  paid_commission: string;
  paid_commercial: string;
  observation: string;
  invoice_id: number;
  title_bearer: string;

  invoice_billet_status_id: number;
  created_at: string;
  updated_at: string;
  invoice_billetstatus: {
    id: number;
    name: string;
    created_at: string | null;
    updated_at: string | null;
  };
  change?: string[];
}

export interface formDataAtt {
  numberOfBillets: number;
  paymentTerm: number;
  firstPayment: number;
  observation: string;
  number: string;
  value: string;
  status: number;
  percentage_commission: string;
  commercial_percentage: string;
  paid_at: string;
}


export const colourOptions = [
  { value: 1, label: "Aberto" },
  { value: 2, label: "Fechado" },
  { value: 3, label: "Cancelado" },
];

export interface invoiceInterface {
  id: number;
  number: string;
  issuance_date: string;
  commercial_commission: string;
  commercial_percentage: string;
  percentage_commission: string;
  commission: string;
  observation: string;
  status: number;
  term_day: number;
  term_qty: number;
  term_payment: number;
  value: string;
  order: Order;
  invoice_billets: InvoiceBillet[];
  pdfs_imports: PDFFile[];
  paid_at: string;
  data_base: string;
  invoices_logs: [
    {
      id: number;
      invoice_id: number;
      mod: string;
      created_at: string;
      updated_at: string;
      deleted_at: string;
      user: {
        id: number;
        name: string;
      }
    }
  ]
}

export function EditFinances() {
  const { push, goBack } = useHistory();
  const [billetObservations, setBilletObservations] = useState<Record<number, InvoiceBillet>>({});
  const [billetStatus, setBilletStatus] = useState<Record<number, InvoiceBillet>>({});

  const [formValues, setFormValues] = useState<formDataAtt>();

  const [selectedDate, setSelectedDate] = useState<string>();
  const [selectedBaseDate, setSelectedBaseDate] = useState<string>('');

  const [pdf, setPdf] = useState<boolean>(false);


  const formRef = useRef<FormHandles>(null);
  const [pValue, setPValue] = useState<string>();
  const [sValue, setSValue] = useState<string>();
  const [disc, setDisc] = useState<Discount>();
  const [noInvoiceValue, setNoInvoiceValue] = useState<string>();

  const [estadoSelecionado, setEstadoSelecionado] = useState<number>();
  const valorPreselecionado = colourOptions.find(option => option.value === estadoSelecionado)


  const [invoiceData, setInvoiceData] = useState<invoiceInterface>();
  const [edit, setEdit] = useState(true)
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [delModalOpen, setDelModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [tickets, setTickets] = useState([]);
  const [sumDiscount, setSumDiscount] = useState<string>();

  const [fullTickets, setFullTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([
    {
      id: 1,
      ticket: '943472',
      client: 'João Botelho Brinquedos LTDA',
      state: 'pending',
      subject: 'Meus produtos do pedido 738366B ainda não chegaram',
      date: new Date().toISOString(),
      answered: '2 dias',
    },
    {
      id: 2,
      ticket: '943471',
      client: 'João Botelho Brinquedos LTDA',
      state: 'done',
      subject: 'Meus produtos do pedido 738366B ainda não chegaram',
      date: new Date().toISOString(),
      answered: '2 dias',
    }
  ]);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {

    const { value } = event.target;
    if (!!formValues) {
      // @ts-ignore
      setFormValues((prevValues: formDataAtt) => ({
        ...prevValues,
        [name]: value,
      }));

      setEdit(false);
    }
  };

  const handlePaidBillet = async (id: number) => {
    try {

      await api.post(`billets/paid/${id}`)
      // eslint-disable-next-line no-restricted-globals
      location.reload()
    }
    catch {
      throw new Error('Erro na requisição');

    }
  }

  const handleUnPaidBillet = async (id: number) => {
    try {

      await api.post(`billets/unpaid/${id}`)
      // eslint-disable-next-line no-restricted-globals
      location.reload()
    }
    catch {
      throw new Error('Erro na requisição');

    }
  }

  function onPayDateChange(value: string, id: number, field: string) {
    setBilletObservations((prevObservations) => ({
      ...prevObservations,
      [id]: {
        ...prevObservations[id],
        [field]: value,
      },
    }));
  }

  const handleObservationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    billetId: number,
    field: string,
  ) => {

    const value = typeof event === 'string' ? event : event.target.value;

    setBilletObservations((prevObservations: Record<number, InvoiceBillet>) => {
      const currentObservation = prevObservations[billetId] || {} as InvoiceBillet;
      const currentChangeArray = currentObservation.change || [];
      console.log(billetObservations)
      const updatedChangeArray = currentChangeArray.includes(field) ? currentChangeArray : [...currentChangeArray, field];

      return {
        ...prevObservations,
        [billetId]: {
          ...currentObservation,
          [field]: value,
          change: updatedChangeArray,
        },
      };
    });
  };






  const updateBilletObservation = async (billetId: number) => {
    try {
      const {
        observation,
        paid_at,
        percentage_commission,
        commercial_percentage,
        discount,
        paid_commission,
        paid_commercial,
        discounted_price,
      } = billetObservations[billetId];
      console.log(billetObservations[billetId]);

      const validObservation = billetObservations[billetId]?.change?.find(ele => ele === 'observation') ? observation : null;
      const validPaidAt = typeof paid_at !== 'object' ? null : (paid_at !== null ? formatDateString(paid_at) : null);
      const validPercentageCommission = billetObservations[billetId]?.change?.find(ele => ele === 'percentage_commission') ? percentage_commission : null;
      const validCommercialPercentage = billetObservations[billetId]?.change?.find(ele => ele === 'commercial_percentage') ? commercial_percentage : null;
      const validDiscount = billetObservations[billetId]?.change?.find(ele => ele === 'discount') ? discount : null;
      const validPaidCommission = typeof paid_commission !== 'object' ? null : (paid_commission !== null ? formatDateString(paid_commission) : null);
      const validPaidCommercial = typeof paid_commercial !== 'object' ? null : (paid_commercial !== null ? formatDateString(paid_commercial) : null);
      const validDiscountedPrice = billetObservations[billetId]?.change?.find(ele => ele === 'discounted_price') ? discounted_price : null;
      const validTitle_bearer = billetObservations[billetId].title_bearer ?? null;

      await api.post(`billets/${billetId}`, {
        obs: validObservation,
        pay: validPaidAt,
        auge: validPercentageCommission,
        commercial: validCommercialPercentage,
        discount: validDiscount,
        auge_date: validPaidCommission,
        commercial_date: validPaidCommercial,
        discounted_price: validDiscountedPrice,
        title_bearer: validTitle_bearer
      });

      setPdf(!pdf);

    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`invoices/${id}`);
        const invoiceType: invoiceInterface = data.invoice;
        const { data: data1 } = await api.get(`/invoices/order/${invoiceType.order.id}`);
        const pValue = data.paidValue;
        const sValue = data.checkValue;

        setPValue(pValue);
        setSValue(sValue);
        setSumDiscount(data.discountBillets)
        setEstadoSelecionado(invoiceType.status)
        setDisc(data.discountOrder);
        setNoInvoiceValue(data.noInvoicedValue);
        setInvoiceData(invoiceType);
        setFormValues({
          numberOfBillets: invoiceType?.term_qty ?? 0,
          paymentTerm: invoiceType?.term_payment ?? 0,
          firstPayment: invoiceType?.term_day ?? 0,
          observation: invoiceType?.observation === null ? '' : invoiceType.observation,
          number: invoiceType.number ?? `${invoiceType.order.code}- ${data1.order.invoice.length}`,
          status: invoiceType.status ?? '',
          value: invoiceType.value ?? '',
          percentage_commission: invoiceType.percentage_commission ?? '',
          commercial_percentage: invoiceType.commercial_percentage ?? '',
          paid_at: invoiceType.paid_at ?? ''
        });

        setSelectedDate(invoiceType?.issuance_date === null ? formatDateString(new Date().toString()) : invoiceType.issuance_date);
        setSelectedBaseDate(invoiceType?.data_base === null ? formatDateString(new Date().toString()) : invoiceType.data_base);

        if (Array.isArray(invoiceType.invoice_billets)) {
          const initialBilletObservations: Record<number, InvoiceBillet> = {};
          invoiceType.invoice_billets.forEach((billet) => {
            initialBilletObservations[billet.id] = billet;
          });
          setBilletObservations(initialBilletObservations);
          setBilletStatus(initialBilletObservations);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching invoice data:', error);
      }
    };

    fetchData();
  }, [id, pdf]);


  const { orderData, setOrderData } = useOrder()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [sortingField, setSortingField] = useState('');

  const updateBillets = async (invoiceId: number, i: number, f: number, t: number) => {
    try {
      const response = await api.post(
        `invoices/updatebillets/${invoiceId}`,
        null,
        {
          params: {
            installment: i,
            first: f,
            term: t,
          },
        }
      );

      setOrderData(null);
      // eslint-disable-next-line no-restricted-globals
      setPdf(!pdf)
      setIsModalOpen(false);
      return response.data;
    } catch (error) {
      setError('Erro da Edição');

      throw new Error('Erro na requisição');
    }
  };

  const updateInvoices = async (invoiceId: string, o: string, n: string, date: string, v: string, cp: string, ap: string, data_base: string) => {
    try {

      const dataFormat = formatDateString(date);
      const apiData = formatDateString(invoiceData?.issuance_date);
      const apiData2 = formatDateString(invoiceData?.data_base);
      const dataFormat2 = formatDateString(data_base);

      console.log(invoiceData?.observation)

      const response = await api.put(
        `invoices/${invoiceId}`,
        null,
        {
          params: {
            obs: '' === o ? null : o,
            number: invoiceData?.number === n ? null : n,
            issuance_date: apiData === dataFormat ? null : dataFormat,
            value: invoiceData?.value === v ? null : v,
            auge: invoiceData?.percentage_commission === ap ? null : ap,
            comercial: invoiceData?.commercial_percentage === cp ? null : cp,
            status: estadoSelecionado === invoiceData?.status ? null : estadoSelecionado,
            data_base: apiData2 === dataFormat2 ? null : dataFormat2
          },
        }

      );


      // eslint-disable-next-line no-restricted-globals
      setPdf(!pdf)
      return response.data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      setError('Erro da Edição');
      throw new Error('Erro na requisição');
    }
  };


  function handleSelectChange(value: number) {

    setEstadoSelecionado(value);
    setEdit(false);
  }



  const usingSafari = useMemo(() => isOnSafari, []);

  const formattedData = useMemo(() => ({
    order_date: new Date().toISOString(),
    auge_register: new Date().toISOString()
  }), []);

  function onDateChange(value: string) {
    setSelectedDate(value);
    setEdit(false);
  }

  function onBaseDateChange(value: string) {
    setSelectedBaseDate(value);
    setEdit(false);
  }

  const [deletId, setDeletId] = useState<string>();

  const deleteIdFunc = (invoiceid: string) => {
    setDeletId(invoiceid)
    setDelModalOpen(true)
  }

  const deletInvoice = useCallback(async () => {
    try {
      await api.delete(`invoices/${deletId}`);
      goBack();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [deletId]);

  const deletModalError = () => {
    setDelModalOpen(false);
  }

  return (
    <>
      <Header route={['Financeiro', 'Editar Financeiro']} />
      <MenuAndTableContainer>
        <Menu minimal />
        {loading ? <LoadingContainer
          content="os dados"
        /> :
          <Form ref={formRef} onSubmit={() => { }} initialData={formattedData}>
            <Container>
              {
                // @ts-ignore

                <OrderHeader id={invoiceData?.order.id} />
              }

              <SectionTitle style={{ marginTop: '1.25rem' }}>
                Faturamento
              </SectionTitle>
              <InputContainer>

              </InputContainer>

              <Modal
                isModalOpen={delModalOpen}
                setIsModalOpen={setDelModalOpen}
                customOnClose={() => {
                  setDelModalOpen(false)
                }}
              >
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Deletar Faturamento?</h2>
                <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto' }}>
                  <EditButton
                    onClick={() =>
                      // @ts-ignore

                      deletInvoice()}                  >
                    Confirmar
                  </EditButton>
                  <CancelButton onClick={() => deletModalError()}>
                    Cancelar
                  </CancelButton>
                </div>
              </Modal>
              <InputContainer>
                <FormInput
                  name="name"
                  title="Número NF-E 01"
                  width="5.6875rem"
                  value={formValues?.number}
                  onChange={(event) => handleInputChange(event, 'number')}
                />
                <DateBox
                  name="order_date"
                  title="Data Fatura"
                  width="7rem"
                  validated={true}
                  hasHour={false}
                  noMinDate={true}
                  initialDate={selectedDate !== null ? selectedDate : ''}
                  onDateChange={(value) => onDateChange(value)}
                />
                <DateBox
                  name="order_date"
                  title="Data Base Fatura"
                  width="6rem"
                  validated={false}
                  noMinDate={true}
                  hasHour={false}
                  initialDate={selectedBaseDate !== null ? selectedBaseDate : ''}
                  onDateChange={(value) => onBaseDateChange(value)}
                />
                <MeasureBox
                  name="value"
                  title="Valor Faturado Produtos"
                  measure="R$"
                  width="8rem"
                  value={formValues?.value}
                  onChange={(event) => handleInputChange(event, 'value')}
                />
                <MeasureBox
                  name="percentage_commission"
                  title="Auge"
                  measure="%"
                  width="3.125rem"
                  value={formValues?.percentage_commission}
                  onChange={(event) => handleInputChange(event, 'percentage_commission')}
                />
                <MeasureBox
                  name="icms"
                  title="Auge"
                  measure="R$"
                  width="5.5rem"
                  disabled
                  value={invoiceData?.commission}

                />
                <MeasureBox
                  name="commercial_percentage"
                  title="Comercial"
                  measure="%"
                  width="3.125rem"
                  value={formValues?.commercial_percentage}
                  onChange={(event) => handleInputChange(event, 'commercial_percentage')}

                />
                <MeasureBox
                  name="icms"
                  title="Comercial"
                  measure="R$"
                  width="5.5rem"
                  disabled
                  value={invoiceData?.commercial_commission}

                />
                <EditButton
                  style={{ fontSize: '0.7rem', width: '11rem' }}
                  onClick={() => {
                    // @ts-ignore

                    updateInvoices(id, formValues.observation, formValues.number, selectedDate, formValues.value, formValues.commercial_percentage, formValues.percentage_commission, selectedBaseDate);
                  }
                  }
                  disabled={edit}
                >
                  Salvar Mudanças
                </EditButton>

              </InputContainer>
              <InputContainer>
                <FormInput
                  name="observation"
                  title="Observação"
                  width="40.875rem"
                  value={formValues?.observation}
                  onChange={(event) => handleInputChange(event, 'observation')}
                />
                <FormSelect
                  name="status"
                  title="Status"
                  customWidth={'8rem'}
                  placeholder="Selecione..."
                  customValue={valorPreselecionado}
                  data={colourOptions}
                  onChange={(value: number) => handleSelectChange(value)}
                />
                <TableActionButton
                  style={{ marginLeft: '3rem', marginTop: '1rem', }}
                  onClick={() => push(`/finances/new/${invoiceData?.order.id}`)}
                >
                  <ViewIcon />
                </TableActionButton>

                <TableActionButton
                  style={{ marginTop: '1rem', }}
                  onClick={() => deleteIdFunc(id)}
                >
                  <CloseIcon />
                </TableActionButton>


              </InputContainer>
              {
                formValues ?
                  <InvoiceTabs
                    handleInputChange={handleInputChange}
                    status={estadoSelecionado}
                    formValues={formValues}
                    invoiceData={invoiceData}
                    updateBilletObservation={updateBilletObservation}
                    updateBillets={updateBillets}
                    onPayDateChange={onPayDateChange}
                    handleObservationChange={handleObservationChange}
                    handleUnPaidBillet={handleUnPaidBillet}
                    billetObservations={billetObservations}
                    billetStatus={billetStatus}
                    sumDiscount={sumDiscount}
                    sValue={sValue}
                    pValue={pValue}
                  /> : null
              }
            </Container>
          </Form>
        }
      </MenuAndTableContainer >
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
