import React, { useCallback, useMemo, useState } from 'react';

import { ReactComponent as DropRateIcon } from '~assets/drop_rate.svg'

import { ReactComponent as SortIcon } from '~assets/sort.svg';

import {
  Container,
  Table,
  Button,
  FilterContainer,
  Filter,
  FilterContent,
  TableContainer
} from './styles';
import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Charts } from '~components/Chart';

import {
  InputContainer,
  MenuAndTableContainer,
  SectionTitle,
} from '~styles/components';
import { CustomDateBox } from '~components/CustomDateBox';
import { LoadingContainer } from '@/src/components/LoadingContainer';
import { isOnSafari } from '~utils/validation';
import { TableActionButton, TableFooter, TableSortingHeader, TableTitle } from '@/src/styles/components/tables';
import { sortByField, sortNumberFields } from '@/src/utils/sorting';
import { Pagination } from '@/src/components/Pagination';
import { MeasureBox } from '@/src/components/MeasureBox';

export function Analytics() {
  const [startPeriod, setStartPeriod] = useState(
    () => new Date().toISOString()
  );

  const [endPeriod, setEndPeriod] = useState(
    () => new Date().toISOString()
  );

  const [loading, setLoading] = useState(false);

  const [sortingField, setSortingField] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([
    {
      id: 1,
      name: 'Paulo Brinquedos LTDA',
      count: 221,
    },
  ]);

  const [viewedData, setViewedData] = useState([
    {
      id: 1,
      name: '/conheca-os-beneficios-do-diospiro',
      count: 221,
    },
  ]);

  const usingSafari = useMemo(() => isOnSafari, []);

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

  return (
    <>
      <Header route={['Dashboard']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <SectionTitle>
            Filtro
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
            <Button
              onClick={() => {}}
            >
              Filtrar
            </Button>
          </InputContainer>
          <FilterContainer>
            <Filter
              bg="#3699CF"
              buttonBg="#3699CF"
            >
              <FilterContent>
                <div style={{ gridColumn: '1 / 3' }}>
                  <p>Visualizações de páginas</p>
                  <strong>2.672</strong>
                  <p>Visualizações de páginas únicas</p>
                  <strong>1.588</strong>
                </div>
              </FilterContent>
            </Filter>
            <Filter
              bg="#FE726E"
              buttonBg="#D65D5D"
            >
              <FilterContent>
                <DropRateIcon />
                <div>
                  <p>Taxa de Rejeição</p>
                  <strong>88%</strong>
                  <p>Tempo médio na página</p>
                  <strong>01:09</strong>
                </div>
              </FilterContent>
            </Filter>
          </FilterContainer>
          <SectionTitle>
            Google Analytics
          </SectionTitle>
          {loading ?
            <LoadingContainer
              content="o Analytics"
            /> :
          <TableContainer>
            <Table isOnSafari={usingSafari}>
              <colgroup>
                <col span={1} style={{ width: '70%' }} />
                <col span={1} style={{ width: '30%' }} />
              </colgroup>
              <thead>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('ref') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'ref' })}
                  >
                    Origem do Acesso
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('product') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'product' })}
                  >
                    Acesso
                    <SortIcon />
                  </TableSortingHeader>  
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
                    <td>{p.count}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Table isOnSafari={usingSafari}>
              <colgroup>
                <col span={1} style={{ width: '70%' }} />
                <col span={1} style={{ width: '30%' }} />
              </colgroup>
              <thead>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('ref') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'ref' })}
                  >
                    Palavras da Busca Google
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('product') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'product' })}
                  >
                    Acesso
                    <SortIcon />
                  </TableSortingHeader>  
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
                    <td>{p.count}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Table isOnSafari={usingSafari}>
              <colgroup>
                <col span={1} style={{ width: '77%' }} />
                <col span={1} style={{ width: '23%' }} />
              </colgroup>
              <thead>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('ref') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'ref' })}
                  >
                    Páginas mais Visualizadas
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('product') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'product' })}
                  >
                    Acesso
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
              </thead>
              <tbody>
                {viewedData.map(p => (
                  <tr key={p.id}>
                    <td
                      style={{ 
                        color: "##3699CF"
                       }}
                    >
                      <TableTitle
                        fontSize="0.6875rem"
                        lineHeight="0.8125rem"
                        style={{ 
                          color: "##3699CF"
                         }}
                      >
                        <a>{p.name}</a>
                      </TableTitle>
                    </td>
                    <td>{p.count}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
          }
          <Charts title="Visualizações" />
          <Charts title="Visualizações de páginas únicas" />
        </Container>
      </MenuAndTableContainer>
    </>
  );
}
