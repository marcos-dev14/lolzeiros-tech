import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FormInput } from '@/src/components/FormInput';


import { ReactComponent as ViewIcon } from '~assets/view1.svg';
import { ReactComponent as EditIcon } from '~assets/edit1.svg';
import { ReactComponent as ReportIcon } from '~assets/report.svg';
import { ReactComponent as CloseIcon } from '~assets/trash.svg';
import { ReactComponent as BagXIcon } from '~assets/bagx1.svg';
import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';
import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';
import { ReactComponent as PdfIcon } from '~assets/pdf-ico.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Pagination } from '~components/Pagination';
import { TableDateBox } from '~components/TableDateBox';
import { SearchBox } from '~components/SearchBox';
import { MeasureBox } from '@/src/components/MeasureBox';

import { Container, Table, TableHeader, Button } from './styles';
import { InputContainer, MenuAndTableContainer, SectionTitle } from '~styles/components';

import {
  TableFooter,
  TableActionButton,
  TableTitle,
  TableSortingHeader
} from '~styles/components/tables';

import { api } from '~api';

import { MainProduct } from '~types/main';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { emptyFieldRegex, isNotEmpty, isOnSafari } from '~utils/validation';
import { useProduct } from '@/src/context/product';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { CancelButton, EditButton, GoBackButton } from '../Edit/styles';
import { Modal } from '@/src/components/Modal';
import { useOrder } from '@/src/context/order';
import { Order, OrderHeader } from '@/src/components/OrderHeader/OrderHeader';
import { DateBox } from '@/src/components/DateBox';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';


interface Invoice {
  id: number;
  number: string;
  issuance_date: string;
  value: string;

}

interface Discount {

  auge: string;
  commercial: string;

}

interface InvoiceData {
  id: number;
  code: string;
  shipping_company_name: string;
  total_value: string;
  created_at: string;
  buyer_email: string;
  buyer_cellphone: string;

  supplier: {
    name: string;
    document: string;
  }
  client: {
    name: string;
    company_name: string;
    document: string;
  };
  seller: {
    name: string;
    cellphone: string;
    email: string;
  }
  invoice: Invoice[]
}

export const formatDateString = (originalDateString: any) => {
  const originalDate = new Date(originalDateString);

  const year = originalDate.getFullYear();
  const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
  const day = originalDate.getDate().toString().padStart(2, '0');

  return `${day}-${month}-${year}`;
}

