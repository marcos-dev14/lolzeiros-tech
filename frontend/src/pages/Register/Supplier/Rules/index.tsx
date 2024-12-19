import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Form } from '@unform/web';
import { Scope, FormHandles } from '@unform/core';
import { useQuery } from 'react-query';

import { ReactComponent as PlusIcon } from '~assets/plus.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg'
import { ReactComponent as EditIcon } from '~assets/edit1.svg';

import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Button, Container, CustomSectionTitle, DeleteItemsContainer } from './styles';

import { FormSelect } from '~components/FormSelect';
import { CustomSelect as Select } from '~components/Select';
import { MeasureBox } from '~components/FormMeasureBox';
import { RadioBox } from '~components/RadioBox';

import { api } from '~api';
import {
  DefaultValuePropsWithId,
  IBaseType,
  IState,
  ITag,
  MainSupplier,
  ProductAttribute as IProductAttribute
} from '~types/main';

import { SupplierHeader } from '@/src/components/SupplierHeader';
import { StatesWithIcmsOff } from './components/StatesWithIcmsOff';
import { FractionalBox } from './components/FractionalBox';
import { DiscountsPerProfile } from './components/DiscountsPerProfile';
import { DiscountsPerProductsAndCategories } from './components/DiscountsPerProductsAndCategories';
import { PromotionsByProducts } from './components/PromotionsByProducts';
import { PromotionsByCategories } from './components/PromotionsByCategories';
import { InstallmentsRules } from './components/NewInstallmentsRules';
import { PaymentPromotion } from './components/PaymentPromotion';
import { TagInput } from '@/src/components/TagInput';
import { useRegister } from '@/src/context/register';
import { MultiSelect } from '@/src/components/MultiSelect';
import { BinaryRadioBox } from '@/src/components/BinaryRadioBox';
import { Modal } from '~components/Modal';
import { Input } from '~components/Input';
import { TableActionButton } from '@/src/styles/components/tables';
import { ErrorModal } from '@/src/components/ErrorModal';
import { SuccessModal } from '@/src/components/SuccessModal';
import { fetchRulesData, fetchSupplierData } from '@/src/services/requests';

