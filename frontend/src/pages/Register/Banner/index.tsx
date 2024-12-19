import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as SortIcon } from '~assets/sort.svg';
import { ReactComponent as EditIcon } from '~assets/edit1.svg'
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Input } from '~components/Input';

import { Container, Table } from './styles';
import { MenuAndTableContainer } from '~styles/components';

import { TableActionButton, TableSortingHeader } from '~styles/components/tables';

import { api } from '~api';

import { sortByField, sortNumberFields } from '~utils/sorting';
import { isOnSafari } from '~utils/validation';

import { LoadingContainer } from '@/src/components/LoadingContainer';
import { ErrorModal } from '@/src/components/ErrorModal';
import { Modal } from '@/src/components/Modal';
import { IBanner } from '@/src/types/main';
import { useRegister } from '@/src/context/register';

export function Banners() {
  const { push } = useHistory();
  const { setBanner } = useRegister();
    
  const [isNewBannerModalOpen, setIsNewBannerModalOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [banners, setBanners] = useState<IBanner[]>([]);
  const [filteredBanners, setFilteredBanners] = useState<IBanner[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingBanner, setLoadingBanner] = useState(-1);
  const [error, setError] = useState('');

  const [sortingField, setSortingField] = useState('');  
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: {
          data: banners
        }
      } = await api.get('/banners');

      setFilteredBanners(banners);  
      setBanners(banners);  
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [])

  const handleSortingByField = useCallback(({ value, type = 'string' }) => {
    if(sortingField.includes(value)) {
      setFilteredBanners(banners.reverse());
      
      sortingField.includes('-desc') ?
        setSortingField(prev => prev.replace("-desc", "")) :
        setSortingField(prev => `${prev}-desc`);

      return;
    }

    if(type === 'string')
      setFilteredBanners(prev => sortByField(prev, value));
    else {
      setFilteredBanners(prev => sortNumberFields(prev, value));
    }
    setSortingField(value);
  }, [banners, sortingField]);

  const usingSafari = useMemo(() => isOnSafari, []);

  const handleEditBanner = useCallback(async (id: number) => {
    try{
      setLoadingBanner(id);
      
      const {
        data: { data: response } // @ts-ignore
      } = await api.get(`/banners/${id}/images`);


      setBanner(response as unknown as IBanner);

      push('/register/banners/edit');
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao registrar o cliente.';

      setError(errorMessage);  
    } finally {
      setLoadingBanner(-1);
    }
  }, [push, setBanner]);

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <>
      <Header route={['Cadastro', 'Banner (Publicidade)']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          {loading ?
            <LoadingContainer
              content="os banners"
            /> :
            <Table isOnSafari={usingSafari}>
              <colgroup>
                <col span={1} style={{ width: '49%' }} />
                <col span={1} style={{ width: '23%' }} />
                <col span={1} style={{ width: '12%' }} />
                <col span={1} style={{ width: '12%' }} />
                <col span={1} style={{ width: '4%' }} />
              </colgroup>
              <thead>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('name') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'name' })}
                  >
                    Tipo
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('name') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'name' })}
                  >
                    Localização do Banner
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('desktop') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'desktop' })}
                  >
                    Desktop
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>
                  <TableSortingHeader
                    dir={sortingField.includes('phone') ? sortingField : 'asc'}
                    onClick={() => handleSortingByField({ value: 'phone' })}
                  >
                    Mobile
                    <SortIcon />
                  </TableSortingHeader>  
                </th>
                <th>Ação</th>
              </thead>
              <tbody>
                {filteredBanners.map(b => (
                  <tr key={b.id}>
                    <td style={{ padding: '0 0.625rem' }}>
                      <Input
                        name="name"
                        noTitle
                        value={b.name}
                        disabled
                        fullW
                      />
                    </td>
                    <td style={{ padding: '0 0.625rem' }}>
                      <Input
                        name="desktop"
                        noTitle
                        value={b.name}
                        disabled
                        fullW
                      />
                    </td>
                    <td style={{ padding: '0 0.625rem' }}>
                      <Input
                        name="phone"
                        noTitle
                        value={`${b.desktop_images_count} imagens`}
                        disabled
                        fullW
                      />
                    </td>
                    <td style={{ padding: '0 0.625rem' }}>
                      <Input
                        name="count"
                        noTitle
                        value={`${b.mobile_images_count} imagens`}
                        disabled
                        fullW
                      />
                    </td>
                    <td style={{ padding: '0 0.625rem' }}>
                      <div>
                        <TableActionButton
                          onClick={() => handleEditBanner(b.id)}
                          disabled={loadingBanner === b.id}
                          loading={loadingBanner === b.id}
                        >
                          {loadingBanner === b.id ? <LoadingIcon className="load" /> : <EditIcon />}
                        </TableActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
