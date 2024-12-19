import React, { useMemo } from 'react';

import { Container, CustomSectionTitle, FavoriteProductsContainer } from './styles';
import { Header } from '~components/Header';
import { Menu } from '~components/Menu';

import { MenuAndTableContainer, } from '~styles/components';

import { ClientHeader } from '@/src/components/ClientHeader';
import { FavoriteRelatedProduct } from '@/src/components/FavoriteRelatedProduct';

export function MostAccessed() {
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
      brands: [
        {
          id: 1,
          name: 'Nike',
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/2560px-Logo_NIKE.svg.png',
        },
        {
          id: 2,
          name: 'Nike',
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/2560px-Logo_NIKE.svg.png',
        },
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
      <Header route={['Cadastro', 'Cliente', 'Pedidos']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Container>
          <ClientHeader
            ref={null}
            disabled={false}
          />
          <CustomSectionTitle
            bg="#8073FC"
          >
            Fisher Price - 5 Produtos Favoritos
          </CustomSectionTitle>
          <FavoriteProductsContainer>
            {products.map((product) => 
              <FavoriteRelatedProduct
                // @ts-ignore
                product={product}
              />
            )}
          </FavoriteProductsContainer>
        </Container>
      </MenuAndTableContainer>
    </>
  );
}
