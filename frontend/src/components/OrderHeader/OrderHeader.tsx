import { InputContainer, SectionTitle } from '@/src/styles/components';
import { FormInput } from '../FormInput';
import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';
import { DateBox } from '~components/DateBox';
import { MeasureBox } from '../MeasureBox';
import { ReactComponent as PdfIcon } from '~assets/download.svg'
import { ReactComponent as EditIcon } from '~assets/view1.svg';
import { useCallback, useEffect, useState } from 'react';
import { GoBackButton } from '../ProductHeader/styles';
import { ReactComponent as NewIcon } from '~assets/new.svg';
import { ReactComponent as ReceivedIcon } from '~assets/received.svg';
import { ReactComponent as TruckIcon } from '~assets/truck.svg';
import { ReactComponent as PaidIcon } from '~assets/paid.svg';
import { ReactComponent as PausedIcon } from '~assets/paused.svg';
import { ReactComponent as CancelledIcon } from '~assets/cancelled.svg';
import { ReactComponent as EmailIcon } from '~assets/email.svg';

import {
    Button,
    Container,
    TableHeader,
    Badge,
} from '../../pages/Store/Sales/styles';

import { useHistory } from 'react-router';
import { api } from '@/src/services/api';
import { TableActionButton } from '@/src/styles/components/tables';
import { useRegister } from '@/src/context/register';
import { DefaultValueProps, ISale } from '@/src/types/main';
import { CustomSectionTitle, EmptyElement, Status, StatusList } from '@/src/pages/Store/Sales/New/styles';
import { Input } from '../Input';
import { StaticSocialBox } from '../StaticSocialBox';
import { FormPhoneBox } from '../FormPhoneBox';
import { formatDateString } from '@/src/pages/Finances/NewInvoice';

export interface Order {
    id: number;
    created_at: string;
    installment_rule_value: string;
    origin: string;
    external_order_id: string;
    external_created_at: string;
    code: string;
    lead_time: string;
    count_products: number,
    internal_comments: string,
    count_sum_products: number,
    order_type_id: number;
    observation: string;
    fractional_box: number;
    current_status: string;
    total_discount: string;
    total_value_with_ipi: string;
    installment_rule: string;
    term_payment: string;
    invoiced_value: string;
    buyer_cellphone: string;
    comments: string;
    icms: string;
    total_value: string;
    profile_discount: string;
    shipping_company_name: string;
    shipping_company_id: number;
    product_supplier_name: string;
    product_supplier_id: number;
    buyer_name: string;
    buyer_id: number;
    client: {
        name: string;
        company_name: string;
        document: string;
        corporate_email: string;
    };

    type: {
        id: number;
        name: string;
    };
    seller: {
        id: number;
        name: string;
    };
    shipping_company: {
        document: string;
    }
};

export interface Discount {
    auge: string;
    commercial: string;
}


