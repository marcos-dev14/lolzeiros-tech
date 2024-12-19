import { useCallback, useEffect, useState } from 'react';

import { ReactComponent as EditIcon } from '~assets/edit1.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';

import { Container, CustomHeader, Button, ListHeader, ListContent } from './styles';
import { MenuAndTableContainer } from '~styles/components';

import { api } from '~api';
import { TableActionButton } from '@/src/styles/components/tables';
import { useHistory } from 'react-router';
import { capitalizeContent } from '@/src/utils/validation';

type Navigation = {
  id: number;
  location: string;
  title: string;
  order: number;
}

export function SiteMap() {
  const { push } = useHistory();
  const [navigations, setNavigations] = useState<Navigation[]>([] as Navigation[]);
  const [filteredNavigations, setFilteredNavigations] = useState<Navigation[]>([] as Navigation[]);

  const handleSearch = useCallback((search: string) => {
    setFilteredNavigations(navigations.filter(
      (r) => r.title.toLowerCase().includes(search.toLowerCase())
    ));
  }, [navigations]);

  const fetchNavigations = useCallback(async () => {
    try {
      const {
        data: {
          data
        }
      } = await api.get('navigations');

      setNavigations(data);
      setFilteredNavigations(data);
    } catch (error) {
      console.log('error', error)
    }
  }, []);

  useEffect(() => {
    fetchNavigations();
  }, [])

  return (
    <>
      <Header route={['Configuração', 'Mapa do Site']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <ListHeader>
            <div>
              <strong>Nome do Bloco de Menu</strong>
            </div>
            <div>
              <strong>Ação</strong>
            </div>
          </ListHeader>
            {filteredNavigations.map(({id, title}) =>
              <ListContent>
                <div>
                  {capitalizeContent(title)}
                </div>
                <div>
                  <TableActionButton
                    onClick={() => push('/settings/map/edit', { id, title })}
                  >
                    <EditIcon />
                  </TableActionButton>
                </div>
              </ListContent>
            )}
        </Container>
      </MenuAndTableContainer>
    </>
  );
}
