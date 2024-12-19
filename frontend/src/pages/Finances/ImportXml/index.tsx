import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useHistory } from 'react-router';
import { ReactComponent as ViewIcon } from '~assets/view1.svg';
import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as EditIcon } from '~assets/config.svg';
import { ReactComponent as OkIcon } from '~assets/OK-icon.svg';
import { ReactComponent as AlertIcon } from '~assets/alerta-icon.svg';
import { ReactComponent as ArrowLeft } from '~assets/Left.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { SearchBox } from '~components/SearchBox';
import { Pagination } from '~components/Pagination';
import { TableDateBox } from '~components/TableDateBox';

import {
  InputContainer,
  InputFileContainer,
  MenuAndTableContainer,
  SupplierList,
} from '~styles/components';
import {
  TableActionButton,
  TableSortingHeader,
} from '~styles/components/tables';

import { Container, TableHeader, Table, Button } from './styles';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { api } from '@/src/services/api';
import { ITemplate } from '@/src/types/main';
import { useAuth } from '@/src/context/auth';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { useProduct } from '@/src/context/product';
import { Modal } from '@/src/components/Modal';
import { MeasureBox } from '@/src/components/MeasureBox';
import { handleOrderResume } from '../index';

type Order = {
  id: number;
  code: string;
  date: string;
  to_be_invoiced: number;
  shipping_number: string;
  value: number;
  status: string;
};

type ResponseData = {
  message: string;
  code: string;
  date: string;
  shipping_number: string;
  to_be_invoiced: number;
  value: string;
  orders: Order[];
  invoice: number | null;
};

type Suppliers = {
  id: number;
  name: string;
  img: object;
  is_available: boolean;
};

function isApiError(
  error: unknown
): error is { response: { data: { message: string } } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    'data' in (error as any).response
  );
}

