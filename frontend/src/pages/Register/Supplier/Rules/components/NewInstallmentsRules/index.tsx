import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CustomSectionTitle } from '../../styles';

import { ReactComponent as PlusIcon } from '~assets/plus_white.svg'
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg'

import { InputContainer } from '~styles/components';
import { Input } from '~components/Input';
import { NoTitleSelect as Select } from '~components/NoTitleSelect';
import { MeasureBox } from '@/src/components/MeasureBox';
import { TagInput } from '@/src/components/TagInput';
import { Rule, RulesContainer, CustomButton, Header, Content } from './styles';
import { useRegister } from '~context/register';
import { api } from '~api';
import { InstallmentRule, ITag } from '~types/main';
import { TableActionButton } from '@/src/styles/components/tables';
import { isNotEmpty, isEmpty } from '@/src/utils/validation';

type Props = {
  data: InstallmentRule[];
  setDisabled: (value: boolean) => void;
}

type IBlockedOption = {
  [key: string]: boolean;
}

export function InstallmentsRules({ data, setDisabled }: Props) {
  const { supplier, updateSupplier } = useRegister();
  const [currentData, setCurrentData] = useState(data);
  const [clientOptions, setClientOptions] = useState([]);
  const [clientGroupOptions, setClientGroupOptions] = useState([]);
  const [cleaning, setCleaning] = useState(false);
  const [blockedOptions, setBlockedOptions] = useState<IBlockedOption>({} as IBlockedOption);
  const [blockedValueModifiers, setBlockedValueModifiers] = useState<IBlockedOption>({} as IBlockedOption);

  const [clientName, setClientName] = useState('');
  const [addingClient, setAddingClient] = useState(false);

  // client1
  // group2
  // client3
  // data['group1'] = value !== 'Todos'


  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientGroupId, setClientGroupId] = useState('');
  // const [installments, setInstallments] = useState<ITag[]>([]);
  const [installments, setInstallments] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [additionalValue, setAdditionalValue] = useState('');
  // const [inCash, setInCash] = useState<ITag[]>([]);
  // const [inCashDiscountValue, setInCashDiscountValue] = useState('');
  // const [inCashAdditionalValue, setInCashAdditionalValue] = useState('');

  const [addingInstallmentRule, setAddingInstallmentRule] = useState(false);
  const [deletingInstallmentRule, setDeletingInstallmentRule] = useState(-1);
  
  const [clientOptionDisabled, setClientOptionDisabled] = useState('');
  const [valueModifierDisabled, setValueModifierDisabled] = useState('');

  const isAddingDisabled = useMemo(() => 
    !supplier.id ||
    addingInstallmentRule ||
    isEmpty(name) ||
    (isEmpty(clientId) && isEmpty(clientGroupId)) ||
    isEmpty(installments) ||
    (isEmpty(discountValue) && isEmpty(additionalValue))
  , [supplier, addingInstallmentRule, name, clientId, clientGroupId, installments, discountValue, additionalValue]);

  const handleAddInstallmentRule = useCallback(async () => {
    try {
      setAddingInstallmentRule(true);
      const { id } = supplier;

      // const formattedInstallments = installments.map((e) => e.value).join(',');
      // const formattedInCash = inCash.map((e) => e.value).join(',');

      let client_id = null;
      let client_group_id = null;

      if (clientOptionDisabled === 'rule_group_client') {// @ts-ignore
        client_id = clientOptions.find(p => p.value === clientId).id
      }
      else if (clientOptionDisabled === 'rule_client') {// @ts-ignore
        client_group_id = clientGroupOptions.find(p => p.value === clientGroupId).id
      }

      const installmentRuleData = {
        name,
        min_value: '0',
        installments,
        discount_value: discountValue,
        additional_value: additionalValue,
        client_id,
        client_group_id,
      }

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/installment_rules`, installmentRuleData);

      setClientOptionDisabled('Atualizando...');
      setName('');
      setClientId('');
      setClientGroupId('');
      setInstallments('');
      setDiscountValue('');
      setAdditionalValue('');
      setClientOptionDisabled('');

      const installment_rules = [...currentData, data];

      setCurrentData(installment_rules);
      updateSupplier({ installment_rules });
    } catch (e) {
      console.log('e', e);
    } finally {
      setAddingInstallmentRule(false);
      setCleaning(false);
    }
  }, [
      supplier,
      updateSupplier,
      currentData,
      clientOptions,
      clientGroupOptions,
      name,
      clientId,
      clientGroupId,
      installments,
      discountValue,
      additionalValue,
      // inCash,
      // inCashDiscountValue,
      // inCashAdditionalValue,
      clientOptionDisabled,
    ]);

  const handleEditInstallmentRule = useCallback(async (order: InstallmentRule) => {
    try {
      const { id } = supplier;

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/installment_rules/${order.id}?_method=PUT`, order);

      const installment_rules = currentData.map(p => p.id === order.id ? data : p);

      setCurrentData(installment_rules);
      updateSupplier({ installment_rules });
    } catch (e) {
      console.log('e', e);
    }
  }, [supplier, updateSupplier, currentData]);

  const handleDeleteInstallmentRule = useCallback(async (installmentRuleId: number) => {
    try {
      setDeletingInstallmentRule(installmentRuleId);
      
      const { id } = supplier;

      await api.delete(`/products/suppliers/${id}/installment_rules/${installmentRuleId}`);

      const installment_rules = currentData.filter(p => p.id !== installmentRuleId);

      setCurrentData(installment_rules);
      updateSupplier({ installment_rules });
    } catch (e) {
      console.log('e', e);
    } finally {
      setDeletingInstallmentRule(-1);
    }
  }, [supplier, currentData, updateSupplier]);

  const fetchData = useCallback(async () => {
    try {
      const [
        // clientsResponse,
        clientGroupsResponse
      ] = 
        await Promise.all([
          // api.get('/clients'),
          api.get('/clients/groups'),
        ]);

      // const {
      //   data: { data: clientsData }
      // } = clientsResponse;

      const {
        data: { data: clientProfilesData }
      } = clientGroupsResponse;

      // @ts-ignore
      // setClientOptions([{ value: 'Todos', label: 'Todos', id: null  }, ...clientsData.map((c) => ({ id: c.id, value: c.company_name, label: c.company_name }))]);

      // @ts-ignore
      setClientGroupOptions([{ value: 'Todos', label: 'Todos', id: null  }, ...clientProfilesData.map((c) => ({ id: c.id, value: c.name, label: c.name }))]);

    } catch (e) {
      console.log('e', e);
    }
  }, []);

  const handleShouldUpdate = useCallback(
    (oldValue: string, newValue: string, order: InstallmentRule) =>
      String(newValue) !== String(oldValue) && handleEditInstallmentRule(order)
  , [handleEditInstallmentRule]);

  const handleBlockedOptions = useCallback((field: string, value: boolean) => {
    let temp = blockedOptions;
    temp[field] = value;
    setBlockedOptions(temp);
  }, [blockedOptions])

  const handleBlockedValueModifiers = useCallback((field: string, value: boolean) => {
    let temp = blockedValueModifiers;
    temp[field] = value;
    setBlockedValueModifiers(temp);
  }, [blockedValueModifiers])

  const handleLookupClientName = useCallback(async (search: string) => {
    try {
      if(!isNotEmpty(search)) return;
      setAddingClient(true);

      const {
        data: {
          data: {
            data
          }
        } // @ts-ignore
      } =  await api.get('/clients?paginated=true', { reference: search.toLowerCase() });

      // @ts-ignore
      setClientOptions([{ value: 'Todos', label: 'Todos', id: null  }, ...data.map((c) => ({ id: c.id, value: c.company_name, label: c.company_name }))]);
    } catch (e) {
      console.log("e", e);
    } finally {
      setAddingClient(false);
    }
  }, []);

  useEffect(() => {
    currentData.forEach(e => {
      handleBlockedOptions(`group${e.id}`, !!e.client);
      handleBlockedOptions(`client${e.id}`, !!e.client_group);
      handleBlockedValueModifiers(`additional${e.id}`, !!e.discount_value);
      handleBlockedValueModifiers(`discount${e.id}`, !!e.additional_value);
    })
  }, [])

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <CustomSectionTitle>
        Regra de Parcelamentos
      </CustomSectionTitle>
      <Header>
        <div>
          <strong>Nome da Regra</strong>
        </div>
        <div>
          <strong>Cliente</strong>
        </div>
        <div>
          <strong>Grupo de Cliente</strong>
        </div>
        <div>
          <strong>Parcelamento</strong>
        </div>
        <div>
          <strong>Desconto</strong>
        </div>
        <div>
          <strong>Acréscimo</strong>
        </div>
        <div>
          <strong>Ação</strong>
        </div>
      </Header>
      {currentData.map(r =>
        <Content key={r.id}>
          <div>
            <Input
              name="Nome da Regra"
              noTitle
              width="8.5rem"
              validated={false}
              defaultValue={r.name}
              noValueInput
              disabled
              // onBlur={({ target: { value: name } }) =>
              //   handleShouldUpdate(r.name, name, {...r, name })
              // }
            />
          </div>
          <div>
            <Select
              placeholder="Selecione..."
              customWidth="10rem"
              setValue={() => {}}
              // @ts-ignore
              // setValue={(value, client_id) => { // @ts-ignore
              //   handleShouldUpdate(r.client, value, {...r, client_id});
              //   handleBlockedOptions(`group${r.id}`, value !== 'Todos')
              // }
              // }
              data={clientOptions}
              // disabled={blockedOptions[`client${r.id}`]}
              disabled
              defaultValue={{
                value: !!r.client ? r.client : 'Todos',
                label: !!r.client ? r.client : 'Todos'
              }}
            />
          </div>
          <div>
            <Select
              placeholder="Selecione..."
              customWidth="10rem"
              setValue={() => {}}
              // @ts-ignore
              // setValue={(value, client_group_id) => { // @ts-ignore
              //   handleShouldUpdate(r.client_group, value, {...r, client_group_id});
              //   handleBlockedOptions(`client${r.id}`, value !== 'Todos')
              // }
              // }
              // disabled={blockedOptions[`group${r.id}`]}
              disabled
              data={clientGroupOptions}
              defaultValue={{
                value: !!r.client_group ? r.client_group : 'Todos',
                label: !!r.client_group ? r.client_group : 'Todos'
              }}
            />
          </div>
          <div>
            <Input
              name="Parcelamento"
              noTitle
              width="10.25rem"
              validated={false}
              defaultValue={r.installments}
              noValueInput
              disabled
              // onBlur={({ target: { value: installments } }) =>
              //   handleShouldUpdate(r.installments, installments, {...r, installments })
              // }
            />
          </div>
          <div>
            <MeasureBox
              name="discount_value"
              noTitle
              measure="%"
              width="8.25rem"
              validated={false}
              defaultValue={r.discount_value}
              // disabled={blockedValueModifiers[`discount${r.id}`]}
              disabled
              // onBlur={({ target: { value: discount_value } }) => {
              //   handleShouldUpdate(
              //     String(r.discount_value),
              //     discount_value,
              //     {...r, discount_value: +discount_value }
              //   );
              //   handleBlockedValueModifiers(`additional${r.id}`, !!discount_value)
              // }
              // }
            />
          </div>
          <div>
            <MeasureBox
              name="additional_value"
              noTitle
              measure="%"
              width="8.25rem"
              validated={false}
              defaultValue={r.additional_value}
              // disabled={blockedValueModifiers[`additional${r.id}`]}
              disabled
              // onBlur={({ target: { value: additional_value } }) => {
              //   handleShouldUpdate(
              //     String(r.additional_value),
              //     additional_value,
              //     {...r, additional_value: +additional_value }
              //   );
              //   handleBlockedValueModifiers(`discount${r.id}`, !!additional_value)
              // }
              // }
            />
          </div>
          <div>
            <TableActionButton
              disabled={deletingInstallmentRule === r.id}
              onClick={() => handleDeleteInstallmentRule(r.id)}
            >
              {deletingInstallmentRule === r.id ? <LoadingIcon /> : <TrashIcon />}
            </TableActionButton>
          </div>
        </Content>
      )}
      <Content style={{ backgroundColor: '#f2f2f2' }}>
        <div>
          <Input
            name="Nome da Regra"
            noTitle
            validated={false}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!supplier.id}
            width="8.5rem"
          />
        </div>
        <div>
          {clientOptionDisabled !== 'Atualizando...' ?
            !!clientOptions.length ?
              <Select
                placeholder="Selecione..."
                isClearable
                // @ts-ignore
                setValue={() => {}}
                // @ts-ignore
                onChange={(value, id) => {
                  if(!value) setClientOptions([])
                  setClientId(value);
                  setClientOptionDisabled(!!value ? 'rule_group_client' : '')
                }}
                customWidth="10rem"
                data={clientOptions}
                disabled={addingClient || !supplier.id || clientOptionDisabled === 'rule_client'}
              /> :
              <Input
                name="Tipo"
                noTitle
                title="Tipo"
                width="10rem"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                onBlur={(e) => handleLookupClientName(e.target.value)}
              /> :
            <></>
            }
        </div>
        <div>
          {clientOptionDisabled !== 'Atualizando...' ?
            <Select
              placeholder="Selecione..."
              customWidth="10rem"
              isClearable
              data={clientGroupOptions}
              // @ts-ignore
              setValue={(v) => {
                setClientGroupId(v);
                setClientOptionDisabled(!!v ? 'rule_client' : '')
              }}
              disabled={!supplier.id || clientOptionDisabled === 'rule_group_client'}
            /> :
            <></>
          }
        </div>
         <div>
           <Input
             name="Parcelamento"
             noTitle
             validated={false}
             value={installments}
             onChange={(e) => setInstallments(e.target.value)}
             disabled={!supplier.id}
             width="10.25rem"
           />
         </div>
        <div>
          <MeasureBox
            name="discount_value"
            noTitle
            measure="%"
            width="8.25rem"
            validated={false}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            onBlur={({ target: { value } }) =>
              setValueModifierDisabled(!!value ? 'additional_value' : '') 
             }
            disabled={!supplier.id || valueModifierDisabled === 'discount_value'}
          />
        </div>
        <div>
          <MeasureBox
            name="additional_value"
            noTitle
            measure="%"
            width="8.25rem"
            validated={false}
            value={additionalValue}
            onChange={(e) => setAdditionalValue(e.target.value)}
            onBlur={({ target: { value } }) =>
              setValueModifierDisabled(!!value ? 'discount_value' : '') 
             }
            disabled={!supplier.id || valueModifierDisabled === 'additional_value'}
          />
        </div>
        <div>
          <TableActionButton
            disabled={isAddingDisabled}
            onClick={handleAddInstallmentRule}
          >
            {addingInstallmentRule ? <LoadingIcon /> : <PlusIcon />}
          </TableActionButton>
        </div>
      </Content>
    </>
  );
}
