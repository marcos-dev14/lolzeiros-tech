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
  InputFileContainer,
  MenuAndTableContainer,
  SupplierList,
} from '~styles/components';
import {
  TableFooter,
  TableActionButton,
  TableTitle,
  TableSortingHeader,
} from '~styles/components/tables';

import { Container, TableHeader, Table, Button } from './styles';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { api } from '@/src/services/api';
import { ITemplate } from '@/src/types/main';
import { useAuth } from '@/src/context/auth';
import { isNotEmpty, isOnSafari } from '@/src/utils/validation';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { useProduct } from '@/src/context/product';
import { Modal } from '@/src/components/Modal';
import { MeasureBox } from '@/src/components/MeasureBox';
import { handleOrderResume } from '../index';
import { min, set } from 'date-fns';
import { object } from 'prop-types';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import DownloadFileButton from '@/src/components/DownloadFileButton';

type Order = {
  supplierCode: string;
  message: string;
  clientName: string;
  clientDoc: string;

  billetDiscount: string;
  billetDiscounted: string;
  billetDueDate: string;
  billetNumber: string;
  billetObs: string;
  billetPaidAt: string;
  billetValue: string;
  code: string;
  commissionAuge: string;
  commissionAugePorcent: string;
  commissionCommercial: string;
  commissionCommercialPorcent: string;
};

