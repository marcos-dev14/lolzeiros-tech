import React, { useCallback, useMemo, useRef, useState } from 'react';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { ReactComponent as BagBottomIcon } from '~assets/bag-bottom.svg'
import { ReactComponent as BagBottomFillIcon } from '~assets/bag-bottom_fill.svg'

import { ReactComponent as DetailsArrowIcon } from '~assets/arrow_bg.svg'
import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as ViewIcon } from '~assets/view1.svg';
import { ReactComponent as BagIcon } from '~assets/bag1.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { Container, Table, Button, FilterContainer, Filter, FilterContent, CustomSectionTitle } from './styles';
import { Header } from '~components/Header';
import { Menu } from '~components/Menu';

import {
  InputContainer,
  MenuAndTableContainer,
  SectionTitle,
} from '~styles/components';
import { CustomDateBox } from '~components/CustomDateBox';
import { CustomSelect as Select } from '~components/Select';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { isOnSafari } from '~utils/validation';
import { TableActionButton, TableFooter, TableSortingHeader, TableTitle } from '@/src/styles/components/tables';
import { sortByField, sortNumberFields } from '@/src/utils/sorting';
import { TableDateBox } from '@/src/components/TableDateBox';
import { Pagination } from '@/src/components/Pagination';
import { MeasureBox } from '@/src/components/MeasureBox';
import { StaticDateBox } from '@/src/components/StaticDateBox';
import { FormSelect } from '@/src/components/FormSelect';
import { Modal } from '@/src/components/Modal';
import { Charts } from '@/src/components/Chart';
import { TableTagInput } from '@/src/components/TableTagInput';

