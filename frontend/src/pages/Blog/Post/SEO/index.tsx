import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useQRCode } from 'next-qrcode';
import html2canvas from 'html2canvas';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import * as Yup from 'yup';
import { DragPicture } from '@/src/components/DragPicture';

import { InputContainer, MenuAndTableContainer, ColumnInputContainer, CropImageButton } from '~styles/components';

import { ReactComponent as Logo } from '~assets/auge-logo.svg';
import { ReactComponent as Dragdrop } from '~assets/Dragdrop.svg';
import { ReactComponent as SmartphoneIcon } from '~assets/smartphone.svg';

import { ReactComponent as GoogleIcon } from '~assets/Google.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { FormInput } from '~components/FormInput';
import { CopyBox } from '~components/CopyBox';
import { VerifyUrl } from '~components/VerifyUrl';
import { RadioBox } from '~components/RadioBox';
import { TagInput } from '~components/TagInput';
import { PrimaryColor } from '~components/PrimaryColor';
import { PostHeader } from '~components/PostHeader';
import { FormTitleInput } from '~components/FormTitleInput';
import { TitleInput } from '~components/TitleInput';
import { Modal } from '~components/Modal';
import { ImagesCarousel } from '~components/ImagesCarousel';

import {
  QrCodeInputContainer,
  TagContainer,
  Container,
  CustomSectionTitle,
  SEOAddressContainer,
  SEOAddress,
  SEOTitle,
  SEODescription,
  Button,
  HorizontalTagContainer,
  HorizontalTagContent,
  TagProductInfoContainer
} from './styles';

import { DefaultValueProps, DefaultValuePropsWithId, ITag, MainBlogPost } from '~types/main';
import { api } from '@/src/services/api';
import { ErrorModal } from '@/src/components/ErrorModal';
import { SuccessModal } from '@/src/components/SuccessModal';
import { capitalizeContent, emptyFieldRegex, getUrl, isNotEmpty } from '@/src/utils/validation';
import { useRegister } from '@/src/context/register';
import { useQuery } from 'react-query';
import { fetchBlogData } from '@/src/services/requests';
import { PostActionsButton } from '../styles';
import { subHours } from 'date-fns';

