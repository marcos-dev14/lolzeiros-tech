import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import 'photoswipe/dist/photoswipe.css'

import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';
import { ReactComponent as ViewIcon } from '~/assets/view_white_icon.svg';
import { ReactComponent as EditIcon } from '~/assets/edit_white.svg';
import { ReactComponent as TrashIcon } from '~/assets/trash_white_icon.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { InputContainer, MenuAndTableContainer, SectionTitle } from '~styles/components';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { Button, Container, DimensionsContainer, GalleryContainer, GoBackButton, MeasuresContainer, RulesButton } from './styles';
import { DragPicture } from '@/src/components/DragPicture';
import { TableActionButton } from '@/src/styles/components/tables';
import { Input } from '@/src/components/Input';
import { CustomSelect as Select } from '@/src/components/Select';
import { NoTitleSelect } from '@/src/components/NoTitleSelect';
import { StaticDateBox } from '@/src/components/StaticDateBox';
import { StaticSocialBox } from '@/src/components/StaticSocialBox';
import { TextArea } from '@/src/components/TextArea';
import { IBanner, IBannerImage } from '@/src/types/main';
import { api } from '@/src/services/api';
import { Modal } from '@/src/components/Modal';
import { useRegister } from '@/src/context/register';
import { ErrorModal } from '@/src/components/ErrorModal';
import { getUrl } from '@/src/utils/validation';
import { SuccessModal } from '@/src/components/SuccessModal';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { GalleryImage } from '@/src/components/Draggables/GalleryImage';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { ImagesCarousel } from '@/src/components/ImagesCarousel';