export function SuppliersRules() {
  const { supplier, updateSupplier, setSupplier } = useRegister();
 
  const noSupplier = useMemo(() => 
    !supplier || (!!supplier && !supplier.id)
  , [supplier])
 
  const [loading, setLoading] = useState(true);

  const [statesById, setStatesById] = useState({});
  const [regionsById, setRegionsById] = useState({});
  
  const [registering, setRegistering] = useState(false);

  const [regionName, setRegionName] = useState('');
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

  // @ts-ignore
  const [formRef, setFormRef] = useState(null);
  const updateFormRef = useCallback(node => !!node && !formRef && setFormRef(node), [formRef]);

  const [disabled, setDisabled] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const [countryStatesOptions, setCountryStatesOptions] = useState([]);
  const [regionsOptions, setRegionsOptions] = useState([]);
  const [leadTimes, setLeadTimes] = useState([]);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [taxRegimesOptions, setTaxRegimesOptions] = useState([]);
  const [blogPostsOptions, setBlogPostsOptions] = useState([]);

  const commercialStatusOptions = useMemo(() => [
    { id: 1, value: 'Ativo', label: 'Ativo' },
    { id: 2, value: 'Inativo', label: 'Inativo' },
    { id: 3, value: 'Bloqueado', label: 'Bloqueado' },
    { id: 4, value: 'Prospecção', label: 'Prospecção' },
    { id: 5, value: 'Ativa', label: 'Ativa' },
    { id: 6, value: 'Inativa', label: 'Inativa' },
    { id: 7, value: 'Bloqueada', label: 'Bloqueada' },
  ], []);

  const [allowReservation, setAllowReservation] = useState(() =>
    !!supplier ? 
      'allowReservation' in supplier ? supplier.allowReservation! :
      !!supplier.allows_reservation ? !!supplier.allows_reservation ? 'Sim' : 'Não' 
      : 'Sim'
    : 'Sim'
  );

  const [fractionalBox, setFractionalBox] = useState(() =>
    !!supplier ?
      'fractionalBox' in supplier ? supplier.fractionalBox! :
        supplier.fractional_box : 0
  );

  // const attributesOptions = useMemo(() => 
  //   attributes.map((a: MainAttribute) => ({ value: a.name, label: a.name }))
  // , [attributes]);
console.log('s', supplier)
  const { data: rulesData, isLoading } = useQuery('rulesData', fetchRulesData, {
    staleTime: 1000 * 60 * 5,
  });

  const { data: supplierData, isLoading: isSupplierLoading } =
    useQuery('supplierData', fetchSupplierData, {
      staleTime: 1000 * 60 * 5,
    });

  const handleSubmit = useCallback(async () => {
    try {
      setRegistering(true);
      // @ts-ignore
      const data = formRef.getData(); 

      const newsletter_tags =
        !!supplier.newsletterTags ?
          supplier.newsletterTags.reduce((init, value) => `${init},${value.value}`, '').replace(',','')
          : '';

      const allows_reservation = allowReservation === 'Sim' ? 1 : 0;

      const formattedData = {
        ...supplier,
        ...data,
        allows_reservation,
        fractional_box: fractionalBox,
        newsletter_tags
      }

      if (!!supplier.tax_regime) {
        if(typeof(supplier.tax_regime) === 'string') {
          // @ts-ignore
          const { id } = taxRegimesOptions.find(e => e.value === supplier.tax_regime);
          formattedData['tax_regime_id'] = id;
        } else { // @ts-ignore
          formattedData['tax_regime_id'] = supplier.tax_regime.id;
        }
      }

      if (!!supplier.status) {
        // @ts-ignore
        const { value } = commercialStatusOptions.find(e => e.value === supplier.status);
        formattedData['status'] = value;
      }

      if (!!supplier.lead_time) {
        if(typeof(supplier.lead_time) === 'string') {
          // @ts-ignore
          const { id } = leadTimes.find(e => e.value === supplier.lead_time);
          formattedData['lead_time_id'] = id;
        } else { // @ts-ignore
          formattedData['lead_time_id'] = supplier.lead_time.id;
        }
      }

      // @ts-ignore
      if (!!supplier.shipping_type_name) {
        // @ts-ignore
        if(typeof(supplier.shipping_type_name) === 'string') {
          // @ts-ignore
          const { id } = shippingOptions.find(e => e.value === supplier.shipping_type_name);
          formattedData['shipping_type_id'] = id;
        } else { // @ts-ignore
          formattedData['shipping_type_id'] = supplier.shipping_type_name.id;
        }
      }

      if (!!supplier.commercial_status) {
        // @ts-ignore
        const { value } = commercialStatusOptions.find(e => e.value === supplier.commercial_status);
        formattedData['commercial_status'] = value;
      }

      // @ts-ignore
      if (!!supplier.blog_post_id) {
        // @ts-ignore
        const { id } = blogPostsOptions.find(e => e.value === supplier.blog_post_id);
        formattedData['blog_post_id'] = id;
      }
      
      // const supplierWithoutNullValues = // @ts-ignore
        // Object.fromEntries(Object.entries(formattedData).filter(e => typeof e[1] === 'number' || !!e[1]));

      // const supplierWithoutArrayValues =
        // Object.fromEntries(Object.entries(formattedData).filter(e => typeof e[1] !== 'object'));
        // Object.fromEntries(Object.entries(supplierWithoutNullValues).filter(e => typeof e[1] !== 'object'));
      
      // @ts-ignore
      delete formattedData.id;
      // @ts-ignore
      delete formattedData.image;
      // delete supplierWithoutArrayValues.id;
      //  console.log('f', formattedData)
      if (!noSupplier) 
        await api.post(`/products/suppliers/${supplier.id}?_method=PUT`, formattedData);
      else {
        const {
          data: { data }
        } = await api.post('/products/suppliers', formattedData);

        setSupplier(data as unknown as MainSupplier);
      }

      setMessage('Salvo com sucesso');

      // se for novo, salvar o supplier para permitir edição
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar a representada.';

      setError(errorMessage);
    } finally {
      setRegistering(false);
    }
  }, [
      formRef,
      noSupplier,
      supplier,
      setSupplier,
      commercialStatusOptions,
      taxRegimesOptions,
      leadTimes,
      shippingOptions,
      blogPostsOptions,
      allowReservation,
      fractionalBox
    ]);

  // const fetchData = useCallback(async () => {
  //   try {
  //     if (!!countryStatesOptions.length && !!regionsOptions.length) return;
      
  //     const [
  //       countryStatesResponse,
  //       regionsResponse
  //     ] = await Promise.all([
  //       api.get('/country_states'),
  //       api.get('/blocking_rules')
  //     ])

  //     const {
  //       data: { data: countryStates }
  //     } = countryStatesResponse;

  //     const {
  //       data: { data: regions }
  //     } = regionsResponse;

  //     let countrySet = {};
  //     let regionsSet = {};

  //     // @ts-ignore
  //     countryStates.forEach((s) => countrySet[s.id] = s.name);
  //     // @ts-ignore
  //     regions.forEach((s) => regionsSet[s.id] = s.name);

  //     setStatesById(countrySet);
  //     setRegionsById(regionsSet);

  //     // @ts-ignore
  //     setCountryStatesOptions(countryStates.map((a: string) => ({ id: a.id, value: a.code, label: a.code })))
  //     // @ts-ignore
  //     setRegionsOptions(regions.map((a: string) => ({ id: a.id, value: a.name, label: a.name })));
  //     // setRegionsOptions([{ id: -1, value: 'new', label: 'Novo Modelo' }, ...regions.map((a: string) => ({ id: a.id, value: a.name, label: a.name }))]);
  //   } catch (e) {
  //     console.log('e', e);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [countryStatesOptions, regionsOptions]);

  const formattedData = useMemo(() => {
    if (!supplier) {
      return {
        activity_start: '2022-06-03T01:05:45.000000Z',
        auge_register: '2022-06-03T01:05:45.000000Z',
        min_ticket: '',
        min_order: '',
        discount_in_cash: '',
        fractional_box: '',
        client_mei_value: '',
        client_vip_value: '',
        client_premium_value: '',
        client_platinum_value: ''
      };
    }

    // falta pegar os valores de radio button

    return {
      activity_start: supplier.activity_start ?? new Date().toISOString(),
      auge_register: supplier.auge_register ?? new Date().toISOString(),
      min_ticket: supplier.min_ticket ?? '',
      min_order: supplier.min_order ?? '',
      discount_in_cash: supplier.discount_in_cash ?? '',
      fractional_box: supplier.fractional_box ?? '',
      client_mei_value: supplier.client_mei_value ?? '',
      client_vip_value: supplier.client_vip_value ?? '',
      client_premium_value: supplier.client_premium_value ?? '',
      client_platinum_value: supplier.client_platinum_value ?? ''
    };
  }, [supplier]);

  const paymentPromotionsData = useMemo(() => 
    !!supplier ?
      !!supplier.payment_promotions ? supplier.payment_promotions : []
    : []
  , [supplier])

  const stateDiscountsData = useMemo(() => 
    !!supplier ?
      !!supplier.state_discounts ? supplier.state_discounts : []
    : []
  , [supplier])

  const profileDiscountsData = useMemo(() => 
    !!supplier ? 
      !!supplier.profile_discounts ? 
      supplier.profile_discounts.filter(s => !s.categories.length) : []
    : []
  , [supplier])

  const profileCategoriesDiscountsData = useMemo(() => 
    !!supplier ? 
      !!supplier.profile_discounts ? 
      supplier.profile_discounts.filter(s => !!s.categories.length) : []
    : []
  , [supplier])

  const promotionsByProductsData = useMemo(() => 
    !!supplier ? 
      !!supplier.promotions ? supplier.promotions.filter(p => !!p.products) : []
    : []
  , [supplier])

  const promotionsByCategoryData = useMemo(() => 
    !!supplier ? 
      !!supplier.promotions ? supplier.promotions.filter(p => !!p.categories) : []
    : []
  , [supplier])

  const installmentsRules = useMemo(() => 
    !!supplier ? 
      !!supplier.installment_rules ? supplier.installment_rules : []
    : []
  , [supplier])

  const fractionations = useMemo(() => 
    !!supplier ? 
      !!supplier.profile_fractionations ? supplier.profile_fractionations : []
    : []
  , [supplier])

  const handleShouldUpdate = useCallback((fieldTitle: string, newValue: string) => {
    // @ts-ignore
    let data = formRef.getData();
    
    // @ts-ignore
    data[fieldTitle] = newValue;
          
    // @ts-ignore
    updateSupplier(data);
  }, [formRef, updateSupplier]);

  const handleBlockingRules = useCallback(async (name: string, id?: number) => {
    try {
      // let endpoint = `/products/suppliers/${supplier.id}/blocking_rules/${id}`
      let endpoint = `/blocking_rules/${id}`
      endpoint = !!id ? `${endpoint}?_method=PUT` : endpoint; 

      // await api.post(`/blocking_rules/${id}`);
      const { data: { data } } = await api.post(endpoint, { name });

      // @ts-ignore
      setRegionsOptions(prev => // @ts-ignore
        !!id ? prev.map(e => e.id === id ? ({ id, value: name, label: name }) : e) : // @ts-ignore
        [...prev, { id: data.id, value: data.name, label: data.name }]
      );
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  const handleDeleteBlockingRule = useCallback(async (id: number) => {
    try {
      await api.delete(`/blocking_rules/${id}`);

      // @ts-ignore
      setRegionsOptions(prev => prev.filter(e => e.id !== id));
      setRegionName('Carregando');
      // setRegionName(data.name);
      setRegionName('');
    } catch (e) {
      console.log('e', e);
    }
  }, []);

  const handleBlockingRule = useCallback(async (value: DefaultValuePropsWithId[]) => {
    try {
      if(!supplier) return;
      
      const { blocking_rules } = supplier;
      
      const formattedBlockingRules = value.map(e => ({ id: e.id, name: e.value }));
      
      if (!!blocking_rules.length && !value.length) {
        // @ts-ignore
        let { id } = blocking_rules[blocking_rules.length -1];
        await api.delete(`/products/suppliers/${supplier.id}/blocking_rules/${id}`);
        updateSupplier({ blocking_rules: formattedBlockingRules });
        
        return;
      }

      const valuesOnlyId = value.map(c => c.id);
      const blockedRegionsOnlyId = blocking_rules.map(c => c.id);

      if (blocking_rules.length > value.length) {
        // @ts-ignore
        let [id] = blockedRegionsOnlyId.filter(e => !valuesOnlyId.includes(e));
        await api.delete(`/products/suppliers/${supplier.id}/blocking_rules/${id}`);
      }
      else {
        const id = !blocking_rules.length ? value[0].id : valuesOnlyId.filter((e) => !blockedRegionsOnlyId.includes(e));
        await api.post(`/products/suppliers/${supplier.id}/blocking_rules`, { attach_id: id });
      }
      
      updateSupplier({ blocking_rules: formattedBlockingRules });
    } catch (e) {
      console.log('e', e);
    }
  }, [supplier, updateSupplier])

  const handleAllowedStates = useCallback(async (value: DefaultValuePropsWithId[]) => {
    try {
      if(!supplier) return;
      
      const { blocked_states } = supplier;
      
      // @ts-ignore
      const formattedBlockedStates = value.map(e => ({ id: e.id, code: e.value, name: statesById[e.id] }));

      if (!!blocked_states.length && !value.length) {
        // @ts-ignore
        let { id } = blocked_states[blocked_states.length -1];
        await api.delete(`/products/suppliers/${supplier.id}/blocked_states/${id}`);
        updateSupplier({ blocked_states: formattedBlockedStates });
        
        return;
      }

      const valuesOnlyId = value.map(c => c.id);
      const blockedStatesOnlyId = blocked_states.map(c => c.id);

      if (blocked_states.length > value.length) {        
        // @ts-ignore
        let [id] = blockedStatesOnlyId.filter((e) => !valuesOnlyId.includes(e))
        await api.delete(`/products/suppliers/${supplier.id}/blocked_states/${id}`);
      }
      else {        
        const id = !blocked_states.length ? value[0].id : valuesOnlyId.filter((e) => !blockedStatesOnlyId.includes(e));
        await api.post(`/products/suppliers/${supplier.id}/blocked_states`, { attach_id: id });
      }
      
      updateSupplier({ blocked_states: formattedBlockedStates });
    } catch (e) {
      console.log('e', e);
    }
  }, [supplier, updateSupplier, statesById])

  const handleNewRegion = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.post('/blocking_rules', { name: regionName });

      const newRegion = {
        id: data.id,
        value: data.name,
        label: data.name,
      }

      // @ts-ignore
      setRegionsOptions(prev => [...prev, newRegion])

      setRegionName('Carregando');
      // setRegionName(data.name);
      setRegionName('');

      setIsRegionModalOpen(false);
    } catch (e) {
      console.log('e', e);
    }
  }, [regionName]);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  useEffect(() => {
    if(!isLoading && !!rulesData) {
      // @ts-ignore
      setStatesById(rulesData.countrySet)
      // @ts-ignore
      setRegionsById(rulesData.regionsSet)
      // @ts-ignore
      setCountryStatesOptions(rulesData.countryStatesOptions)
      // @ts-ignore
      setRegionsOptions(rulesData.regionsOptions)
    }
  }, [isLoading, rulesData]);

  useEffect(() => {
    if(!isSupplierLoading && !!supplierData) {
      // @ts-ignore
      setShippingOptions(supplierData.shippingOptions)
      
      // @ts-ignore
      setLeadTimes(supplierData.leadTimesOptions)      
      
      // @ts-ignore
      setTaxRegimesOptions(supplierData.taxRegimesOptions)      
      
      // @ts-ignore
      setBlogPostsOptions(supplierData.blogPostsOptions);
    }
  }, [isSupplierLoading, supplierData]);

  return (
    <>
      <Header minimal route={['Cadastro', 'Representada', 'Editar Representada']} />
      <MenuAndTableContainer>
        <Menu minimal />
          {/* @ts-ignore */}
        <Form ref={updateFormRef} onSubmit={() => {}} initialData={formattedData}>
        <Container>
          <SupplierHeader
          // @ts-ignore
            ref={formRef}
            disabled={disabled}
            data={{
              fractionalBox,
              allowReservation
            }}
          >
            <div
              style={{
                margin: '0 1rem',
                borderLeft: '2px solid #eee'
              }}
            >
              <Button
                onClick={handleSubmit}
                disabled={registering}
                type="button"
                style={{
                  width: '12.375rem',
                  marginLeft: '1rem',
                  backgroundColor: '#21D0A1',
                  color: '#fff'
                }}
              >
                {registering ? 'Aguarde...' : 'Salvar'}
              </Button>
            </div>
          </SupplierHeader>

          <CustomSectionTitle>
            Políticas e Estratégias Comerciais
          </CustomSectionTitle>
            <InputContainer>
              <MeasureBox
                name="min_ticket"
                title="Boleto Mínimo"
                measure="R$"
                width="5.5rem"
                validated={false}
                onBlur={({ target: { value } }) => !!value && handleShouldUpdate('min_ticket', value)}
              />
              <MeasureBox
                name="min_order"
                title="Pedido Mínimo"
                measure="R$"
                width="5.5rem"
                validated={false}
                onBlur={({ target: { value } }) => !!value && handleShouldUpdate('min_order', value)}
              />
              {/* <MeasureBox
                name="discount_in_cash"
                title="Desconto à Vista"
                measure="%"
                width="4.25rem"
                validated={false}
                onBlur={({ target: { value } }) => !!value && handleShouldUpdate('discount_in_cash', value)}
              /> */}
              <BinaryRadioBox
                title="Fraciona Caixa"
                value={fractionalBox}
                setValue={setFractionalBox}
              />
              <RadioBox
                title="Permite Reserva"
                value={allowReservation}
                setValue={setAllowReservation}
              />
              <MultiSelect
                title="Estados que não são permitido a venda"
                placeholder="Selecione..."
                // customWidth="19.25rem"
                customWidth="48rem"
                disabled={!supplier.id}
                data={countryStatesOptions}
                customBgColor="#FF6F6F"
                twoLines
                style={{
                  maxHeight: 64,
                }}
                // @ts-ignore
                setValue={(value) => handleAllowedStates(value)}
                // data={countryStates}
                defaultValue={
                  !!supplier &&
                  !!supplier.blocked_states &&
                  supplier.blocked_states.map((s: IState) => ({ id: s.id, value: s.code, label: s.code }))
                }
              />
            </InputContainer>
            <InputContainer>
              {regionName !== 'Carregando' ?
                <>
                  <MultiSelect
                    title="Regras de Bloqueio"
                    placeholder="Selecione..."
                    customWidth="44rem"
                    disabled={!supplier.id}
                    // @ts-ignore
                    // data={[{ id: 'new', value: 'new', label: 'Novo Modelo' }, ...regionsOptions]}
                    data={regionsOptions}
                    customBgColor="#FF6F6F"
                    // @ts-ignore
                    setValue={(value) => handleBlockingRule(value)}
                    style={{
                      marginTop: 0
                    }}
                    // data={countryStates}
                    defaultValue={
                      !!supplier &&
                      !!supplier.blocking_rules &&
                      supplier.blocking_rules.map((s: IBaseType) => ({ id: s.id, value: s.name, label: s.name }))
                    }
                  />
                  <TableActionButton
                    onClick={() => setIsRegionModalOpen(true)}
                    style={{
                      marginTop: '1.25rem',
                      marginLeft: '0.5rem'
                    }}
                  >
                    <EditIcon />  
                  </TableActionButton> 
                </>
                :
                 <></>
                }
            </InputContainer>
            <StatesWithIcmsOff data={stateDiscountsData} />
            {!!fractionalBox &&
              <FractionalBox data={fractionations} />
            }
            <DiscountsPerProfile data={profileDiscountsData} />
            <DiscountsPerProductsAndCategories data={profileCategoriesDiscountsData} />
            <PromotionsByProducts data={promotionsByProductsData} />
            <PromotionsByCategories data={promotionsByCategoryData} />
            <InstallmentsRules data={installmentsRules} setDisabled={setDisabled} />
            <PaymentPromotion data={paymentPromotionsData} />
        </Container>
        </Form>
      </MenuAndTableContainer>
      <Modal
        title="Regra de Bloqueio"
        isModalOpen={isRegionModalOpen}
        setIsModalOpen={setIsRegionModalOpen}
        customOnClose={() => {}}
        style={{ width: 471 }}
      >
        <InputContainer style={{ alignItems: 'flex-end' }}>
          <Input
            name="Regra de Bloqueio"
            fullW
            value={regionName}
            onChange={(e) => setRegionName(e.target.value)}
          />
          <TableActionButton
            onClick={handleNewRegion}
            style={{
              marginLeft: '1rem'
            }}
          >
            <PlusIcon />
          </TableActionButton>
        </InputContainer>
        <DeleteItemsContainer>
          {regionsOptions.map((t: DefaultValuePropsWithId) => 
            // t.value !== 'new' &&
            <div key={t.id}>
              <Input
                name=""
                noTitle
                width="100%"
                fullW
                // @ts-ignore
                defaultValue={t.value}
                onBlur={({ target: { value } }) => // @ts-ignore
                  value !== t.value && handleBlockingRules(value, t.id)
                }
                noValueInput
                validated
              />
              <TableActionButton
                onClick={() => handleDeleteBlockingRule(t.id)}
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
