import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useHistory, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import Dropzone from 'react-dropzone';

import { ReactComponent as PlusIcon } from '~assets/plus.svg'
import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg'
import { ReactComponent as UploadIcon } from '~assets/upload_black.svg';
import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { FormSelect } from '~components/FormSelect';
import { CustomSelect as Select } from '~components/Select';
import { NoTitleSelect } from '~components/NoTitleSelect';
import { Modal } from '~components/Modal';
import { Input } from '~components/Input';
import { Pagination } from '~components/Pagination';
import { TableSearchBox } from '~components/TableSearchBox';
import { SuccessModal } from '~components/SuccessModal';

import {
  MenuAndTableContainer,
  SectionTitle,
  InputContainer
} from '~styles/components';

import{
  TableTitle,
  TableActionButton,
  TableSortingHeader
} from '~styles/components/tables';

import { Container, Button, AddButton, GoBackButton, Table, ReportMessage } from './styles';
import { DefaultValueProps, Supplier, ITemplate, LocationState } from '~types/main';

import { api } from '~api';

import { emptyFieldRegex, isNotEmpty, isOnSafari } from '~utils/validation';
import { sortByField, sortNumberFields } from '~utils/sorting';

import { baseColumnOptions, customReports } from '@/src/data';
import { ErrorModal } from '@/src/components/ErrorModal';
import { useProduct } from '@/src/context/product';

type TemplateData = {
  id: string;
  template: string;
  supplier: string;
  initial_line: string;
  new_register: string;
  fieldName: string;
  column: string;
}

type TemplateLine = {
  id: number;
  field_label: string;
  field_name: string;
  column: string;
}

export type ResultsData = {
  line: string;
  column_reference: string;
  column_name: string;
  product_reference: string | null;
  status: 'SUCESSO' | 'ERRO';
  message: string;
}

