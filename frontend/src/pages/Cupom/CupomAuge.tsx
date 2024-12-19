import CustomSelect from "@/src/components/ApiSelect/CustomSelect";
import { DateBox } from "@/src/components/DateBox";
import { ErrorModal } from "@/src/components/ErrorModal";
import { FormInput } from "@/src/components/FormInput";
import { FormSelect } from "@/src/components/FormSelect";
import { FormTextArea } from "@/src/components/FormTextArea";
import { Header } from "@/src/components/Header";
import { LoadingContainer } from "@/src/components/LoadingContainer";
import { Menu } from "@/src/components/Menu";
import { RadioBox } from "@/src/components/RadioBox";
import { SuccessModal } from "@/src/components/SuccessModal";

import { api } from "@/src/services/api";
import {
    InputContainer,
    SectionTitle,
    WrapperCardsCupons,
} from "@/src/styles/components";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router";
import { ReactComponent as GoBackIcon } from "~assets/goback_arrow.svg";
import { MenuAndTableContainer } from "~styles/components";
import { Button, Container } from "../Dashboard/styles";
import { formatDateString } from "../Finances/NewInvoice";
import { GoBackButton } from "../Mail/New/styles";
import Cupom from "./Cupom";
import CupomImg from "./cupom.png";
import { Pagination } from "@/src/components/Pagination";
import { isNotEmpty } from "@/src/utils/validation";

interface CupomInterface {
    id: number;
    name: string;
    discount_value: string;
    discount_porc: string;
    created_at: string;
    validate: string;
    updated_at: string;
    deleted_at: string;
}

interface Response {
    current_page: number;
    data: CupomInterface[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

const tipoCupom = [
    {
        value: 1,
        label: "Novo Cliente",
    },
    {
        value: 2,
        label: "Cliente Retornado",
    },
];

export function CupomAuge() {
    const formRef = useRef<FormHandles>(null);
    const [initialData, setInitialData] = useState({});
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [cuponsAuge, setCuponsAuge] = useState<Response>();
    const [loading, setLoading] = useState(true);
    const [selecao, setSelecao] = useState<string>("Porcentagem");
    const [selecao1, setSelecao1] = useState<string>("");


    const [buyer, setBuyer] = useState<string>();
    const [product, setProduct] = useState<string>();
    const [category, setCategory] = useState<string>();
    const [seller, setSeller] = useState<string>();
    const [group, setGroup] = useState<string>();
    const [perfil, setPerfil] = useState<string>();
    const [searchCurrentPage, setSearchCurrentPage] = useState<number>(1);
    const [searchLastPage, setSearchLastPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(1);
    const [search, setSearch] = useState('');


    const [supplier, setSupplier] = useState<string>();
    const [comercialProfile, setComercialProfile] = useState<string>();

    const [selectedDate, setSelectedDate] = useState<string>();
    const [brand, setbrands] = useState<string>();

    const { goBack } = useHistory();

    const fetchData = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const {
                data,
            } = await api.get("/coupons", {
                params: { page }
            });
            console.log("AQUI ==>", data);

            setCuponsAuge(data);
        } catch (e) {
            console.log("e", e);
        } finally {
            setLoading(false);
        }
    }, [setLoading]);

    function onDateChange(value: string) {
        setSelectedDate(value);
    }

