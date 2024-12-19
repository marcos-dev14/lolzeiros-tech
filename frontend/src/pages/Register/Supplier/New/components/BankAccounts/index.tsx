import React, { useCallback, useEffect, useState } from 'react';
import { InputContainer } from '~styles/components';
import { TableActionButton } from '~styles/components/tables';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { ReactComponent as CollapseIcon } from '~assets/collapse.svg'
import { ReactComponent as ExpandIcon } from '~assets/expand_white.svg'
import { ReactComponent as PlusIcon } from '~assets/plus.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg'

import { Input } from '~components/Input';
import { CustomSelect as Select } from '~components/Select';
import { NoTitleSelect } from '@/src/components/NoTitleSelect';
import { PhoneBox } from '@/src/components/PhoneBox';

import {
  CustomSectionTitle,
  BankAccountTableContentWrapper,
  Button,
  BankAccountTableHeader,
  BankAccountTableContent,
  BankAccountTableExpandedContent,
  DeleteItemsContainer,
} from './styles';
import { useRegister } from '@/src/context/register';
import { api } from '@/src/services/api';
import { DefaultValuePropsWithId, IBaseType, IBankAccount } from '@/src/types/main';
import { ConfirmationModal } from '@/src/components/ConfirmationModal';
import { Modal } from '@/src/components/Modal';
import { ErrorModal } from '@/src/components/ErrorModal';
import { capitalizeContent } from '@/src/utils/validation';

type Props = {
  bankAccounts: IBankAccount[];
}

