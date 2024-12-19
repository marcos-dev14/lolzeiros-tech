import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Form } from '@unform/web';

import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { ReactComponent as EmailIcon } from '~assets/email.svg';
import { ReactComponent as PlusIcon } from '~assets/plus.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg'

import { ReactComponent as InstagramIcon } from '~assets/instagram-ico.svg';
import { ReactComponent as FacebookIcon } from '~assets/facebook-ico.svg';
import { ReactComponent as YoutubeIcon } from '~assets/youtube-ico.svg';
import { ReactComponent as TwitterIcon } from '~assets/twitter-ico.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import {
  Button,
  Container,
  CustomSectionTitle,
  DeleteItemsContainer,
} from './styles';
import { FormInput } from '~components/FormInput';
import { Input } from '~components/Input';
import { Modal } from '~components/Modal';
import { TagInput } from '~components/TagInput';
import { FormSelect } from '~components/FormSelect';
import { RadioBox } from '~components/RadioBox';
import { DateBox } from '~components/DateBox';

import { calculateAge, capitalizeContent, cnpjValidation, isNotEmpty } from '~utils/validation';

import { api } from '~api';
import {
  DefaultValuePropsWithId,
  IBaseType,
  ITag,
  MainClient,
} from '~types/main';
import { SocialBox } from '@/src/components/SocialBox';
import { SiteBox } from '@/src/components/SiteBox';
import { MultiSelect } from '@/src/components/MultiSelect';
import { ClientHeader } from '@/src/components/ClientHeader';
import { ErrorModal } from '@/src/components/ErrorModal';
import { SuccessModal } from '@/src/components/SuccessModal';
import { useRegister } from '@/src/context/register';
import { FormInputCustomMask } from '@/src/components/FormInputCustomMask';
import { TableActionButton } from '@/src/styles/components/tables';
import { NoTitleSelect } from '@/src/components/NoTitleSelect';
import { StaticSocialBox } from '@/src/components/StaticSocialBox';
import { PhoneBox } from '@/src/components/PhoneBox';
import { ConfirmationModal } from '@/src/components/ConfirmationModal';
import { Contacts } from './components/Contacts';
import { Addresses } from './components/Addresses';
import { BankAccounts } from './components/BankAccounts';
import { AlertModal } from '@/src/components/AlertModal';
import { FormTextArea } from '@/src/components/FormTextArea';
import { FormPhoneBox } from '@/src/components/FormPhoneBox';