export function PostSEO() {
  const { blogPost, updateBlogPost } = useRegister();
  const { Canvas } = useQRCode();

  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [color, setColor] = useColor("hex", "#3798CD");
  
  const [categoriesOptions, setCategoriesOptions] = useState<DefaultValuePropsWithId[]>([]);
  const [authorsOptions, setAuthorsOptions] = useState<DefaultValuePropsWithId[]>([]);

  const [useQrCodePostTitle, setUseQrCodePostTitle] = useState(() =>
    !!blogPost ? // @ts-ignore
      !!blogPost.qrcode_custom_title ? // @ts-ignore
        blogPost.qrcode_custom_title === 1 ? 'Sim' 
        : 'Não'
      : 'Não'
    : 'Não'
  );   

  const [file, setFile] = useState('');

  const [error, setError] = useState('');  
  const [message, setMessage] = useState('');  
  const [verifyingUrl, setVerifyingUrl] = useState(false);  
  const [checkedUrl, setCheckedUrl] = useState('');  
  const [qrCustomTitle, setQrCustomTitle] = useState('');
  const [savingPost, setSavingPost] = useState(false);
  
  const [openChooseImages, setOpenChooseImages] = useState(false);

  const [customUrl, setCustomUrl] = useState(() => blogPost.full_url ?? '');

  const { data: blogData, isLoading } = useQuery('blogData', fetchBlogData, {
    staleTime: 1000 * 60 * 5,
  });

  const postTitle = useMemo(() => 
    useQrCodePostTitle === 'Sim' ? // @ts-ignore
      !!blogPost.qrcode_title ? blogPost.qrcode_title
      : blogPost.title
    : blogPost.title
  , [useQrCodePostTitle, blogPost])

  const formRef = useRef<FormHandles>(null);

  const [title, setTitle] = useState(() => 
    !!blogPost ?
    'seo_title' in blogPost ? blogPost.seo_title :
    'title' in blogPost ? blogPost.title : ''
    : ''
  );

  const [description, setDescription] = useState(() => 
    !!blogPost ?
    'seo_description' in blogPost ? blogPost.seo_description : ''
    : ''
  );

  const [url, setUrl] = useState(() => 
    !!blogPost ?
    'slug' in blogPost ? blogPost.slug : ''
    : ''
  );
  
  const [seoTags, setSeoTags] = useState<ITag[]>(() => 
    !!blogPost ?
    'seoTags' in blogPost ? blogPost.seoTags :
    !!blogPost.seo_tags ?
    blogPost.seo_tags.split(',').map(s => ({id: s, value: s})) : []
    : []
  );

  const [disabled, setDisabled] = useState(false);
  const [firstImage, setFirstImage] = useState(() => 
    !!blogPost ?
      'qrcode_image1' in blogPost ? blogPost.qrcode_image1 :
        'file' in blogPost ? blogPost.file :
          'pictures' in blogPost ?
          !!blogPost.pictures[0] ? blogPost.pictures[0].image.JPG : ''
        : ''
      : ''
  );

  const [secondImage, setSecondImage] = useState(() => 
    !!blogPost ?
    'qrcode_image2' in blogPost ? blogPost.qrcode_image2 :
      'pictures' in blogPost ?
          !!blogPost.pictures[0] ? blogPost.pictures[0].image.JPG : ''
        : ''
    : ''
  );
  
  const [chosingImage, setChosingImage] = useState<'primeira' | 'segunda'>('primeira');

  const formattedPictures = useMemo(() => 
    !!blogPost ?
      'images' in blogPost ?
        !!blogPost.images.length ?
          blogPost.images.map(p => ({ banner: p.image.JPG, thumbs: p.image.JPG, })) :
          'pictures' in blogPost ?
          blogPost.pictures.map(p => ({ banner: p.image.JPG, thumbs: p.image.JPG, }))
        : []
      : []
    : []
  , [blogPost]);

  // const customUrl = useMemo(() => {
  //   // @ts-ignore
  //   const supplier = String(product.supplier.name).replaceAll(' ', '-').toLowerCase();
    
  //   // @ts-ignore
  //   const category = product.category_id.replaceAll(' ', '-').toLowerCase();
    
  //   // @ts-ignore
  //   const slug = url.replaceAll(' ', '-').toLowerCase();

  //   return `https://augeapp.com.br/produtos/${supplier}/${category}/${slug}`;
  // }, [product, url]);

  const handleOpenImagesModal = useCallback((value: 'primeira' | 'segunda') => {
    if(!blogPost.pictures.length) {
      alert('Você deve adicionar imagens na galeria primeiro.');
      return;
    }

    setChosingImage(value);
    setOpenChooseImages(true);
  }, [blogPost.pictures]);

  const handleUpdateImage = useCallback((value: 'primeira' | 'segunda') => {
    chosingImage === 'primeira' ? setFirstImage(value) : setSecondImage(value);
    setOpenChooseImages(false);
  }, [chosingImage]);

  const handleDownloadImage = useCallback(async () => {
    // @ts-ignore
    const canvas = await html2canvas(document.getElementById('tagContainer'));
    const image = canvas.toDataURL('image/png', 5.0);
    var elem = window.document.createElement('a');
    elem.href = image
    elem.download = !!title ? // @ts-ignore
      `${title.replaceAll(' ', '-').toLowerCase()}.png` :
      'download.png'  
    ;
    
    // @ts-ignore
    elem.style = 'display:none;';
    (document.body || document.documentElement).appendChild(elem);
    if (typeof elem.click === 'function') {
        elem.click();
    } else {
      elem.target = '_blank';
      elem.dispatchEvent(new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
      }));
    }
    URL.revokeObjectURL(elem.href);
    elem.remove(); 
  }, [title])

  const handleVerifyUrl = useCallback(async () => {
    try {
      setVerifyingUrl(true);
    
      await api.post(`/blogs/posts/${blogPost.id}/routes/checks`, {
        url: customUrl
      })
    
      setCheckedUrl(customUrl);
    } catch(e) {  
      console.log('e');
      // @ts-ignore
      setError(e.response.data.message);
      setCheckedUrl('');
    } finally {
      setVerifyingUrl(false);
    }
  }, [blogPost, customUrl]);

  const handleUpdateUrl = useCallback(async () => {
    try {
      setVerifyingUrl(true);
    
      const {
        data: {
          data, message
        }
      } = await api.put(`/blogs/posts/${blogPost.id}/routes`, {
        url: customUrl
      })
      setMessage(message)

      if (!!Object.values(data).length) {
        updateBlogPost({
          ...blogPost,
          url: data.url,
          full_url: data.full_url
        })
      }

    } catch(e) {  
      console.log('e');
      // @ts-ignore
      setError(e.response.data.message)
    } finally {
      setVerifyingUrl(false);
    }
  }, [blogPost, customUrl]);

  // useEffect(() => {
  //   if(!!blogPost.qrcode_color && color.hex !== blogPost.qrcode_color)
  //     setColor({...color, hex: blogPost.qrcode_color })
  // }, [color, setColor, blogPost.qrcode_color]);

  useEffect(() => {
    if(!!blogPost.qrcode_color)
      setColor({...color, hex: blogPost.qrcode_color })
  }, []);

  useEffect(() => {
    if('images' in blogPost) {
      if(!!blogPost.images.length) {
        const { images } = blogPost;

        // @ts-ignore
        setFirstImage(prev => !!prev ? prev : !!images[0] ? images[0].image.JPG : '')
        
        // @ts-ignore
        setSecondImage(prev => !!prev ? prev : !!images[1] ? images[1].image.JPG : '')
        return;
      }

    }

    if('pictures' in blogPost) {
      const { pictures } = blogPost;

      // @ts-ignore
      setFirstImage(prev => !!prev ? prev : !!pictures[0] ? pictures[0].image.JPG : '')
      
      // @ts-ignore
      setSecondImage(prev => !!prev ? prev : !!pictures[1] ? pictures[1].image.JPG : '')   
    }
  }, [blogPost])

  const schema = useMemo(() => 
    Yup.object().shape({
      title: Yup.string().matches(emptyFieldRegex),
      category_id: Yup.string().matches(emptyFieldRegex),
  }), []);

  const handleRegisterPost = useCallback(async () => {
    try {
      setSavingPost(true);

      const {
        category_id,
        author_id,
        file,
        pictures,
        tags,
        published_at,
        featured_until
      } = blogPost;

      // @ts-ignore
      const formData = formRef?.current?.getData();      

      let basePostData = {}
      const category = categoriesOptions.find(c => c.value === category_id);
      const author = authorsOptions.find(a => a.value === author_id);

      if(!!author) { // @ts-ignore
        basePostData = {...basePostData, blog_author_id: author!.id}
      }

      if(!!category) { // @ts-ignore
        basePostData = {...basePostData, category_id: category!.id}
      }
 
      await schema.validate(basePostData);

      const searcheable = tags.reduce((init, value) => `${init},${value.value}`, '').replace(',','');
      const seo_tags =
        !!seoTags ? seoTags.reduce((init, value) => `${init},${value.value}`, '').replace(',','') : [];
            
      let hasMainImage = false;    
      let hasImages = false;
      const mainImageData = new FormData();
      const imagesData = new FormData();
      
      if(file.includes('blob:')) {
        // @ts-ignore
        const formattedFile = await getUrl(file);
        hasMainImage = true;
        mainImageData.append('images', formattedFile);
      }
      
      if(!!pictures.length) {  
        await Promise.all(
          pictures.map(
            async (p, index) => {
              const url = p.image.JPG;
              if(!url.includes('blob:')) return '';
              hasImages = true;
              return imagesData.append(`images[${index + 1}]`, await getUrl(url));
            })
          );
      }
      
      if (hasMainImage) await api.post(`/blogs/posts/${blogPost.id}/main-images`, mainImageData);
      if (hasImages) await api.post(`/blogs/posts/${blogPost.id}/images`, imagesData);

      const formattedData = {
        ...blogPost,
        ...formData,
        ...basePostData,
        // qrcode_image1: firstImage,
        // qrcode_image2: secondImage,
        searcheable,
        seo_tags,
        // @ts-ignore
        published_at: subHours(published_at, 3),
        // @ts-ignore
        featured_until: subHours(featured_until, 3),
      };
            
      const postWithoutNullValues = Object.fromEntries(Object.entries(formattedData).filter(e => !!e[1]));

      const {
        data: {
          data
        }
      } = await api.put(`/blogs/posts/${blogPost.id}`, postWithoutNullValues);
      
      updateBlogPost({ main_image: data.main_image });
      setMessage('Salvo com sucesso')
    } catch(e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar a postagem.';
// @ts-ignore
      setError(errorMessage);
    } finally {
      setSavingPost(false);
    }
  }, [
      updateBlogPost,
      blogPost,
      schema,
      categoriesOptions,
      authorsOptions,
      seoTags,
      firstImage,
      secondImage
    ]);

  useEffect(() => {
    if(!isLoading && !!blogData) {
      setCategoriesOptions(blogData.categoriesOptions)
      setAuthorsOptions(blogData.authorsOptions)
    }
  }, [isLoading, blogData]);

  const handleUpdate = useCallback((field: string, value: string) => {    
    const updatedValue = capitalizeContent(value);
    formRef.current?.setFieldValue(field, updatedValue)
  }, []);

  return (
    <>
      <Header minimal route={['Blog', 'Postagem', 'Seo Google']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Form ref={formRef} onSubmit={() => {}} initialData={blogPost}>
        <Container>
          <PostHeader
            ref={formRef}
            disabled={disabled}
            data={{
              seoTags,
              qrcode_color: color.hex,
              // qrcode_image1: firstImage,
              // qrcode_image2: secondImage
            }}
          >
            <div
              style={{
                margin: '0 0 0 auto',
                borderLeft: '2px solid #eee'
              }}
            >
              <PostActionsButton
                className="viewing"
                style={{ width: '12rem', marginLeft: '1rem' }}
                onClick={handleRegisterPost}
                type="button"
                disabled={savingPost}
              >
                {savingPost ? 'Salvando...' : 'Salvar Postagem'}
              </PostActionsButton>
            </div>
          </PostHeader>
          <CustomSectionTitle>
            SEO para o Google
          </CustomSectionTitle>
          <InputContainer>
            <FormTitleInput
              name="seo_title"
              title="Título do Conteúdo (Ideal entre 15 e 65 caracteres)"
              width="26.25rem"
              validated={false}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={e => {
                setTitle(capitalizeContent(e.target.value));
                handleUpdate('seo_title', e.target.value)
              }}
            />
            <TagInput
              title="Palavras-chave (SEO Google)"
              tags={seoTags}
              setTags={setSeoTags}
              width="54.125rem"
              validated={false}
              onFocus={() => setDisabled(true)}
              onBlur={() => 
                setTimeout(() => setDisabled(false), 2000)
              }
            />
          </InputContainer>
          <InputContainer>
            <FormTitleInput
              name="seo_description"
              title="Descrição da Postagem para o Google (até 166 caracteres)"
              width="100%"
              validated={false}
              maxLength={166}
              onChange={(e) => setDescription(e.target.value)}
              fullW
            />
          </InputContainer>
          <CustomSectionTitle>
            Busca Orgânica do Google
          </CustomSectionTitle>
          <InputContainer style={{ alignItems: 'flex-start' }}>
            <SEOAddressContainer>
              <GoogleIcon style={{ width: '91px', height: '30px' }} />
              <SEOAddress>
                {blogPost.url ?? 'augeapp.com.br/produtos/representada/categoria/nome-do-produto'}
              </SEOAddress>
              <SEOTitle>
                {!!title ? title : 'Título do Conteúdo'}
              </SEOTitle>
              <SEODescription>
                {!!description ? description : 'Aqui vai a descrição do conteúdo.'}
              </SEODescription>
            </SEOAddressContainer>
            <ColumnInputContainer style={{ marginTop: 0, marginLeft: '3.125rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <VerifyUrl
                  name="Digite abaixo um endereço personalizado"
                  width="27.25rem"
                  validated={checkedUrl === customUrl && isNotEmpty(customUrl)}
                  action={handleVerifyUrl}
                  disabled={verifyingUrl}
                  value={customUrl}
                  // @ts-ignore
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                    setUrl(e.target.value);
                  }}
                />
                <Button
                  type="button"
                  onClick={handleUpdateUrl}
                  disabled={checkedUrl !== customUrl || !isNotEmpty(customUrl)}
                >
                  Alterar Endereço
                </Button>
              </div>
              <CopyBox
                name="Endereço Personalizado"
                width="39.1875rem"
                validated={false}
                value={customUrl}
                disabled
              />
            </ColumnInputContainer>
          </InputContainer>
          <CustomSectionTitle>
            QRCode para Redes Sociais e Impressão de Etiqueta
          </CustomSectionTitle>
          <QrCodeInputContainer>
            <PrimaryColor
              color={color.hex}
              onClick={() => setOpenColorPicker(true)}
            />
            <RadioBox
              title="Título da Postagem QRCode"
              value={useQrCodePostTitle}
              setValue={(value: string) => {
                setUseQrCodePostTitle(value); // @ts-ignore
                updateBlogPost({...blogPost, qrcode_custom_title: Number(value === 'Sim')})
              }}
            />
            <FormTitleInput
              name="qrcode_title"
              title="Título da Postagem QRCode (Ideal entre 15 e 65 caracteres)"
              width="26.25rem"
              disabled={useQrCodePostTitle === 'Não'}
              validated={false}
              // onChange={(e) => setQrCustomTitle(e.target.value)}
              onBlur={(e) => {
                const qrcode_title = capitalizeContent(e.target.value);
                // @ts-ignore
                updateBlogPost({...blogPost, qrcode_title });
                handleUpdate('qrcode_title', e.target.value);
              }}
            />
          </QrCodeInputContainer>
          <QrCodeInputContainer>
            <TagContainer
              id="tagContainer"
              style={{ borderColor: color.hex }}
            >
              <Canvas
                text={!!customUrl ? customUrl : 'auge'}
                options={{
                  type: 'image/jpeg',
                  quality: 0.5,
                  level: 'M',
                  margin: 1,
                  scale: 4,
                  width: 148,
                }}
              />
              <TagProductInfoContainer>
                <strong>
                  {postTitle}
                </strong>
                <Logo style={{ border: 'none' }} />
              </TagProductInfoContainer>
              <DragPicture
                file={file}
                noCrop
                setFile={setFile}
                format="JPG | PNG"
                accept="image/jpeg, image/jpg, image/png"
                style={{
                  borderRadius: 0,
                  width: '100%',
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  height: '11.5rem',
                  objectFit: 'cover',
                  cursor: 'pointer'
                }}
              />
            </TagContainer>
            <HorizontalTagContainer
              style={{ borderColor: color.hex }}            
            >
              <Canvas
                text={!!customUrl ? customUrl : 'auge'}
                options={{
                  type: 'image/jpeg',
                  quality: 0.5,
                  level: 'M',
                  margin: 1,
                  scale: 4,
                  width: 200,
                }}
              />
              <HorizontalTagContent>
                <div>
                  <SmartphoneIcon  style={{ border: 'none', height: 45, width: 33 }} />
                  <b>Compre pelo aplicativo!</b>
                </div>
                <strong>
                  {postTitle}
                </strong>
                <div>
                  <Logo style={{ width: '184px', height: '50px', border: 'none' }} />
                </div>
              </HorizontalTagContent>
            </HorizontalTagContainer>
          </QrCodeInputContainer>
          <InputContainer style={{ justifyContent: 'flex-end' }}>
            <Button type="button" style={{ width: '20rem' }} onClick={handleDownloadImage}>Download para Impressão de Etiquetas</Button>
            <Button type="button" style={{ width: '20rem' }}>Download para Redes Sociais</Button>
          </InputContainer>
        </Container>
        </Form>
      </MenuAndTableContainer>
      <Modal
        isModalOpen={openColorPicker}
        setIsModalOpen={setOpenColorPicker}
        style={{ height: 450 }}
      >
        <ColorPicker
          width={250}
          height={180}
          color={color}
          // @ts-ignore
          onChange={(c) => {
            setColor(c);
            updateBlogPost({...blogPost, qrcode_color: c.hex})
          }}
          hideHSV
          hideRGB
          dark
        />
        <CropImageButton
          type="button"
          onClick={() => setOpenColorPicker(false)}
          style={{ width: '80%' }}
        >
          Selecionar Cor
        </CropImageButton>
      </Modal>
      <Modal
        isModalOpen={openChooseImages}
        setIsModalOpen={setOpenChooseImages}
        style={{ height: 250, alignItems: 'center' }}
      >
        <h2>Selecione a {chosingImage} imagem:</h2>
        <ImagesCarousel
          images={formattedPictures}
          setImage={handleUpdateImage}
          toShow={3}
          style={{
            alignSelf: 'center',
            maxWidth: 588
          }}
        />
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