export function EditBanners() {
  const { goBack } = useHistory();
  const { banner, setBanner } = useRegister();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [imageId, setImageId] = useState('');
  const [imageType, setImageType] = useState<'desktop' | 'mobile' | ''>('');
  const [label, setLabel] = useState('');
  const [link, setLink] = useState('');
  const [imagePing, setImagePing] = useState('');

  const [pictures, setPictures] = useState<IBannerImage[]>(banner.desktop_images);
  const [mobilePictures, setMobilePictures] = useState<IBannerImage[]>(banner.mobile_images);
  const [currentBanner, setCurrentBanner] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState('');

  const carouselDesktopPictures = useMemo(() =>
    pictures.map(p => ({ id: p.id, banner: p.url, thumbs: p.url }))
  , [pictures])

  const carouselMobilePictures = useMemo(() =>
    mobilePictures.map(p => ({ id: p.id, banner: p.url, thumbs: p.url }))
  , [mobilePictures])

  const [isDeletingPicture, setIsDeletingPicture] = useState('');

  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [updatingImages, setUpdatingImages] = useState(false);
  const [deletingImages, setDeletingImages] = useState(false);
  
  const [isDraggingDesktop, setIsDraggingDesktop] = useState(false);
  const [isDraggingMobile, setIsDraggingMobile] = useState(false);

  const handleAddImages = useCallback(async () => {
    try {
      setUpdatingImages(true);
      
      let hasDesktopImages = false;
      let hasMobileImages = false;
      const desktopImages = new FormData();
      const mobileImages = new FormData();
      
      desktopImages.append('platform', 'desktop')
      mobileImages.append('platform', 'mobile')

      console.log('pictures', pictures)

      await Promise.all(
        pictures.map(
          async (p, index) => {
            const url = p.url;
            if(!url.includes('blob:')) return '';
            hasDesktopImages = true;
            return desktopImages.append(`images[${index}]`, await getUrl(url));
          })
        );

      await Promise.all(
        mobilePictures.map(
          async (p, index) => {
            const url = p.url;
            if(!url.includes('blob:')) return '';
            hasMobileImages = true;
            return mobileImages.append(`images[${index}]`, await getUrl(url));
          })
        );

        if (hasDesktopImages) {
          const {
            data: {
              data
            }
          } = await api.post(`/banners/${banner.id}/images`, desktopImages);
        
          setPictures(data.desktop_images);
          setBanner({...banner, desktop_images: data.desktop_images})
        }

        if (hasMobileImages) {
          const {
            data: {
              data
            }
          } = await api.post(`/banners/${banner.id}/images`, mobileImages);
        
          setMobilePictures(data.mobile_images);
          setBanner({...banner, mobile_images: data.mobile_images})
        }


      setMessage('Salvo com sucesso');
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao atualizar as imagens.';

      setError(errorMessage);  
    } finally {
      setUpdatingImages(false);
    }
  }, [banner, setBanner, pictures, mobilePictures]);

  const handleEditImages = useCallback(async () => {
    try {
      setUpdatingImages(true);
      
      const request = {
        label,
        link,
        imageping: imagePing
      }      

      await api.put(`/banners/${banner.id}/images/${imageId}`, request);

      const updatedImages =
        imageType === 'desktop' ? 
          pictures.map(p => p.id === imageId ? ({...p, label, imageping: imagePing, link }) : p) : 
          mobilePictures.map(p => p.id === imageId ? ({...p, label, imageping: imagePing, link }) : p)
      
      
      let updatedBanner = {...banner};

      if (imageType === 'desktop') setPictures(updatedImages)
      else setMobilePictures(updatedImages)
      
      Object.assign(
        updatedBanner,
        imageType === 'desktop' ?
          { desktop_images: updatedImages } :
          { mobile_images: updatedImages }
      )

      setImageId('');
      setImageType('');
      setLabel('');
      setLink('');
      setImagePing('');
      // @ts-ignore
      setBanner(updatedBanner)
      setEditModalOpen(false);
      setMessage('Salvo com sucesso');
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao atualizar as imagens.';

      setError(errorMessage);  
    } finally {
      setUpdatingImages(false);
    }
  }, [
      banner,
      setBanner,
      label,
      link,
      pictures,
      mobilePictures,
      imageId,
      imageType,
      imagePing
    ]);

    const handleDeleteImages = useCallback(async (id: string, type: string) => {
      try {
        setDeletingImages(true);
        
        if(!id.includes('new-')) {
          await api.delete(`/banners/${banner.id}/images/${id}`);
        }

        if (type === 'desktop') {
          const updatedImages = pictures.filter(p => p.id != id);
          setPictures(updatedImages);
          setBanner({...banner, desktop_images: updatedImages})
        }
        else {
          const updatedImages = mobilePictures.filter(p => p.id != id);
          setMobilePictures(updatedImages);
          setBanner({...banner, mobile_images: updatedImages })
        } 
      } catch (e) {
        console.log('e', e);
        // @ts-ignore
        const errorMessage = !!e.response ? e.response.data.message :
          'Houve um erro ao atualizar as imagens.';
  
        setError(errorMessage);  
      } finally {
        setDeletingImages(false);
      }
    }, [banner, setBanner, pictures, mobilePictures]);

    const handleDragEndDesktop = useCallback(async e => {
      try {
        const { active, over } = e;
  
        if(active.id !== over.id) {
          const activeIndex = pictures.findIndex(e => e.id === active.id);
          const overIndex = pictures.findIndex(e => e.id === over.id);
          const sortedLinks = arrayMove(pictures, activeIndex, overIndex);
          const request = {
            images: sortedLinks.map((e, i) => ({ id: e.id, order: i + 1 })),
            platform: 'desktop'
          } 
  
          setSorting(true);
          await api.put(`/banners/${banner.id}/images/sort`, request);
          
          setPictures(sortedLinks);
        }
      } catch(e) {
        console.log('e', e);
      } finally {
        setSorting(false);
      }
    }, [pictures, banner])

    const handleDragEndMobile = useCallback(async e => {
      try {
        const { active, over } = e;
  
        if(active.id !== over.id) {
          const activeIndex = mobilePictures.findIndex(e => e.id === active.id);
          const overIndex = mobilePictures.findIndex(e => e.id === over.id);
          const sortedLinks = arrayMove(mobilePictures, activeIndex, overIndex);
          const request = {
            images: sortedLinks.map((e, i) => ({ id: e.id, order: i + 1 })),
            platform: 'mobile'
          } 
  
          setSorting(true);
          await api.put(`/banners/${banner.id}/images/sort`, request);
          
          setMobilePictures(sortedLinks);
        }
      } catch(e) {
        console.log('e', e);
      } finally {
        setSorting(false);
      }
    }, [mobilePictures, banner]);

    const shouldDragDesktop = useMemo(() =>
      pictures.some(p => String(p.id).includes('new-'))
    , [pictures]);

    const shouldDragMobile = useMemo(() =>
      mobilePictures.some(p => String(p.id).includes('new-'))
    , [mobilePictures]);

  return (
    <>
      <Header minimal route={['Cadastro', 'Banner (Publicidade)', 'Editar Banner (Publicidade)']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Container
          onClick={() => {
            setIsDraggingDesktop(false);
            setIsDraggingMobile(false);
          }}
        >
          <InputContainer style={{ marginTop: 0 }}>
            <RulesButton>{banner.name}</RulesButton>
            {/* <RulesButton>{banner.}</RulesButton> */}
            <Button
              type="button"
              style={{ marginLeft: 'auto' }}
              className="viewing"
              onClick={handleAddImages}
              disabled={updatingImages || (!pictures.length && !mobilePictures.length)}
            >
              {updatingImages ? 'Salvando' : 'Salvar'}
            </Button>
            <GoBackButton
              onClick={goBack}
              type="button"
              className="goBack"
              style={{ marginLeft: '1.25rem' }}
            >
              <GoBackIcon />
              <p>Voltar</p>
            </GoBackButton>
          </InputContainer>
          <SectionTitle style={{ marginTop: '1.25rem' }}>
            Desktop
          </SectionTitle>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEndDesktop}
          >
            <GalleryContainer>
              <SortableContext
                disabled={sorting || shouldDragDesktop}
                items={pictures}
                strategy={horizontalListSortingStrategy}
              >
              {pictures.map(({ id, label, url, imageping }) => 
                <GalleryImage
                  key={id}
                  id={id}
                  disabled={isDeletingPicture === id}
                  image={url}
                  dragging={isDraggingDesktop}
                  sorting={sorting}
                  setIsDragging={shouldDragDesktop ? () => {} : setIsDraggingDesktop}
                >
                  <button
                    onClick={() => {
                      setViewModalOpen('desktop');
                      setCurrentBanner(url);
                    }}
                  >
                    <ViewIcon />
                  </button>
                  <button
                    onClick={() => {
                      setImageId(id);
                      setImageType('desktop');
                      setLabel(label);
                      setLink(url);
                      setImagePing(imageping);
                      setEditModalOpen(true);
                    }}
                  >
                    <EditIcon />
                  </button>
                  <button
                    disabled={deletingImages}
                    onClick={() => handleDeleteImages(String(id), 'desktop')}
                  >
                    <TrashIcon />
                  </button>
                </GalleryImage>
              )}
              {/* <GallerySwipe /> */}
              </SortableContext>
              <DragPicture
                noCrop
                file=""
                // @ts-ignore
                setFile={(f) => setPictures(prev => [...prev, { id: `new-${prev.length}`, name: f, url: f }])}
                style={{
                  width: '18.75rem',
                  height: '11.5rem'
                }}
                action="Arraste a imagem do Banner ou clique aqui"
                format="JPG | GIF | PNG"
                deletePicture={() => {}}
                canDelete={false}
              />
            </GalleryContainer>
          </DndContext>
          <SectionTitle style={{ marginTop: '1.25rem' }}>
            Telemóvel
          </SectionTitle>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEndMobile}
          >
            <GalleryContainer>
              <SortableContext
                disabled={sorting || shouldDragMobile}
                items={mobilePictures}
                strategy={horizontalListSortingStrategy}
              >
              {mobilePictures.map(({ id, label, url, imageping }, i) => 
                <GalleryImage
                  key={id}
                  id={id}
                  disabled={isDeletingPicture === id}
                  image={url}
                  dragging={isDraggingMobile}
                  sorting={sorting}
                  setIsDragging={shouldDragMobile ? () => {} : setIsDraggingMobile}
                >
                  <button
                    onClick={() => {
                      setViewModalOpen('mobile');
                      setCurrentBanner(url);
                    }}
                  >
                    <ViewIcon />
                  </button>
                  <button
                    onClick={() => {
                      setImageId(id);
                      setImageType('mobile');
                      setLabel(label);
                      setLink(url);
                      setImagePing(imageping);
                      setEditModalOpen(true);
                    }}
                  >
                    <EditIcon />
                  </button>
                  <button
                    disabled={deletingImages}
                    onClick={() => handleDeleteImages(String(id), 'mobile')}
                  >
                    <TrashIcon />
                  </button>
                </GalleryImage>
              )}
              </SortableContext>
              <DragPicture
                noCrop
                file=""
                // @ts-ignore
                setFile={(f) => setMobilePictures(prev => [...prev, { id: `new-${prev.length}`, name: f, url: f }])}
                style={{
                  width: '18.75rem',
                  height: '11.5rem'
                }}
                action="Arraste a imagem do Banner ou clique aqui"
                format="JPG | GIF | PNG"
                deletePicture={() => {}}
                canDelete={false}
              />
            </GalleryContainer>
            </DndContext>
        </Container>
      </MenuAndTableContainer>
      <Modal
        title="Editar Banner"
        isModalOpen={editModalOpen}
        setIsModalOpen={setEditModalOpen}
        customOnClose={() => {
          setImageId('');
          setImageType('');
          setLabel('');
          setLink('');
          setImagePing('');
        }}
        style={{
          width: '29.4375rem'
        }}
      >
        <InputContainer>
          <Input
            name="Legenda da Imagem"
            width="100%"
            fullW
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <Input
            name="Link do Banner"
            width="100%"
            fullW
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <TextArea
            title="Código de Rastreio"
            width="100%"
            fullW
            height="6.5rem"
            value={imagePing}
            onChange={(e) => setImagePing(e.target.value)}
          />
        </InputContainer>
        <Button
          type="button"
          style={{ marginTop: '1.875rem', width: '100%' }}
          onClick={handleEditImages}
        >
          {updatingImages ? <LoadingIcon className="load" /> : 'Salvar'}
        </Button>
      </Modal>
      <Modal
        // title="Editar Banner"
        isModalOpen={!!viewModalOpen}
        setIsModalOpen={() => {}}
        customOnClose={() => setViewModalOpen('')}
        style={{
          width: '55.5rem'
        }}
      >
        <img src={currentBanner} alt="" style={{ borderRadius: '0.25rem' }} />
        {viewModalOpen === 'desktop' ? 
          <ImagesCarousel
            images={carouselDesktopPictures}
            setImage={setCurrentBanner}
          /> : 
          <ImagesCarousel
            images={carouselMobilePictures}
            setImage={setCurrentBanner}
            // toShow={6}
          />
        }
      </Modal>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
      <SuccessModal
        message={message}
        setIsModalOpen={() => setMessage('')}
      />
    </>
  );
}
