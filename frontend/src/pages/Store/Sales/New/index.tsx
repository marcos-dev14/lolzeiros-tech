import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Form } from '@unform/web';

import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';
import { ReactComponent as EmailIcon } from '~assets/email.svg';
import { ReactComponent as StarOnIcon } from '~assets/Star1.svg';
import { ReactComponent as StarOffIcon } from '~assets/Star2.svg';
import { ReactComponent as PlusIcon } from '~assets/plus.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg'

import { ReactComponent as NewIcon } from '~assets/new.svg';
import { ReactComponent as ReceivedIcon } from '~assets/received.svg';
import { ReactComponent as TruckIcon } from '~assets/truck.svg';
import { ReactComponent as PaidIcon } from '~assets/paid.svg';
import { ReactComponent as PausedIcon } from '~assets/paused.svg';
import { ReactComponent as CancelledIcon } from '~assets/cancelled.svg';

import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { FormInput } from '~components/FormInput';
import { Input } from '~components/Input';
import { Modal } from '~components/Modal';
import { TagInput } from '~components/TagInput';
import { FormSelect } from '~components/FormSelect';
import { RadioBox } from '~components/RadioBox';
import { StaticDateBox } from '~components/StaticDateBox';
import { DateBox } from '~components/DateBox';

import {
  Button,
  Container,
  CustomSectionTitle,
  EmptyElement,
  GoBackButton,
  ProductsSectionTitle,
  Status,
  StatusList,
  TableContent,
  TableHeader,
  Badge,
  DeleteItemsContainer,
} from './styles';
import { api } from '@/src/services/api';
import { useRegister } from '@/src/context/register';
import { useHistory } from 'react-router';
import { MeasureBox } from '@/src/components/FormMeasureBox';
import { StaticSocialBox } from '@/src/components/StaticSocialBox';
import { PhoneBox } from '@/src/components/PhoneBox';
import { FormPhoneBox } from '@/src/components/FormPhoneBox';
import { formatToBrl } from '@/src/utils/format';
import { ISaleData, DefaultValuePropsWithId, DefaultValueProps } from '@/src/types/main';
import { ErrorModal } from '@/src/components/ErrorModal';
import { SuccessModal } from '@/src/components/SuccessModal';
import { TableActionButton } from '@/src/styles/components/tables';
import { formatDateString } from '@/src/pages/Finances/NewInvoice';

