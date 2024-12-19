import { useCallback, useEffect, useState } from 'react';

import { ReactComponent as CloseIcon } from '~assets/close.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Input } from '~components/Input';
import { Brand } from '~components/Brand';

import {
  Container,
  OptionsHeader,
  DimensionsContainer,
  Button,
  BrandsContainer
} from './styles';

import {
  MenuAndTableContainer,
  SectionTitle,
} from '~styles/components';

import { api } from '~api';
import { ConfirmationModal } from '@/src/components/ConfirmationModal';

export type IBrand = {
  id: number;
  name: string;
  registered: boolean;
  image: {
    JPG: string;
    WEBP: string;
  };
}

export function Brands() { 
  const [brands, setBrands] = useState<IBrand[]>([] as IBrand[]);
  const [deletingBrand, setDeletingBrand] = useState(-1);
  const [currentDeletingBrand, setCurrentDeletingBrand] = useState(null as unknown as IBrand);

  const handleAddBrand = useCallback(() => {
    setBrands(prev => [
      {
        id: Date.now() + prev.length + 1,
        name: '',
        registered: false,
        image: { JPG: '', WEBP: ''}
      },
      ...prev]);
  }, []);

  const handleRemoveBrand = useCallback(async () => {
    try{
      const { id, registered } = currentDeletingBrand;
      const findIndex = brands.findIndex(s => s.id === id);
      
      if(findIndex > -1 ){
        setDeletingBrand(id);

        if(registered)
          await api.delete(`/products/brands/${id}`);

        setBrands(prev => prev.filter(s => s.id !== id));
      }
    } catch (e) {
      console.log('e', e);
    } finally {
      setDeletingBrand(-1);
      setCurrentDeletingBrand(null as unknown as IBrand)
    }
  }, [currentDeletingBrand, brands]);

  const handleBrandData = useCallback(async (id, registered, name, url) => {
    try{
      const findIndex = brands.findIndex(s => s.id === id);
    
      if(findIndex > -1){
        const upload = new FormData();

        upload.append('name', name);

        if(!!url) {
          let image = await fetch(url).then(r => r.blob());
          upload.append('image', image);
        }

        const endpoint = registered ? 
        `/products/brands/${id}?_method=PUT` : 
        '/products/brands';

        const {
          data: { data }
        } = await api.post(endpoint, upload);

        setBrands(prev => prev.map(b => b.id === id ? ({...data, registered: true }) : b))
      }
    } catch (e) {
      console.log('e', e);
    }
  }, [brands]);

  const fetchBrands = useCallback(async () => {
    try {
      const {
        data: { data }
      } = await api.get('products/brands');

      setBrands(data.map((b: IBrand) => ({ ...b, registered: true })));
    } catch (error) {
      console.log('error', error)
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return (
    <>
      <Header route={['Loja Online', 'Marca do Produto']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <SectionTitle>
            Adicione as Marcas
          </SectionTitle>
          <OptionsHeader>
            <DimensionsContainer>
              <Input
                name="Largura"
                width="3.75rem"
                validated
                value="200"
                disabled
              />
              <span>
                <CloseIcon />
              </span>
              <Input
                name="Altura"
                width="3.75rem"
                validated
                value="130"
                disabled
              />
            </DimensionsContainer>
            <Button
              type="button"
              onClick={handleAddBrand}
            >
              Nova Marca
            </Button>
          </OptionsHeader>
          <BrandsContainer>
            {brands.map((b) =>
              <Brand
                key={b.id}
                brand={b}
                deletingBrand={b.id === deletingBrand}
                updateBrand={
                  ({ name, url = '' }) =>  handleBrandData(b.id, b.registered, name, url)
                }
                remove={() => setCurrentDeletingBrand(b)}
              />
            )}
          </BrandsContainer>
        </Container>
      </MenuAndTableContainer>
      <ConfirmationModal
        category={!!currentDeletingBrand ? currentDeletingBrand.name : ''}
        action={handleRemoveBrand}
        setIsModalOpen={() => {
          setCurrentDeletingBrand(null as unknown as IBrand)
        }}
      />
    </>
  );
}