export function ImportXml() {
  const { push } = useHistory();
  const { user } = useAuth();

  const { setCurrentImport } = useProduct();

  const [sortingField, setSortingField] = useState('');
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ITemplate[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string>();
  const [fetchResponse, setFetchResponse] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isModalConfirmationOpen, setIsModalConfirmationOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<ResponseData | null>(null);
  const [suppliers, setSuppliers] = useState<Suppliers[]>([]);
  const [supplierSelected, setSupplierSelected] = useState<number | null>(null);
  const [invoicedOrderId, setInvoicedOrderId] = useState<number | null>(null);

  const inputFile = useRef(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSupplierClick = (id: number) => {
    setSupplierSelected(id);
  };

  const getSelectedSupplierName = (id: number | null) => {
    const selectedSupplier = suppliers.find((supplier) => supplier.id === id);
    return selectedSupplier ? selectedSupplier.name : '';
  };

  const handleSearch = useCallback(
    (search: string) => {
      setFilteredTemplates(
        templates.filter((r) =>
          r.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    },
    [templates]
  );

  // const handleSortingByField = useCallback(
  //   ({ value, type = 'string' }) => {
  //     if (sortingField.includes(value)) {
  //       setFilteredTemplates(templates.reverse());

  //       sortingField.includes('-desc')
  //         ? setSortingField((prev) => prev.replace('-desc', ''))
  //         : setSortingField((prev) => `${prev}-desc`);

  //       return;
  //     }

  //     if (type === 'string') {
  //       // @ts-ignore
  //       setFilteredTemplates((prev) => sortByField(prev, value));
  //     } else {
  //       // @ts-ignore
  //       setFilteredTemplates((prev) => sortNumberFields(prev, value));
  //     }
  //     setSortingField(value);
  //   },
  //   [templates, sortingField]
  // );

  // const fetchTemplates = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const {
  //       data: {
  //         data: {
  //           data,
  //           meta: { current_page, last_page },
  //         },
  //       },
  //     } = await api.get(`products/imports?paginated=true&page=${currentPage}`);

  //     setTemplates(data);
  //     setFilteredTemplates(data);

  //     setCurrentPage(current_page);
  //     setLastPage(last_page);
  //   } catch (error) {
  //     console.log('error', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [currentPage]);

  const handleInvoiceClick = async () => {
    if (!selectedOrder || !file) {
      // Se nenhum pedido estiver selecionado ou o arquivo estiver ausente, não faz nada
      console.log(file);
      return;
    }

    const formData = new FormData();
    formData.append('xml', file);
    formData.append('orderCode', selectedOrder);

    try {
      setLoading(true);

      const { data } = await api.post<ResponseData>(
        `/invoicing/import-xml/${supplierSelected}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Ajuste o Content-Type conforme necessário
          },
        }
      );

      setError(data.message);
      setInvoicedOrderId(data.invoice);
    } catch (error) {
      console.error('Erro no envio do arquivo:', error);

      if (isApiError(error)) {
        setError(error.response.data.message);
      } else {
        setError('Erro ao enviar o arquivo. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files?.length > 0) {
      setFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecione um arquivo.');
      return;
    }
    if (!supplierSelected) {
      setError('Por favor, selecione um fornecedor.');
      return;
    }

    const formData = new FormData();
    formData.append('xml', file);

    try {
      setLoading(true);

      const { data } = await api.post(
        `/invoicing/import-xml/${supplierSelected}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const ResponseData = data as ResponseData;

      setOrder(ResponseData);
      setError(ResponseData.message);

      // fetchTemplates();
    } catch (error) {
      console.error('Erro no envio do arquivo:', error);

      if (isApiError(error)) {
        setFetchResponse(false);
        setError(error.response.data.message);
        console.log(error);
      } else {
        setError('Erro ao enviar o arquivo. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchTemplates();
  //   setCurrentImport(null as unknown as ITemplate);
  // }, [fetchTemplates, setCurrentImport]);

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get('/products/suppliers');
      const filteredData = data.data.filter(
        (supplier: { is_available: any }) => supplier.is_available
      );

      const sortedData = filteredData.sort(
        (a: { name: number }, b: { name: number }) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        }
      );

      setSuppliers(sortedData);
      setLoading(false);
    } catch (error) {
      console.log('e', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Header route={['Importação de XML']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          {supplierSelected ? (
            <>
              <TableHeader style={{ gap: '1rem' }}>
                <h1
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#0C5DA7',
                    margin: '0',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {getSelectedSupplierName(supplierSelected)}
                </h1>
                <SearchBox
                  search={handleSearch}
                  onClear={() => setFilteredTemplates(templates)}
                />
                <Button
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    padding: '1.2rem 1.56rem',
                    height: 'initial',
                    width: 'initial',
                    margin: '0',
                  }}
                >
                  Nova Importação
                </Button>
                <Button
                  onClick={() => setSupplierSelected(null)}
                  style={{
                    width: 'fit-content',
                    padding: '1rem',
                  }}
                >
                  <ArrowLeft />
                </Button>
              </TableHeader>
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
                    <TableSortingHeader dir="" onClick={() => {}}>
                      CÓDIGO
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader dir="" onClick={() => {}}>
                      DATA
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th style={{ whiteSpace: 'nowrap' }}>
                    <TableSortingHeader dir="" onClick={() => {}}>
                      VALOR PEDIDO
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader dir="" onClick={() => {}}>
                      SALDO A FATURAR
                      <SortIcon />
                    </TableSortingHeader>
                  </th>
                  <th>AÇÕES</th>
                </thead>
                <tbody></tbody>
              </Table>
            </>
          ) : (
            <SupplierList>
              {suppliers.map((supplier: any) => (
                <li key={supplier.id}>
                  <button
                    onClick={() => {
                      handleSupplierClick(supplier.id);
                    }}
                  >
                    <picture>
                      <source srcSet={supplier.image.WEBP} type="image/webp" />
                      <img src={supplier.image.JPG} alt={supplier.name} />
                    </picture>
                  </button>
                </li>
              ))}
            </SupplierList>
          )}

          <div>{loading ? <LoadingContainer content={''} /> : null}</div>
        </Container>
      </MenuAndTableContainer>
      <Modal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        hasCloseButton
        customOnClose={() => {
          setSupplierSelected(null);
          setOrder(null);
          setFetchResponse(false);
          setIsModalOpen(false);
          setError('');
          setSelectedOrder('');
        }}
        style={{
          minWidth: '85rem',
        }}
      >
        <h2 style={{ color: '#0C5DA7', fontSize: '24px' }}>
          Importação de XML
        </h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: '0.5rem' }}>
          <InputFileContainer>
            <label
              htmlFor="import-file"
              style={{
                backgroundColor: '#E6E6E6',
                padding: '0.6rem 2.5rem',
                height: 'initial',
                borderRadius: '0.5rem',
                whiteSpace: 'nowrap',
                
                fontFamily: 'Roboto',
                fontSize: '1.1rem',
                fontWeight: '400',
                lineHeight: '22.5px',
                textAlign: 'left',
                color: '#4B4B4B',
              }}
            >
              Escolher arquivo
            </label>
            <input
              id="import-file"
              type="file"
              ref={inputFile}
              accept=".xml"
              onChange={handleFileChange}
              style={{
                width: '100%',
              }}
            />
            <Button
              style={{
                backgroundColor: '#0C5DA7',
                color: 'white',
                padding: '0.6rem 6.2rem',
                height: 'initial',
                whiteSpace: 'nowrap',
              }}
              type="submit"
            >
              Carregar Arquivo
            </Button>
            {selectedOrder && (
              <Button
                style={{
                  backgroundColor: '#0C5DA7',
                  color: 'white',
                  padding: '0.6rem 6.2rem',
                  height: 'initial',
                }}
                onClick={handleInvoiceClick}
              >
                Faturar
              </Button>
            )}
          </InputFileContainer>
        </form>
        <div style={{ display: 'flex' }}>
          {error}
          <Button
            onClick={() => {
              setSupplierSelected(null);
              setOrder(null);
              setError('');
              setFetchResponse(false);
              setIsModalOpen(false);
              setError('');
              setSelectedOrder('');
            }}
            style={{
              backgroundColor: '##E6E6E6',
              color: '#5F5F5F',
              padding: '0.6rem 2.2rem',
              height: 'initial',
              width: '12.4rem',
            }}
          >
            Nova Importação
          </Button>
        </div>
        {order && (
          <Table
            style={{
              minWidth: '100%',
            }}
          >
            <colgroup>
              <col span={1} style={{ width: '4%' }} />
              <col span={1} style={{ width: '20%' }} />
              <col span={1} style={{ width: '20%' }} />
              <col span={1} style={{ width: '20%' }} />
              <col span={1} style={{ width: '4%' }} />
            </colgroup>
            <thead>
              <th>
                <TableSortingHeader dir="" onClick={() => {}}>
                  CÓDIGO
                  {/* <SortIcon /> */}
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader dir="" onClick={() => {}}>
                  CNPJ
                  {/* <SortIcon /> */}
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader dir="" onClick={() => {}}>
                  DATA PEDIDO
                  {/* <SortIcon /> */}
                </TableSortingHeader>
              </th>
              <th style={{ whiteSpace: 'nowrap' }}>
                <TableSortingHeader dir="" onClick={() => {}}>
                  VALOR PEDIDO
                  {/* <SortIcon /> */}
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader dir="" onClick={() => {}}>
                  SALDO A FATURAR
                  {/* <SortIcon /> */}
                </TableSortingHeader>
              </th>
              <th>AÇÕES</th>
            </thead>
            <tbody style={{ backgroundColor: '#F5F5F5' }}>
              {order.orders?.map((order) => (
                <tr>
                  <td style={{ fontSize: '1rem', lineHeight: '125%' }}>
                    {order.code}
                  </td>
                  <td style={{ fontSize: '1rem', lineHeight: '125%' }}>
                    {order.shipping_number}
                  </td>
                  <td style={{ fontSize: '1rem', lineHeight: '125%' }}>
                    <TableDateBox
                      name=""
                      title=""
                      width="7.5rem"
                      // @ts-ignore
                      showTime={false}
                      date={order.date ? order.date : ''}
                      onDateSelect={() => {}}
                      disabled
                      validated={false}
                    />
                  </td>
                  <td style={{ fontSize: '1rem', lineHeight: '125%' }}>
                    <MeasureBox
                      name="value"
                      title=""
                      measure="R$"
                      defaultValue={order?.value}
                      disabled
                    />
                  </td>
                  <td style={{ fontSize: '1rem', lineHeight: '125%' }}>
                    <MeasureBox
                      name="value"
                      title=""
                      measure="R$"
                      defaultValue={order?.to_be_invoiced?.toFixed(2)}
                      disabled
                    />
                  </td>
                  <td>
                    <InputContainer style={{ margin: '0', gap: '1rem' }}>
                      <TableActionButton
                        onClick={() => handleOrderResume(order.id)}
                      >
                        <ViewIcon width={32} height={32} />
                      </TableActionButton>
                      {/* <TableActionButton
                  onClick={() => console.log('Editar', index)}
                  disabled
                >
                  <EditIcon width={32} height={32} />
                </TableActionButton> */}
                      <input
                        type="radio"
                        checked={order.code === selectedOrder}
                        onChange={() => setSelectedOrder(order.code)}
                      />
                    </InputContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <div style={{ alignItems: 'center', display: 'flex', width: '100%' }}>
          <Button
            style={{
              backgroundColor: '#36C8B1',
              color: 'white',
              margin: 'auto',
              marginTop: '1rem',
              cursor: selectedOrder ? 'pointer' : 'not-allowed', // Altera o cursor para indicar se o botão está habilitado
            }}
            onClick={() => push(`/finances/edit/${invoicedOrderId}`)}
            disabled={!invoicedOrderId} // Desabilita o botão se nenhum pedido estiver selecionado
          >
            Ver Faturamento
          </Button>
        </div>
      </Modal>
      {/* <Modal
        isModalOpen={isModalConfirmationOpen}
        setIsModalOpen={setIsModalConfirmationOpen}
        hasCloseButton
        style={{
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {fetchResponse ? (
          <OkIcon style={{ width: '100px', height: '100px' }} />
        ) : (
          <AlertIcon
            style={{ width: '100px', height: '100px', fill: '#FF0000' }}
          />
        )}
        <h2>{error}</h2>
      </Modal> */}
    </>
  );
}
