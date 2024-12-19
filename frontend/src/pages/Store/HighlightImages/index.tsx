import { useCallback, useEffect, useMemo, useState } from 'react';

import { ReactComponent as CloseIcon } from '~assets/close.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Input } from '~components/Input';
import { CustomSelect as Select } from '~components/Select';
import { HighlightImage } from '~components/HighlightImage';

import {
  Container,
  OptionsHeader,
  DimensionsContainer,
  Button,
  SuppliersContainer
} from './styles';

import {
  MenuAndTableContainer,
  SectionTitle,
} from '~styles/components';
import { api } from '~api';

import { MainProduct, HighlightImage as IHighlightImage, DefaultValueProps } from '~types/main';
import { ConfirmationModal } from '@/src/components/ConfirmationModal';

export function HighlightImages() {
  const [highlightImages, setHighlightImages] = useState<IHighlightImage[]>([] as IHighlightImage[]);
  const [products, setProducts] = useState<DefaultValueProps[]>([]);
  const [deletingHighlightImage, setDeletingHighlightImage] = useState(-1);
  const [currentDeletingHighlightImage, setCurrentDeletingHighlightImage] = useState(null as unknown as IHighlightImage);

  const handleAddHighlightImage = useCallback(() => {
    setHighlightImages(prev => [
      {
        id: Date.now() + prev.length + 1,
        name: '',
        registered: false,
        image: {
          JPG: '',
          WEBP: '',
        }
      },
      ...prev]);
  }, []);

  const handleRemoveHighlightImage = useCallback(async () => {
    try{
      const { id, registered } = currentDeletingHighlightImage;

      const findIndex = highlightImages.findIndex(s => s.id === id);
      
      if(findIndex > -1 ){
        setDeletingHighlightImage(id);

        if(registered)
          await api.delete(`/products/badges/${id}`);

        setHighlightImages(prev => prev.filter(h => h.id !== id));
      }
    } catch (e) {
      console.log('e', e);
    } finally {
      setDeletingHighlightImage(-1);
      setCurrentDeletingHighlightImage(null as unknown as IHighlightImage)
    }
  }, [currentDeletingHighlightImage, highlightImages]);

  const handleHighlightImage = useCallback(async (id, registered, name, url) => {
    try{
      const findIndex = highlightImages.findIndex(h => h.id === id);
    
      if(findIndex > -1){
        const upload = new FormData();

        upload.append('name', name);

        if(!!url) {
          let image = await fetch(url).then(r => r.blob());
          upload.append('image', image);
        }

        const endpoint = registered ? 
        `/products/badges/${id}?_method=PUT` : 
        '/products/badges';
        
        const {
          data: { data }
        } = await api.post(endpoint, upload);
                
        setHighlightImages(prev => prev.map(h => h.id === id ? ({...data, registered: true }) : h))
      }
    } catch (e) {
      console.log('e', e);
    }
  }, [highlightImages]);

  const fetchBadges = useCallback(async () => {
    try {
      const {
        data: { data: badges }
      } = await api.get('/products/badges');

      setHighlightImages(badges.map((b: IHighlightImage) => ({ ...b, registered: true })));
    } catch (error) {
      console.log('error', error)
    }
  }, []);

  useEffect(() => {
    fetchBadges();
  }, [])

  return (
    <>
      <Header route={['Loja Online', 'Imagens de Destaque']} />
      <MenuAndTableContainer>
        <Menu />
        <Container>
          <SectionTitle>
            Imagens de Destaque
          </SectionTitle>
          <OptionsHeader>
            <DimensionsContainer>
              <Input
                name="Largura"
                width="3.75rem"
                validated
                value="1.200"
                disabled
              />
              <span>
                <CloseIcon />
              </span>
              <Input
                name="Altura"
                width="3.75rem"
                validated
                value="1.200"
                disabled
              />
            </DimensionsContainer>
            <Button
              type="button"
              onClick={handleAddHighlightImage}
            >
              Nova Imagem de Destaque
            </Button>
          </OptionsHeader>
          <SuppliersContainer>
            {highlightImages.map((h) =>
              <HighlightImage
                key={h.id}
                picture="https://augeapp.com.br/storage/products/gallery/5365/dragao-de-pau-banguela-como-treinar-seu-dragao-1m-6003-96202.webp"
                highlightImage={h}
                deletingHighlightImage={h.id === deletingHighlightImage}
                updateHighlightImage={
                  ({ name, url = '' }) => handleHighlightImage(h.id, h.registered, name, url)}
                remove={() => setCurrentDeletingHighlightImage(h)}
              />
            )}
          </SuppliersContainer>
        </Container>
      </MenuAndTableContainer>
      <ConfirmationModal
        category={!!currentDeletingHighlightImage ? currentDeletingHighlightImage.name : ''}
        action={handleRemoveHighlightImage}
        setIsModalOpen={() => {
          setCurrentDeletingHighlightImage(null as unknown as IHighlightImage)
        }}
      />
    </>
  );
}
