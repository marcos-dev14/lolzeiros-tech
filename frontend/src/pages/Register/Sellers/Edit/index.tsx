import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormHandles } from '@unform/core';
import { Form } from "@unform/web";

import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';

import { Header } from "@/src/components/Header";
import { Menu } from "@/src/components/Menu";
import { InputContainer, MenuAndTableContainer, SectionTitle } from "@/src/styles/components";
import { FormInput } from "@/src/components/FormInput";

import { Button, Container } from "../styles";
import { GoBackButton } from "./styles";
import { useHistory, useParams } from "react-router";
import { api } from "@/src/services/api";
import { useRegister } from "@/src/context/register";
import { DateBox } from "@/src/components/DateBox";
import { RadioBox } from "@/src/components/RadioBox";
import type { DefaultValuePropsWithId, IBaseType, ISeller } from "@/src/types/main";
import { FormSelect } from "@/src/components/FormSelect";
import { MultiSelect } from "@/src/components/MultiSelect";
import { SuccessModal } from "@/src/components/SuccessModal";
import { ErrorModal } from "@/src/components/ErrorModal";

export function EditSeller() {
  const [sellerData, setSellerData] = useState<ISeller>({} as ISeller);
  const [suppliersOptions, setSuppliersOptions] = useState([]);
  const [isUpdatingBlockedSupplier, setIsUpdatingBlockedSupplier] = useState(false);
  const [suppliersId, setSuppliersId] = useState<number[]>([]);
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const formRef = useRef<FormHandles>(null);
  const { seller, setSeller, updateSeller } = useRegister()
  const { goBack } = useHistory();

  const { id } = useParams<{ id: string }>();
  
  const [sellerStatus, setSellerStatus] = useState(() =>
    !!sellerData ?
      'status' in sellerData ? sellerData.status! :
        !!sellerData.status ? 'Ativo' : 'Inativo'
      : 'Inativo'
  );

  const [avaliableOpportunity , setAvaliableOpportunity ] = useState(() =>
    !!sellerData ?
      'avaliable_opportunity ' in sellerData ? sellerData.status! :
        !!sellerData.status ? 'Sim' : 'Não'
      : 'Não'
  );

  const [portfolioCustomer , setPortfolioCustomer  ] = useState(() =>
    !!sellerData ?
      'portfolio_customer' in sellerData ? sellerData.status! :
        !!sellerData.status ? 'Fixo' : 'Dinâmico'
      : 'Dinâmica'
  );

  const fetchSeller = useCallback(async () => {
    try {
      const [
        sellerResponse,
        suppliersResponse
      ] = await Promise.all([
        api.get(`sellers/${id}`),
        api.get('/products/suppliers'),
      ])

      const {
        data: { data: seller }
      } = sellerResponse;

      const {
        data: { data: suppliersData }
      } = suppliersResponse;
      
      setSeller(seller);
      setSellerData(seller);

      setSellerStatus(seller.status);
      setAvaliableOpportunity(seller.avaliable_opportunity);
      setPortfolioCustomer(seller.portfolio_customer);
      // @ts-ignore
      setSuppliersOptions(suppliersData.map((a: string) => ({ id: a.id, value: a.name, label: a.name })))
    } catch (e) {
      console.log('Erro ao buscar vendedor:', e);
    }
  }, []);

  const formattedFetchSeller = useMemo(() => {
    if (sellerData) {
      return {
        ...sellerData,
        // @ts-ignore
        created_at: new Date(sellerData.created_at),
      };
    }
  }, [sellerData])

  // const handleBlockedSupplier = useCallback(async (value: DefaultValuePropsWithId[]) => {
  //   try {
  //     if (!sellerData.blocked_suppliers) return;
  //     setIsUpdatingBlockedSupplier(true);

  //     const { blocked_suppliers } = sellerData;
  //     const formattedBlockedSuppliers = value.map(e => ({ id: e.id, name: e.value }));

  //     console.log("FORMATTED BLOCKED: ", formattedBlockedSuppliers)

  //     if (!!blocked_suppliers.length && !value.length) {
  //       // @ts-ignore
  //       let { id } = blocked_suppliers[blocked_suppliers.length - 1];
  //       await api.delete(`/clients/${sellerData.id}/blocked_suppliers/${id}`);
  //       updateSeller({ blocked_suppliers: formattedBlockedSuppliers });

  //       return;
  //     }

  //     const valuesOnlyId = value.map(c => c.id);
  //     const blockedSuppliersOnlyId = blocked_suppliers.map(c => c.id);

  //     console.log("ID BLOCKED: ", blockedSuppliersOnlyId)

  //     if (blocked_suppliers.length > value.length) {
  //       // @ts-ignore
  //       let [id] = blockedSuppliersOnlyId.filter(e => !valuesOnlyId.includes(e));
  //       await api.delete(`/clients/${sellerData.id}/blocked_suppliers/${id}`);
  //     }
  //     else {
  //       const id = !blocked_suppliers.length ? value[0].id : valuesOnlyId.filter((e) => !blockedSuppliersOnlyId.includes(e));
  //       await api.post(`/clients/${sellerData.id}/blocked_suppliers`, { attach_supplier_id: id });
  //     }

  //     updateSeller({ blocked_suppliers: formattedBlockedSuppliers });
  //   } catch (e) {
  //     console.log('e', e);
  //   } finally {
  //     setIsUpdatingBlockedSupplier(false);
  //   }
  // }, [seller, sellerData, updateSeller])

  const handleBlockedSupplier = useCallback((value: DefaultValuePropsWithId[]) => {
    try {
      if (!sellerData.blocked_suppliers) return;
      setIsUpdatingBlockedSupplier(true);
  
      const formattedBlockedSuppliers = value.map(e => e.id); // Extraindo apenas os IDs
  
      // console.log("FORMATTED BLOCKED: ", formattedBlockedSuppliers);
  
      // Atualizando o suppliersId com os IDs (números) extraídos
      setSuppliersId(formattedBlockedSuppliers);
  
      // @ts-ignore
      updateSeller({ blocked_suppliers: value.map(e => ({ name: e.value })) });
    } catch (e) {
      console.log('e', e);
    } finally {
      setIsUpdatingBlockedSupplier(false);
    }
  }, [seller, sellerData, updateSeller]);

  const handleSubmit = useCallback(async () => {
    // @ts-ignore
    const data = formRef.current.getData()

    const formattingData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      origin: data.origin,
      status: sellerStatus === 'Ativo' ? 'Ativo' : 'Inativo',
      avaliable_opportunity: avaliableOpportunity === 'Sim' ? 'Sim' : 'Não',
      portfolio_customer: portfolioCustomer === 'Fixo' ? 'Fixo' : 'Dinâmico',
      created_at: typeof data.created_at === 'string' ? data.created_at :
      // @ts-ignore
      data.created_at.toISOString(),
      blocked_suppliers: suppliersId
    }

    console.log("DADOS ENVIADO: ", formattingData)

    // try {
    //   await api.post(`/sellers/${id}?_method=PUT`, formattingData);
    //   setMessage('Salvo com sucesso');
    // } catch (e) {
    //   console.log('Erro ao editar vendedor:', e);

    //   // @ts-ignore
    //   const errorMessage = !!e.response ? e.response.data.message :
    //     'Houve um erro ao salvar o cliente.';

    //   setError(errorMessage);
    // }
  }, [sellerStatus, avaliableOpportunity, portfolioCustomer, suppliersId])

  useEffect(() => {
    fetchSeller();
  }, [id]);

  console.log("DADOS DO SUPPLIERS: ", sellerData.blocked_suppliers)

  return (
    <>
      <Header route={[]} />
      <MenuAndTableContainer>
        <Menu />

        <Form ref={formRef} onSubmit={() => {}} initialData={formattedFetchSeller} >
          <Container>
            <SectionTitle>
              Comercial
            </SectionTitle>

            <InputContainer>
              <FormInput
                name="name"
                title="Nome"
                placeholder="Digite aqui..."
                style={{ textAlign: "left" }}
              />

              <FormInput
                name="email"
                title="Email"
                placeholder="Digite aqui..."
                style={{ textAlign: "left" }}
              />

              <FormInput
                name="phone"
                title="Celular"
                placeholder="Digite aqui..."
                style={{ textAlign: "left" }}
              />

              <FormInput
                name="phone"
                title="Telefone fixo"
                placeholder="Digite aqui..."
                style={{ textAlign: "left" }}
              />
            </InputContainer>

            <InputContainer>
              <FormInput
                name="origin"
                title="Origem"
                placeholder="Digite aqui..."
                style={{ textAlign: "left" }}
              />

              <MultiSelect
                title="Representada Bloqueada"
                placeholder="Selecione..."
                customWidth="32.75rem"
                disabled={!sellerData.created_at || isUpdatingBlockedSupplier}
                data={suppliersOptions}
                // @ts-ignore
                setValue={(value) => handleBlockedSupplier(value)}
                defaultValue={!!sellerData && !!sellerData.blocked_suppliers && sellerData.blocked_suppliers.map((s: IBaseType) => ({ id: s.id, value: s.name, label: s.name }))}
              />

              {sellerData.created_at && (
                <DateBox 
                  name="created_at" 
                  title="Cadastro na Auge"
                  width="6.75rem"
                  validated={false}
                  hasHour={false}
                  noMinDate
                  disabled={!sellerData.created_at}
                />
              )}
            </InputContainer>

            <InputContainer>
              <RadioBox
                title="Status do Comercial"
                value={sellerStatus}
                setValue={setSellerStatus}
                options={['Ativo', 'Inativo']}
              />
              <RadioBox
                title="Oportunidade de acesso"
                value={avaliableOpportunity}
                setValue={setAvaliableOpportunity}
              />
               <RadioBox
                title="Portfólio"
                value={portfolioCustomer}
                setValue={setPortfolioCustomer}
                options={['Fixo', 'Dinâmico']}
              />
            </InputContainer>

            <InputContainer>
              <GoBackButton
                onClick={goBack}
                type="button"
                className="goBack"
              >
                <GoBackIcon />
                <p>Voltar</p>
              </GoBackButton>

              <Button
                onClick={handleSubmit}
              >
                Salvar
              </Button>
            </InputContainer>
          </Container>
        </Form>
      </MenuAndTableContainer>

      <SuccessModal
        message={message}
        setIsModalOpen={() => setMessage('')}
      />
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  )
}