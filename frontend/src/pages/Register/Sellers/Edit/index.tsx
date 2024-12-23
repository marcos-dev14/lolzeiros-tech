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
import type { ISeller } from "@/src/types/main";
import { FormSelect } from "@/src/components/FormSelect";

export function EditSeller() {
  const [sellerData, setSellerData] = useState<ISeller>({} as ISeller);

  const formRef = useRef<FormHandles>(null);
  const { seller, setSeller, updateSeller } = useRegister()
  const { goBack } = useHistory();

  const { id } = useParams<{ id: string }>();

  const fetchSeller = useCallback(async () => {
    try {
      const {
        data: { data },
      } = await api.get(`sellers/${id}`);

      setSeller(data);
      setSellerData(data)
    } catch (e) {
      console.log('Erro ao buscar vendedor:', e);
    }
  }, []);

  const [sellerStatus, setSellerStatus] = useState(() =>
    !!sellerData ?
      'status' in sellerData ? sellerData.status! :
        !!seller.status ? 'Ativo' : 'Inativo'
      : 'Inativo'
  );

  const [avaliableOpportunity , setAvaliableOpportunity ] = useState(() =>
    !!sellerData ?
      'avaliable_opportunity ' in sellerData ? sellerData.status! :
        !!seller.status ? 'Sim' : 'Não'
      : 'Não'
  );

  const [portfolioCustomer , setPortfolioCustomer  ] = useState(() =>
    !!sellerData ?
      'portfolio_customer' in sellerData ? sellerData.status! :
        !!seller.status ? 'Fixo' : 'Dinâmico'
      : 'Dinâmica'
  );
  
  useEffect(() => {
    fetchSeller();
  }, [id]);

  return (
    <>
      <Header route={[]} />
      <MenuAndTableContainer>
        <Menu />

        <Form ref={formRef} onSubmit={() => {}} initialData={sellerData} >
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
              {/* <FormSelect 
                name="status"
                title="Status do Comercial"
                placeholder="Selecione..."
                customWidth="12.5rem"
              /> */}
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
              {/* <DateBox
                name="createDate"
                title="Cadastro na Auge"
                width="6.75rem"
                validated={false}
                hasHour={false}
                disabled={!sellerData}
                noMinDate
                // @ts-ignore
                focusOnNextElement={() => hasEcommerceRef?.current?.focus()}
              /> */}
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
                onClick={() => {}}
              >
                Salvar
              </Button>
            </InputContainer>
          </Container>
        </Form>
      </MenuAndTableContainer>
    </>
  )
}