export function BankAccounts({ bankAccounts }: Props) {
  const { supplier, updateSupplier } = useRegister();
  
  const [accountOwner, setAccountOwner] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [bankNumber, setBankNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [agencyNumber, setAgencyNumber] = useState('');
  const [operation, setOperation] = useState('');
  const [pix, setPix] = useState('');
  const [paypal, setPaypal] = useState('');
  const [bankAccountOpened, setBankAccountOpened] = useState(false);

  const [error, setError] = useState('');

  const [cleaning, setCleaning] = useState(false);
  
  const [bankOptions, setBankOptions] = useState<DefaultValuePropsWithId[]>([]);

  const [addingBankAccount, setAddingBankAccount] = useState(false);
  const [deletingBankAccount, setDeletingBankAccount] = useState(-1);

  const [bankOption, setBankOption] = useState('');
  const [isNewBankOptionModalOpen, setIsNewBankOptionModalOpen] = useState<'normal' | 'new' | ''>('');

  const [currentData, setCurrentData] = useState<IBankAccount[]>(bankAccounts);

  const handleAddBankAccount = useCallback(async () => {
    try {
      setAddingBankAccount(true);
      const { id } = supplier;

      const bankAccountData = {
        owner_name: capitalizeContent(accountOwner),
        document: registrationNumber,
        bank_id: bankNumber,
        account_number: accountNumber,
        agency: agencyNumber,
        operation,
        pix_key: pix,
        paypal
      }

      const {
        data: {
          data
        }
      } = await api.post(`/products/suppliers/${id}/bank_accounts`, bankAccountData);

      setCleaning(true);
      setAccountOwner('');
      setRegistrationNumber('');
      setBankNumber('');
      setAccountNumber('');
      setAgencyNumber('');
      setOperation('');
      setPix('');
      
      const bankAccounts = [...currentData, data];

      setCurrentData(bankAccounts);
      updateSupplier({ bank_accounts: bankAccounts });
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar a representada.';

      setError(errorMessage);
    } finally {
      setAddingBankAccount(false);
      setCleaning(false);
    }
  }, [
      currentData,
      supplier,
      updateSupplier,
      accountOwner,
      registrationNumber,
      bankNumber,
      accountNumber,
      agencyNumber,
      operation,
      pix,
      paypal
    ]);

  const handleEditBankAccount = useCallback(async (order) => {
    try {
      const { id } = supplier;

      const {
        data: { data }
      } = await api.post(`/products/suppliers/${id}/bank_accounts/${order.id}?_method=PUT`, order);

      // @ts-ignore
      const bankAccounts = currentData.map(p => p.id === order.id ? data : p);

      setCurrentData(bankAccounts);
      updateSupplier({ bank_accounts: bankAccounts });
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar a representada.';

      setError(errorMessage);
    }
  }, [supplier, updateSupplier, currentData]);

  const handleDeleteBankAccount = useCallback(async () => {
    try {      
      const { id } = supplier;

      await api.delete(`/products/suppliers/${id}/bank_accounts/${deletingBankAccount}`);

      // @ts-ignore
      const bankAccounts = currentData.filter(p => p.id !== deletingBankAccount);

      setCurrentData(bankAccounts);
      updateSupplier({ bank_accounts: bankAccounts });
      // find and update locally
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar a representada.';

      setError(errorMessage);
    } finally {
      setDeletingBankAccount(-1);
    }
  }, [supplier, updateSupplier, currentData, deletingBankAccount]);

  const fetchData = useCallback(async () => {
    try {
      const {
        data: {
          data
        }
      } = await api.get('/banks');

      setBankOptions([
        { value: 'new', label: 'Editar Bancos' },
        ...data.map((r: IBaseType) => ({ id: r.id, value: capitalizeContent(r.name), label: capitalizeContent(r.name) }))
      ])
    } catch (e) {
      console.log('e', e);
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const handleShouldUpdate = useCallback(
    (oldValue: string, newValue: string, order: IBankAccount) =>
      String(newValue) !== String(oldValue) && handleEditBankAccount(order)
  , [handleEditBankAccount]);

  const handleAddBankOption = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.post('/banks', { name: capitalizeContent(bankOption) });

      const newBankOption = {
        id: data.id,
        value: capitalizeContent(data.name),
        label: capitalizeContent(data.name),
      }

      // @ts-ignore
      setBankOptions(prev => [...prev, newBankOption])

      setBankOption(isNewBankOptionModalOpen === 'new' ? 'CarregandoNew' : 'Carregando');
      setBankOption(capitalizeContent(data.name));

      setIsNewBankOptionModalOpen('');
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar a representada.';

      setError(errorMessage);
    }
  }, [bankOption, isNewBankOptionModalOpen]);

  const handleDeleteBankOption = useCallback(async (id: number, value: string) => {
    try {
      await api.delete(`/banks/${id}`);

      // @ts-ignore
      setBankOptions(prev => prev.filter(e => e.value !== value));
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar a representada.';

      setError(errorMessage);
    }
  }, [])

  return (
    <>
      <CustomSectionTitle>
        Conta Bancária
      </CustomSectionTitle>
      <BankAccountTableHeader>
        <div>
          <strong>Proprietário da Conta</strong>
        </div>
        <div>
          <strong>CPF/CNPJ</strong>
        </div>
        <div>
          <strong>Banco</strong>
        </div>
        <div>
          <strong>Conta Corrente</strong>
        </div>
        <div>
          <strong>Agência</strong>
        </div>
        <div>
          <strong>Operação</strong>
        </div>
        <div>
          <strong>Chave Pix</strong>
        </div>
        <div>
          <strong>Ação</strong>
        </div>
      </BankAccountTableHeader>
      {currentData.map((b) =>
        <BankAccountTableContentWrapper
          key={b.id}
          contactOpened={bankAccountOpened}
        >
          <BankAccountTableContent
            contactOpened={bankAccountOpened}
          >
            <div>
              <Input
                name="min_q"
                noTitle
                width="12.875rem"
                defaultValue={capitalizeContent(b.owner_name)}
                noValueInput
                onBlur={({ target: { value: owner_name } }) =>
                  handleShouldUpdate(b.owner_name, owner_name, {...b, owner_name: capitalizeContent(owner_name) })
                }
              />
            </div>
            <div>
              <Input
                name="min_q"
                noTitle
                width="9rem"
                defaultValue={b.document}
                noValueInput
                onBlur={({ target: { value: document } }) =>
                  handleShouldUpdate(b.document, document, {...b, document })
                }
              />
            </div>
            <div>
              {bankOption !== 'Carregando' ?
                <NoTitleSelect
                  placeholder="Selecione..."
                  customWidth="15rem"
                  data={bankOptions}
                  setValue={() => {}}
                  onChange={(value: string, id: string) => 
                    value === 'new' ?
                      setIsNewBankOptionModalOpen('normal') :
                      handleEditBankAccount({ ...b, bank_id: id })
                  }
                  defaultValue={{
                    value: !!bankOption ? // @ts-ignore
                      bankOption : !!b.bank ? capitalizeContent(b.bank.name) : '',
                    label: !!bankOption ? // @ts-ignore
                      bankOption : !!b.bank ? capitalizeContent(b.bank.name) : '',
                  }}
                /> :
                <></>
              }
            </div>
            <div>
              <Input
                name="min_q"
                noTitle
                width="7.5rem"
                validated={false}
                defaultValue={b.account_number}
                noValueInput
                onBlur={({ target: { value: account_number } }) =>
                  handleShouldUpdate(b.account_number, account_number, {...b, account_number })
                }
              />
            </div>
            <div>
              <Input
                name="min_q"
                noTitle
                width="4.625rem"
                validated={false}
                defaultValue={b.agency}
                noValueInput
                onBlur={({ target: { value: agency } }) =>
                  handleShouldUpdate(b.agency, agency, {...b, agency })
                }
              />
            </div>
            <div>
              <Input
                name="min_q"
                noTitle
                width="4.625rem"
                validated={false}
                defaultValue={b.operation}
                noValueInput
                onBlur={({ target: { value: operation } }) =>
                  handleShouldUpdate(b.operation, operation, {...b, operation })
                }
              />
            </div>
            <div>
              <Input
                name="min_q"
                noTitle
                width="12.5rem"
                validated={false}
                defaultValue={b.pix_key}
                noValueInput
                onBlur={({ target: { value: pix_key } }) =>
                  handleShouldUpdate(b.pix_key, pix_key, {...b, pix_key })
                }
              />
            </div>
            <div>
              <TableActionButton
                onClick={() => setBankAccountOpened(c => !c)}
              >
                {bankAccountOpened ? <CollapseIcon /> : <ExpandIcon />}
              </TableActionButton>
              <TableActionButton
                onClick={() => setDeletingBankAccount(b.id)}
              >
                <TrashIcon />
              </TableActionButton>
            </div>
          </BankAccountTableContent>
          {bankAccountOpened &&
            <BankAccountTableExpandedContent>
              <Input
                name="Paypal"
                width="100%"
                validated={false}
                defaultValue={b.paypal}
                noValueInput
                onBlur={({ target: { value: paypal } }) =>
                  handleShouldUpdate(b.paypal, paypal, {...b, paypal })
                }
              />
            </BankAccountTableExpandedContent>
            }
        </BankAccountTableContentWrapper>
      )}
      <BankAccountTableContentWrapper
        contactOpened={bankAccountOpened}
      >
        <BankAccountTableContent
          contactOpened={bankAccountOpened}
        >
          <div>
            <Input
              name="min_q"
              noTitle
              width="12.875rem"
              validated={false}
              value={capitalizeContent(accountOwner)}
              onChange={(e) => setAccountOwner(e.target.value)}
              onBlur={(e) => setAccountOwner(capitalizeContent(e.target.value))}
            />
          </div>
          <div>
            <Input
              name="min_q"
              noTitle
              width="9rem"
              validated={false}
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
          </div>
          <div>
            {!cleaning && bankOption !== 'CarregandoNew' ? 
              <NoTitleSelect
                placeholder="Selecione..."
                customWidth="15rem"
                data={bankOptions}
                setValue={() => {}}
                onChange={(value: string, id: string) => 
                  value === 'new' ?
                    setIsNewBankOptionModalOpen('new') :
                    setBankNumber(id)
                }
                defaultValue={{
                  value: bankOption,
                  label: bankOption
                }}
              /> :
              <></>
            }
          </div>
          <div>
            <Input
              name="min_q"
              noTitle
              width="7.5rem"
              validated={false}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
          <div>
            <Input
              name="min_q"
              noTitle
              width="4.625rem"
              validated={false}
              value={agencyNumber}
              onChange={(e) => setAgencyNumber(e.target.value)}
            />
          </div>
          <div>
            <Input
              name="min_q"
              noTitle
              width="4.625rem"
              validated={false}
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
            />
          </div>
          <div>
            <Input
              name="min_q"
              noTitle
              width="12.5rem"
              validated={false}
              value={pix}
              onChange={(e) => setPix(e.target.value)}
            />
          </div>
          <div>
            <TableActionButton
              onClick={() => setBankAccountOpened(c => !c)}
            >
              {bankAccountOpened ? <CollapseIcon /> : <ExpandIcon />}
            </TableActionButton>
            <TableActionButton
              disabled={addingBankAccount}
              onClick={handleAddBankAccount}
            >
              {addingBankAccount ? <LoadingIcon /> : <PlusIcon />}
            </TableActionButton>
          </div>
        </BankAccountTableContent>
        {bankAccountOpened &&
          <BankAccountTableExpandedContent>
            <Input
              name="Paypal"
              width="100%"
              validated={false}
              value={paypal}
              onChange={(e) => setPaypal(e.target.value)}
            />
          </BankAccountTableExpandedContent>
          }
      </BankAccountTableContentWrapper>
      <Modal
        title="Editar Bancos"
        isModalOpen={!!isNewBankOptionModalOpen}
        customOnClose={() => setIsNewBankOptionModalOpen('')}
        style={{ width: 471 }}
      >
        <InputContainer style={{ alignItems: 'flex-end' }}>
          <Input
            name="Novo Banco"
            fullW
            value={bankOption}
            onChange={(e) => setBankOption(e.target.value)}
          />
          <TableActionButton
            onClick={handleAddBankOption}
            style={{
              marginLeft: '1rem'
            }}
          >
            <PlusIcon />
          </TableActionButton>
        </InputContainer>
        <DeleteItemsContainer>
          {bankOptions.map((t: DefaultValuePropsWithId) => 
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
                onClick={() => handleDeleteBankOption(t.id, t.value)}
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
      <ConfirmationModal
        category={deletingBankAccount !== -1 ? 'Conta Bancária' : ''}
        action={handleDeleteBankAccount}
        style={{ marginTop: 0 }}
        setIsModalOpen={() => 
          setDeletingBankAccount(-1)
        }
      />
    </>
  );
}
