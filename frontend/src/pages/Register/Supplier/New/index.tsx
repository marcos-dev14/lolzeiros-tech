import { Form } from '@unform/web';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { ReactComponent as EmailIcon } from '~assets/email.svg';
import { ReactComponent as FacebookIcon } from '~assets/facebook-ico.svg';
import { ReactComponent as InstagramIcon } from '~assets/instagram-ico.svg';
import { ReactComponent as PlusIcon } from '~assets/plus.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg';
import { ReactComponent as TwitterIcon } from '~assets/twitter-ico.svg';
import { ReactComponent as YoutubeIcon } from '~assets/youtube-ico.svg';

import { DateBox } from '~components/DateBox';
import { FormInput } from '~components/FormInput';
import { FormSelect } from '~components/FormSelect';
import { Header } from '~components/Header';
import { Input } from '~components/Input';
import { Menu } from '~components/Menu';
import { RadioBox } from '~components/RadioBox';
import { Addresses } from './components/Addresses';
import { BankAccounts } from './components/BankAccounts';
import { Contacts } from './components/Contacts';
import {
  Button,
  Container,
  CustomSectionTitle,
  EmptyElement,
  PhotoContainer
} from './styles';

import { calculateAge, capitalizeContent, isMailValid } from '~utils/validation';

import { ConfirmationModal } from '@/src/components/ConfirmationModal';
import { ErrorModal } from '@/src/components/ErrorModal';
import { FormInputCustomMask } from '@/src/components/FormInputCustomMask';
import { Modal } from '@/src/components/Modal';
import { MultiSelect } from '@/src/components/MultiSelect';
import { SiteBox } from '@/src/components/SiteBox';
import { SocialBox } from '@/src/components/SocialBox';
import { SuccessModal } from '@/src/components/SuccessModal';
import { SupplierHeader } from '@/src/components/SupplierHeader';
import { useRegister } from '@/src/context/register';
import { fetchSupplierData } from '@/src/services/requests';
import { TableActionButton } from '@/src/styles/components/tables';
import { useQuery } from 'react-query';
import { api } from '~api';
import {
  DefaultValuePropsWithId,
  IBaseType,
  ITag
} from '~types/main';
import { DeleteItemsContainer } from '../../Clients/New/styles';
import { AddSupplierPhoto } from './components/AddPhoto';