type ResponseData = {
  result: Order[];
  resultCount: { Success: number; Error: number };
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

export function ImportExcelTitles() {
  const { setCurrentImport } = useProduct();

  const [sortingField, setSortingField] = useState('');
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ITemplate[]>([]);
  const [fetchResponse, setFetchResponse] = useState<boolean>(false);
  const [successResults, setSuccessResults] = useState<number | null>(null);
  const [errorResults, setErrorResults] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Suppliers[]>([]);
  const [supplierSelected, setSupplierSelected] = useState<number | null>(null);

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

  const handleSortingByField = useCallback(
    ({ value, type = 'string' }) => {
      if (sortingField.includes(value)) {
        setFilteredTemplates(templates.reverse());

        sortingField.includes('-desc')
          ? setSortingField((prev) => prev.replace('-desc', ''))
          : setSortingField((prev) => `${prev}-desc`);

        return;
      }

      if (type === 'string') {
        // @ts-ignore
        setFilteredTemplates((prev) => sortByField(prev, value));
      } else {
        // @ts-ignore
        setFilteredTemplates((prev) => sortNumberFields(prev, value));
      }
      setSortingField(value);
    },
    [templates, sortingField]
  );

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

  //   const handleOkClick = async () => {
  //     if (!selectedOrders || !file) {
  //       // Se nenhum pedido estiver selecionado ou o arquivo estiver ausente, não faz nada
  //       console.log(file)
  //       return
  //     }

  //     const formData = new FormData()
  //     formData.append("fileToUpload", file)
  //     formData.append("orderCode", selectedOrders)

  //     try {
  //       setLoading(true)

  //       const { data } = await api.post<ResponseData>(
  //         "/invoicing/import-excel",
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data", // Ajuste o Content-Type conforme necessário
  //           },
  //         }
  //       )

  //       setIsModalOpen(false)
  //       setOrders(data.orders)
  //       setError(data.message)
  //       setFetchResponse(data.success)

  //       fetchTemplates()
  //     } catch (error) {
  //       console.error("Erro no envio do arquivo:", error)

  //       if (isApiError(error)) {
  //         setError(error.response.data.message)
  //       } else {
  //         setError("Erro ao enviar o arquivo. Tente novamente.")
  //       }
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
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
    formData.append('fileToUpload', file);

    try {
      setLoading(true);

      const { data } = await api.post(
        `/invoicingBillets/import-excel/${supplierSelected}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const ResponseData = data as ResponseData;
      console.log(ResponseData.result);
      setOrders(ResponseData.result);
      setSuccessResults(ResponseData.resultCount.Success);
      setErrorResults(ResponseData.resultCount.Error);

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
      //   console.log("suppliers", sortedData)
      setLoading(false);
    } catch (error) {
      console.log('e', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownloadLog = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo.');
      return;
    }
    if (!supplierSelected) {
      setError('Por favor, selecione um fornecedor.');
      return;
    }

    const formData = new FormData();
    formData.append('fileToUpload', file);
    formData.append('download', 'true');

    try {
      setLoading(true);
      setError('Fazendo download do log...');

      const { data } = await api.post(
        `/invoicingBillets/import-excel/${supplierSelected}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob', // para lidar com o retorno do arquivo
        }
      );

      // Criar o link de download
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'relatorio.xlsx'); // Nome do arquivo a ser baixado
      document.body.appendChild(link);
      link.click();

      // Limpar URL temporária
      window.URL.revokeObjectURL(url);

      setError('Download concluído.');
    } catch (error) {
      console.error('Erro no envio do arquivo:', error);
      setError('Erro ao fazer download do arquivo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header route={['Importação de Excel - Títulos']} />
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
                      {/* <SortIcon /> */}
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader dir="" onClick={() => {}}>
                      Nº FORNECEDOR
                      {/* <SortIcon /> */}
                    </TableSortingHeader>
                  </th>
                  <th>
                    <TableSortingHeader dir="" onClick={() => {}}>
                      DATA
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
                      VALOR FATURAMENTO
                      {/* <SortIcon /> */}
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
          setOrders([]);
          setError('');
          setFetchResponse(false);
          setSuccessResults(null);
          setErrorResults(null);
        }}
        style={{
          minWidth: '85rem',
        }}
      >
        <h2 style={{ color: '#0C5DA7', fontSize: '24px' }}>
          Importação de Excel - Títulos
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
              accept=".xlsx"
              onChange={handleFileChange}
              style={{
                width: '100%',
              }}
            />
            <p
              style={{
                fontSize: '16px',
                fontWeight: '400',
                lineHeight: '20px',
                textAlign: 'left',
                whiteSpace: 'nowrap',
              }}
            >
              Baixe o modelo de arquivo.
            </p>
              <DownloadFileButton route="/invoicingBillets/download-excel" />
            <Button
              style={{
                backgroundColor: '#0C5DA7',
                color: 'white',
                padding: '0.6rem 6.2rem',
                height: 'initial',
              }}
              type="submit"
            >
              Enviar
            </Button>
          </InputFileContainer>
        </form>
        <div style={{ display: 'flex' }}>
          {error === '' ? (
            errorResults === null ? null : errorResults === 0 ? (
              <p style={{ color: '#4B4B4B', fontSize: '1rem' }}>
                Você importou uma planilha com {orders.length} registro
                {orders.length === 0 ? '' : 's'} da{' '}
                {getSelectedSupplierName(supplierSelected)}. Todos os pedidos
                foram faturados com sucesso.
              </p>
            ) : (
              <p style={{ color: '#4B4B4B', fontSize: '1rem' }}>
                Você importou uma planilha com {orders.length} registro
                {orders.length === 0 ? '' : 's'} da{' '}
                {getSelectedSupplierName(supplierSelected)}. {successResults}{' '}
                vínculos realizados com sucesso, {errorResults} ainda precisam
                de ajustes.
              </p>
            )
          ) : (
            <p style={{ color: '#4B4B4B', fontSize: '1rem' }}>{error}</p>
          )}

          <Button
            onClick={() => {
              setSupplierSelected(null);
              setOrders([]);
              setError('');
              setFetchResponse(false);
              setIsModalOpen(false);
              successResults && setSuccessResults(null);
              errorResults && setErrorResults(null);
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
        {orders.length !== 0 ? (
          <Table style={{ backgroundColor: '#f5f5f5' }}>
            <colgroup>
              <col span={1} style={{ width: '4%' }} />
              <col span={1} style={{ width: '4%' }} />
              <col span={1} style={{ minWidth: '10rem' }} />
              <col span={1} style={{ minWidth: '6rem' }} />
              <col span={1} style={{ width: '4%' }} />
              <col span={1} style={{ width: '4%' }} />
              <col span={1} style={{ width: '4%' }} />
              <col span={1} style={{ width: '4%' }} />
              <col span={1} style={{ width: '4%' }} />
              <col span={1} style={{ width: '4%' }} />
              <col span={1} style={{ width: '4%' }} />
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
                  RAZÃO SOCIAL
                  {/* <SortIcon /> */}
                </TableSortingHeader>
              </th>
              <th style={{ whiteSpace: 'nowrap' }}>
                <TableSortingHeader dir="" onClick={() => {}}>
                  CNPJ
                  {/* <SortIcon /> */}
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader dir="" onClick={() => {}}>
                  TÍTULO
                  {/* <SortIcon /> */}
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader dir="" onClick={() => {}}>
                  VALOR ORIGINAL
                  {/* <SortIcon /> */}
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader dir="" onClick={() => {}}>
                  VALOR REAL PAGO
                  {/* <SortIcon /> */}
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader dir="" onClick={() => {}}>
                  % COMISSÃO AUGE
                  {/* <SortIcon /> */}
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader dir="" onClick={() => {}}>
                  $ COMISSÃO AUGE
                  {/* <SortIcon /> */}
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader dir="" onClick={() => {}}>
                  % COMISSÃO COMERCIAL
                  {/* <SortIcon /> */}
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader dir="" onClick={() => {}}>
                  $ COMISSÃO COMERCIAL
                  {/* <SortIcon /> */}
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader dir="" onClick={() => {}}>
                  LOG
                  {/* <SortIcon /> */}
                </TableSortingHeader>
              </th>
              {/* <th>AÇÕES</th> */}
            </thead>
            <tbody style={{ backgroundColor: '#F5F5F5' }}>
              {orders?.map((order, index) => (
                <tr key={index}>
                  <td style={{ fontSize: '.8rem', lineHeight: '125%' }}>
                    {order.code}
                  </td>
                  <td
                    style={{
                      fontSize: '.8rem',
                      lineHeight: '125%',
                      maxWidth: '18rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {order.clientName}
                  </td>
                  <td style={{ fontSize: '.8rem', lineHeight: '125%' }}>
                    {order.clientDoc}
                  </td>
                  <td style={{ fontSize: '.8rem', lineHeight: '125%', whiteSpace: 'nowrap' }}>
                    {order.billetNumber}
                  </td>
                  <td style={{ fontSize: '.8rem', lineHeight: '125%' }}>
                    <MeasureBox
                      name="billetValue"
                      title=""
                      noTitle
                      validated
                      measure="R$"
                      defaultValue={parseFloat(order.billetValue)}
                      disabled
                      width="5rem"
                    />
                  </td>
                  <td style={{ fontSize: '.8rem', lineHeight: '125%' }}>
                    <MeasureBox
                      name="billetDiscounted"
                      title=""
                      noTitle
                      validated
                      measure="R$"
                      defaultValue={order.billetDiscounted}
                      disabled
                      width="5rem"
                    />
                  </td>
                  <td style={{ fontSize: '.8rem', lineHeight: '125%' }}>
                    <MeasureBox
                      name="commissionAugePorcent"
                      title=""
                      noTitle
                      validated
                      measure="%"
                      defaultValue={order.commissionAugePorcent}
                      disabled
                      width="3rem"
                    />
                  </td>
                  <td style={{ fontSize: '.8rem', lineHeight: '125%' }}>
                    <MeasureBox
                      name="commissionAuge"
                      title=""
                      noTitle
                      validated
                      measure="R$"
                      defaultValue={order.commissionAuge}
                      disabled
                      width="4rem"
                    />
                  </td>
                  <td style={{ fontSize: '.8rem', lineHeight: '125%' }}>
                    <MeasureBox
                      name="commissionCommercialPorcent"
                      title=""
                      noTitle
                      validated
                      measure="%"
                      defaultValue={order.commissionCommercialPorcent}
                      disabled
                      width="3rem"
                    />
                  </td>
                  <td style={{ fontSize: '.8rem', lineHeight: '125%' }}>
                    <MeasureBox
                      name="commissionCommercial"
                      title=""
                      noTitle
                      validated
                      measure="R$"
                      defaultValue={order.commissionCommercial}
                      disabled
                      width="5rem"
                    />
                  </td>

                  <td style={{ fontSize: '.8rem', lineHeight: '125%' }}>
                    {order.message}
                  </td>
                  {/* <td>
                  <InputContainer style={{ margin: "0", gap: ".4rem" }}>
                    <TableActionButton
                      onClick={() => console.log("Editar", index)}
                    >
                      <EditIcon width={32} height={32} />
                    </TableActionButton>
                    <TableActionButton onClick={() => handleOrderResume(index)}>
                      <ViewIcon width={32} height={32} />
                    </TableActionButton>
                  </InputContainer>
                </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
        <div style={{ alignItems: "center", display: "flex", width: "100%" }}>
          <Button
            style={{
              backgroundColor: '#36C8B1',
              color: 'white',
              margin: 'auto',
              marginTop: '1rem',
              cursor: orders ? 'pointer' : 'not-allowed', // Altera o cursor para indicar se o botão está habilitado
            }}
            onClick={handleDownloadLog} // Remova os parênteses para passar a função corretamente
            disabled={!orders} // Desativa o botão se selectedOrders não estiver definido
          >
            Download do log
          </Button>
        </div>
      </Modal>
    </>
  );
}