export function NewImport() {
  const { goBack } = useHistory();
  const { currentImport } = useProduct();
  const { state } = useLocation<LocationState>();
  const formRef = useRef<FormHandles>(null);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentReportMessage, setCurrentReportMessage] = useState<number>(-1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [suppliers, setSuppliers] = useState<DefaultValueProps[]>([] as DefaultValueProps[]);
  const [currentTemplate, setCurrentTemplate] = useState<ITemplate>({} as unknown as ITemplate);
  const [supplierName, setSupplierName] = useState('');
  const [templates, setTemplates] = useState<DefaultValueProps[]>([]);
  const [fieldNames, setFieldNames] = useState<DefaultValueProps[]>([]);
  const [baseFieldNames, setBaseFieldNames] = useState<DefaultValueProps[]>([]);
  const [filterByStatus, setFilterByStatus] = useState('');
  const [results, setResults] = useState<ResultsData[]>(customReports);
  const [sortingField, setSortingField] = useState('');
  const [isFileImported, setIsFileImported] = useState(false);
  const [canImportBeReversed, setCanImportBeReversed] = useState(false);
  const [filteredResults, setFilteredResults] = useState<ResultsData[]>([]);
  const [templateLines, setTemplateLines] = useState<TemplateLine[]>([]);
  const [templateName, setTemplateName] = useState(() => !!currentImport ? currentImport.name : '');
  const [initialLine, setInitialLine] = useState('');
  const [search, setSearch] = useState('');
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(-1);
  const [file, setFile] = useState('');
  const [mousePosition, setMousePosition] = useState(0);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [initialData, setInitialData] = useState({});
  
  const fileRef = useRef(null);

  const fullColumnOptions = useMemo(() => {
    const formattedOptions: DefaultValueProps[] = [];
    baseColumnOptions.forEach(
      (b: DefaultValueProps) => baseColumnOptions.forEach(
        (c: DefaultValueProps) => formattedOptions.push(
          { value: b.value + c.value, label: b.value + c.value }
          ))
    );

    return [...baseColumnOptions, ...formattedOptions];
  }, []);

  const handleInitialData = useCallback(async () => {
    if(!currentImport) return {};

    const supplier = !!currentImport.supplier ? currentImport.supplier.name : ''; 

    setInitialLine(initialLine ?? '')
    setResults(currentImport.reports);
    setFilteredResults(currentImport.reports);
    setIsFileImported(true);
    setCurrentTemplate({...currentImport, value: currentImport.name})

    setCanImportBeReversed(currentImport.new_register === 'yes');
    
    const {
      data: {
        data: { columns }
      }
    } = await api.get(`/products/imports/${currentImport.id}`);

    setTemplateLines(columns);
    // @ts-ignore
    columns.forEach(c => {
      setColumnOptions(prev => prev.filter(co => co.value !== c.column));
      setFieldNames(prev => prev.filter(fn => fn.value !== c.field_name));
    });

    setInitialData({ supplier });
    // supplier
    // new_register
    // initialLine - setState
  }, [currentImport, initialLine]);

  const newRegisterDefaultValue = useMemo(() => {
    if(!currentImport) return { value: '', label: '' }
    const new_register =
      currentImport.new_register === 'yes' ? 'Sim' :
        currentImport.new_register === 'no' ? 'Não' :
      'Preços e Estoques'

    return { value: new_register, label: new_register }
  }, [currentImport]);

  const supplierDefaultValue = useMemo(() => {
    if(!currentImport) return { value: '', label: '' }

    const currentSupplier = !!currentImport.supplier ? currentImport.supplier.name : ''; 
    setSupplierName(currentSupplier);

    return { value: currentSupplier, label: currentSupplier }
  }, [currentImport]);

  const openDialog = useCallback(() => {
    if (!!fileRef.current) {
      // @ts-ignore
      fileRef.current.open();
    }
  }, []);

  const validator = useCallback((file) => {
    const { type } = file;
    
    const acceptedExtensions = [
      'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'xlsx',
      'xls',
      'application/vnd.ms-excel'
    ];

    const[, extension] = type.split('/')

    if(!acceptedExtensions.includes(extension)) {
      return {
        code: "name-too-large",
        message: `Name is larger than characters`
      };
    }

    return null;
  }, []);

  const [columnOptions, setColumnOptions] = useState<DefaultValueProps[]>(fullColumnOptions);

  const handleNewTemplate = useCallback(async (value: string) => {
    try {
      const upload = new FormData();

      upload.append('name', value);

      const {
        data: {
          data
        }
      } = await api.post('/products/imports', upload);

      setCurrentTemplate(data);

    } catch (e) {
      // @ts-ignore
      setError(e.response.data.message)
      console.log('e', e);
    }
  }, []);

  const handleTemplateSelect = useCallback(async (value: string) => {
    try {
      setTemplateName('');
      setTemplateLines([]);
      setFieldNames(baseFieldNames);  
      setColumnOptions(fullColumnOptions);

      if(value === 'new') {
        setIsNewTemplateModalOpen(true);
        return;
      }

      // @ts-ignore
      const newTemplate = templates.find(t => t.value === value)
      
      setTemplateName(value);
      setCurrentTemplate(newTemplate as unknown as ITemplate);
      
      // @ts-ignore
      const { data: { data } } = await api.post(`/products/imports/${newTemplate!.id}/copy`);

      setCurrentTemplate(prev => ({...prev, id: data.id }));

      const {
        data: { data: { columns } }
      } = // @ts-ignore
      await api.get(`/products/imports/${data.id}`);

      setTemplateLines(columns);
      setIsFileImported(false);
      setResults([]);
      setFilteredResults([]);
      // @ts-ignore
      columns.forEach(c => {
        setColumnOptions(prev => prev.filter(co => co.value !== c.column));
        setFieldNames(prev => prev.filter(fn => fn.value !== c.field_name));
      });
      // @ts-ignore
      formRef.current?.setFieldValue('column', { value: '', label: '' });
    } catch(e) {
      console.log('e', e);
      // @ts-ignore
      setError(e.response.data.message)
    }
  }, [templates, baseFieldNames, fullColumnOptions]);

  const fetchTemplates = useCallback(async () => {
    try {
      const [suppliersResponse, templatesResponse, columnsResponse] =
        await Promise.all([
          api.get('/products/suppliers', {
            params: {
              sortBy: 'name',
              sortDirection: 'asc'
            }
          }),
          api.get('products/imports'),
          api.get('/products/imports/columns/configurations')
        ])
      const {
        data: {
          data
        }
      } = suppliersResponse;

      const {
        data: {
          data: templateData
        }
      } = templatesResponse;

      const {
        data: {
          data: { columns: columnsData }
        }
      } = columnsResponse;

      setSuppliers(data.map((s: Supplier) => ({ id: s.id!, value: s.name!, label: s.name! })));
      setTemplates([
        { value: 'new', label: 'Novo Modelo' },
        ...templateData.map((s: ITemplate) => ({ id: s.id, value: s.name, label: s.name }))]
      );
      // @ts-ignore
      setBaseFieldNames(Object.entries(columnsData).map(c => ({ value: c[0], label: c[1] })))
      // @ts-ignore
      setFieldNames(Object.entries(columnsData).map(c => ({ value: c[0], label: c[1] })))
      // setTemplates(templatesResponse);
      setLastPage(1);
    } catch (error) {
      console.log('error', error)
    }
  }, [currentPage])

  const schema = useMemo(() => 
    Yup.object().shape({
      name: Yup.string().required().matches(emptyFieldRegex),
      supplier_id: Yup.number().required(),
      initial_line: Yup.string().required().matches(emptyFieldRegex),
      new_register: Yup.string().required().matches(emptyFieldRegex),
  }), []);

  const handleAddNewTemplate = useCallback(async (new_register: string) => {
    try{
      setIsAddingTemplate(true);
      // @ts-ignore
      const data: TemplateData = formRef.current?.getData();
      const selectedTemplate = formRef.current?.getFieldValue('template');
      const newTemplate = templates.find(t => t.value === selectedTemplate)
      
      // @ts-ignore
      const { id: supplier_id } = suppliers.find(s => s.value === data.supplier)
      
      const formattedData = {
        name: templateName,
        supplier_id,
        initial_line: initialLine,
        new_register
      };

      await schema.validate(formattedData);

      // @ts-ignore
      const currentId = !!currentTemplate ? currentTemplate.id : newTemplate.id!;

      const {
        data: {
          data: updatedTemplate
        }
      } = await api.put(`/products/imports/${currentId}`, formattedData)

      setCurrentTemplate({...updatedTemplate, value: updatedTemplate.name });
    } catch(err) {
      console.log('err', err);
      // @ts-ignore
      setError(err.response.data.message)
    } finally {
      setIsAddingTemplate(false);
    }
  }, [
      currentTemplate,
      suppliers,
      templates,
      templateName,
      initialLine,
      formRef,
      schema
    ]);

  const handleAddColumn = useCallback(async () => {
    try {
      const fieldName = formRef.current?.getFieldValue('fieldName');
      const column = formRef.current?.getFieldValue('column');
      
      const requestBody = {};
      // @ts-ignore
      requestBody[fieldName] = column;

      const {
        data: { data }
      } = await api.post(`/products/imports/${currentTemplate.id}/columns`, requestBody);
      
      setTemplateLines(data);
      setColumnOptions(prev => prev.filter(c => c.value !== column));
      setFieldNames(prev => prev.filter(c => c.value !== fieldName));
    } catch(e) {
      // @ts-ignore
      setError(e.response.data.message)
      console.log('e', e);
    }
  }, [currentTemplate]);

  const handleDeleteColumn = useCallback(async (id: number, value: string, label: string, column: string) => {
    try {
      setIsDeleting(id);

      await api.delete(`/products/imports/${currentTemplate.id}/columns/${id}`);

      setTemplateLines(prev => prev.filter(t => t.id !== id));
      setFieldNames(prev => [{ value, label },...prev])
      setColumnOptions(prev => [{ value: column, label: column },...prev])
      
    } catch(e) {
      // @ts-ignore
      setError(e.response.data.message)
      console.log('e', e);
    } finally {
      setIsDeleting(-1)
    }
  }, [currentTemplate]);

  const handleRepeatImport = useCallback(async (id: number) => {
    try {
      setIsImporting(true);
      const {
        data: { data }
      } = await api.post(`/products/imports/${currentTemplate.id}/copy`);

      setCurrentTemplate(prev => ({...prev, id: data.id }))

      setIsFileImported(false)
    } catch(e) {
      // @ts-ignore
      setError(e.response.data.message)
      console.log('e', e);
    } finally {
      setIsImporting(false);
    }
  }, [currentTemplate]);
  
  const handleRetryImport = useCallback(async (file) => {
    try {
      setIsImporting(true);
      const { data: { data } } = await api.post(`/products/imports/${currentTemplate!.id}/copy`);

      setCurrentTemplate(prev => ({...prev, id: data.id }));

      const {
        data: { data: { columns } }
      } = // @ts-ignore
      await api.get(`/products/imports/${data.id}`);

      setTemplateLines(columns);
      setIsFileImported(false);
      setResults([]);

      setFilteredResults([]);
      // @ts-ignore
      columns.forEach(c => {
        setColumnOptions(prev => prev.filter(co => co.value !== c.column));
        setFieldNames(prev => prev.filter(fn => fn.value !== c.field_name));
      });

      const url = URL.createObjectURL(file);

      const newFile =
        await fetch(url).then(r => r.blob());
      
      const upload = new FormData();

      upload.append('file', newFile);

      const {
        data: {
          data: { reports }
        }
      } = await api.post(`/products/imports/${data.id}/upload`, upload);

      setResults(reports);

      setFilteredResults(reports);
      // column_reference
      // column_name
      // product_reference

      setIsFileImported(true);
      setMessage('Enviado com sucesso');
    } catch(e) {
      console.log('e', e);
    } finally {
      setIsImporting(false);
    }
  }, [currentTemplate])

  const handleFileImport = useCallback(async (file) => {
    try {
      setIsImporting(true);

      const url = URL.createObjectURL(file);

      const newFile =
        await fetch(url).then(r => r.blob());
      const upload = new FormData();

      upload.append('file', newFile);

      const {
        data: {
          data: { reports }
        }
      } = await api.post(`/products/imports/${currentTemplate.id}/upload`, upload);

      setResults(reports);
      setFilteredResults(reports);
      // column_reference
      // column_name
      // product_reference

      setIsFileImported(true);
      setMessage('Enviado com sucesso');
    } catch (e) {
      // @ts-ignore
      console.log('e', e.response.data.message);
      // @ts-ignore
      const { message } = e.response.data;

      if(message.includes('Adicione'))
        alert(message);

      if(message === 'Cannot upload to this import, create a new import')  
        try {
         await handleRetryImport(file);
        }
        catch(e) {       
          // @ts-ignore
          setError(e.response.data.message)
        } finally {
          setIsImporting(false);
        }
    } finally {
      setIsImporting(false);
    }
  }, [currentTemplate, handleRetryImport]);

  const handleRevertImport = useCallback(async () => {
    try {
      if(!currentImport) return;
      setIsReverting(true);
      await api.delete(`/products/imports/${currentImport.id}/rollback`);

      setCanImportBeReversed(false);
    } catch(e) {
      // @ts-ignore
      setError(e.response.data.message)
    } finally {
      setIsReverting(false);
    }
  }, [currentImport])

  const onDrop = useCallback(async (acceptedFiles) => {
    // Do something with the files
    try{      
      const file = acceptedFiles[0];
      // const file =
        // await fetch(url).then(r => r.blob() as unknown as PDFFile);

      setFile(file);
      await handleFileImport(file);
    } catch(e) {
      console.log('e', e)
    }
  }, [handleFileImport]);

  const handleSearchByRef = useCallback(() => {
    if(!search) return;

    setFilteredResults(
      results.filter((r) =>
        isNotEmpty(search) ?
          r.product_reference?.includes(search) && r.status === filterByStatus :
          r.status === filterByStatus
        )
    );
  }, [filterByStatus, search, results]);

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if(sortingField.includes(value)) {
      setTemplateLines(templateLines.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if(type === 'string')
      setTemplateLines(prev => sortByField(prev, value));
    else {
      setTemplateLines(prev => sortNumberFields(prev, value));
    }
    setSortingField(value);
  }, [templateLines, sortingField]);

  useEffect(() => {
    handleSearchByRef();
  }, [filterByStatus]);

  useEffect(() => {
    if(!search && !!filterByStatus) {
      setFilteredResults(results.filter(r => r.status === filterByStatus));
      return;
    }
  }, [filterByStatus, results, search]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);
  
  useEffect(() => {
    if(!!currentImport)
      handleInitialData();
  }, [currentImport]);

  const usingSafari = useMemo(() => isOnSafari, []);

  return (
    <>
      <Header route={["Loja Online", "Importação dos Produtos", "Editar Importação dos Produtos"]} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <SectionTitle>
            Importação do Produto
          </SectionTitle>
          <Form ref={formRef} onSubmit={() => {}}>
            <InputContainer>
            {templateName !== 'Carregando...' ?
              <FormSelect
                name="template"
                title="Template"
                customWidth="10.625rem"
                onChange={(value: string) => handleTemplateSelect(value)}
                data={templates}
                newOption={!!templateName ? templateName : "Novo Modelo"}
                customDefaultValue={{
                  value: templateName ?? '',
                  label: templateName ?? ''
                }}
                disabled={!!currentImport}
              /> :
            <></>
            }
              <FormSelect
                name="supplier"
                title="Representada"
                customWidth="12.5rem"
                disabled={(!templateName || !!currentImport) && !!supplierName}
                data={suppliers}
                onChange={(e: string) => setSupplierName(e)}
                customDefaultValue={supplierDefaultValue}
              />
              <Input
                name="Linha Inicial"
                width="4.8125rem"
                value={initialLine}
                onChange={(e) => setInitialLine(e.target.value)}
                disabled={!templateName}
              />
              <Select
                title="Novo Cadastro"
                customWidth="6.25rem"
                defaultValue={newRegisterDefaultValue}
                data={[
                  { value: 'yes', label: 'Sim' },
                  { value: 'no', label: 'Não' },
                  { value: 'withdraw', label: 'Preços e Estoques' },
                ]}
                setValue={(e: string) => {
                  if(!!e) handleAddNewTemplate(e)
                }
              }
              />
              <FormSelect
                name="fieldName"
                title="Nome do Campo do Produto"
                customWidth="12.5rem"
                data={fieldNames}
                disabled={isAddingTemplate}
              />
              <FormSelect
                name="column"
                title="Coluna"
                customWidth="4.625rem"
                disabled={!templateName || isAddingTemplate}
                customDefaultValue={
                  { value: "A", label: "A" }
                }
                data={columnOptions}
              />
              <AddButton
                onClick={handleAddColumn}
                disabled={!supplierName}
              >
                <PlusIcon />
              </AddButton>
              <GoBackButton
                onClick={goBack}
                type="button"
              >
                <GoBackIcon />
                <p>Voltar</p>
              </GoBackButton>
            </InputContainer>
          </Form>
          <Table isOnSafari={usingSafari}>
            <colgroup>
              <col span={1} style={{ width: '18%' }} />
              <col span={1} style={{ width: '18%' }} />
              <col span={1} style={{ width: '12%' }} />
              <col span={1} style={{ width: '38%' }} />
              <col span={1} style={{ width: '9%' }} />
              <col span={1} style={{ width: '5%' }} />
            </colgroup>
            <thead>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('template') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'template' })}
                >
                  Template
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('supplier') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'supplier' })}
                >
                  Representada
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('initialLine') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'initialLine', type: 'number' })}
                >
                  Linha Inicial
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('fieldName') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'fieldName' })}
                >
                  Nome do Campo do Produto
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes('column') ? sortingField : 'asc'}
                  onClick={() => handleSortingByField({ value: 'column' })}
                >
                  Coluna
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                Ação
              </th>
            </thead>
            <tbody>
              {templateLines.map((t) => (
                <tr key={t.id}>
                  <td>{currentTemplate.value}</td>
                  <td>
                    <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                      {supplierName}
                    </TableTitle>
                  </td>
                  <td style={{ padding: '0 0.625rem' }}>
                    {initialLine}
                  </td>
                  <td style={{ padding: '0 0.625rem' }}>
                    {t.field_label}
                  </td>
                  <td>
                    {t.column}
                  </td>
                  <td>
                    <div>
                      <TableActionButton
                        disabled={isDeleting === t.id}
                        onClick={() =>
                          handleDeleteColumn(t.id, t.field_name, t.field_label, t.column)
                        }
                      >
                        <TrashIcon />
                      </TableActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div style={{ justifyContent: 'flex-end', display: 'flex', marginTop: '1.875rem' }}>
            {canImportBeReversed &&
              <Button
                className="revert"
                style={{ width: '14.375rem' }}
                onClick={handleRevertImport}
              >
                {
                  isReverting ? <LoadingIcon className="revert" /> :
                  'Reverter Importação'
                }
              </Button>
            }
            <Dropzone
              ref={fileRef}
              validator={validator}
              onDrop={onDrop}
              noClick
              noKeyboard
              accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            >
            {({ getRootProps, getInputProps }) => {
              return (
                <Button
                  className="import"
                  disabled={!templateLines.length || isImporting}
                  style={{ width: isFileImported ? '22.8125rem' : '14.375rem' }}
                  {...getRootProps()}
                  onClick={isFileImported ? handleRepeatImport : openDialog}
                >
                  <input {...getInputProps()} />
                  {!isImporting && <UploadIcon />}
                  {
                  isImporting ? <LoadingIcon className="load" /> :
                  isFileImported ? 'Repetir a Importação do Arquivo' : 'Importar Arquivo'}
                </Button>
              );
            }}
            </Dropzone>
          </div>
          {isFileImported &&
            <>
              <SectionTitle style={{ marginTop: '1.875rem' }}>
                Relatório do Envio
              </SectionTitle>
              <Table isOnSafari={usingSafari}>
                <colgroup>
                  <col span={1} style={{ width: '8%' }} />
                  <col span={1} style={{ width: '13%' }} />
                  <col span={1} style={{ width: '37%' }} />
                  <col span={1} style={{ width: '27%' }} />
                  <col span={1} style={{ width: '14%' }} />
                </colgroup>
                <thead>
                  <th>Linha</th>
                  <th>Coluna</th>
                  <th>Nome do Campo do Produto</th>
                  <th>
                    <TableSearchBox 
                      value={search}
                      setValue={setSearch}
                      search={handleSearchByRef}
                    />
                  </th>
                  <th>
                    <NoTitleSelect
                      setValue={(value: string) => setFilterByStatus(value)}
                      placeholder="Selecione..."
                      customWidth="7.5rem"
                      defaultValue={{ value: 'SUCESSO', label: 'SUCESSO' }}
                      data={[
                        { value: 'SUCESSO', label: 'SUCESSO' },
                        { value: 'ERRO', label: 'ERRO' }
                      ]}
                    />
                  </th>
                </thead>
                <tbody>
                  {filteredResults.map((r) => (
                    <tr
                      key={r.line}
                      onMouseOver={(e) => {
                        setCurrentReportMessage(+r.line);
                        setMousePosition(e.clientX - 460);
                      }}
                      onMouseOut={() => setCurrentReportMessage(-1)}
                      id={r.line}
                    >
                      <td>
                        {r.line}
                      </td>
                      <td style={{ padding: '0 0.625rem' }}>
                        {r.column_reference}
                      </td>
                      <td style={{ padding: '0 0.625rem' }}>
                        {r.column_name}
                      </td>
                      <td>
                        {r.product_reference}
                      </td>
                      <td style={{ color: r.status === 'SUCESSO' ? '#25CFA1' : '#FF6F6F'}}>
                        {r.status}
                      </td>
                      {currentReportMessage === +r.line && r.status !== 'SUCESSO' && 
                        <ReportMessage leftPos={mousePosition}>
                          <p>{r.message}</p>
                        </ReportMessage>
                      }
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                setCurrentPage={setCurrentPage}
                style={{ marginTop: '1.25rem', marginLeft: 'auto' }}
              />
            </>
            }
        </Container>
      </MenuAndTableContainer>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
      <SuccessModal
        message={message}
        setIsModalOpen={() => setMessage('')}
      />
      <Modal
        title="Novo"
        isModalOpen={isNewTemplateModalOpen}
        setIsModalOpen={setIsNewTemplateModalOpen}
        customOnClose={() => setTemplateName('')}
      >
        <Input
          name="Nome da Importação do Template"
          fullW
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          style={{ marginTop: '1.875rem' }}
        />
        <Button
          className="newTemplate"
          disabled={!isNotEmpty(templateName)}
          onClick={() => {
            setIsNewTemplateModalOpen(false);
            formRef.current?.setFieldValue('template', templateName);
            setTemplateName('Carregando...');
            setTimeout(() => {
              setTemplateName(templateName);
              handleNewTemplate(templateName);
            }, 1000);
          }}
        >
          Adicionar
        </Button>
      </Modal>
    </>
  );
}