export function OrderHeader({ id: OrderId }: { id: string }) {
    const { goBack, push } = useHistory();
    const [dataOrder, setdataOrder] = useState<Order>()
    const [discount, setDiscount] = useState<Discount>();
    const [noInvoiceValue, setNoInvoiceValue] = useState<string>()
    const [clientName, setClientName] = useState()
    const [loading, setLoading] = useState(false);
    const { sale, setSale } = useRegister();
    const [statusOptions, setStatusOptions] = useState<DefaultValueProps[]>([]);
    const [cleaning, setCleaning] = useState(false);





    const fetchData = async (id: string) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/invoices/order/${OrderId}`);

            setClientName(data.clientName);
            setdataOrder(data.order);
            setNoInvoiceValue(data.noInvoiceValue);
            setDiscount(data.discount);
            setLoading(false);
            console.log(dataOrder?.external_order_id);


        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {

        fetchData(OrderId);
    }, []);

    const currentIcon = useCallback((status: string) => {
        switch (status) {
            case 'Novo':
                return <NewIcon />;
            case 'Recebido':
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
                return <TruckIcon />;
        }
    }, []);



    const handleEditSale = useCallback(async (code: any) => {
        try {
            setLoading(true);

            const response = await api.get(`/orders/${code}`);
            const { data } = response.data;

            setSale(data);

            window.open('/store/sales/new', '_blank');
        } catch (error) {
            console.error('Erro ao buscar dados da venda:', error);

        } finally {
            setLoading(false);
        }
    }, [setSale]);

    return (
        <>
            <CustomSectionTitle style={{ marginTop: 0 }}>
                Resumo do pedido  | {sale.formated_date}
            </CustomSectionTitle>

            <InputContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: "center", marginRight: '4rem', marginLeft: '3rem' }}>
                    <label style={{ fontSize: '0.5rem', fontWeight: 'bold' }} htmlFor="statusPedido">STATUS DO PEDIDO</label>
                    { /* @ts-ignore */}
                    <Badge status={dataOrder?.current_status}>
                        { /* @ts-ignore */}
                        {currentIcon(dataOrder?.current_status)}
                        <p>{dataOrder?.current_status}</p>
                    </Badge>
                </div>

                <FormInput
                    name="lead_time"
                    title="Codigo Pedido"
                    width="11.125rem"
                    validated={false}
                    value={dataOrder?.code}
                    disabled
                />

                <FormInput
                    name="lead_time"
                    title="Faturamento Estimado"
                    width="8.125rem"
                    validated={false}
                    value={dataOrder?.lead_time}
                    disabled
                />
                <FormInput
                    name="supplier_name"
                    title="Fornecedor"
                    width="11.125rem"
                    validated={false}
                    value={dataOrder?.product_supplier_name}
                    disabled
                />
                <FormInput
                    name="order_type"
                    title="Tipo do Pedido"
                    placeholder="Selecione..."
                    disabled
                    width='8rem'
                    value={dataOrder?.type.name}

                />
                <TableActionButton
                    style={{ marginTop: '1rem', marginLeft: '2rem', marginRight: '2rem' }}
                    onClick={() => handleEditSale(dataOrder?.code)}
                >
                    <EditIcon />
                </TableActionButton>
            </InputContainer>
            <InputContainer
                style={{ marginLeft: '2rem' }}
            >
                <FormInput
                    name="status"
                    title="Transportadora"
                    width="9.625rem"
                    value={dataOrder?.shipping_company_name ?? '--'
                    }
                    disabled
                />
                <FormInput
                    name="client"
                    title="Cliente"
                    width="15.125rem"
                    validated={false}
                    value={dataOrder?.client.company_name ?? dataOrder?.client.name}
                    disabled
                />
                <FormInput
                    name="documment"
                    title="Cnjp Cliente"
                    width="11.125rem"
                    validated={false}
                    value={dataOrder?.client.document}
                    disabled
                />

                <FormInput
                    name="buyer_cellphone"
                    title="Contato Cliente"
                    disabled
                    width="9.25rem"
                    // noTitle
                    validated
                    defaultValue={dataOrder?.buyer_cellphone}
                // onBlur={({ target: { value: cellphone } }) =>
                // phoneIsValid(cellphone) &&
                // handleShouldUpdate(c.cellphone, cellphone, {...c, cellphone })
                // }
                />
                <StaticSocialBox
                    name="Email Cliente"
                    type="social"
                    badge={EmailIcon}
                    validated
                    disabled
                    width="15rem"
                    title="Email"
                    value={dataOrder?.client.corporate_email}
                    inputStyle={{ textTransform: 'lowercase' }}
                />

            </InputContainer>

            <InputContainer
                style={{ marginLeft: '3rem' }}
            >
                <MeasureBox
                    name="profile_discount"
                    title="Desconto Perfil Cliente"
                    measure="%"
                    placeholder="Selecione..."
                    width="6.875rem"
                    value={dataOrder?.profile_discount}
                    disabled
                />
                <MeasureBox
                    name="installment_rule_value"
                    title="Desconto ou Acréscimo"
                    measure="%"
                    width="4.875rem"
                    validated={false}
                    value={dataOrder?.installment_rule_value}
                    disabled
                />
                <MeasureBox
                    name="country_state_icms"
                    title="ICMS entre Estados"
                    measure="%"
                    width="5.9375rem"
                    validated={false}
                    value={dataOrder?.icms}
                    disabled
                />
                <MeasureBox
                    name="installment_rule_value"
                    title="Valor à Faturar"
                    measure="R$"
                    width="4.875rem"
                    validated={false}
                    value={noInvoiceValue ? parseFloat(noInvoiceValue).toFixed(2) : 0}
                    disabled
                />
                <FormInput
                    name="fractional_box"
                    title="Caixa Fracionada"
                    placeholder="Selecione..."
                    disabled
                    width='5rem'
                    value={dataOrder?.fractional_box}
                />
                <FormInput
                    name="installments"
                    title="Prazo de Pagamento"
                    disabled
                    value={dataOrder?.installment_rule}
                />


                <MeasureBox
                    name="installment_rule_value"
                    title="Valor Faturado"
                    measure="R$"
                    width="4.875rem"
                    validated={false}
                    value={dataOrder?.invoiced_value ? parseFloat(dataOrder?.invoiced_value).toFixed(2) : 0}
                    disabled
                />

            </InputContainer>
            <InputContainer
                style={{ marginLeft: '3rem' }}
            >
                <MeasureBox
                    name="total_value"
                    title="Total do Pedido sem IPI"
                    measure="R$"
                    width="6.125rem"
                    validated={false}
                    value={dataOrder?.total_value}
                    disabled
                />
                <MeasureBox
                    name="total_value_with_ipi"
                    title="Total do Pedido com IPI"
                    measure="R$"
                    width="6.125rem"
                    validated={false}
                    value={dataOrder?.total_value_with_ipi}
                    disabled
                />
                <MeasureBox
                    name="total_discount"
                    title="Economia Total"
                    measure="R$"
                    width="6.125rem"
                    validated={false}
                    value={dataOrder?.total_discount}
                    disabled
                />
                <FormInput
                    name="origin"
                    title="Origem"
                    width="6.875rem"
                    validated={false}
                    value={dataOrder?.origin}
                    disabled
                />
                <FormInput
                    name="external_order_id"
                    title="Codigo Pedido Fornecedor"
                    width='8rem'
                    disabled
                    value={dataOrder?.external_order_id}
                    placeholder=''
                />
                <FormInput
                    name='external_created_at'
                    title='Data Pedido Fornecedor'
                    value={formatDateString(dataOrder?.external_created_at)}
                    width='8rem'
                    placeholder=''
                    disabled
                />
            </InputContainer>
            <InputContainer>
                <FormInput
                    name="comments"
                    title="Observações"
                    fullW
                    width="100%"
                    disabled
                    value={dataOrder?.comments ?? '------'}
                    validated={false}
                />
            </InputContainer>
            <InputContainer>
                <FormInput
                    name="internal_comments"
                    title="Observações Auge"
                    fullW
                    width="100%"
                    disabled
                    value={dataOrder?.internal_comments ?? '------'}
                    validated={false}
                />
            </InputContainer>
        </>
    );
}