    const handleSubmit = useCallback(async () => {
        try {
            setUpdating(true);
            setLoading(true);
            // @ts-ignore
            const data = formRef.current?.getData();

            await api.post("/coupons/novocupon", {
                ...data,
                buyer,
                product,
                price_type: selecao1 === 'Acima de' ? 1 : 2,
                category,
                seller,
                group,
                comercial_profile: perfil,
                supplier,
                brand,
                validate: formatDateString(selectedDate),
            });

            setMessage("Salvo com sucesso");
        } catch (e) {
            console.log("e", e);
            // @ts-ignore
            const errorMessage = !!e.response
                ? // @ts-ignore
                e.response.data.message
                : "Houve um erro ao salvar as configurações.";

            setError(errorMessage);
        } finally {
            setUpdating(false);
            setLoading(false);
        }
    }, [brand, buyer, category, group, perfil, product, selecao1, selectedDate, seller, supplier]);

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, fetchData, updating]);

    const { currentPageValue, lastPageValue } = useMemo(() => ({
        currentPageValue: isNotEmpty(search) ? searchCurrentPage : currentPage,
        lastPageValue: isNotEmpty(search) ? searchLastPage : lastPage,
    }), [search, searchCurrentPage, currentPage, lastPage, searchLastPage])

    return (
        <>
            <Header route={["Loja Online", "Cupons"]} />
            <MenuAndTableContainer>
                <Menu />
                <Container>
                    <Form ref={formRef} onSubmit={() => { }} initialData={initialData}>
                        <SectionTitle>Area de criação</SectionTitle>

                        <InputContainer>
                            <RadioBox
                                title="Tipo de Cupom"
                                value={selecao}
                                setValue={setSelecao}
                                options={["Valor Integral", "Porcentagem"]}
                            />
                        </InputContainer>

                        <InputContainer style={{ gap: "1rem" }}>
                            <FormInput 
                                name="name" 
                                title="Nome do Cupom" 
                                width="8.625rem" 
                                style={{ margin: 0 }}
                            />

                            {selecao === "Valor Integral" ? (
                                <FormInput
                                    name="value"
                                    title="Valor integral"
                                    width="8.625rem"
                                    style={{ margin: 0 }}
                                />
                            ) : (
                                <FormInput
                                    name="porcent"
                                    title="Porcentagem"
                                    width="8.625rem"
                                    style={{ margin: 0 }}
                                />
                            )}

                            <DateBox
                                name="order_date"
                                title="Validade"
                                width="6rem"
                                validated={true}
                                hasHour={false}
                                noMinDate={true}
                                initialDate={formatDateString(new Date().toString())}
                                onDateChange={(value) => onDateChange(value)}
                            />

                            <FormSelect
                                name="type"
                                title="Novo Cliente"
                                placeholder="Selecione..."
                                customWidth="10rem"
                                data={tipoCupom}
                                style={{ margin: 0 }}
                            />

                            <FormInput 
                                type="text" 
                                name="period" 
                                title="Periodo" 
                                width="6.625rem" 
                                style={{ margin: 0 }}
                            />

                            <FormInput 
                                name="price" 
                                title="Valor" 
                                width="6.625rem" 
                                placeholder="Digite aqui..." 
                                style={{ margin: 0 }}
                            />

                            <RadioBox
                                title="Valor"
                                value={selecao1}
                                setValue={setSelecao1}
                                options={["Acima de", "Abaixo de"]}
                            />
                        </InputContainer>

                        <InputContainer style={{ gap: "6rem" }}>
                            <div style={{ display: "flex", gap: "2rem" }}>
                                <CustomSelect
                                    route="sellers"
                                    label="Vendedor"
                                    newKey="name"
                                    onChange={(selectedOption) => setSeller(selectedOption?.value || "")}
                                />
                                <CustomSelect
                                    route="clients/profiles"
                                    newKey="profiles"
                                    label="Perfil Comercial"
                                    onChange={(selectedOption) =>
                                        setPerfil(selectedOption?.value || "")
                                    }
                                />
                                <CustomSelect
                                    label="Grupo"
                                    route="clients/groups?paginated=true&per_page=10"
                                    newKey="search"
                                    onChange={(selectedOption) =>
                                        setGroup(selectedOption?.value || "")
                                    }
                                />

                                <CustomSelect
                                    route='clients?paginated=true&per_page=10'
                                    newKey='search'
                                    custom='by_group'
                                    label='Razão Social'
                                    onChange={(selectedOption) => setBuyer(selectedOption?.value || '')}
                                />
                            </div>

                        </InputContainer>

                        <InputContainer>
                            <CustomSelect
                                route="/products/suppliers"
                                label="Fornecedor"
                                newKey="name"
                                onChange={(selectedOption) =>
                                    setSupplier(selectedOption?.value || "")
                                }
                            />
                            {supplier ? (
                                <CustomSelect
                                    route={`/products/suppliers/${supplier}/categories`}
                                    label="Categoria"
                                    newKey="category"
                                    onChange={(selectedOption) =>
                                        setCategory(selectedOption?.value || "")
                                    }
                                />
                            ) : null}

                            <CustomSelect
                                route="products"
                                label="Produtos"
                                newKey="title"
                                custom="by_category"
                                id={category}
                                onChange={(selectedOption) =>
                                    setProduct(selectedOption?.value || "")
                                }
                            />

                            <CustomSelect
                                route="products/brands"
                                newKey="name"
                                label="Marca"
                                onChange={(selectedOption) =>
                                    setbrands(selectedOption?.value || "")
                                }
                            />
                        </InputContainer>

                        <InputContainer style={{ alignItems: 'center' }}>
                            <FormTextArea
                                name="description"
                                type="description"
                                title="Descrição do cupom"
                                width="48rem"
                                maxLength={130}
                            />

                            <GoBackButton onClick={goBack}>
                                <GoBackIcon />
                                Voltar
                            </GoBackButton>

                            <Button
                                onClick={handleSubmit}
                                className="save"
                                disabled={updating}
                            >
                                {updating ? "Criando..." : "Criar Cupom"}
                            </Button>
                        </InputContainer>
                    </Form>
                    <SectionTitle>Lista de Cupons</SectionTitle>
                    <WrapperCardsCupons>
                        {loading ? (
                            <Container>
                                <LoadingContainer content="as configurações" />
                            </Container>
                        ) : (
                            cuponsAuge?.data?.map((cupom) => (
                                <Cupom
                                    id={cupom.id}
                                    name={cupom?.name}
                                    value={cupom?.discount_value}
                                    porcent={cupom?.discount_porc}
                                    cDate={cupom?.created_at}
                                    url={CupomImg}
                                    validate={cupom?.validate ?? cupom?.created_at}
                                    setError={setError}
                                    setLoading={setUpdating}
                                />
                            ))
                        )}
                    </WrapperCardsCupons>
                    <Pagination
                        style={{ marginTop: '2rem' }}
                        currentPage={cuponsAuge?.current_page || 1}
                        lastPage={cuponsAuge?.last_page || 1}
                        setCurrentPage={setCurrentPage}
                    />
                </Container>
            </MenuAndTableContainer>

            <ErrorModal error={error} setIsModalOpen={() => setError("")} />
            <SuccessModal message={message} setIsModalOpen={() => setMessage("")} />
        </>
    );
}