export function NewSupplier() {
  const { supplier, setSupplier, updateSupplier } = useRegister();
  const [cleaning, setCleaning] = useState(false);


  const [companyName, setCompanyName] = useState(() =>
    !!supplier ?
      !!supplier.company_name ?
        capitalizeContent(supplier.company_name) : ''
    : ''
  );

  const [name, setName] = useState(() =>
    !!supplier ?
      !!supplier.name ?
        capitalizeContent(supplier.name) : ''
    : ''
  );

  const [stateRegistration, setStateRegistration] = useState(() =>
    !!supplier ?
      !!supplier.state_registration ?
        capitalizeContent(supplier.state_registration) : ''
    : ''
  );

  const documentStatus = useMemo(() =>
    !!supplier ? !!supplier.document_status ? supplier.document_status : '' : ''
  , []);

  const [shippingOptionName, setShippingOptionName] = useState('');
  const [isShippingOptionsModalOpen, setIsShippingOptionsModalOpen] = useState(false);
  const [leadTimesName, setLeadTimesName] = useState('');
  const [isLeadTimesModalOpen, setIsLeadTimesModalOpen] = useState(false);
  const [taxRegimeName, setTaxRegimeName] = useState('');
  const [isTaxRegimeModalOpen, setIsTaxRegimeModalOpen] = useState(false);

  const [currentDeletingAttribute, setCurrentDeletingAttribute] = useState('');

  // const formRef = useRef<FormHandles>(null);
  // @ts-ignore
  const [formRef, setFormRef] = useState(null);

  const noSupplier = useMemo(() =>
    !supplier || (!!supplier && !supplier.id)
  , [supplier])

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [age, setAge] = useState(() =>
    !!supplier ? calculateAge(new Date(supplier.activity_start)) : 0
  );

  const [editingNumber, setEditingNumber] = useState(-1);
  const [phone, setPhone] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const [leadTimes, setLeadTimes] = useState([]);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [taxRegimesOptions, setTaxRegimesOptions] = useState([]);
  const [blogPostsOptions, setBlogPostsOptions] = useState([]);

  const commercialStatusOptions = useMemo(() => [
    { id: 1, value: 'Ativo', label: 'Ativo' },
    { id: 2, value: 'Inativo', label: 'Inativo' },
    { id: 3, value: 'Bloqueado', label: 'Bloqueado' },
    { id: 4, value: 'Prospecção', label: 'Prospecção' },
  ], []);

  const [commissionRulesOptions, setCommissionRulesOptions] = useState([]);

  const [disabled, setDisabled] = useState(false);
  const [registering, setRegistering] = useState(false);

  const [suspendSales, setSuspendSales] = useState(() =>
    !!supplier ?
      'suspendSales' in supplier ? supplier.suspendSales! :
        !!supplier.suspend_sales ? 'Sim' : 'Não'
      : 'Não'
  );

  const [orderSchedule, setOrderSchedule] = useState(() =>
    !!supplier ?
      'orderSchedule' in supplier ? supplier.orderSchedule! :
        !!supplier.order_schedule ? 'Sim' : 'Não'
      : 'Não'
  );

  const [orderBalance, setOrderBalance] = useState(() =>
    !!supplier ?
      'orderBalance' in supplier ? supplier.orderBalance! :
        !!supplier.order_balance ? 'Sim' : 'Não'
      : 'Não'
  );

  const [enterPriceOnOrder, setEnterPriceOnOrder] = useState(() =>
    !!supplier ?
      'enterPriceOnOrder' in supplier ? supplier.enterPriceOnOrder! :
        !!supplier.enter_price_on_order ? 'Sim' : 'Não'
      : 'Não'
  );

  const [canMigrateService, setCanMigrateService] = useState(() =>
    !!supplier ?
      'canMigrateService' in supplier ? supplier.canMigrateService! :
        !!supplier.can_migrate_service ? 'Sim' : 'Não'
      : 'Não'
  );

  const [website, setWebsite] = useState(() =>
    !!supplier ?
      !!supplier.website ? supplier.website : ''
    : ''
  );

  const [blockedSuppliers, setBlockedSuppliers] = useState<ITag[]>([]);
  const [newsletterTags, setNewsletterTags] = useState<ITag[]>([]);

  const contacts = useMemo(() =>
    !!supplier ?
      !!supplier.contacts ? supplier.contacts : []
    : []
  , [supplier]);

  const addresses = useMemo(() =>
    !!supplier ?
      !!supplier.addresses ? supplier.addresses : []
    : []
  , [supplier]);

  const bankAccounts = useMemo(() =>
    !!supplier ?
      !!supplier.bank_accounts ? supplier.bank_accounts : []
    : []
  , [supplier]);

  const hasEcommerceRef = useRef(null);
  const yearsRef = useRef(null);

  const phoneData = useMemo(() =>
    !!supplier ?
      !!supplier.phones ? supplier.phones.filter(p => p.type === 'phone') : []
    : []
  , [supplier]);

  const cellphoneData = useMemo(() =>
    !!supplier ?
      !!supplier.phones ? supplier.phones.filter(p => p.type === 'cellphone') : []
    : []
  , [supplier]);

  const whatsappData = useMemo(() =>
    !!supplier ?
      !!supplier.phones ? supplier.phones.filter(p => p.type === 'whatsapp') : []
    : []
  , [supplier]);

  const { data: supplierData, isLoading } = useQuery('supplierData', fetchSupplierData, {
    staleTime: 1000 * 60 * 5,
  });

  // const fetchData = useCallback(async () => {
  //   try {
  //     const {
  //       shippingOptions,
  //       leadTimesOptions,
  //       taxRegimesOptions,
  //       commissionRulesOptions,
  //       blogPostsOptions
  //     } = await fetchSupplierData()

  //     // @ts-ignore
  //     setShippingOptions(shippingOptions)

  //     // @ts-ignore
  //     setLeadTimes(leadTimesOptions)

  //     // @ts-ignore
  //     setTaxRegimesOptions(taxRegimesOptions)

  //     // @ts-ignore
  //     setCommissionRulesOptions(commissionRulesOptions)

  //     // @ts-ignore
  //     setBlogPostsOptions(blogPostsOptions);
  //   } catch (e) {
  //     console.log('e', e);

  //   } finally {
      // setLoading(false);
  //   }
  // }, []);

  const handleSubmit = useCallback(async () => {
    try {
      setRegistering(true);
      // @ts-ignore
      const data = formRef.getData();

      let tax_regime_id = '';
      let status = '';
      let lead_time_id = '';
      let shipping_type_id = '';
      let commercial_status = '';
      let blog_post_id = '';

      if (!!data.tax_regime) {
        // @ts-ignore
        const { id } = taxRegimesOptions.find(e => e.value === data.tax_regime);
        tax_regime_id = id;
      }

      if (!!data.status) {
        // @ts-ignore
        const { value } = commercialStatusOptions.find(e => e.value === data.status);
        status = value;
      }

      if (!!data.lead_time) {
        // @ts-ignore
        const { id } = leadTimes.find(e => e.value === data.lead_time);
        lead_time_id = id;
      }

      if (!!data.shipping_type_name) {
        // @ts-ignore
        const { id } = shippingOptions.find(e => e.value === data.shipping_type_name);
        shipping_type_id = id;
      }

      if (!!data.commercial_status) {
        // @ts-ignore
        const { value } = commercialStatusOptions.find(e => e.value === data.commercial_status);
        commercial_status = value;
      }

      // @ts-ignore
      if (!!data.blog_post_id) {
        // @ts-ignore
        const { id } = blogPostsOptions.find(e => e.value === data.blog_post_id);
        blog_post_id = id;
      }

      if(!isMailValid(data.corporate_email)) {
        setError('Preencha um email válido.');
        return;
      }

      const { activity_start, auge_register } = data;

      const newsletter_tags =
        !!newsletterTags ?
          newsletterTags.reduce((init, value) => `${init},${value.value}`, '').replace(',','')
          : [];

      const allows_reservation =
        !!supplier.allowReservation ?
          supplier.allowReservation === 'Sim' ? 1 : 0
        : 0;

      const fractional_box =
        !!supplier.fractionalBox ? supplier.fractionalBox : 0;

      const formattedData = {
        ...supplier,
        ...data,
        allows_reservation,
        fractional_box,
        website,
        tax_regime_id,
        status,
        lead_time_id,
        shipping_type_id,
        blog_post_id,
        commercial_status,
        company_name: companyName,
        name,
        state_registration: stateRegistration,
        document_status: documentStatus,
        suspend_sales: suspendSales === 'Sim',
        order_schedule: orderSchedule === 'Sim',
        order_balance: orderBalance === 'Sim',
        enter_price_on_order: enterPriceOnOrder === 'Sim',
        can_migrate_service: canMigrateService === 'Sim',
        auge_register:
          typeof auge_register === 'string' ? auge_register :
            // @ts-ignore
            auge_register.toISOString(),
        activity_start:
          typeof activity_start === 'string' ? activity_start :
            // @ts-ignore
            activity_start.toISOString(),
        newsletter_tags
      }

      // if (typeof 2 === 'number') return;

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

      if (!noSupplier)
        await api.post(`/products/suppliers/${supplier.id}?_method=PUT`, formattedData);
      else {
        const {
          data: { data }
        } = await api.post('/products/suppliers', formattedData);

        // @ts-ignore
        // delete data.shipping_type
        // setSupplier(data as unknown as MainSupplier);
        // @ts-ignore
        setSupplier({...data, shipping_type_name: data.shipping_type.name });
      }

      setMessage('Salvo com sucesso');
      setCleaning(true);

      // se for novo, salvar o supplier para permitir edição
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar a representada.';

      setError(errorMessage);
    } finally {
      setRegistering(false);
      setCleaning(false);
    }
  }, [
      companyName,
      name,
      stateRegistration,
      documentStatus,
      formRef,
      noSupplier,
      supplier,
      setSupplier,
      newsletterTags,
      website,
      suspendSales,
      orderSchedule,
      orderBalance,
      enterPriceOnOrder,
      canMigrateService,
      commercialStatusOptions,
      taxRegimesOptions,
      leadTimes,
      shippingOptions,
      blogPostsOptions
    ]);

  useEffect(() => {
    if(!isLoading && !!supplierData) {
      // @ts-ignore
      setShippingOptions(supplierData.shippingOptions)

      // @ts-ignore
      setLeadTimes(supplierData.leadTimesOptions)

      // @ts-ignore
      setTaxRegimesOptions(supplierData.taxRegimesOptions)

      // @ts-ignore
      setCommissionRulesOptions(supplierData.commissionRulesOptions)

      // @ts-ignore
      setBlogPostsOptions(supplierData.blogPostsOptions);
    }
  }, [isLoading, supplierData]);

  const formattedData = useMemo(() => {
    // @ts-ignore
    if (!supplier) {
      return {
        activity_start: new Date().toISOString(),
        auge_register: new Date().toISOString(),
        company_name: '',
        name: '',
        document: '',
        document_status: '',
        state_registration: '',
        code: '',
        tax_regime: '',
        status: '',
        corporate_email: '',
        instagram: '',
        facebook: '',
        youtube: '',
        twitter: '',
        lead_time: '',
        shipping_type_name: '',
        commercial_status: '',
        auto_observation_order: '',
      };
    }

    const {
      tax_regime,
      status,
      commercial_status, // @ts-ignore
      shipping_type_name,
      lead_time, // @ts-ignore
      blog_post_id, // @ts-ignore
      blog_post
    } = supplier;

    setNewsletterTags([]);

    const currentTaxRegime =
      !!tax_regime ? typeof(tax_regime) === 'string' ? // @ts-ignore
        tax_regime : tax_regime.name
      : '';

    const currentLeadTime =
      !!lead_time ? typeof(lead_time) === 'string' ? // @ts-ignore
        lead_time : lead_time.name
      : '';

    // const currentShippingOption = shipping_type_name;
    const currentShippingOption =
      !!shipping_type_name ? typeof(shipping_type_name) === 'string' ? // @ts-ignore
        shipping_type_name : shipping_type_name.name
      : '';

    // @ts-ignore
    setTaxRegimeName(currentTaxRegime);
    // @ts-ignore
    setLeadTimesName(currentLeadTime);
    // @ts-ignore
    setShippingOptionName(currentShippingOption);

    const formattedData = {
      ...supplier,
      activity_start: !!supplier.activity_start ? supplier.activity_start : new Date().toISOString(),
      auge_register: !!supplier.auge_register ? supplier.auge_register : new Date().toISOString(),
      tax_regime: currentTaxRegime,
      status: !!status ? status : '',
      blog_post_id:
        !!blog_post_id ? blog_post_id :
        !!blog_post ? blog_post.title : null,
      commercial_status: !!commercial_status ? commercial_status : '',
      shipping_type_name: currentShippingOption,
      lead_time: currentLeadTime,
      company_name: !!supplier.company_name ? supplier.company_name : '',
      name: !!supplier.name ? supplier.name : '',
      document: !!supplier.document ? supplier.document : '',
      document_status: !!supplier.document_status ? supplier.document_status : '',
      state_registration: !!supplier.state_registration ? supplier.state_registration : '',
      code: !!supplier.code ? supplier.code : '',
      corporate_email: !!supplier.corporate_email ? supplier.corporate_email : '',
      instagram: !!supplier.instagram ? supplier.instagram : '',
      facebook: !!supplier.facebook ? supplier.facebook : '',
      youtube: !!supplier.youtube ? supplier.youtube : '',
      twitter: !!supplier.twitter ? supplier.twitter : '',
      auto_observation_order: !!supplier.auto_observation_order ? supplier.auto_observation_order : '',
    }

    return formattedData;
  }, [supplier]);

  const handleShouldUpdate = useCallback((fieldTitle: string, newValue: string) => {
    // @ts-ignore
    let data = formRef.getData();

    // @ts-ignore
    data[fieldTitle] = newValue;

    // @ts-ignore
    updateSupplier(data);
  }, [updateSupplier, formRef]);

  const handleUpdate = useCallback((fieldTitle: string, newValue: DefaultValuePropsWithId) => {
    // @ts-ignore
    let data = formRef.getData();

    // @ts-ignore
    data[fieldTitle] = newValue;

    // @ts-ignore
    updateSupplier(data);
  }, [updateSupplier, formRef]);

  const handleCommissionRules = useCallback(async (value: DefaultValuePropsWithId[]) => {
    try {
      if(noSupplier) return;

      const { commission_rules } = supplier;

      const formattedCommissionRules = value.map(e => ({ id: e.id, name: e.value }));

      if (!!commission_rules.length && !value.length) {
        // @ts-ignore
        let { id } = commission_rules[commission_rules.length-1];
        await api.delete(`/products/suppliers/${supplier.id}/commission_rules/${id}`);
        updateSupplier({ commission_rules: formattedCommissionRules });

        return;
      }

      if (commission_rules.length > value.length) {
        // @ts-ignore
        let { id } = commission_rules.find(e => !value.includes(e));
        await api.delete(`/products/suppliers/${supplier.id}/commission_rules/${id}`);
      }
      else {
        const valuesOnlyId = value.map(c => c.id);
        const commissionRulesOnlyId = commission_rules.map(c => c.id);

        // @ts-ignore
        const id = !commission_rules.length ? value[0].id : valuesOnlyId.filter((e) => !commissionRulesOnlyId.includes(e));
        await api.post(`/products/suppliers/${supplier.id}/commission_rules`, { attach_id: id });
      }

      updateSupplier({ commission_rules: formattedCommissionRules });
    } catch (e) {
      console.log('e', e);
    }
  }, [noSupplier, supplier, updateSupplier])

  const handleNewShippingOptionName = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.post('/suppliers/shipping_types', { name: shippingOptionName });
      // } = await api.post('/suppliers/shipping_companies', { name: shippingOptionName });

      const newShippingOption = {
        id: data.id,
        value: data.name,
        label: data.name,
      }

      // @ts-ignore
      setShippingOptions(prev => [...prev, newShippingOption])

      setShippingOptionName('Carregando');
      setShippingOptionName(data.name);
      // @ts-ignore
      handleUpdate('shipping_type', { id: data.id, name: data.name })
      // @ts-ignore
      handleUpdate('shipping_type_name', { id: data.id, name: data.name })

      setIsShippingOptionsModalOpen(false);
    } catch (e) {
      console.log('e', e);
    }
  }, [shippingOptionName, handleUpdate])

  const handleNewLeadTime = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.post('/suppliers/lead_times', { name: leadTimesName });

      const newLeadTime = {
        id: data.id,
        value: data.name,
        label: data.name,
      }

      // @ts-ignore
      setLeadTimes(prev => [...prev, newLeadTime])

      setLeadTimesName('Carregando');
      setLeadTimesName(data.name);
      // @ts-ignore
      handleUpdate('lead_time', { id: data.id, name: data.name })

      setIsLeadTimesModalOpen(false);
    } catch (e) {
      console.log('e', e);
    }
  }, [leadTimesName, handleUpdate])

  const handleNewTaxRegimeName = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.post('/tax_regimes', { name: taxRegimeName });

      const newTaxRegime = {
        id: data.id,
        value: data.name,
        label: data.name,
      }

      // @ts-ignore
      setTaxRegimesOptions(prev => [...prev, newTaxRegime])

      setTaxRegimeName('Carregando');
      setTaxRegimeName(data.name);
      // @ts-ignore
      handleUpdate('shipping_type', { id: data.id, name: data.name })
      // @ts-ignore
      handleUpdate('shipping_type_name', { id: data.id, name: data.name })

      setIsTaxRegimeModalOpen(false);
    } catch (e) {
      console.log('e', e);
    }
    }, [taxRegimeName, handleUpdate]);

  const handleDeleteTaxRegime = useCallback(async (id: number, value: string) => {
    try {
      await api.delete(`/tax_regimes/${id}`);

      // @ts-ignore
      setTaxRegimesOptions(prev => prev.filter(e => e.value !== value));
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  const handleDeleteLeadTimes = useCallback(async (id: number, value: string) => {
    try {
      await api.delete(`/suppliers/lead_times/${id}`);

      // @ts-ignore
      setLeadTimesOptions(prev => prev.filter(e => e.value !== value));
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  const handleDeleteShippingOption = useCallback(async (id: number, value: string) => {
    try {
      // await api.delete(`/suppliers/shipping_companies/${id}`);
      await api.delete(`/suppliers/shipping_types/${id}`);

      // @ts-ignore
      setShippingOptions(prev => prev.filter(e => e.value !== value));
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  const updateFormRef = useCallback(node => !!node && !formRef && setFormRef(node), [formRef]);

  return (
    <>
      <Header minimal route={['Cadastro', 'Representada', 'Editar Representada']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Form ref={updateFormRef} onSubmit={() => {}} initialData={formattedData}>
        <Container>
          <SupplierHeader
            ref={formRef}
            disabled={disabled}
            data={{
              suspendSales,
              orderSchedule,
              orderBalance,
              enterPriceOnOrder,
              canMigrateService,
              website,
              newsletterTags
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
                  marginLeft: '1rem'
                }}
              >
                {registering ? 'Aguarde...' : 'Salvar'}
              </Button>
            </div>
          </SupplierHeader>
          <CustomSectionTitle>
            Representada
          </CustomSectionTitle>
            <InputContainer style={{ position: 'relative' }}>
              <PhotoContainer>
                <AddSupplierPhoto
                  supplier={{...supplier, image: !!supplier ? !!supplier.image ? supplier.image : { JPG: '', WEBP: '' } : { JPG: '', WEBP: '' }}}
                  remove={() => {}}
                />
              </PhotoContainer>
              <EmptyElement style={{}} />

              <Input
                name="Razão Social"
                width="19.8125rem"
                validated={false}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onBlur={(e) => {
                  const company_name = capitalizeContent(e.target.value);
                  setCompanyName(company_name);
                  if(!noSupplier) updateSupplier({...supplier, company_name })
                }}
              />
              <Input
                name="Nome Fantasia"
                width="18.0625rem"
                validated={false}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={(e) => {
                  const name = capitalizeContent(e.target.value);
                  setName(name);
                  if(!noSupplier) updateSupplier({...supplier, name })
                }}
              />
              <FormInputCustomMask
                name="document"
                title="CNPJ"
                width="9.375rem"
                mask="99.999.999/0001-99"
                onBlur={(e) => handleShouldUpdate('document', e.target.value)}
              />
              <Input
                name="Status do CNPJ"
                width="6.25rem"
                validated={false}
                value={documentStatus}
                disabled
              />
              <Input
                name="Inscrição Estadual"
                width="9.375rem"
                validated={false}
                value={stateRegistration}
                onChange={(e) => setStateRegistration(e.target.value)}
                onBlur={(e) => {
                  const state_registration = capitalizeContent(e.target.value);
                  setStateRegistration(state_registration);
                  if(!noSupplier) updateSupplier({...supplier, state_registration })
                }}
              />
            </InputContainer>
            <InputContainer>
              <EmptyElement />
              <FormInput
                name="code"
                title="Código Automático"
                width="9.375rem"
                validated={false}
                disabled
              />
              <DateBox
                name="activity_start"
                title="Início de Atividade"
                width="6.75rem"
                validated={false}
                hasHour={false}
                noMinDate
                // aplicar handleUpdate
                onDateSelect={(value) => setAge(calculateAge(!!value ? value : new Date()))}
                // @ts-ignore
                focusOnNextElement={() => yearsRef?.current?.focus()}
              />
              <input ref={yearsRef} style={{ width: 0, marginLeft: -10, opacity: 0 }}/>
              <Input
                name="Anos"
                width="3.125rem"
                validated={false}
                value={age}
                disabled
              />
              {!cleaning && taxRegimeName !== 'Carregando' ?
                <FormSelect
                  name="tax_regime"
                  title="Regime Fiscal"
                  placeholder="Selecione..."
                  customWidth="12.5rem"
                  disabled={isLoading}
                  data={taxRegimesOptions}
                  onChange={ // @ts-ignore
                    (value, id) => value === 'new' ?
                    setIsTaxRegimeModalOpen(true) : // @ts-ignore
                    handleUpdate('tax_regime', { id, name: value })
                  }
                  customValue={{
                    // @ts-ignore
                    value: taxRegimeName ?? supplier.tax_regime,
                    // @ts-ignore
                    label:  taxRegimeName
                  }}

                /> :
                <></>
              }
              <FormSelect
                name="status"
                title="Status da Representada"
                placeholder="Selecione..."
                customWidth="12.5rem"
                disabled={isLoading}
                data={commercialStatusOptions}
                onChange={ // @ts-ignore
                  (value) => handleShouldUpdate('status', value)
                }
                // ref={originRef}

                customValue={{
                  // @ts-ignore
                  value: supplier?.status,
                  // @ts-ignore
                  label:  supplier?.status
                }}
              />
              <DateBox
                name="auge_register"
                title="Cadastro na Auge"
                width="6.75rem"
                validated={false}
                hasHour={false}
                noMinDate
                // aplicar handleUpdate
                // @ts-ignore
                focusOnNextElement={() => hasEcommerceRef?.current?.focus()}
              />
              <input ref={hasEcommerceRef} style={{ width: 0, marginLeft: -10, opacity: 0 }}/>
            </InputContainer>
            <CustomSectionTitle>
              Contato Corporativo
            </CustomSectionTitle>
            <InputContainer
              style={{
                alignItems: 'flex-end'
              }}
            >
              <SocialBox
                name="corporate_email"
                title="Email Corporativo"
                type="social"
                badge={EmailIcon}
                width="15rem"
                // @ts-ignore
                onBlur={(e) => handleShouldUpdate('corporate_email', e.target.value.toLowerCase())}
                inputStyle={{ textTransform: 'lowercase' }}
              />
              <SiteBox
                name="Site"
                // validated={false}
                // @ts-ignore
                value={website}
                defaultValue={website}
                // @ts-ignore
                onChange={(e) => setWebsite(e.target.value)}
              />
            </InputContainer>
            <InputContainer>
              <SocialBox
                name="instagram"
                title="Instagram"
                type="social"
                badge={InstagramIcon}
                width="17.5rem"
                // @ts-ignore
                onBlur={(e) => handleShouldUpdate('instagram', e.target.value)}
              />
              <SocialBox
                name="facebook"
                title="Facebook"
                type="social"
                badge={FacebookIcon}
                width="17.5rem"
                // @ts-ignore
                onBlur={(e) => handleShouldUpdate('facebook', e.target.value)}
              />
              <SocialBox
                name="youtube"
                title="YouTube"
                type="social"
                badge={YoutubeIcon}
                width="17.5rem"
                // @ts-ignore
                onBlur={(e) => handleShouldUpdate('youtube', e.target.value)}
              />
              <SocialBox
                name="twitter"
                title="Twitter"
                type="social"
                badge={TwitterIcon}
                width="17.5rem"
                // @ts-ignore
                onBlur={(e) => handleShouldUpdate('twitter', e.target.value)}
              />
            </InputContainer>
            <CustomSectionTitle>
              Política Comercial
            </CustomSectionTitle>
            <InputContainer>
              {!cleaning && leadTimesName !== 'Carregando' ?
                <FormSelect
                  name="lead_time"
                  title="Lead Time"
                  placeholder="Selecione..."
                  customWidth="16.1875rem"
                  data={leadTimes}
                  disabled={isLoading}
                  onChange={ // @ts-ignore
                    (value, id) => value === 'new' ?
                    setIsLeadTimesModalOpen(true) : // @ts-ignore
                    handleUpdate('lead_time', { id, name: value })
                  }
                  customValue={{
                    value: leadTimesName ?? supplier.lead_time.name,
                    label: leadTimesName ?? supplier.lead_time.name
                  }}
                /> :
                <></>
              }
              {!cleaning && shippingOptionName !== 'Carregando' ?
                <FormSelect
                  name="shipping_type_name"
                  title="Modalidade de Frete"
                  placeholder="Selecione..."
                  customWidth="12.5rem"
                  data={shippingOptions}
                  disabled={isLoading}
                  onChange={ // @ts-ignore
                    (value, id) => value === 'new' ?
                    setIsShippingOptionsModalOpen(true) : // @ts-ignore
                    handleUpdate('shipping_type_name', { id, name: value })
                  }
                  customValue={{
                    value: shippingOptionName,
                    label: shippingOptionName
                  }}
                /> :
                <></>
              }
              <RadioBox
                title="Suspender as Vendas"
                value={suspendSales}
                setValue={setSuspendSales}
              />
              <MultiSelect
                title="Pagamento das comissões para a Auge"
                placeholder="Selecione..."
                customWidth="100%"
                disabled={noSupplier}
                data={commissionRulesOptions}
                // @ts-ignore
                setValue={(value) => handleCommissionRules(value)}
                // data={countryStates}
                defaultValue={
                  !!supplier &&
                  !!supplier.commission_rules &&
                  supplier.commission_rules.map((s: IBaseType) => ({ id: s.id, value: s.name, label: s.name }))
                }
              />
            </InputContainer>
            <CustomSectionTitle>
              Perfil Comercial
            </CustomSectionTitle>
            <InputContainer style={{ alignItems: 'flex-start' }}>
              <RadioBox
                title="Saldo de Pedido"
                value={orderBalance}
                setValue={setOrderBalance}
              />
              <FormInput
                name="auto_observation_order"
                title="Observação Automática do Pedido"
                fullW
                width="100%"
                validated={false}
                // @ts-ignore
                onBlur={(e) => handleShouldUpdate('auto_observation_order', e.target.value)}
              />
            </InputContainer>
            <CustomSectionTitle>
              Post da Representada
            </CustomSectionTitle>
            <InputContainer style={{ alignItems: 'flex-start' }}>
              <FormSelect
                name="blog_post_id"
                title="Post da Representada"
                placeholder="Selecione..."
                customWidth="12.5rem"
                data={blogPostsOptions}
                disabled={isLoading}
                onChange={ // @ts-ignore
                  (value) => // @ts-ignore
                  handleUpdate('blog_post_id', value)
                }
              />
            </InputContainer>
            <Contacts contacts={contacts} />
            <Addresses addresses={addresses} />
            <BankAccounts bankAccounts={bankAccounts} />
            {/* <InputContainer>
              <Button
                onClick={handleSubmit}
                disabled={registering}
                type="button"
              >
                {registering ? 'Aguarde...' : !noSupplier ? 'Atualizar' : 'Salvar'}
              </Button>
            </InputContainer> */}
        </Container>
        </Form>
      </MenuAndTableContainer>
      <Modal
        title="Modalidade de Frete"
        isModalOpen={isShippingOptionsModalOpen}
        setIsModalOpen={setIsShippingOptionsModalOpen}
        customOnClose={() => {}}
        style={{ width: 471 }}
      >
        <InputContainer style={{ alignItems: 'flex-end' }}>
          <Input
            name="Modalidade de Frete"
            fullW
            value={shippingOptionName}
            onChange={(e) => setShippingOptionName(e.target.value)}
          />
          <TableActionButton
            onClick={handleNewShippingOptionName}
            style={{
              marginLeft: '1rem'
            }}
          >
            <PlusIcon />
          </TableActionButton>
        </InputContainer>
        <DeleteItemsContainer>
          {shippingOptions.map((t: DefaultValuePropsWithId) =>
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
                onClick={() => handleDeleteShippingOption(t.id, t.value)}
                style={{ marginLeft: '1rem' }}
              >
                <TrashIcon />
              </TableActionButton>
            </div>
          )}
        </DeleteItemsContainer>
      </Modal>
      <Modal
        title="Lead Time"
        isModalOpen={isLeadTimesModalOpen}
        setIsModalOpen={setIsLeadTimesModalOpen}
        customOnClose={() => {}}
        style={{ width: 471 }}
      >
        <InputContainer style={{ alignItems: 'flex-end' }}>
          <Input
            name="Lead Time"
            fullW
            value={leadTimesName}
            onChange={(e) => setLeadTimesName(e.target.value)}
          />
          <TableActionButton
            onClick={handleNewLeadTime}
            style={{
              marginLeft: '1rem'
            }}
          >
            <PlusIcon />
          </TableActionButton>
        </InputContainer>
        <DeleteItemsContainer>
          {leadTimes.map((t: DefaultValuePropsWithId) =>
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
                onClick={() => handleDeleteLeadTimes(t.id, t.value)}
                style={{ marginLeft: '1rem' }}
              >
                <TrashIcon />
              </TableActionButton>
            </div>
          )}
        </DeleteItemsContainer>
      </Modal>
      <Modal
        title="Regime Fiscal"
        isModalOpen={isTaxRegimeModalOpen}
        setIsModalOpen={setIsTaxRegimeModalOpen}
        customOnClose={() => {}}
        style={{ width: 471 }}
      >
        <InputContainer style={{ alignItems: 'flex-end' }}>
          <Input
            name="Regime Fiscal"
            fullW
            value={taxRegimeName}
            onChange={(e) => setTaxRegimeName(e.target.value)}
          />
          <TableActionButton
            onClick={handleNewTaxRegimeName}
            style={{
              marginLeft: '1rem'
            }}
          >
            <PlusIcon />
          </TableActionButton>
        </InputContainer>
        <DeleteItemsContainer>
          {taxRegimesOptions.map((t: DefaultValuePropsWithId) =>
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
                onClick={() => handleDeleteTaxRegime(t.id, t.value)}
                style={{ marginLeft: '1rem' }}
              >
                <TrashIcon />
              </TableActionButton>
            </div>
          )}
        </DeleteItemsContainer>
      </Modal>
      <ConfirmationModal
        category={currentDeletingAttribute}
        action={() => {}}
        style={{ marginTop: 0 }}
        setIsModalOpen={() =>
          setCurrentDeletingAttribute('')
        }
      />
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
