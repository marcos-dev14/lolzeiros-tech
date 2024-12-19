import { useCallback, useEffect, useMemo, useState } from 'react';
import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { ReactComponent as PlusIcon } from '~assets/plus.svg'

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { CustomSelect as Select } from '~components/Select';
import { BlogRelatedProduct } from '~components/BlogRelatedProduct';
import { PostHeader } from '~components/PostHeader';

import { DefaultValueProps, MainProduct } from '~types/main';
import { api } from '~api';

import {
  Container,
  CustomSectionTitle,
  ProductsContainer,
  Button
} from './styles';

export function PostRelatedProducts() {
  const [products, setProducts] = useState<MainProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableProducts, setAvailableProducts] = useState<DefaultValueProps[]>([]);
  const [selectedProducts, setSelectedProducts] = useState([
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
  ])
  
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(-1);
  
  const [currentProduct, setCurrentProduct] = useState<DefaultValueProps>({} as DefaultValueProps);
  
  const handleAddProduct = useCallback(async () => {
    try {
      setAdding(true);
      if(!Object.entries(currentProduct).length) return;

      const selectedProduct = products.find(p => p.title === currentProduct.value);
      
      const data = {
        // @ts-ignore
        attach_product_id: selectedProduct.id
      }

      await api.post(`/products/$id/related`, data)

      // setSelectedProducts(prev => [...prev, selectedProduct!]);
      setAvailableProducts(prev => prev.filter(p => p.value !== currentProduct.value));
      setCurrentProduct({} as DefaultValueProps);
    } catch(e){
      console.log('e', e);
    } finally {
      setAdding(false);
    }
  }, [currentProduct, products]);

  const handleRemoveProduct = useCallback(async (productName: string) => {
    try {

      // @ts-ignore
      const { id } = products.find(p => p.title === productName);
      setDeleting(id);

      await api.delete(`/products/$id/related/${id}`)

      setSelectedProducts(prev => prev.filter(p => p.title !== productName))
      setAvailableProducts(prev => [...prev, { value: productName, label: productName }]);
    } catch(e) {
      console.log('e', e);
    } finally {
      setDeleting(-1);
    }
  }, [products]);

  const fetchProducts = useCallback(async () => {
    try {
      const {
        data: {
          data: productsResponse
        }
      } = await api.get(`products?by_supplier=$id`);

      // const findProduct = productsResponse.find((p: MainProduct) => p.id === product.id);
      const findProduct = productsResponse.find((p: MainProduct) => p.id === 1);
      const productsWithoutCurrentProduct = productsResponse.filter((p: MainProduct) => p.id !== 1);
      
      const { related } = findProduct;
            
      const productsWithoutRelatedProducts =
        productsWithoutCurrentProduct.filter((p: MainProduct) => related.findIndex((i: MainProduct)=> i.id === p.id) === -1);

      setProducts(productsWithoutCurrentProduct);
                
      setAvailableProducts(
        productsWithoutRelatedProducts
          .map((p: MainProduct) => ({ value: p.title, label: p.title }))
      );
      
      setSelectedProducts(related);
    } catch (error) {
      console.log('e', error)
    } finally {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    // fetchProducts();
  }, []);

  return (
    <>
      <Header minimal route={['Blog', 'Postagem', 'Produtos Relacionados']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Container>
          <PostHeader />
          <CustomSectionTitle>
            Produtos Relacionados
          </CustomSectionTitle>
          <InputContainer>
            <Select
              title="Código"
              customWidth="9.375rem"
              data={availableProducts}
              defaultValue={currentProduct}
              disabled={loading}
              setValue={
                (value: string) => setCurrentProduct({ value, label: value})
              }
            />
            <Select
              title="Produto"
              customWidth="30rem"
              data={availableProducts}
              defaultValue={currentProduct}
              disabled={loading}
              setValue={
                (value: string) => setCurrentProduct({ value, label: value})
              }
            />
            <Button
              onClick={() => {}}
            >
              Adicionar
            </Button>
          </InputContainer>
          <ProductsContainer>
            {selectedProducts.map(p => 
              <BlogRelatedProduct
                key={p.id}
                // @ts-ignore
                product={p}
              />
            )}
          </ProductsContainer>
        </Container>
      </MenuAndTableContainer>
    </>
  );
}
