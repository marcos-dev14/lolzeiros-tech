import React, { useCallback, useMemo, useState } from 'react';

import { ReactComponent as BagBottomIcon } from '~assets/bag-bottom.svg'
import { ReactComponent as BagBottomFillIcon } from '~assets/bag-bottom_fill.svg'
import { ReactComponent as DetailsArrowIcon } from '~assets/arrow_bg.svg'
import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as ViewIcon } from '~assets/view1.svg';
import { ReactComponent as HeartIcon } from '~assets/heart.svg';
import { ReactComponent as BagIcon } from '~assets/bag1.svg';

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
import { SupplierHeader } from '@/src/components/SupplierHeader';

export function Sales() {
  const [startPeriod, setStartPeriod] = useState(
    () => new Date().toISOString()
  );

  const [endPeriod, setEndPeriod] = useState(
    () => new Date().toISOString()
  );

  const [loading, setLoading] = useState(false);

  const [supplier, setSupplier] = useState('');
  const [status, setStatus] = useState('');
  const [filterOption, setFilterOption] = useState<'done' | 'dropped' | 'all'>('done');
  const [sortingField, setSortingField] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([
    {
      id: 1,
      name: 'Paulo Brinquedos LTDA',
      date: new Date().toISOString(),
      profile: 'VIP',
      value: '278,55',
      products_count: 12,
      commercial: 'Paulo Gustavo',
      region: 'São Paulo',
      last_purchase: new Date().toISOString()
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
  }), []);

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

  const products = useMemo(() => [
    {
      id: 1,
      title: 'NERF Elite Colete Tático Armazenador de Dardos Ajustável +8 Anos',
      reference: '2410',
      created_at: new Date().toISOString(),
      unit_price_promotional: '99,00',
      unit_price: '119,00',
      images: [
        {
          image: {
            JPG: 'https://m.media-amazon.com/images/I/81KDL-G2nRL._AC_SL1500_.jpg'
          }
        }
      ],
      views: 229,
      sales: 87
    },
    {
      id: 2,
      title: 'NERF Elite Colete Tático Armazenador de Dardos Ajustável +8 Anos',
      reference: '2410',
      created_at: new Date().toISOString(),
      unit_price_promotional: '99,00',
      unit_price: '119,00',
      images: [
        {
          image: {
            JPG: 'https://m.media-amazon.com/images/I/81KDL-G2nRL._AC_SL1500_.jpg'
          }
        }
      ],
      views: 229,
      sales: 87
    },
    {
      id: 3,
      title: 'NERF Elite Colete Tático Armazenador de Dardos Ajustável +8 Anos',
      reference: '2410',
      created_at: new Date().toISOString(),
      unit_price_promotional: '99,00',
      unit_price: '119,00',
      images: [
        {
          image: {
            JPG: 'https://m.media-amazon.com/images/I/81KDL-G2nRL._AC_SL1500_.jpg'
          }
        }
      ],
      views: 229,
      sales: 87
    },
    {
      id: 4,
      title: 'NERF Elite Colete Tático Armazenador de Dardos Ajustável +8 Anos',
      reference: '2410',
      created_at: new Date().toISOString(),
      unit_price_promotional: '99,00',
      unit_price: '119,00',
      images: [
        {
          image: {
            JPG: 'https://m.media-amazon.com/images/I/81KDL-G2nRL._AC_SL1500_.jpg'
          }
        }
      ],
      views: 229,
      sales: 87
    },
    {
      id: 5,
      title: 'NERF Elite Colete Tático Armazenador de Dardos Ajustável +8 Anos',
      reference: '2410',
      created_at: new Date().toISOString(),
      unit_price_promotional: '99,00',
      unit_price: '119,00',
      images: [
        {
          image: {
            JPG: 'https://m.media-amazon.com/images/I/81KDL-G2nRL._AC_SL1500_.jpg'
          }
        }
      ],
      views: 229,
      sales: 87
    }
  ], []);

  return (
    <>
      <Header route={['Cadastro', 'Representada', 'Vendas']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Container>
          <SupplierHeader
            ref={null}
            disabled={false}
          />
          <SectionTitle style={{
            marginTop: '1.25rem'
          }}>
            Filtro de Vendas
          </SectionTitle>
          <InputContainer>
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
              title="Comercial"
              placeholder="Selecione..."
              customWidth="12.5rem"
              // @ts-ignore
              setValue={(v) => setSupplier(v)}
            />
             <Select
              title="Perfil do Cliente"
              placeholder="Selecione..."
              customWidth="12.5rem"
              // @ts-ignore
              setValue={(v) => setStatus(v)}
            />
             <Select
              title="Tipo de PDV"
              placeholder="Selecione..."
              customWidth="12.5rem"
              // @ts-ignore
              setValue={(v) => setStatus(v)}
            />
            <Button
              onClick={() => {}}
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
                <HeartIcon />
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
            <CustomSectionTitle
              bg={bgOptions[filterOption]}
            >
              {titleOptions[filterOption]}
            </CustomSectionTitle>
            {loading ?
              <LoadingContainer
                content="os pedidos"
              /> :
            <>
              <Table isOnSafari={usingSafari}>
                <colgroup>
                  <col span={1} style={{ width: '20%' }} />
                  <col span={1} style={{ width: '10%' }} />
                  <col span={1} style={{ width: '9%' }} />
                  <col span={1} style={{ width: '9%' }} />
                  <col span={1} style={{ width: '8%' }} />
                  <col span={1} style={{ width: '13%' }} />
                  <col span={1} style={{ width: '13%' }} />
                  <col span={1} style={{ width: '12%' }} />
                  <col span={1} style={{ width: '6%' }} />
                </colgroup>
                <thead>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('ref') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'ref' })}
                    >
                      Cliente
                      <SortIcon />
                    </TableSortingHeader>  
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
                      Perfil
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
                      Produtos
                      <SortIcon />
                    </TableSortingHeader>  
                  </th>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'updated_at' })}
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
                      Região
                      <SortIcon />
                    </TableSortingHeader>  
                  </th>
                  <th>
                    <TableSortingHeader
                      dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                      onClick={() => handleSortingByField({ value: 'updated_at' })}
                    >
                      Última Compra
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
                          {p.name}
                        </TableTitle>
                      </td>
                      <td style={{ padding: '0 0.625rem' }}>
                        <TableDateBox
                          name=""
                          title=""
                          width="7.5rem"
                          // @ts-ignore
                          date={p.date}
                          onDateSelect={() => {}}
                          disabled
                          validated={false}
                        />
                      </td>
                      <td>
                        {p.profile}
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
                        {p.products_count}
                      </td>
                      <td>
                        {p.commercial}
                      </td>
                      <td>
                        {p.region}
                      </td>
                      <td style={{ padding: '0 0.625rem' }}>
                        <TableDateBox
                          name=""
                          title=""
                          width="7.5rem"
                          // @ts-ignore
                          date={p.last_purchase}
                          onDateSelect={() => {}}
                          disabled
                          validated={false}
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
            <SectionTitle style={{ marginTop: '1.25rem' }}>
              Curva ABC de Produtos
            </SectionTitle>
            <Table isOnSafari={usingSafari}>
              <colgroup>
                <col span={1} style={{ width: '10%' }} />
                <col span={1} style={{ width: '38%' }} />
                <col span={1} style={{ width: '10%' }} />
                <col span={1} style={{ width: '8%' }} />
                <col span={1} style={{ width: '9%' }} />
                <col span={1} style={{ width: '9%' }} />
                <col span={1} style={{ width: '12%' }} />
                <col span={1} style={{ width: '4%' }} />
              </colgroup>
              <thead>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('ref') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'ref' })}
                  >
                    Referência
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('product') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'product' })}
                  >
                    Produto
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
                    Vendas
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Acessos
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Pedidos
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('updated_at') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'updated_at' })}
                  >
                    Última Compra
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
                      RTE7382
                    </td>
                    <td>
                      <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                        {p.name}
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
                      245
                    </td>
                    <td>
                      11.928
                    </td>
                    <td>
                      245
                    </td>
                    <td style={{ padding: '0 0.625rem' }}>
                      <TableDateBox
                        name=""
                        title=""
                        width="7.5rem"
                        // @ts-ignore
                        date={p.date}
                        onDateSelect={() => {}}
                        disabled
                        validated={false}
                      />
                    </td>
                    <td>
                      <div>
                        <TableActionButton
                          onClick={() => {}}
                        >
                          <ViewIcon />
                        </TableActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
        </Container>
      </MenuAndTableContainer>
    </>
  );
}