export function Invoices() {
  const { push, goBack } = useHistory();
  const { id } = useParams<{ id: string }>();

  const [currentOrder, setCurrentOrder] = useState<InvoiceData>();
  const [teste, setTeste] = useState<Invoice[]>([]);
  const [fullCampaigns, setFullCampaigns] = useState<Invoice[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Invoice[]>();
  const [deleteError, setDeleteError] = useState(false);
  const [deletId, setDeletId] = useState<number>();
  const [dataOrder, setdataOrder] = useState<Order>()



  const [currentPage, setCurrentPage] = useState<number>(1);
  const [discount, setDiscount] = useState<Discount>();
  const [noInvoiceValue, setNoInvoiceValue] = useState<string>();

  const [lastPage, setLastPage] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [att, setAtt] = useState(false);
  const { orderData, setOrderData } = useOrder();
  const [valorAFaturar, setValorAFaturar] = useState();



  const [sortingField, setSortingField] = useState('');

  const [hasSearch, setHasSearch] = useState(false);

  const [updatingAvailability, setUpdatingAvailability] = useState(-1);

  const availabilityOptions = useMemo(() => [
    { value: 'Disponível', label: 'Disponível' },
    { value: 'Indisponível', label: 'Indisponível' },
    { value: 'Pré-venda', label: 'Pré-venda' },
    { value: 'Fora de linha', label: 'Fora de linha' }
  ], []);

  const handleSearch = useCallback((search: string) => {
    const searchString = search.toLowerCase();

    const filtrado = fullCampaigns.filter((c) => {
      if (c.number !== null) return c.number && c.number.toString().includes(searchString);
      else return null
    })
    if (searchString) {
      setTeste(filtrado);
      setFilteredCampaigns(filtrado.slice(0, 10));
      setLastPage(Math.ceil(filtrado.length / 10))
    }
    setHasSearch(isNotEmpty(search));
  }, [fullCampaigns]);

  const handleClearSearch = () => {
    setFilteredCampaigns(fullCampaigns.slice(0, 10));
    setLastPage(Math.ceil(fullCampaigns.length / 10));
    setHasSearch(false);
  };

  const newInvoices = async () => {
    try {
      setLoading(true);
      const response = await api.post(
        `invoices/create/${id}`);

      // eslint-disable-next-line no-restricted-globals
      setLoading(false)
      setOrderData(null)
      setAtt(!att);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição:', error);

      throw new Error('Erro na requisição');
    }
  };



  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        setLoading(true);
        const { data } = await api.get(`invoices/order/${id}`);
        setCurrentOrder(data.order);
        setValorAFaturar(data.noInvoiceValue);
        setdataOrder(data.order)
        setNoInvoiceValue(data.noInvoiceValue)
        setDiscount(data.discount)
        setFullCampaigns(data.order.invoice);
        setFilteredCampaigns(data.order.invoice.slice(0, 10));
        setLastPage(Math.ceil(data.order.invoice.length / 10));
        setIsModalOpen(false)
        setDeleteError(false);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(id);
  }, [id, att]);

  const deleteIdFunc = (invoiceid: number) => {
    setDeletId(invoiceid)
    setIsModalOpen(true)
  }

  const pdfExport = async (id: number) => {
    try {
      const response = await api.get(`invoices/pdf/export/invoice/${id}`, { responseType: 'arraybuffer' });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'Financeiro'
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const deletInvoice = useCallback(async () => {
    try {
      await api.delete(`invoices/${deletId}`);
      setAtt((prevAtt) => !prevAtt);
    } catch (error) {
      setDeleteError(true);
      console.error('Error fetching data:', error);
    }
  }, [deletId]);


  const deletModalError = () => {
    setIsModalOpen(false);
    setDeleteError(false);
  }




  const handlePagination = async (page: number) => {
    try {
      setLoading(true);
      const start = (page - 1) * 10;
      const end = start + 10;
      const slicedCampaigns = hasSearch ? teste?.slice(start, end) : fullCampaigns?.slice(start, end);

      // @ts-ignore

      setFilteredCampaigns(slicedCampaigns);
      setCurrentPage(page);
    } catch (error) {
      console.log('Error during pagination:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if (sortingField.includes(value)) {
      setFilteredCampaigns(filteredCampaigns?.reverse());

      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if (type === 'string')
      // @ts-ignore

      setFilteredCampaigns(prev => sortByField(prev, value));
    else {
      // @ts-ignore

      setFilteredCampaigns(prev => sortNumberFields(prev, value));
    }
    setSortingField(value);
  }, [filteredCampaigns, sortingField]);

  const usingSafari = useMemo(() => isOnSafari, []);
  const formRef = useRef<FormHandles>(null);

  const formattedData = useMemo(() => ({
    order_date: new Date().toISOString(),
    auge_register: new Date().toISOString()
  }), []);


  return (
    <>
      <Header route={['Financeiro']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          {
            loading ?
              <LoadingContainer
                content="os dados"
              />
              :
              <>
                <Form ref={formRef} onSubmit={() => { }} initialData={formattedData}>
                  {
                    // @ts-ignore

                    <OrderHeader id={id} />
                  }


                </Form>
                <TableHeader style={{ marginTop: '2rem', borderBottom: '2px solid #3699CF', borderTop: '2px solid #3699CF', padding: '1rem' }}>
                  <TableTitle fontSize="2rem" lineHeight="2rem" style={{ margin: 'auto', color: '#3699CF' }} >
                    <h3>Faturamentos:</h3>
                  </TableTitle>

                  <SearchBox
                    search={handleSearch}
                    placeholder='Digite a NF-e...'
                    onClear={() => {
                      handleClearSearch()
                    }}
                  />

                  <EditButton
                    type="button"
                    className="Edit"
                    onClick={() => newInvoices()}
                    disabled={loading || valorAFaturar === 0}
                  >
                    <p>Faturamento Automático</p>
                  </EditButton>
                  <div>
                    <EditButton
                      className="newProduct"
                      onClick={() => push(`/finances/new/${currentOrder?.id}`)}
                      disabled={loading || valorAFaturar === 0}
                    >
                      Novo Faturamento
                    </EditButton>
                  </div>
                </TableHeader>


                <Table isOnSafari={usingSafari}>
                  <colgroup>
                    <col span={1} style={{ width: '9%' }} />
                    <col span={1} style={{ width: '12%' }} />
                    <col span={1} style={{ width: '26%' }} />
                    <col span={1} style={{ width: '13%' }} />
                    <col span={1} style={{ width: '12%' }} />
                    <col span={1} style={{ width: '12%' }} />
                    <col span={1} style={{ width: '12%' }} />
                    <col span={1} style={{ width: '4%' }} />
                  </colgroup>
                  <thead>
                    <th>
                      <TableSortingHeader
                        dir={sortingField.includes('number') ? sortingField : 'asc'}
                        onClick={() => handleSortingByField({ value: 'number' })}
                      >
                        NF-e
                        <SortIcon />
                      </TableSortingHeader>
                    </th>
                    <th>
                      <TableSortingHeader
                        dir={sortingField.includes('issuance_date') ? sortingField : 'asc'}
                        onClick={() => handleSortingByField({ value: 'issuance_date' })}
                      >
                        Data
                        <SortIcon />
                      </TableSortingHeader>
                    </th>

                    <th>
                      <TableSortingHeader
                        dir={sortingField.includes('client') ? sortingField : 'asc'}
                      >
                        Cliente
                      </TableSortingHeader>
                    </th>
                    <th>
                      <TableSortingHeader
                        dir={sortingField.includes('category') ? sortingField : 'asc'}
                      // onClick={() => handleSortingByField({ value: 'category' })}
                      >
                        CNPJ

                      </TableSortingHeader>
                    </th>
                    <th>
                      <TableSortingHeader
                        dir={sortingField.includes('total_value') ? sortingField : 'asc'}
                      >
                        Valor Pedido
                      </TableSortingHeader>
                    </th>
                    <th>
                      <TableSortingHeader
                        dir={sortingField.includes('value') ? sortingField : 'asc'}
                        onClick={() => handleSortingByField({ value: 'value' })}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Valor Faturamentos
                        <SortIcon />
                      </TableSortingHeader>
                    </th>
                    <th>
                      Ações
                    </th>
                  </thead>
                  <tbody>
                    {filteredCampaigns?.map(p => (

                      <tr key={p.id}>
                        <td>
                          {p.number}
                        </td>
                        <td
                          style={{ padding: '0 0.625rem' }}
                        >
                          <TableDateBox
                            name=""
                            title=""
                            width="7.5rem"
                            showTime={false}
                            // @ts-ignore 
                            date={p.issuance_date ?? p.created_at}
                            disabled
                            validated={false}
                          />
                        </td>
                        <td>
                          {currentOrder?.client.company_name ?? currentOrder?.client.name }
                        </td><td style={{ whiteSpace: 'nowrap' }}>
                          {currentOrder?.client.document}
                        </td>
                        <td>
                          <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                            <MeasureBox
                              name="etaSupplier"
                              title=""
                              noTitle
                              validated
                              measure="R$"
                              defaultValue={currentOrder?.total_value}
                              disabled
                            />
                          </TableTitle>
                        </td>
                        <td style={{ padding: '0 0.625rem' }}>
                          <MeasureBox
                            name="etaSupplier"
                            title=""
                            noTitle
                            validated
                            measure="R$"
                            defaultValue={p.value}
                            disabled
                          />
                        </td>
                        <td>
                          <div>
                            <TableActionButton
                              onClick={() => push(`/finances/edit/${p.id}`)}
                            >
                              <EditIcon />
                            </TableActionButton>
                            <TableActionButton
                              onClick={() => pdfExport(p.id)}
                            >
                              <PdfIcon />
                            </TableActionButton>
                            <TableActionButton
                              onClick={() => deleteIdFunc(p.id)}
                            >
                              <CloseIcon />
                            </TableActionButton>
                          </div>
                        </td>
                        <Modal
                          isModalOpen={isModalOpen}
                          setIsModalOpen={setIsModalOpen}
                          customOnClose={() => {
                            setIsModalOpen(false)
                          }}
                        >
                          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Deletar Faturamento?</h2>
                          {
                            deleteError &&
                            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'red' }}>
                              Erro ao deletar Faturamento!
                            </h2>
                          }
                          <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto' }}>
                            <EditButton
                              onClick={() =>
                                // @ts-ignore

                                deletInvoice()}                  >
                              Confirmar
                            </EditButton>
                            <CancelButton onClick={() => deletModalError()}>
                              Cancelar
                            </CancelButton>
                          </div>
                        </Modal>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <TableFooter>
                  <p />
                  {!hasFiltered &&
                    <Pagination
                      currentPage={currentPage}
                      lastPage={lastPage}
                      setCurrentPage={handlePagination}
                    />
                  }
                </TableFooter>
              </>
          }
        </Container>
      </MenuAndTableContainer>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
    </>
  );
}
