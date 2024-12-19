import { FormInput } from '@/src/components/FormInput';
import { Header } from '@/src/components/Header';
import { Menu } from '@/src/components/Menu';
import { InputContainer, SectionTitle } from '@/src/styles/components';
import { MenuAndTableContainer } from '~styles/components';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ErrorModal } from '@/src/components/ErrorModal';
import { SuccessModal } from '@/src/components/SuccessModal';
import { api } from '@/src/services/api';
import { RadioBox } from '@/src/components/RadioBox';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { Button, Container, Table } from '../../Dashboard/styles';
import { MainTable } from '@/src/styles/components/tables'
import { useHistory, useParams } from 'react-router';
import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';
import { ReactComponent as EditIcon } from '~assets/edit1.svg';
import CustomSelect from '@/src/components/ApiSelect/CustomSelect';
import { GoBackButton } from '../../Mail/New/styles';
import { DateBox } from '@/src/components/DateBox';
import { formatDateString } from '../../Finances/NewInvoice';
import {
    TableFooter,
    TableActionButton,
    TableTitle,
    TableSortingHeader
} from '~styles/components/tables';
import { Pagination } from '@/src/components/Pagination';
import { TableHeader } from '../../Finances/styles';

import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { TableDateBox } from '@/src/components/TableDateBox';
import { Link } from 'react-router-dom';
import { useRegister } from '@/src/context/register';

interface CupomInterface {
    id: number;
    name: string;
    discount_value: string;
    discount_porc: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    validate: string;
    type: number;
    price: number;
    price_type: number;
    description: string;