export function Sales() {
  const [startPeriod, setStartPeriod] = useState(
    () => new Date().toISOString()
  );

  const [endPeriod, setEndPeriod] = useState(
    () => new Date().toISOString()
  );

  const [loading, setLoading] = useState(false);
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [hasFiltered, setHasFiltered] = useState(false);

  const filterFormRef = useRef<FormHandles>(null)

  const [status, setStatus] = useState('');
  const [filterOption, setFilterOption] = useState<'done' | 'dropped' | 'all'>('done');
  const [sortingField, setSortingField] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([
    {
      id: 1,
      company_name: 'Paulo Brinquedos LTDA',
      supplier: 'Barão',
      commercial: 'Paulo Oliveira',
      city: 'São Paulo',
      updated_at: new Date().toISOString(),
      value: 12,
      status: 'Entregue'
    },
  ]);

  const usingSafari = useMemo(() => isOnSafari, []);

  const bgOptions = useMemo(() => ({
    done: "#21D0A1",
    dropped: "#FE726E",
    all: "#8073FC"
  }), [])

  const titleOptions = useMemo(() => ({
    done: "38 vendas efetivadas",
    dropped: "28 cestos abandonados",
    all: "172 vendas efetivadas"
  }), [])

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if(sortingField.includes(value)) {
      setFilteredData(data.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if(type === 'string') // @ts-ignore
      setFilteredData(prev => sortByField(prev, value));
    else { // @ts-ignore
      setFilteredData(prev => sortNumberFields(prev, value));
    }
    setSortingField(value);
  }, [data, sortingField]);

  const handleFilterSales = useCallback(async () => {
    try {
      setLoading(true);
      const data = filterFormRef?.current?.getData();

      const params = {};
      // setCurrentPage(current_page);
      // setLastPage(last_page);

    } catch (error) {
      // @ts-ignore
      console.log('e', error.response.data.message);

      // @ts-ignore
      setError(error.response.data.message)
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterStatus = useCallback(async () => {
    if(!hasFiltered) {
      setIsFilterModalOpen(true)
      return;
    }
        
    // await handlePagination(1);
    
    setHasFiltered(false);
  // }, [handlePagination, hasFiltered])
  }, [hasFiltered])

  return (
    <>
      <Header route={['Dashboard']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <SectionTitle>
            Filtro da Loja Online
          </SectionTitle>
          <InputContainer>
            {filterOption !== 'done' &&
              <>
                <CustomDateBox
                  name="startPeriod"
                  title="Período Inicial"
                  width="8.75rem"
                  // @ts-ignore
                  date={startPeriod}
                  onDateSelect={() => {}}
                  validated={false}
                />
                <CustomDateBox
                  name="endPeriod"
                  title="Período Final"
                  width="8.75rem"
                  // @ts-ignore
                  date={endPeriod}
                  onDateSelect={() => {}}
                  validated={false}
                />
                <Select
                  title="Status do Pedido"
                  placeholder="Selecione..."
                  customWidth="14.8125rem"
                  // @ts-ignore
                  setValue={(v) => setStatus(v)}
                />
              </>
            }
            <Button
              onClick={handleFilterStatus}
              style={{
                marginLeft: 'auto'
              }}
            >
              Filtro
            </Button>
          </InputContainer>
          <FilterContainer>
            <Filter
              bg="#21D0A1"
              buttonBg="#1AAD86"
              active={filterOption === 'done'}
            >
              <FilterContent>
                <BagBottomIcon />
                <div>
                  <p>39 vendas efetivadas</p>
                  <strong>R$ 116.928,22</strong>
                  <p>28 clientes</p>
                </div>
              </FilterContent>
              <button onClick={() => setFilterOption('done')}>
                Detalhes <DetailsArrowIcon />
              </button>
            </Filter>
            <Filter
              bg="#3699CF"
              buttonBg="#3699CF"
              active={false}
            >
              <FilterContent>
                <BagBottomIcon />
                <div>
                  <p>Ticket médio por compra</p>
                  <strong>R$ 2.800,10</strong>
                  <p>Ticket médio por produto</p>
                  <strong>R$ 115,55</strong>
                </div>
              </FilterContent>
            </Filter>
            <Filter
              bg="#FE726E"
              buttonBg="#D65D5D"
              active={filterOption === 'dropped'}
            >
              <FilterContent>
                <BagBottomFillIcon />
                <div>
                  <p>28 cestos abandonados</p>
                  <strong>R$ 91.872,00</strong>
                  <p>22 clientes</p>
                </div>
              </FilterContent>
              <button onClick={() => setFilterOption('dropped')}>
                Detalhes <DetailsArrowIcon />
              </button>
            </Filter>
            <Filter
              bg="#8073FC"
              buttonBg="#353686"
              active={filterOption === 'all'}
            >
              <FilterContent>
                <BagBottomIcon />
                <div>
                  <p>172 vendas efetivadas</p>
                  <strong>R$ 1.927.087,19</strong>
                  <p>145 clientes</p>
                </div>
              </FilterContent>
              <button onClick={() => setFilterOption('all')}>
                Detalhes <DetailsArrowIcon />
              </button>
            </Filter>
          </FilterContainer>
          
          {loading ?
            <LoadingContainer
              content="as vendas"
            /> :
            filterOption === 'done' ?
            <>
              <CustomSectionTitle
                bg={bgOptions[filterOption]}
              >
                {titleOptions[filterOption]} | 01/01/2022 - 01/02/2022
              </CustomSectionTitle>
              <Table isOnSafari={usingSafari}>
              <colgroup>
                <col span={1} style={{ width: '23%' }} />
                <col span={1} style={{ width: '12%' }} />
                <col span={1} style={{ width: '12%' }} />
                <col span={1} style={{ width: '12%' }} />
                <col span={1} style={{ width: '12%' }} />
                <col span={1} style={{ width: '12%' }} />
                <col span={1} style={{ width: '11%' }} />
                <col span={1} style={{ width: '6%' }} />
              </colgroup>
              <thead>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('ref') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'ref' })}
                  >
                    Razão Social
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('product') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'product' })}
                  >
                    Representada
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('category') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'category' })}
                  >
                    Comercial
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Cidade
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Data
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Valor
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Status
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>                
                  Ação
                </th>
              </thead>
              <tbody>
                {filteredData.map(p => (
                  <tr key={p.id}>
                    <td>
                      <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                        {p.company_name}
                      </TableTitle>
                    </td>
                    <td>{p.supplier}</td>
                    <td>
                      {p.commercial}
                    </td>
                    <td>
                      {p.city}
                    </td>
                    <td style={{ padding: '0 0.625rem' }}>
                      <TableDateBox
                        name="etaSupplier"
                        title="Previsão de Chegada da Representada"
                        width="7.5rem"
                        // @ts-ignore
                        date={p.updated_at}
                        onDateSelect={() => {}}
                        disabled
                        validated={false}
                      />
                    </td>
                    <td style={{ padding: '0 0.625rem' }}>
                      <MeasureBox
                        name="etaSupplier"
                        title=""
                        noTitle
                        validated
                        measure="R$"
                        defaultValue="278,55"
                        disabled
                      />
                    </td>
                    <td>
                      Entregue
                    </td>
                    <td>
                      <div>
                        <TableActionButton
                          onClick={() => {}}
                        >
                          <ViewIcon />
                        </TableActionButton>
                        <TableActionButton
                          onClick={() => {}}
                          disabled={false}
                        >
                          {/* {p.availability === 'Disponível' ? <BagIcon /> : <BagXIcon />} */}
                          <BagIcon />
                        </TableActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <TableFooter>
              <Pagination
                currentPage={1}
                lastPage={7}
                setCurrentPage={() => {}}
                style={{ marginLeft: 'auto' }}
              />
            </TableFooter>
            </> :
            filterOption === 'dropped' ?
            <>
              <CustomSectionTitle
                bg={bgOptions[filterOption]}
              >
                {titleOptions[filterOption]}
              </CustomSectionTitle>
              <Table isOnSafari={usingSafari}>
              <colgroup>
                <col span={1} style={{ width: '17%' }} />
                <col span={1} style={{ width: '12%' }} />
                <col span={1} style={{ width: '7%' }} />
                <col span={1} style={{ width: '12%' }} />
                <col span={1} style={{ width: '12%' }} />
                <col span={1} style={{ width: '11%' }} />
                <col span={1} style={{ width: '21%' }} />
                <col span={1} style={{ width: '8%' }} />
              </colgroup>
              <thead>
                <th>
                  Cliente
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('product') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'product' })}
                  >
                    Data
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('category') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'category' })}
                  >
                    Prod
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Valor
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Região
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Compra
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Newsletter
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>                
                  Ação
                </th>
              </thead>
              <tbody>
                {filteredData.map(p => (
                  <tr key={p.id}>
                    <td>
                      <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                        {p.company_name}
                      </TableTitle>
                    </td>
                    <td style={{ padding: '0 0.625rem' }}>
                      <TableDateBox
                        name="etaSupplier"
                        title="Previsão de Chegada da Representada"
                        width="6.75rem"
                        // @ts-ignore
                        date={p.updated_at}
                        onDateSelect={() => {}}
                        disabled
                        validated={false}
                      />
                    </td>
                    <td>{p.supplier}</td>
                    <td style={{ padding: '0 0.625rem' }}>
                      <MeasureBox
                        name="etaSupplier"
                        title=""
                        noTitle
                        validated
                        measure="R$"
                        defaultValue="278,55"
                        disabled
                      />
                    </td>
                    <td>
                      {p.commercial}
                    </td>
                    <td>
                      {p.city}
                    </td>
                    <td style={{ padding: 0 }}>
                      <TableTagInput
                        tags="Abandonou/Novembro2021 (72)"
                        fullW
                        noTitle
                        orange
                        isOnTable
                      />
                    </td>
                    <td>
                      <div>
                        <TableActionButton
                          onClick={() => {}}
                        >
                          <ViewIcon />
                        </TableActionButton>
                        <TableActionButton
                          onClick={() => {}}
                          disabled={false}
                        >
                          {/* {p.availability === 'Disponível' ? <BagIcon /> : <BagXIcon />} */}
                          <BagIcon />
                        </TableActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <TableFooter>
              <Pagination
                currentPage={1}
                lastPage={7}
                setCurrentPage={() => {}}
                style={{ marginLeft: 'auto' }}
              />
            </TableFooter>
            </>
             :
             <>
              <CustomSectionTitle
                bg={bgOptions[filterOption]}
              >
                {titleOptions[filterOption]}
              </CustomSectionTitle>
              <Table isOnSafari={usingSafari}>
              <colgroup>
                <col span={1} style={{ width: '17%' }} />
                <col span={1} style={{ width: '12%' }} />
                <col span={1} style={{ width: '9%' }} />
                <col span={1} style={{ width: '10%' }} />
                <col span={1} style={{ width: '12%' }} />
                <col span={1} style={{ width: '11%' }} />
                <col span={1} style={{ width: '21%' }} />
                <col span={1} style={{ width: '8%' }} />
              </colgroup>
              <thead>
                <th>
                  Cliente
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('product') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'product' })}
                  >
                    Data
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Status
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('category') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'category' })}
                  >
                    Prod
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Valor
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Região
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Newsletter
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>                
                  Ação
                </th>
              </thead>
              <tbody>
                {filteredData.map(p => (
                  <tr key={p.id}>
                    <td>
                      <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                        {p.company_name}
                      </TableTitle>
                    </td>
                    <td style={{ padding: '0 0.625rem' }}>
                      <TableDateBox
                        name="etaSupplier"
                        title="Previsão de Chegada da Representada"
                        width="6.75rem"
                        // @ts-ignore
                        date={p.updated_at}
                        onDateSelect={() => {}}
                        disabled
                        validated={false}
                      />
                    </td>
                    <td>{p.city}</td>
                    <td>{p.supplier}</td>
                    <td style={{ padding: '0 0.625rem' }}>
                      <MeasureBox
                        name="etaSupplier"
                        title=""
                        noTitle
                        validated
                        measure="R$"
                        defaultValue="278,55"
                        disabled
                      />
                    </td>
                    <td>
                      {p.commercial}
                    </td>
                    <td style={{ padding: 0 }}>
                      <TableTagInput
                        tags="Abandonou/Novembro2021 (72)"
                        fullW
                        noTitle
                        isOnTable
                      />
                    </td>
                    <td>
                      <div>
                        <TableActionButton
                          onClick={() => {}}
                        >
                          <ViewIcon />
                        </TableActionButton>
                        <TableActionButton
                          onClick={() => {}}
                          disabled={false}
                        >
                          {/* {p.availability === 'Disponível' ? <BagIcon /> : <BagXIcon />} */}
                          <BagIcon />
                        </TableActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <TableFooter>
              <Pagination
                currentPage={1}
                lastPage={7}
                setCurrentPage={() => {}}
                style={{ marginLeft: 'auto' }}
              />
            </TableFooter>
            </>
          }
          <Charts title="Vendas" />
          <Charts title="Visualizações" />

        </Container>
      </MenuAndTableContainer>
      <Modal
        title="Filtro de Clientes"
        isModalOpen={isFilterModalOpen}
        setIsModalOpen={setIsFilterModalOpen}
      >
        <Form ref={filterFormRef} onSubmit={() => {}}>
          <InputContainer style={{ marginTop: '1.875rem' }}>
            <FormSelect
              name="Comercial"
              title="Comercial"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
            <FormSelect
              name="Grupo do Cliente"
              title="Grupo do Cliente"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
          </InputContainer>
          <InputContainer>
            <FormSelect
              name="Tipo de PDV"
              title="Tipo de PDV"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
            <FormSelect
              name="Perfil do Cliente"
              title="Perfil do Cliente"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
          </InputContainer>
          <InputContainer>
            <FormSelect
              name="Última Compra"
              title="Última Compra"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
            <FormSelect
              name="Newsletter"
              title="Newsletter"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
          </InputContainer>
          <InputContainer>
            <FormSelect
              name="Representada Liberada"
              title="Representada Liberada"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
            <FormSelect
              name="Status"
              title="Status"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
          </InputContainer>
          <InputContainer>
            <FormSelect
              name="Cidade"
              title="Cidade"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
            <FormSelect
              name="Região"
              title="Região"
              placeholder="Selecione..."
              customWidth="11.875rem"
            />
          </InputContainer>
          <InputContainer>
            <StaticDateBox
              name=""
              title="Período Inicial"
              width="8.75rem"
              // @ts-ignore
              date={new Date()}
              onDateSelect={() => {}}
              validated={false}
            />
            <StaticDateBox
              name=""
              title="Período Final"
              width="8.75rem"
              // @ts-ignore
              date={new Date()}
              onDateSelect={() => {}}
              validated={false}
            />
          </InputContainer>
          <Button
            onClick={handleFilterSales}
            type="button"
            style={{
              marginTop: '3.125rem',
              marginLeft: 0,
              width: '100%',
            }}
          >
            {loading ? <LoadingIcon className="load" /> : 'Filtrar Clientes'}
          </Button>
        </Form>
      </Modal>
    </>
  );
}