export function NewClient() {
  const { client, setClient, updateClient } = useRegister();

  const [loading, setLoading] = useState(true);

  const [companyName, setCompanyName] = useState(() =>
    !!client ?
      !!client.company_name ?
        capitalizeContent(client.company_name) : ''
      : ''
  );

  const [name, setName] = useState(() =>
    !!client ?
      !!client.name ?
        capitalizeContent(client.name) : ''
      : ''
  );

  const [stateRegistration, setStateRegistration] = useState(() =>
    !!client ?
      !!client.state_registration ?
        capitalizeContent(client.state_registration) : ''
      : ''
  );

  const [clientGroupName, setClientGroupName] = useState('');
  const [isGroupClientModalOpen, setIsGroupClientModalOpen] = useState(false);
  const [pdvName, setPdvName] = useState('');
  const [isPdvModalOpen, setIsPdvModalOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [originName, setOriginName] = useState('');
  const [isOriginModalOpen, setIsOriginModalOpen] = useState(false);
  const [taxRegimeName, setTaxRegimeName] = useState('');
  const [isTaxRegimeNameModalOpen, setIsTaxRegimeNameModalOpen] = useState(false);

  const [currentDeletingAttribute, setCurrentDeletingAttribute] = useState('');
  const [isUpdatingBlockedSupplier, setIsUpdatingBlockedSupplier] = useState(false);

  const [shouldUpdateUser, setShouldUpdateUser] = useState('');
  const [newClientProfile, setNewClientProfile] = useState('');

  const noClient = useMemo(() =>
    !client || (!!client && !client.id)
    , [client])

  // const formRef = useRef<FormHandles>(null);

  // @ts-ignore
  const [formRef, setFormRef] = useState(null);
  const updateFormRef = useCallback(node => !!node && !formRef && setFormRef(node), [formRef]);
  // @ts-ignore


  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [age, setAge] = useState(() =>
    !!client ? calculateAge(new Date(client.activity_start)) : 0
  );

  const [profilesOptions, setProfilesOptions] = useState([]);
  const [groupsOptions, setGroupsOptions] = useState([]);
  const [pdvsOptions, setPdvsOptions] = useState([]);
  const [blockingRulesOptions, setBlockingRulesOptions] = useState([]);
  const [originOptions, setOriginOptions] = useState([]);
  const [sellerOptions, setSellerOptions] = useState([]);
  const [taxRegimesOptions, setTaxRegimesOptions] = useState([]);
  const [suppliersOptions, setSuppliersOptions] = useState([]);
  const commercialStatusOptions = useMemo(() => [
    { id: 1, value: 'Ativo', label: 'Ativo' },
    { id: 2, value: 'Inativo', label: 'Inativo' },
    { id: 3, value: 'Bloqueado', label: 'Bloqueado' },
    { id: 4, value: 'Prospecção', label: 'Prospecção' },
  ], []);

  const statusOptions = useMemo(() => [
    { id: 1, value: 'Ativo', label: 'Ativo' },
    { id: 2, value: 'Inativo', label: 'Inativo' },
  ], []);


  const [disabled, setDisabled] = useState(false);
  const [registering, setRegistering] = useState(false);

  const [hasEcommerce, setHasEcommerce] = useState(() =>
    !!client ?
      'hasEcommerce' in client ? client.hasEcommerce! :
        !!client.has_ecommerce ? 'Sim' : 'Não'
      : 'Não'
  );

  const [orderSchedule, setOrderSchedule] = useState(() =>
    !!client ?
      'orderSchedule' in client ? client.orderSchedule! :
        !!client.order_schedule ? 'Sim' : 'Não'
      : 'Não'
  );

  const [orderBalance, setOrderBalance] = useState(() =>
    !!client ?
      'orderBalance' in client ? client.orderBalance! :
        !!client.order_balance ? 'Sim' : 'Não'
      : 'Não'
  );

  const [enterPriceOnOrder, setEnterPriceOnOrder] = useState(() =>
    !!client ?
      'enterPriceOnOrder' in client ? client.enterPriceOnOrder! :
        !!client.enter_price_on_order ? 'Sim' : 'Não'
      : 'Não'
  );

  const [canMigrateService, setCanMigrateService] = useState(() =>
    !!client ?
      'canMigrateService' in client ? client.canMigrateService! :
        !!client.can_migrate_service ? 'Sim' : 'Não'
      : 'Não'
  );

  const [website, setWebsite] = useState(() =>
    !!client ?
      !!client.website ? client.website : ''
      : ''
  );

  const [newsletterTags, setNewsletterTags] = useState<ITag[]>(() =>
    !!client ?
      !!client.newsletter_tags ?
        client.newsletter_tags.split(',').map(s => ({ id: s, value: s }))
        : []
      : []);

  const contacts = useMemo(() =>
    !!client ?
      !!client.contacts ? client.contacts : []
      : []
    , [client]);

  const addresses = useMemo(() =>
    !!client ?
      !!client.addresses ? client.addresses : []
      : []
    , [client]);

  const bankAccounts = useMemo(() =>
    !!client ?
      !!client.bank_accounts ? client.bank_accounts : []
      : []
    , [client]);

  const hasEcommerceRef = useRef(null);
  const yearsRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [
        profilesResponse,
        groupsResponse,
        pdvsResponse,
        blockingRulesResponse,
        originsResponse,
        sellerResponse,
        taxRegimesResponse,
        suppliersResponse
      ] = await Promise.all([
        api.get('/clients/profiles'),
        api.get('/clients/groups'),
        api.get('/clients/pdvs'),
        api.get('/blocking_rules'),
        api.get('/clients/origins'),
        api.get('/sellers'),
        api.get('/tax_regimes'),
        api.get('/products/suppliers'),
      ])

      const {
        data: { data: profiles }
      } = profilesResponse;

      const {
        data: { data: groups }
      } = groupsResponse;

      const {
        data: { data: pdvs }
      } = pdvsResponse;

      const {
        data: { data: blockingRules }
      } = blockingRulesResponse;

      const {
        data: { data: origins }
      } = originsResponse;

      const {
        data: { data: sellers }
      } = sellerResponse;

      const {
        data: { data: taxRegimes }
      } = taxRegimesResponse;

      const {
        data: { data: suppliersData }
      } = suppliersResponse;

      // @ts-ignore
      setProfilesOptions([{ value: '', label: 'Selecione...' }, { value: 'new', label: 'Novo Modelo' }, ...profiles.map((a: string) => ({ id: a.id, value: a.name, label: a.name }))])

      // @ts-ignore
      setGroupsOptions([{ value: '', label: 'Selecione...' }, { value: 'new', label: 'Novo Modelo' }, ...groups.map((a: string) => ({ id: a.id, value: a.name, label: a.name }))])

      // @ts-ignore
      setPdvsOptions([{ value: '', label: 'Selecione...' }, { value: 'new', label: 'Novo Modelo' }, ...pdvs.map((a: string) => ({ id: a.id, value: a.name, label: a.name }))])

      // @ts-ignore
      setBlockingRulesOptions(blockingRules.map((a: string) => ({ id: a.id, value: a.name, label: a.name })))

      // @ts-ignore
      setOriginOptions([{ value: 'new', label: 'Novo Modelo' }, ...origins.map((a: string) => ({ id: a.id, value: a.name, label: a.name }))])

      // @ts-ignore
      setSellerOptions([{ value: '', label: 'Selecione...' }, ...sellers.map((a: string) => ({ id: a.id, value: a.name, label: a.name }))])

      // @ts-ignore
      setTaxRegimesOptions([{ value: 'new', label: 'Novo Modelo' }, ...taxRegimes.map((a: string) => ({ id: a.id, value: a.name, label: a.name }))])

      // @ts-ignore
      setSuppliersOptions(suppliersData.map((a: string) => ({ id: a.id, value: a.name, label: a.name })))
    } catch (e) {
      console.log('e', e);

    } finally {
      setLoading(false);
    }
  }, []);

  const handleBlockedSupplier = useCallback(async (value: DefaultValuePropsWithId[]) => {
    try {
      console.log('a')
      if (noClient) return;
      setIsUpdatingBlockedSupplier(true);

      const { blocked_suppliers } = client;
      const formattedBlockedSuppliers = value.map(e => ({ id: e.id, name: e.value }));

      if (!!blocked_suppliers.length && !value.length) {
        // @ts-ignore
        let { id } = blocked_suppliers[blocked_suppliers.length - 1];
        await api.delete(`/clients/${client.id}/blocked_suppliers/${id}`);
        updateClient({ blocked_suppliers: formattedBlockedSuppliers });

        return;
      }

      const valuesOnlyId = value.map(c => c.id);
      const blockedSuppliersOnlyId = blocked_suppliers.map(c => c.id);

      if (blocked_suppliers.length > value.length) {
        // @ts-ignore
        let [id] = blockedSuppliersOnlyId.filter(e => !valuesOnlyId.includes(e));
        await api.delete(`/clients/${client.id}/blocked_suppliers/${id}`);
      }
      else {
        const id = !blocked_suppliers.length ? value[0].id : valuesOnlyId.filter((e) => !blockedSuppliersOnlyId.includes(e));
        await api.post(`/clients/${client.id}/blocked_suppliers`, { attach_supplier_id: id });
      }

      updateClient({ blocked_suppliers: formattedBlockedSuppliers });
    } catch (e) {
      console.log('e', e);
    } finally {
      setIsUpdatingBlockedSupplier(false);
    }
  }, [client, updateClient, noClient])

  // const handleBlockRule = useCallback(async (value: DefaultValuePropsWithId[]) => {
  //   try {
  //     if(!client) return;

  //     const { regions } = client;

  //     const formattedRegions = value.map(e => ({ id: e.id, name: e.value }));

  //     if (!!regions.length && !value.length) {
  //       // @ts-ignore
  //       let { id } = regions[regions.length -1];
  //       await api.delete(`/clients/${client.id}/regions/${id}`);
  //       updateClient({ regions: formattedRegions });

  //       return;
  //     }
  //     if (regions.length > value.length) {
  //       // @ts-ignore
  //       let { id } = regions.find(e => !value.includes(e));
  //       await api.delete(`/clients/${client.id}/regions/${id}`);
  //     }
  //     else {
  //       const valuesOnlyId = value.map(c => c.id);
  //       const regionsOnlyId = regions.map(c => c.id);
  //       // @ts-ignore
  //       const id = !regions.length ? value[0].id : valuesOnlyId.filter((e) => !regionsOnlyId.includes(e));
  //       await api.post(`/clients/${client.id}/regions`, { attach_id: id });
  //     }

  //     updateClient({ regions: formattedRegions });
  //   } catch (e) {
  //     console.log('e', e);
  //   }
  // }, [client, updateClient])

  const handleSubmit = useCallback(async () => {
    try {
      setRegistering(true);
      // @ts-ignore
      const data = formRef.getData();

      let client_profile_id = '';
      let client_group_id = '';
      let client_pdv_id = '';
      let client_origin_id = '';
      let seller_id = '';
      let blocking_rule_id = '';
      let tax_regime_id = '';
      // let status = '';
      let commercial_status = '';

      if (!cnpjValidation(data.document)) {
        setError('Preencha um CNPJ válido.');
        return;
      }

      if (!!data.tax_regime) {
        // @ts-ignore
        const { id } = taxRegimesOptions.find(e => e.value === data.tax_regime);
        tax_regime_id = id;
      }

      if (!!data.commercial_status) {
        // @ts-ignore
        const { value } = commercialStatusOptions.find(e => e.value === data.commercial_status);
        commercial_status = value;
      }

      if (!!data.profile) {
        // @ts-ignore
        const { id } = profilesOptions.find(e => e.value === data.profile);
        client_profile_id = id;
      }

      if (!!data.group) {
        // @ts-ignore
        const { id } = groupsOptions.find(e => e.value === data.group);
        client_group_id = id;
      }

      if (!!data.origin) {
        // @ts-ignore
        const { id } = originOptions.find(e => e.value === data.origin);
        client_origin_id = id;
      }

      if (!!data.pdv_type) {
        // @ts-ignore
        const { id } = pdvsOptions.find(e => e.value === data.pdv_type);
        client_pdv_id = id;
      }

      if (!!data.seller) {
        // @ts-ignore
        const { id } = sellerOptions.find(e => e.value === data.seller);
        seller_id = id;
      }

      if (!!data.blocking_rule) {
        // @ts-ignore
        const { id } = blockingRulesOptions.find(e => e.value === data.blocking_rule);
        blocking_rule_id = id;
      }

      const { activity_start, auge_register } = data;

      const newsletter_tags =
        !!newsletterTags ?
          newsletterTags.map((e) => e.id).join(',')
          : [];

      const formattedData = {
        ...data,
        website,
        tax_regime_id,
        client_profile_id,
        client_group_id,
        client_pdv_id,
        seller_id,
        blocking_rule_id,
        client_origin_id,
        status: commercial_status,
        company_name: companyName,
        name,
        state_registration: stateRegistration,
        commercial_status,
        has_ecommerce: hasEcommerce === 'Sim',
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

      // @ts-ignore
      delete formattedData.client_profile;
      // @ts-ignore
      delete formattedData.client_region;
      // @ts-ignore
      delete formattedData.client_pdv;
      // @ts-ignore
      delete formattedData.client_group;

      const clientWithoutNullValues = formattedData;
      // Object.fromEntries(Object.entries(formattedData).filter(e => !!e[1]));
      // Object.fromEntries(Object.entries(formattedData).filter(e => !!e[1]));

      if (!noClient)
        await api.put(`/clients/${client.id}`, clientWithoutNullValues);
      else {
        const {
          data: { data }
        } = await api.post('/clients', clientWithoutNullValues);

        setClient(data as unknown as MainClient);
      }

      setMessage('Salvo com sucesso');
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar o cliente.';

      setError(errorMessage);
    } finally {
      setRegistering(false);
    }
  }, [
    companyName,
    name,
    stateRegistration,
    noClient,
    formRef,
    client,
    setClient,
    newsletterTags,
    website,
    taxRegimesOptions,
    profilesOptions,
    originOptions,
    groupsOptions,
    pdvsOptions,
    sellerOptions,
    blockingRulesOptions,
    hasEcommerce,
    orderSchedule,
    orderBalance,
    enterPriceOnOrder,
    canMigrateService,
    commercialStatusOptions
  ]);

  useEffect(() => {
    fetchData();
  }, [])

  const formattedData = useMemo(() => {
    if (!client) {
      return {
        activity_start: '2022-06-03T01:05:45.000000Z',
        auge_register: '2022-06-03T01:05:45.000000Z',
      };
    }

    const {
      activity_start,
      // @ts-ignore
      auge_register,
      pdv_type,
      group,
      seller,
      // @ts-ignore
      blocking_rule,
      profile,
      region,
      tax_regime,
      status,
      commercial_status,
      // @ts-ignore
      origin,
      // @ts-ignore
      role,
      // @ts-ignore
      buyer
    } = client;

    // setHasEcommerce(!!has_ecommerce ? 'Sim' : 'Não');
    // setOrderSchedule(!!order_schedule ? 'Sim' : 'Não');
    // setOrderBalance(!!order_balance ? 'Sim' : 'Não');
    // setEnterPriceOnOrder(!!enter_price_on_order ? 'Sim' : 'Não');
    // setCanMigrateService(!!can_migrate_service ? 'Sim' : 'Não');
    // setWebsite(!!website ? 'Sim' : 'Não');

    // @ts-ignore

    const currentTaxRegimeName =
      !!tax_regime ? typeof (tax_regime) === 'string' ? // @ts-ignore
        tax_regime : tax_regime.name
        : '';

    // const currentOriginName =
    //   !!origin ? typeof(origin) === 'string' ? // @ts-ignore
    //     origin : origin.name
    // : '';

    const currentClientGroupName =
      !!group ? typeof (group) === 'string' ? // @ts-ignore
        group : group.name
        : '';

    const currentPdvName =
      !!pdv_type ? typeof (pdv_type) === 'string' ? // @ts-ignore
        pdv_type : pdv_type.name
        : '';

    const currentProfileName =
      !!profile ? typeof (profile) === 'string' ? // @ts-ignore
        profile : profile.name
        : '';

    const currentSellerName =
      !!seller ? typeof (seller) === 'string' ? // @ts-ignore
        seller : seller.name
        : '';

    const currentBlockingRule =
      !!blocking_rule ? typeof (blocking_rule) === 'string' ? // @ts-ignore
        blocking_rule : blocking_rule.name
        : '';

    const currentOriginName =
      !!origin ? typeof (origin) === 'string' ? // @ts-ignore
        origin : origin.name
        : '';

    const currentBuyerName =
      !!buyer ?
        !!buyer.name ? buyer.name : ''
        : '';

    const currentBuyerEmail =
      !!buyer ?
        !!buyer.email ? buyer.email : ''
        : '';

    // const currentBuyerCellphone =
    //   !!buyer ? 
    //     !!buyer.cellphone ? buyer.cellphone : ''
    //   : '';

    // const currentRole =
    //   !!buyer ? 
    //     !!buyer.role ?
    //       typeof(buyer.role) === 'string' ? buyer.role : buyer.role.name
    //     : ''
    // : '';


    // tratar quando é objeto do backend ou objeto local

    setTaxRegimeName(currentTaxRegimeName);
    setOriginName(currentOriginName);
    setClientGroupName(currentClientGroupName);
    setPdvName(currentPdvName);
    setProfileName(currentProfileName);

    const formattedClientData = {
      ...client,
      status: !!status ? status : '',
      commercial_status: !!commercial_status ? commercial_status : '',
      tax_regime: currentTaxRegimeName,
      // client_origin: currentOriginName,
      origin: currentOriginName,
      // client_group: currentClientGroupName,
      group: currentClientGroupName,
      // client_pdv: currentPdvName,
      pdv_type: currentPdvName,
      seller: currentSellerName,
      blocking_rule: currentBlockingRule,
      // client_profile: currentProfileName,
      profile: currentProfileName,
      activity_start: !!activity_start ? new Date(activity_start) : new Date(),
      auge_register: !!auge_register ? new Date(auge_register) : new Date(),
      buyer_name: currentBuyerName,
      buyer_email: currentBuyerEmail,
      // buyer_cellphone: currentBuyerCellphone,
      buyer_cellphone: '',
      // buyer_role: currentRole,
      buyer_role: '',
    }

    setLoading(false);
    return formattedClientData;
  }, [client]);

  const handleShouldUpdate = useCallback((fieldTitle: string, newValue: string) => {
    // @ts-ignore
    let data = formRef.getData();
    const updatedValue = capitalizeContent(newValue);

    // @ts-ignore
    data[fieldTitle] = updatedValue;
    // @ts-ignore
    formRef.current?.setFieldValue(fieldTitle, updatedValue)

    // @ts-ignore
    updateClient(data);

  }, [updateClient, formRef, client]);

  const handleNewClientGroupName = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.post('/clients/groups', { name: clientGroupName });

      const newClientGroup = {
        id: data.id,
        value: data.name,
        label: data.name,
      }

      // @ts-ignore
      setGroupsOptions(prev => [...prev, newClientGroup])

      // @ts-ignore
      handleShouldUpdate('group', data.name)


      setClientGroupName('Carregando');
      setClientGroupName(data.name);


      setIsGroupClientModalOpen(false);
    } catch (e) {
      console.log('e', e);
    }
  }, [handleShouldUpdate, clientGroupName])

  const handleNewPdvName = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.post('/clients/pdvs', { name: pdvName });

      const newPdv = {
        id: data.id,
        value: data.name,
        label: data.name,
      }

      // @ts-ignore
      setPdvsOptions(prev => [...prev, newPdv])

      // @ts-ignore
      handleShouldUpdate('pdv_type', data.name)

      setPdvName('Carregando');
      setPdvName(data.name);

      setIsPdvModalOpen(false);
    } catch (e) {
      console.log('e', e);
    }
  }, [handleShouldUpdate, pdvName]);


  const handleNewProfileName = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.post('/clients/profiles', { name: profileName });

      const newProfile = {
        id: data.id,
        value: data.name,
        label: data.name,
      }

      // @ts-ignore
      setProfilesOptions(prev => [...prev, newProfile])

      // @ts-ignore
      handleShouldUpdate('profile', data.name)

      setProfileName('Carregando');
      setProfileName(data.name);

      setIsProfileModalOpen(false);
    } catch (e) {
      console.log('e', e);
    }
  }, [handleShouldUpdate, profileName]);

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

      // @ts-ignore
      handleShouldUpdate('tax_regime', data.name)

      setTaxRegimeName('Carregando');
      setTaxRegimeName(data.name);

      setIsTaxRegimeNameModalOpen(false);
    } catch (e) {
      console.log('e', e);
    }
  }, [handleShouldUpdate, taxRegimeName]);

  const handleNewOriginName = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.post('/clients/origins', { name: originName });

      const newOrigin = {
        id: data.id,
        value: data.name,
        label: data.name,
      }

      // @ts-ignore
      setOriginOptions(prev => [...prev, newOrigin])

      // @ts-ignore
      handleShouldUpdate('origin', data.name)

      setOriginName('Carregando');
      setOriginName(data.name);

      setIsOriginModalOpen(false);
    } catch (e) {
      console.log('e', e);
    }
  }, [handleShouldUpdate, originName]);

  const handleDeleteOrigin = useCallback(async (id: number, value: string) => {
    try {
      await api.delete(`/clients/origins/${id}`);

      // @ts-ignore
      setOriginOptions(prev => prev.filter(e => e.value !== value));
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  const handleDeleteTaxRegime = useCallback(async (id: number, value: string) => {
    try {
      await api.delete(`/tax_regimes/${id}`);

      // @ts-ignore
      setTaxRegimesOptions(prev => prev.filter(e => e.value !== value));
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  const handleDeleteProfile = useCallback(async (id: number, value: string) => {
    try {
      await api.delete(`/clients/profiles/${id}`);

      // @ts-ignore
      setProfilesOptions(prev => prev.filter(e => e.value !== value));
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  const handleDeletePdv = useCallback(async (id: number, value: string) => {
    try {
      await api.delete(`/clients/pdvs/${id}`);

      // @ts-ignore
      setPdvsOptions(prev => prev.filter(e => e.value !== value));
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  const handleDeleteGroup = useCallback(async (id: number, value: string) => {
    try {
      await api.delete(`/clients/groups/${id}`);

      // @ts-ignore
      setGroupsOptions(prev => prev.filter(e => e.value !== value));
    } catch (e) {
      console.log('e', e);
    }
  }, []);

  return (
    <>
      <Header minimal route={['Cadastro', 'Cliente', 'Editar Cliente']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Form ref={updateFormRef} onSubmit={() => { }} initialData={formattedData}>
          <Container>
            <ClientHeader
              ref={formRef}
              disabled={disabled}
              data={{
              }}
            >
              <div style={{
                margin: '0 1rem',
                borderLeft: '2px solid #eee'
              }}>
                <Button
                  onClick={handleSubmit}
                  disabled={registering}
                  style={{
                    marginLeft: '1rem'
                  }}
                >
                  Salvar
                </Button>
              </div>
            </ClientHeader>
            <CustomSectionTitle>
              Cliente
            </CustomSectionTitle>
            <InputContainer>
              <Input
                name="Razão Social"
                width="28rem"
                validated={false}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onBlur={(e) => {
                  const company_name = capitalizeContent(e.target.value);
                  setCompanyName(company_name);
                  if (!noClient) updateClient({ ...client, company_name })
                }}
                disabled={!noClient}
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
                  if (!noClient) updateClient({ ...client, name })
                }}
              // disabled={!noClient}
              />
              <FormInputCustomMask
                name="document"
                title="CNPJ"
                width="9.375rem"
                disabled={!noClient}
                mask="99.999.999/9999-99"
                onBlur={(e) => handleShouldUpdate('document', e.target.value)}
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
                  if (!noClient) updateClient({ ...client, state_registration })
                }}
              />
              <FormInput
                name="joint_stock"
                title="Capital Social"
                width="12rem"
                validated={false}
                disabled
              />
            </InputContainer>
            <InputContainer>
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
                disabled={!noClient}
                noMinDate
                onDateSelect={(value) => {
                  setAge(calculateAge(!!value ? value : new Date()));
                  updateClient({
                    activity_start: value.toISOString()
                  })
                }}
                // @ts-ignore
                focusOnNextElement={() => yearsRef?.current?.focus()}
              />
              <input ref={yearsRef} style={{ width: 0, marginLeft: -10, opacity: 0 }} />
              <Input
                name="Anos"
                width="3.125rem"
                validated={false}
                value={age}
                disabled
              />
              {taxRegimeName !== 'Carregando' ?
                <FormSelect
                  name="tax_regime"
                  title="Porte"
                  placeholder="Selecione..."
                  customWidth="12.5rem"
                  disabled={loading}
                  data={taxRegimesOptions}
                  isClearable
                  onChange={
                    (value: string) => value === 'new' ?
                      setIsTaxRegimeNameModalOpen(true) : // @ts-ignore
                      handleShouldUpdate('tax_regime', value)
                  }
                  customValue={{
                    value: client.tax_regime?.name ?? '',
                    label: client.tax_regime?.name ?? ''
                  }}

                /> :
                <></>
              }
              {/* <FormSelect
                name="status"
                title="Status do CNPJ"
                placeholder="Selecione..."
                customWidth="12.5rem"
                disabled={loading}
                data={statusOptions}
                isClearable
                onChange={ // @ts-ignore 
                  (value) => handleShouldUpdate('status', value)
                }
                // ref={originRef}
              /> */}
              <FormInput
                name="document_status"
                title="Situação Cadastral"
                // title="Status do CNPJ"
                width="12.5rem"
                validated={false}
                disabled={!noClient}
              />
              <DateBox
                name="auge_register"
                title="Cadastro na Auge"
                width="6.75rem"
                validated={false}
                hasHour={false}
                disabled={!noClient}
                noMinDate
                // @ts-ignore
                focusOnNextElement={() => hasEcommerceRef?.current?.focus()}
              />
              <input ref={hasEcommerceRef} style={{ width: 0, marginLeft: -10, opacity: 0 }} />
              {originName !== 'Carregando' ?
                <FormSelect
                  // name="client_origin"
                  name="origin"
                  title="Origem do Cliente"
                  placeholder="Selecione..."
                  // customWidth="11.5rem"
                  customWidth="20rem"
                  disabled={loading}
                  data={originOptions}
                  isClearable
                  onChange={
                    (value: string) => value === 'new' ?
                      setIsOriginModalOpen(true) : // @ts-ignore
                      handleShouldUpdate('origin', value)
                  }
                  customValue={{
                    // @ts-ignore
                    value: client.origin?.name ?? '' ,
                    // @ts-ignore
                    label: client.origin?.name ?? ''
                  }}
                /> :
                <></>
              }
            </InputContainer>
            <InputContainer style={{ height: 'auto' }}>
              <FormTextArea
                name="activity_list"
                title="Atividade"
                width="40.1875rem"
                validated={false}
                disabled
              />
              <FormTextArea
                name="legal_representative_list"
                title="Representante Legal"
                width="40.1875rem"
                validated={false}
                disabled
              />
            </InputContainer>
            <CustomSectionTitle>
              Redes Sociais
            </CustomSectionTitle>
            <InputContainer
              style={{
                alignItems: 'flex-start'
              }}
            >
              <RadioBox
                title="Vende Online?"
                value={hasEcommerce}
                setValue={setHasEcommerce}
              />
              <SiteBox
                name="Site"
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
              Perfil do Cliente
            </CustomSectionTitle>
            <InputContainer>
              {clientGroupName !== 'Carregando' ?
                <FormSelect
                  // name="client_group"
                  name="group"
                  title="Grupo do Cliente"
                  customWidth="16.1875rem"
                  data={groupsOptions}
                  disabled={loading}

                  // @ts-ignore

                  onChange={
                    (value: string) => value === 'new' ?
                      setIsGroupClientModalOpen(true) : // @ts-ignore
                      handleShouldUpdate('group', value)
                  }
                  customValue={{
                    // @ts-ignore
                    value: client.group_name ?? '',
                    // @ts-ignore
                    label: client.group_name ?? ''
                  }}
                /> :
                <></>
              }
              {pdvName !== 'Carregando' ?
                <FormSelect
                  // name="client_pdv"
                  name="pdv_type"
                  title="Tipo de PDV"
                  placeholder="Selecione..."
                  customWidth="12.5rem"
                  data={pdvsOptions}
                  disabled={loading}
                  isClearable
                  onChange={
                    (value: string) => value === 'new' ?
                      setIsPdvModalOpen(true) : // @ts-ignore
                      handleShouldUpdate('pdv_type', value)
                  }
                  customValue={{
                    // @ts-ignore
                    value: client.pdv_type?.name ?? '',
                    // @ts-ignore
                    label: client.pdv_type?.name ?? ''
                  }}

                /> :
                <></>
              }
              <FormSelect
                name="seller"
                title="Comercial"
                placeholder="Selecione..."
                customWidth="16.1875rem"
                data={sellerOptions}
                disabled={loading}
                isClearable
                onChange={
                  (value: string) => handleShouldUpdate('seller', value)
                }
                customValue={{
                  // @ts-ignore
                  value: client.seller_name ?? '',
                  // @ts-ignore
                  label: client.seller_name ?? ''
                }}

              />
              {profileName !== 'Carregando' ?
                <FormSelect
                  // name="client_profile"
                  name="profile"
                  title="Perfil do Cliente"
                  placeholder="Selecione..."
                  customWidth="12.5rem"
                  data={profilesOptions}
                  disabled={loading}
                  isClearable
                  // onChange={
                  //   (value: string) => value === 'new' ?
                  //   setIsProfileModalOpen(true) : // @ts-ignore
                  //   handleShouldUpdate('profile', value)
                  // }
                  onChange={(value: string) => {
                    setNewClientProfile(value);
                    // @ts-ignore
                    setShouldUpdateUser(client.same_group)
                  }}
                  customValue={{
                    // @ts-ignore
                    value: client.profile_name,
                    // @ts-ignore
                    label: client.profile_name
                  }}

                /> :
                <></>
              }
              <TagInput
                title="Newsletter"
                tags={newsletterTags}
                setTags={setNewsletterTags}
                width="19.25rem"
                validated={false}
              />
            </InputContainer>
            <CustomSectionTitle>
              Perfil Comercial
            </CustomSectionTitle>
            <InputContainer>
              <FormSelect
                name="commercial_status"
                title="Status Comercial"
                placeholder="Selecione..."
                customWidth="16.1875rem"
                isClearable
                data={commercialStatusOptions}
                onChange={(value: string) => handleShouldUpdate('commercial_status', value)}
                customValue={{
                  // @ts-ignore
                  value: client.commercial_status,
                  // @ts-ignore
                  label: client.commercial_status
                }}
              />
              <RadioBox
                title="Agendamento de Pedido"
                value={orderSchedule}
                setValue={setOrderSchedule}
              />
              <RadioBox
                title="Saldo de Pedido"
                value={orderBalance}
                setValue={setOrderBalance}
              />
              <RadioBox
                title="Digitar preço no Pedido"
                value={enterPriceOnOrder}
                setValue={setEnterPriceOnOrder}
              />
              <RadioBox
                title="Pode migrar atendimento?"
                value={canMigrateService}
                setValue={setCanMigrateService}
              />
              {/* <MultiSelect
                title="Regra de Bloqueio"
                placeholder="Selecione..."
                customWidth="32.5rem"
                disabled={noClient}
                data={regionsOptions}
                // @ts-ignore
                setValue={(value) => handleBlockRule(value)}
                defaultValue={!!client && !!client.regions && client.regions.map((s: IBaseType) => ({ id: s.id, value: s.name, label: s.name }))}
              /> */}
              <FormSelect
                name="blocking_rule"
                title="Regra de Bloqueio"
                placeholder="Selecione..."
                customWidth="32.5rem"
                data={blockingRulesOptions}
                disabled={loading}
                isClearable
                onChange={(value: string) =>
                  handleShouldUpdate('blocking_rule', value)
                }
                customValue={{
                  // @ts-ignore
                  value: client.blocking_rule?.name ?? '',
                  // @ts-ignore
                  label: client.blocking_rule?.name ?? ''
                }}
              />
            </InputContainer>
            <InputContainer>
              <FormInput
                name="auto_observation_order"
                title="Observação Automática do Pedido"
                width="47.875rem"
                validated={false}
                onBlur={(e) => handleShouldUpdate('auto_observation_order', e.target.value)}
              />
              <MultiSelect
                title="Representada Bloqueada"
                placeholder="Selecione..."
                // customWidth="100%"
                customWidth="32.75rem"
                disabled={noClient || isUpdatingBlockedSupplier}
                data={suppliersOptions}
                // @ts-ignore
                setValue={(value) => handleBlockedSupplier(value)}
                // setValue={(value) => console.log(value)}
                // data={countryStates}
                defaultValue={!!client && !!client.blocked_suppliers && client.blocked_suppliers.map((s: IBaseType) => ({ id: s.id, value: s.name, label: s.name }))}
              />
            </InputContainer>
            <CustomSectionTitle>
              Dados de Contato do Comprador
            </CustomSectionTitle>
            <InputContainer>
              <FormInput
                name="buyer_name"
                title="Nome"
                width="16.25rem"
                validated={false}
                disabled
              />
              <FormSelect
                name="buyer_role"
                title="Cargo na Empresa"
                placeholder="Selecione..."
                customWidth="10rem"
                disabled
              />
              <FormPhoneBox
                name="buyer_cellphone"
                title="Celular"
                width="8.125rem"
                disabled
              />
              <SocialBox
                name="buyer_email"
                title="Email Corporativo"
                type="email"
                badge={EmailIcon}
                width="14.25rem"
                inputStyle={{ textTransform: 'lowercase' }}
                disabled
              />
              <FormInput
                name="group_name"
                title="Grupo"
                width="10rem"
                validated={false}
                disabled
              />
              <FormInput
                name="group_sum_clients"
                title="Qtd. Lojas"
                width="4rem"
                validated={false}
                disabled
              />
            </InputContainer>
            <Contacts contacts={contacts} />
            <Addresses addresses={addresses} />
            <BankAccounts bankAccounts={bankAccounts} />
          </Container>
        </Form>
      </MenuAndTableContainer>
      <Modal
        title="Grupo do Cliente"
        isModalOpen={isGroupClientModalOpen}
        setIsModalOpen={setIsGroupClientModalOpen}
        customOnClose={() => { }}
        style={{ width: 471 }}
      >
        <InputContainer style={{ alignItems: 'flex-end' }}>
          <Input
            name="Grupo do Cliente"
            fullW
            value={clientGroupName}
            onChange={(e) => setClientGroupName(e.target.value)}
          />
          <TableActionButton
            onClick={handleNewClientGroupName}
            style={{
              marginLeft: '1rem'
            }}
          >
            <PlusIcon />
          </TableActionButton>
        </InputContainer>
        <DeleteItemsContainer>
          {groupsOptions.map((t: DefaultValuePropsWithId) =>
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
                onClick={() => handleDeleteGroup(t.id, t.value)}
                style={{ marginLeft: '1rem' }}
              >
                <TrashIcon />
              </TableActionButton>
            </div>
          )}
        </DeleteItemsContainer>
      </Modal>
      <Modal
        title="Tipo de PDV"
        isModalOpen={isPdvModalOpen}
        setIsModalOpen={setIsPdvModalOpen}
        customOnClose={() => { }}
        style={{ width: 471 }}
      >
        <InputContainer style={{ alignItems: 'flex-end' }}>
          <Input
            name="Tipo de PDV"
            fullW
            value={pdvName}
            onChange={(e) => setPdvName(e.target.value)}
          />
          <TableActionButton
            onClick={handleNewPdvName}
            style={{
              marginLeft: '1rem'
            }}
          >
            <PlusIcon />
          </TableActionButton>
        </InputContainer>
        <DeleteItemsContainer>
          {pdvsOptions.map((t: DefaultValuePropsWithId) =>
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
                onClick={() => handleDeletePdv(t.id, t.value)}
                style={{ marginLeft: '1rem' }}
              >
                <TrashIcon />
              </TableActionButton>
            </div>
          )}
        </DeleteItemsContainer>
      </Modal>
      <Modal
        title="Perfil do Cliente"
        isModalOpen={isProfileModalOpen}
        setIsModalOpen={setIsProfileModalOpen}
        customOnClose={() => { }}
        style={{ width: 471 }}
      >
        <InputContainer style={{ alignItems: 'flex-end' }}>
          <Input
            name="Perfil do Cliente"
            fullW
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />
          <TableActionButton
            onClick={handleNewProfileName}
            style={{
              marginLeft: '1rem'
            }}
          >
            <PlusIcon />
          </TableActionButton>
        </InputContainer>
        <DeleteItemsContainer>
          {profilesOptions.map((t: DefaultValuePropsWithId) =>
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
                onClick={() => handleDeleteProfile(t.id, t.value)}
                style={{ marginLeft: '1rem' }}
              >
                <TrashIcon />
              </TableActionButton>
            </div>
          )}
        </DeleteItemsContainer>
      </Modal>
      <Modal
        title="Origem do Cliente"
        isModalOpen={isOriginModalOpen}
        setIsModalOpen={setIsOriginModalOpen}
        customOnClose={() => { }}
        style={{ width: 471 }}
      >
        <InputContainer style={{ alignItems: 'flex-end' }}>
          <Input
            name="Origem do Cliente"
            fullW
            value={originName}
            onChange={(e) => setOriginName(e.target.value)}
          />
          <TableActionButton
            onClick={handleNewOriginName}
            style={{
              marginLeft: '1rem'
            }}
          >
            <PlusIcon />
          </TableActionButton>
        </InputContainer>
        <DeleteItemsContainer>
          {originOptions.map((t: DefaultValuePropsWithId) =>
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
                onClick={() => handleDeleteOrigin(t.id, t.value)}
                style={{ marginLeft: '1rem' }}
              >
                <TrashIcon />
              </TableActionButton>
            </div>
          )}
        </DeleteItemsContainer>
      </Modal>
      <Modal
        title="Porte"
        isModalOpen={isTaxRegimeNameModalOpen}
        setIsModalOpen={setIsTaxRegimeNameModalOpen}
        customOnClose={() => { }}
        style={{ width: 471 }}
      >
        <InputContainer style={{ alignItems: 'flex-end' }}>
          <Input
            name="Porte"
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
        action={() => { }}
        style={{ marginTop: 0 }}
        setIsModalOpen={() =>
          setCurrentDeletingAttribute('')
        }
      />
      <AlertModal
        clientName={shouldUpdateUser}
        action={() => {
          if (newClientProfile === 'new') setIsProfileModalOpen(true)
          else handleShouldUpdate('profile', newClientProfile)

          setShouldUpdateUser('');
        }}
        style={{
          marginTop: 0,
          minHeight: '31rem',
          height: 'auto'
        }}
        setIsModalOpen={() => setShouldUpdateUser('')}
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