export function NewSale() {
  const { goBack } = useHistory();
  const { sale, updateSale } = useRegister();

  const [loading, setLoading] = useState(true);
  const [cleaning, setCleaning] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [salesChannel, setSalesChannel] = useState('');

  const [salesChannelOptions, setSalesChannelOptions] = useState([]);
  const [salesChannelModalOpen, setSalesChannelModalOpen] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [date, setDate] = useState<Date | null>(null);
  const [clientActivityStart, setClientActivityStart] = useState<Date | null>(null);
  const [lastPurchase, setLastPurchase] = useState('');

  const [seller, setSeller] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [shippingCompany, setShippingCompany] = useState({
    company_name: '',
    document: '',
  });

  const [originSale, setOriginSele] = useState({
    value: '',
    label: '',
  });

  const dataSelect = [{ value: 'Website', label: 'Website' },
  { value: 'Adm', label: "Adm" },
  { value: 'App', label: 'App' }
  ];


  const order_types = [
    { value: 1, label: 'Venda' },
    { value: 2, label: 'Bonificação' },
    { value: 3, label: 'Mostruário' },
    { value: 4, label: 'Orçamento' }
  ];

  const [statusOptions, setStatusOptions] = useState<DefaultValueProps[]>([]);
  const [sellerOptions, setSellerOptions] = useState([]);
  const [shippingOptions, setShippingOptions] = useState([]);

  // @ts-ignore
  const [formRef, setFormRef] = useState(null);
  const updateFormRef = useCallback(node => !!node && !formRef && setFormRef(node), [formRef]);

  const formattedData = useMemo<ISaleData>(() => {
    setBuyerEmail(sale.buyer_email ?? '');
    setSalesChannel(!!sale.sale_channel ? sale.sale_channel.name : '');
    // @ts-ignore
    setShippingCompany(sale.shipping_company ?? '');
    setDate(!!sale.date ? new Date(sale.date) : null);
    setClientActivityStart(
      !!sale.client_activity_start ? new Date(sale.client_activity_start) : null
    );
    setLastPurchase(!!sale.client_last_order ? sale.client_last_order : '');

    const baseStatusOptions = [
      'Novo',
      'Recebido',
      'Transmitido',
      'Faturado',
      'Pausado',
      'Cancelado'
    ];

    setStatusOptions(
      baseStatusOptions.map(s =>
        s === 'Recebido' ?
          ({ value: s, label: 'Liberado' }) : ({ value: s, label: s })
      ));

    setSeller(
      !!sale.seller ? sale.seller : { name: '', email: '', phone: '' }
    )

    const formattedSaleData = {
      ...sale,
      client_activity_start:
        !!sale.client_formated_activity_start ?
          new Date(sale.client_activity_start).toISOString() :
          '',
    }

    setLoading(false);
    return formattedSaleData;
  }, [sale]);

  const handleExportClick = async (code: string) => {
    try {
      const response = await api.get(`/orders/exportar/${code}`, {
        responseType: 'blob',
      });


      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', 'pedido.xlsx');
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar o arquivo', error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const [
        shippingResponse,
        sellersResponse,
        salesChannelResponse
      ] =
        await Promise.all([
          api.get('/shipping_companies'),
          api.get('/sellers'),
          api.get('/sale_channels')
        ]);

      const {
        data: { data: shipping }
      } = shippingResponse;

      const {
        data: { data: sellers }
      } = sellersResponse;

      const {
        data: { data: salesChannel }
      } = salesChannelResponse;

      // @ts-ignore
      setSellerOptions(sellers.map(s => ({ id: s.id, value: s, label: s.name })))
      // @ts-ignore
      setShippingOptions(shipping.map(s => ({ id: s.id, value: s.name, label: s.name })))
      // @ts-ignore
      setSalesChannelOptions([{ value: 'new', label: 'Novo Canal' }, ...salesChannel.map((a: string) => ({ id: a.id, value: a.name, label: a.name }))])
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      // @ts-ignore
      const current_status = formRef!.getFieldValue('current_status');
      // @ts-ignore
      const internal_comments = formRef!.getFieldValue('internal_comments');
      // @ts-ignore
      const external_order_id = formRef!.getFieldValue('external_order_id');
      // @ts-ignore
      const origin = formRef!.getFieldValue('origin');

      // @ts-ignore
      const external_created_at = formatDateString(formRef!.getFieldValue('external_created_at'));

      let request = {
        external_order_id,
        current_status,
        external_created_at,
        internal_comments,
        origin
      }

console.log(external_order_id,originSale,salesChannel);

      if (
        !external_order_id ||
        !originSale.value ||
        // @ts-ignore
        !salesChannel
      ) {
        setError('Campos "Codigo Pedido Fornecedor", "Origem" e "Canal de Venda" são obrigatórios.');
        return;
      }

      // @ts-ignore
      const selectedSaleChannel = salesChannelOptions.find(s => s.label === salesChannel);

      // @ts-ignore
      if (!!selectedSaleChannel) { // @ts-ignore
        request['sale_channel_id'] = selectedSaleChannel.id;
      }

      // @ts-ignore
      if (!!seller.id) request['seller_id'] = seller.id;

      // @ts-ignore
      if (!!shippingCompany.id) request['shipping_company_id'] = shippingCompany.id;

      if (!!originSale.value) request['origin'] = originSale.value;

      const { data: { data: response } } = await api.put(`/orders/${sale.code}`, request);
      setCleaning(true);

      updateSale({ ...sale, ...response })

      setSeller(prev =>
        !!response.seller ? response.seller : prev
      );

      setShippingCompany(prev =>
        !!response.shipping_company ? response.shipping_company : prev
      );

      setMessage('Salvo com sucesso')
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar o produto.';

      setError(errorMessage);
    } finally {
      setLoading(false);
      setCleaning(false);
    }
  }, [
    formRef,
    seller,
    shippingCompany,
    salesChannel,
    salesChannelOptions,
    originSale,
    sale,
    updateSale
  ]);

  const currentIcon = useCallback((status: string) => {
    switch (status) {
      case 'Novo':
        return <NewIcon />;
      case 'Liberado':
        return <ReceivedIcon />;
      case 'Transmitido':
        return <NewIcon />;
      case 'Faturado':
        return <PaidIcon />;
      case 'Pausado':
        return <PausedIcon />;
      case 'Cancelado':
        return <CancelledIcon style={{ height: '0.5rem' }} />;
      default:
        return <TruckIcon />
    }
  }, []);

  const handleNewSaleChannel = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.post('/sale_channels', { name: salesChannel });

      const newSaleChannel = {
        id: data.id,
        value: data.name,
        label: data.name,
      }

      setSalesChannel('Carregando');
      // @ts-ignore
      setSalesChannelOptions(prev => [...prev, newSaleChannel])

      setSalesChannel(data.name);

      setSalesChannelModalOpen(false);
    } catch (e) {
      console.log('e', e);
    }
  }, [salesChannel]);

  const handleDeleteSalesChannel = useCallback(async (id: number, value: string) => {
    try {
      await api.delete(`/sale_channels/${id}`);

      // @ts-ignore
      setSalesChannelOptions(prev => prev.filter(e => e.value !== value));
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  useEffect(() => {
    console.log(sale)
    fetchData();
  }, []);

  return (
    <>
      <Header route={['Loja Online', 'Vendas', 'Editar Vendas']} />
      <MenuAndTableContainer>
        <Menu />
        <Form
          ref={updateFormRef}
          onSubmit={() => { }}
          initialData={formattedData}
        >
          <Container>
            <CustomSectionTitle style={{ marginTop: 0 }}>
              Resumo do pedido | {sale.code} | {sale.formated_date}
            </CustomSectionTitle>
            <InputContainer>
              <FormSelect
                name="current_status"
                title="Status do Pedido"
                placeholder="Selecione..."
                customWidth="14.375rem"
                badge
                data={statusOptions}
              // onChange={(value: string) => {}}
              // customDefaultValue={{
              //   value: taxRegimeName,
              //   label: taxRegimeName
              // }}
              />
              <FormInput
                name="lead_time"
                title="Faturamento Estimado"
                width="11.125rem"
                validated={false}
                disabled
              />
              <FormInput
                name="supplier_name"
                title="Fornecedor"
                width="11.125rem"
                validated={false}
                disabled
              />

              <FormSelect
                name="order_type"
                title="Tipo do Pedido"
                placeholder="Selecione..."
                customWidth="8.375rem"
                // disabled={loading}
                data={order_types}
                // @ts-ignore
                customValue={{
                  value: sale.order_type,
                  label: sale.order_type
                }}
              />

              <GoBackButton
                onClick={goBack}
              >
                <GoBackIcon />
                Voltar
              </GoBackButton>
            </InputContainer>
            <InputContainer style={{ position: 'relative' }}>
              {!!sale.statuses &&
                <StatusList style={{ overflowY: 'auto', maxHeight: '300px' }}>
                  {sale.statuses.map(s => (
                    <Status key={s.id}>
                      {/* @ts-ignore */}
                      <p>{!!s.formated_date ? s.formated_date : ''}</p>
                      {/* @ts-ignore */}
                      <Badge status={s.name}>
                        {currentIcon(s.name === 'Recebido' ? 'Liberado' : s.name)}
                        <p>{s.name === 'Recebido' ? 'Liberado' : s.name}</p>
                      </Badge>
                    </Status>
                  ))}

                </StatusList>

              }
              <EmptyElement style={{ width: '13.125rem' }} />
              {!loading || !cleaning ?
                <FormSelect
                  name="shipping_company"
                  title="Transportadora"
                  placeholder="Selecione..."
                  customWidth="14.375rem"
                  // disabled={loading}
                  data={shippingOptions}
                  // @ts-ignore
                  onChange={(value: string) => setShippingCompany(value)}
                  customValue={{
                    value: shippingCompany.company_name,
                    label: shippingCompany.company_name
                  }}
                /> :
                <></>
              }
              <Input
                name="CNPJ da Transportadora"
                width="9.875rem"
                validated={false}
                value={shippingCompany.document}
                disabled
              />
              <FormInput
                name="installments"
                title="Prazo de Pagamento"
                width='8rem'
                disabled
              />

              <MeasureBox
                name="installment_rule_value"
                title="Desconto ou Acréscimo"
                measure="%"
                width="4.875rem"
                validated={false}
                disabled
              />
              <FormSelect
                name="fractional_box"
                title="Caixa Fracionada"
                placeholder="Selecione..."
                customWidth="5rem"
                disabled
                data={[
                  { value: 'Sim', label: 'Sim' },
                  { value: 'Não', label: 'Não' }
                ]}
                customValue={{
                  value: !!sale.fractional_box ? 'Sim' : 'Não',
                  label: !!sale.fractional_box ? 'Sim' : 'Não'
                }}
              />
            </InputContainer>
            <InputContainer>
              <EmptyElement />
              <MeasureBox
                name="profile_discount"
                title="Desconto Perfil Cliente"
                measure="%"
                placeholder="Selecione..."
                width="6.875rem"
                disabled
              />
              <MeasureBox
                name="country_state_icms"
                title="ICMS entre Estados"
                measure="%"
                width="5.9375rem"
                validated={false}
                disabled
              />
              <FormInput
                name="external_order_id"
                title="Codigo Pedido Fornecedor"
                width='8rem'
                required
              />
              <DateBox
                name='external_created_at'
                title='Data Pedido Fornecedor'
                initialDate={sale?.external_created_at}
              />
              {/* <DateBox
                name="payment_promotion_term_start"
                title="Promoções de Pagamento"
                width="7.875rem"
                validated={false}
                hasHour={false}
                // @ts-ignore
                date={null}
                onDateSelect={() => {}}
                disabled
              /> */}
              {/* <MeasureBox
                name="voucher"
                title="Cupom"
                measure="%"
                width="2.0625rem"
                validated={false}
                disabled
              />
              <MeasureBox
                name="voucher_discount"
                title="Desconto do Cupom"
                measure="R$"
                width="6.125rem"
                validated={false}
                disabled
              /> */}
            </InputContainer>
            <InputContainer>
              <EmptyElement />
              <MeasureBox
                name="total_value"
                title="Total do Pedido sem IPI"
                measure="R$"
                width="6.125rem"
                validated={false}
                disabled
              />
              <MeasureBox
                name="total_value_with_ipi"
                title="Total do Pedido com IPI"
                measure="R$"
                width="6.125rem"
                validated={false}
                disabled
              />
              <MeasureBox
                name="total_discount"
                title="Economia Total"
                measure="R$"
                width="6.125rem"
                validated={false}
                disabled
              />
              <FormSelect
                name="origin"
                title="Origem"
                customWidth={'7rem'}
                placeholder="Selecione..."
                onChange={(value: string) => setOriginSele({ value: value, label: value })}
                data={dataSelect}
                customValue={{ value: sale?.origin ?? '', label: sale?.origin ?? '' }}
              />
              <FormInput
                name="quantities"
                title="Quantidades"
                width="16.0625rem"
                validated={false}
                disabled
              />
            </InputContainer>
            {sale?.coupon_discount_value !== '0.00' || sale?.installment_discount_value !== '0.00' ?
              (<>
                <CustomSectionTitle style={{ marginTop: 0 }}>
                  DESCONTOS
                </CustomSectionTitle>

                <InputContainer>
                  <div style={{ display: sale.coupon_discount_value !== '0.00' ? 'flex' : 'none', flexDirection: 'column', backgroundColor: '#21D0A1', width: '327px', height: '100px', color: 'white', borderRadius: '4px', padding: '18px', gap: '5px', }}>
                    <span style={{ fontSize: '10px' }}>POR CUPOM</span>
                    <p style={{ fontSize: '28px' }}>R$ {sale.coupon_discount_value}</p>
                    <p style={{ fontSize: '10px', display: 'flex', flexDirection: 'row', gap: '5px' }}>Codigo do cupom: <p style={{ textTransform: 'uppercase' }}>{sale.coupon}</p></p>
                  </div>
                  <div style={{ display: sale.installment_discount_value !== '0.00' ? 'flex' : 'none', flexDirection: 'column', backgroundColor: '#3699CF', width: '327px', height: '100px', color: 'white', borderRadius: '4px', padding: '18px', gap: '5px' }}>
                    <span style={{ fontSize: '10px' }}>POR PRAZO D PAGAMENTO</span>
                    <p style={{ fontSize: '28px' }}>R$ {sale.installment_discount_value}</p>
                  </div>
                </InputContainer>
              </>
              )
              : null
            }            <InputContainer>
              <FormInput
                name="comments"
                title="Observações do Cliente"
                fullW
                width="100%"
                validated={false}
                disabled
              />
            </InputContainer>
            <InputContainer>
              <FormInput
                name="internal_comments"
                title="Observações Auge"
                fullW
                width="100%"
                validated={false}
              />
            </InputContainer>
            <CustomSectionTitle>
              Cliente
            </CustomSectionTitle>
            <InputContainer>
              <FormInput
                name="client_document"
                title="CNPJ"
                width="9.125rem"
                validated={false}
                disabled
              />
              <FormInput
                name="client_name"
                title="Razão Social"
                width="19rem"
                validated={false}
                disabled
              />
              <FormInput
                name="client_state_registration"
                title="IE"
                width="9.125rem"
                validated={false}
                disabled
              />
              <FormInput
                name="client_group"
                title="Grupo"
                width="9.375rem"
                validated={false}
                disabled
              />
              <FormInput
                name="client_code"
                title="Código de Cliente"
                width="9.375rem"
                validated={false}
                disabled
              />
            </InputContainer>
            <InputContainer>
              <FormInput
                name="client_status"
                title="Status do CNPJ"
                width="9.125rem"
                validated={false}
                disabled
              />
              <FormInput
                name="client_commercial_status"
                title="Status Comercial"
                width="9.125rem"
                validated={false}
                disabled
              />
              {/* <StaticDateBox
              name="client_activity_start"
              title="Fundação"
              width="6.625rem"
              // @ts-ignore
              date={clientActivityStart}
              onDateSelect={() => {}}
              disabled
              validated={false}
              hasHour={false}
              noMinDate
            /> */}
              <FormInput
                name="client_pdv_name"
                title="Tipo de PDV"
                width="9.125rem"
                validated={false}
                disabled
              />
              <StaticDateBox
                name="client_last_order"
                title="Última Compra"
                width="9.375rem"
                // @ts-ignore
                date={lastPurchase}
                onDateSelect={() => { }}
                disabled
                validated={false}
                hasHour={false}
                noMinDate
              />
            </InputContainer>
            <InputContainer>
              <FormInput
                name="buyer_name"
                title="Comprador"
                width="19.5rem"
                validated={false}
                disabled
              />
              <StaticSocialBox
                name="Email"
                type="social"
                badge={EmailIcon}
                validated
                disabled
                width="17rem"
                title="Email"
                value={buyerEmail.toLowerCase()}
                onChange={(e) => setBuyerEmail(e.target.value)}
                onBlur={(e) => setBuyerEmail(e.target.value.toLowerCase())}
                inputStyle={{ textTransform: 'lowercase' }}
              />
              <FormPhoneBox
                name="buyer_cellphone"
                title="Contato"
                disabled
                width="9.25rem"
                // noTitle
                validated
              // defaultValue={c.cellphone}
              // onBlur={({ target: { value: cellphone } }) =>
              // phoneIsValid(cellphone) &&
              // handleShouldUpdate(c.cellphone, cellphone, {...c, cellphone })
              // }
              />
            </InputContainer>
            <CustomSectionTitle>
              Endereço Principal - Faturamento
            </CustomSectionTitle>
            <InputContainer>
              <FormInput
                name="address_street"
                title="Endereço"
                width="15.5rem"
                validated={false}
                disabled
              />
              <FormInput
                name="address_number"
                title="Número"
                width="4.8125rem"
                validated={false}
                disabled
              />
              <FormInput
                name="address_complement"
                title="Complemento"
                width="9.625rem"
                validated={false}
                disabled
              />
              <FormInput
                name="address_district"
                title="Bairro"
                width="10.9375rem"
                validated={false}
                disabled
              />
              <FormInput
                name="address_city"
                title="Cidade"
                width="11.5625rem"
                validated={false}
                disabled
              />
              <FormInput
                name="address_zipcode"
                title="CEP"
                width="6.0625rem"
                validated={false}
                disabled
              />
              <FormInput
                name="address_state"
                title="Estado"
                width="4rem"
                validated={false}
                disabled
              />
            </InputContainer>
            <CustomSectionTitle>
              Comercial
            </CustomSectionTitle>
            <InputContainer>
              {!cleaning ?
                <FormSelect
                  name="seller_name"
                  title="Comercial Auge"
                  placeholder="Selecione..."
                  customWidth="15.5rem"
                  // disabled={loading}
                  data={sellerOptions}
                  // @ts-ignore
                  onChange={(value: string, i: string) => setSeller(value)}
                  customValue={{
                    value: seller?.name,
                    label: seller?.name
                  }}
                /> :
                <></>
              }
              <StaticSocialBox
                name="Email"
                type="email"
                badge={EmailIcon}
                validated={!!seller.email}
                disabled
                width="17rem"
                title="Email"
                value={seller.email}
                inputStyle={{ textTransform: 'lowercase' }}
              />
              <PhoneBox
                title="Contato"
                width="6.875rem"
                disabled
                value={seller.phone}
                // noTitle
                validated
              // defaultValue={c.cellphone}
              // onBlur={({ target: { value: cellphone } }) =>
              // phoneIsValid(cellphone) &&
              // handleShouldUpdate(c.cellphone, cellphone, {...c, cellphone })
              // }
              />
              {salesChannel !== 'Carregando' ?
                <FormSelect
                  name="sales_channel"
                  title="Canal de Venda"
                  placeholder="Selecione..."
                  customWidth="10.25rem"
                  data={salesChannelOptions}
                  disabled={loading}
                  onChange={(value: string) => value === 'new' ?
                    setSalesChannelModalOpen(true) :
                    setSalesChannel(value)
                  }
                  customValue={{
                    value: salesChannel ?? '',
                    label: salesChannel ?? ''
                  }}
                /> :
                <></>
              }
            </InputContainer>
            <InputContainer>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Aguarde...' : 'Salvar'}
              </Button>
            </InputContainer>
            {!!sale.products && !!sale.products.length &&
              <>
                <ProductsSectionTitle>
                  <p>Pedido | {sale.code}</p>
                  <div>
                    <p>Avaliação</p>
                    <div>
                      {Array(4).fill(1).map((e, i) => <StarOnIcon key={i} />)}
                      <StarOffIcon />
                    </div>
                  </div>
                  <button onClick={() => handleExportClick(sale.code)}>
                    Download EXCEL
                  </button>
                  <a href={sale.download} target="_blank">
                    Download PDF
                  </a>
                </ProductsSectionTitle>
                <TableHeader>
                  <div />
                  <div>Item</div>
                  <div>Ref.</div>
                  <div>Quant.</div>
                  <div>PREÇO BRUTO</div>
                  <div>Preço Liquido</div>
                  {/* <div>% IPI</div> */}
                  <div>Preço C/ IPI</div>
                  <div>Subtotal</div>
                </TableHeader>
                {sale.products.map((p) =>
                  <TableContent key={p.reference}>
                    <div>
                      {!!p.image && <img src={p.image.WEBP} alt="" />}
                    </div>
                    <div>
                      {p.title}
                    </div>
                    <div>
                      {p.reference}
                    </div>
                    <div>
                      {p.qty}
                    </div>
                    <div>
                      <p>{formatToBrl(p.original_price)}</p>
                    </div>
                    <div>
                      {!!p.discount &&
                        <p style={{ textDecoration: 'line-through' }}>
                          {formatToBrl(p.original_price)}
                        </p>
                      }
                      <p>{formatToBrl(p.getUnitPrice)}</p>

                      {!!p.discount_percentage && <span>{p.discount_percentage}%</span>}
                    </div>
                    {/* <div>
                        IPI
                    </div> */}
                    <div>
                      {formatToBrl(p.getUnitPriceWithIpi)}
                    </div>
                    <div>
                      R${p.getSubtotalWithIpi}
                      {!!p.discount &&
                        <span style={{ marginTop: '0.375rem' }}>
                          Economia {formatToBrl(p.discount)}
                        </span>
                      }
                    </div>
                  </TableContent>
                )}
              </>
            }
          </Container>
        </Form>
      </MenuAndTableContainer>
      <Modal
        title="Novo Canal de Venda"
        isModalOpen={salesChannelModalOpen}
        setIsModalOpen={setSalesChannelModalOpen}
        customOnClose={() => { }}
        style={{ width: 471 }}
      >
        <InputContainer style={{ alignItems: 'flex-end' }}>
          <Input
            name="Canal de Venda"
            fullW
            value={salesChannel}
            onChange={(e) => setSalesChannel(e.target.value)}
          />
          <TableActionButton
            onClick={handleNewSaleChannel}
            style={{
              marginLeft: '1rem'
            }}
          >
            <PlusIcon />
          </TableActionButton>
        </InputContainer>
        <DeleteItemsContainer>
          {salesChannelOptions.map((t: DefaultValuePropsWithId) =>
            t.value !== 'new' &&
            <div key={t.id}>
              <Input
                name=""
                noTitle
                disabled
                width="100%"
                fullW
                value={t.value}
                validated
              />
              <TableActionButton
                onClick={() => handleDeleteSalesChannel(t.id, t.value)}
                style={{ marginLeft: '1rem' }}
              >
                <TrashIcon />
              </TableActionButton>
            </div>
          )}
        </DeleteItemsContainer>
      </Modal>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
      <SuccessModal
        message={message}
        setIsModalOpen={() => setMessage('')}
      />
    </>
  );
}