    client_group: {
        name: string;
    }
    client: {
        name: string;
    };
    client_profile: {
        name: string;
    };
    brand: {
        name: string;
    };
    category: {
        name: string;
    };
    supplier: {
        name: string;
    };
    seller: {
        name: string;
    };
    product: {
        name: string;
    }
    shipping: {
        name: string;
    }
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface CupomStatusProps {
    buyer_id: number | null;
    client_id: number;
    coupon_id: number;
    created_at: string | null;
    updated_at: string | null;
}

interface SellerProps {
    id: number;
    name: string;
    email: string;
    cellphone: string;
    phone: string;
    created_at: string;
    deleted_at: string;
    update_at: string;
}

interface Client {
    id: number;
    company_name: string;
    document: string;
    seller: SellerProps;
    coupon_status: CupomStatusProps[];
    used_coupon: boolean;
    last_login: string | null;
    last_order: string | null;
}

interface ClientResponse {
    current_page: number;
    data: Client[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}


export function EditCupomAuge() {

    const { setClient } = useRegister()
    const { push } = useHistory()

    const { id } = useParams<{ id: string }>();

    const formRef = useRef<FormHandles>(null)
    const [initialData, setInitialData] = useState<CupomInterface>();
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [selecao, setSelecao] = useState<string>('Porcentagem');
    const { goBack } = useHistory();
    const [clients, setClients] = useState<ClientResponse>();
    const [currentPage, setCurrentPage] = useState(1);


    const [buyer, setBuyer] = useState<string>();
    const [perfil, setPerfil] = useState<string>();
    const [product, setProduct] = useState<string>();
    const [category, setCategory] = useState<string>();
    const [seller, setSeller] = useState<string>();
    const [group, setGroup] = useState<string>();

    const [supplier, setSupplier] = useState<string>();

    const [selectedDate, setSelectedDate] = useState<string>();
    const [brand, setbrands] = useState<string>();

    const fetchData = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const { data: { coupon, clients } } = await api.get(`/coupons/${id}`, {
                params: { page }
            });
            setInitialData(coupon);
            setClients(clients);
            setSelecao(coupon.discount_porc ? "Porcentagem" : "Valor Integral");
        } catch (e) {
            console.log('e', e);
        } finally {
            setLoading(false);
        }
    }, [id]);

    function onDateChange(value: string) {
        setSelectedDate(value);
    }

    const handleSubmit = useCallback(async () => {
        try {
            setUpdating(true);
            setLoading(true);
            // @ts-ignore
            const data = formRef.current?.getData();
            const request = {
                ...data,
                buyer,
                product,
                category,
                perfil,
                seller,
                group,
                comercial_profile: perfil,
                supplier,
                brand,
                validate: formatDateString(selectedDate)
            };
            console.log(data);

            await api.post(`/coupons/${id}`, request);

            setMessage('Salvo com sucesso');

        } catch (e) {
            console.log('e', e);
            // @ts-ignore
            const errorMessage = !!e.response ? e.response.data.message :
                'Houve um erro ao salvar as configurações.';

            setError(errorMessage);
        } finally {
            setUpdating(false);
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        fetchData(currentPage);
    }, [fetchData, updating, currentPage]);

    const handleEditClient = useCallback(async (client: Client) => {
        try {
          const {
            data: { data }
          } = await api.get(`/clients/${client.id}`);
    
          setClient(data);
          push('/register/clients/new');
        } catch (e) {
    
        //   console.log('e', e);
          // @ts-ignore
          const errorMessage = !!e.response ? e.response.data.message :
            'Houve um erro ao editar o cliente.';
    
          setError(errorMessage);
        }
      }, [setClient, push]);

      console.log('initialData', initialData);
      

    return (
        <>
            <Header route={['Loja Online', 'Cupons']} />

            <MenuAndTableContainer>
                <Menu />
                <Container >
                    {!loading ?
                        <div>
                            <Form ref={formRef} onSubmit={() => { }} initialData={initialData}>
                                <SectionTitle>
                                    Area de criação
                                </SectionTitle>

                                <InputContainer>
                                    <FormInput
                                        name="name"
                                        title="Tipo de Cupom"
                                        width="6.625rem"
                                        validated={false}
                                        value={selecao === 'Valor Integral' ? 'Valor do Cupom' : 'Porcentagem'}
                                        disabled
                                    />

                                    {
                                        initialData?.type &&
                                            <FormInput
                                                name="name"
                                                title="Cliente"
                                                width="8.625rem"
                                                validated={false}
                                                value={initialData?.type === 1 ? 'Novo Cliente' : 'Cliente Retornado'}
                                                disabled
                                            />
                                    }
    
                                    <FormInput
                                        name='name'
                                        disabled
                                        title='Nome do Cupom'
                                        width="8.625rem"
                                        value={initialData?.name}
                                    />

                                    <FormInput
                                        name='value'
                                        title={selecao}
                                        disabled
                                        width="6.625rem"
                                        value={
                                            selecao === 'Valor Integral' ?
                                             initialData?.discount_value :
                                             initialData?.discount_porc + '%'
                                        }
                                    />
                                    
                                    <DateBox
                                        name="order_date"
                                        title="Validade"
                                        width="7rem"
                                        validated={true}
                                        disabled
                                        hasHour={false}
                                        noMinDate={true}
                                        initialDate={initialData?.validate}
                                        onDateChange={(value) => onDateChange(value)}
                                    />

                                    {     
                                        initialData?.price &&
                                        <FormInput
                                            name='Value'
                                            title={'Valor Válido ' + ((initialData?.price_type === 1) ? 'acima de:' : 'abaixo de:')}
                                            width="8.625rem"
                                            value={"R$" + initialData?.price}
                                            disabled
                                        />
                                    }

                                    <GoBackButton
                                        style={{ marginLeft: 'auto' }}
                                        onClick={goBack}
                                    >
                                        <GoBackIcon />
                                        Voltar
                                    </GoBackButton>
                                </InputContainer>
                                <InputContainer>
                                        <FormInput
                                            disabled
                                            title='Vendedor'
                                            name='grupo'
                                            value={initialData?.seller?.name}
                                            placeholder='Não informado'
                                        />
                                        <FormInput
                                            disabled
                                            title='Perfil Comercial'
                                            name='grupo'
                                            value={initialData?.client_profile?.name}
                                            placeholder='Não informado'
                                        />

                                        <FormInput
                                            disabled
                                            title='Grupo'
                                            name='grupo'
                                            value={initialData?.client_group?.name}
                                            placeholder='Não informado'
                                        />
                                        <FormInput
                                            title='Razão Social'
                                            disabled
                                            name='grupo'
                                            value={initialData?.client?.name}
                                            placeholder='Não informado'
                                        />
                                </InputContainer>
                                <InputContainer>
                                    <FormInput
                                        title='Fornecedor'
                                        name='grupo'
                                        value={initialData?.supplier?.name}
                                        placeholder='Não informado'
                                        disabled
                                    />
                                    {
                                        supplier ?

                                            <FormInput
                                                title='Categoria'
                                                disabled
                                                name='grupo'
                                                value={initialData?.category?.name}
                                                placeholder='Não informado'
                                            />
                                            : null
                                    }

                                    <FormInput
                                        title='Produtos'
                                        disabled
                                        name='grupo'
                                        value={initialData?.product?.name}
                                        placeholder='Não informado'
                                    />

                                    <FormInput
                                        title='Marca'
                                        disabled
                                        name='grupo'
                                        value={initialData?.brand?.name}
                                        placeholder='Não informado'
                                    />
                                </InputContainer>
                                
                                <InputContainer>
                                    <FormInput
                                        name='value'
                                        title='Descrição do cupom'
                                        width="47rem"
                                        value={initialData?.description}
                                        disabled
                                        placeholder='Sem descrição'
                                    />
                                </InputContainer>
                                 
                            </Form>
                            <div>
                                <TableTitle fontSize="2rem" lineHeight="140%" style={{ margin: 10 }}>
                                    Clientes:
                                </TableTitle>
                                <Table>
                                        <colgroup>
                                            <col span={1} style={{ width: '4%' }} />
                                            <col span={1} style={{ width: '18%' }} />
                                            <col span={1} style={{ width: '18%' }} />
                                            <col span={1} style={{ width: '14%' }} />
                                            <col span={1} style={{ width: '14%' }} />
                                            <col span={1} style={{ width: '14%' }} />
                                            <col span={1} style={{ width: '14%' }} />
                                            <col span={1} style={{ width: '4%' }} />
                                        </colgroup>
                                    <thead>
                                        <th>
                                            <TableSortingHeader dir='' onClick={() => { }}>
                                                RAZÃO SOCIAL
                                                <SortIcon />
                                            </TableSortingHeader>
                                        </th>
                                        <th>
                                            <TableSortingHeader dir='' onClick={() => { }}>
                                                CNPJ
                                                <SortIcon />
                                            </TableSortingHeader>
                                        </th>
                                        <th>
                                            <TableSortingHeader dir='' onClick={() => { }}>
                                                COMERCIAL
                                                <SortIcon />
                                            </TableSortingHeader>
                                        </th>
                                        <th style={{ whiteSpace: 'nowrap' }}>
                                            <TableSortingHeader dir='' onClick={() => { }}>
                                                STATUS DO CUPOM
                                                <SortIcon />
                                            </TableSortingHeader>
                                        </th>
                                        <th>
                                            <TableSortingHeader dir='' onClick={() => { }}>
                                                ÚLTIMO LOGIN
                                                <SortIcon />
                                                </TableSortingHeader>
                                        </th>
                                        <th>
                                            <TableSortingHeader dir='' onClick={() => { }}>
                                                ÚLTIMA VENDA
                                                <SortIcon />
                                            </TableSortingHeader>
                                        </th>
                                        <th>
                                            AÇÃO
                                        </th>
                                    </thead>
                                    <tbody>
                                        {clients?.data.map((data) => (
                                            <tr key={data.id}>
                                                <td>{data.company_name}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>
                                                    {data?.document}
                                                </td>
                                                <td style={{ whiteSpace: 'nowrap' }}>
                                                    {data?.seller.name}
                                                </td>
                                                {data?.used_coupon ? 
                                                    <td style={{ whiteSpace: 'nowrap' }}>
                                                        Utilizado
                                                    </td> 
                                                : 
                                                    <td style={{ whiteSpace: 'nowrap' }}>
                                                        Não utilizado
                                                    </td>
                                                }
                                                
                                                <td>
                                                    <TableDateBox
                                                        name=""
                                                        title=""
                                                        width="5rem"
                                                        // @ts-ignore
                                                        showTime={false}
                                                        date={data?.last_login}
                                                        onDateSelect={() => { }}
                                                        disabled
                                                        validated={false}
                                                    />
                                                </td>
                                                <td>
                                                    <TableDateBox
                                                        name=""
                                                        title=""
                                                        width="5rem"
                                                        // @ts-ignore
                                                        showTime={false}
                                                        date={data?.last_order}
                                                        onDateSelect={() => { }}
                                                        disabled
                                                        validated={false}
                                                    />
                                                </td>
                                                <td>
                                                    <TableActionButton
                                                        onClick={() => handleEditClient(data)}
                                                        // disabled={revalidating === p.id}
                                                        >
                                                        <EditIcon />
                                                    </TableActionButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <TableFooter>
                                        <TableFooter>
                                            <Pagination
                                                currentPage={clients?.current_page || 1}
                                                lastPage={clients?.last_page || 1}
                                                setCurrentPage={setCurrentPage}
                                            />
                                        </TableFooter>

                                    </TableFooter>
                                </Table>
                            </div>
                        </div>

                        :
                        <Container>
                            <LoadingContainer
                                content="as configurações"
                            />
                        </Container>
                    }

                </Container>
            </MenuAndTableContainer>

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
};

