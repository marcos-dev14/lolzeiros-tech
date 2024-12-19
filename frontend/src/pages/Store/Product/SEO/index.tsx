import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useQRCode } from 'next-qrcode';
import html2canvas from 'html2canvas';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import * as Yup from 'yup';
import * as htmlToImage from "html-to-image";

import { InputContainer, MenuAndTableContainer, ColumnInputContainer, CropImageButton } from '~styles/components';

import { ReactComponent as Logo } from '~assets/auge-logo.svg';
import { ReactComponent as BarCode } from '~assets/barcode.svg';
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
import { ProductHeader } from '~components/ProductHeader';
import { FormTitleInput } from '~components/FormTitleInput';
import { TitleInput } from '~components/TitleInput';
import { Modal } from '~components/Modal';
import { ImagesCarousel } from '~components/ImagesCarousel';

import { useProduct } from '~context/product';

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
  TagBarcodeContainer,
  TagProductInfoContainer
} from './styles';

import { DefaultValueProps, HighlightImage, IBrand, ICategory, Image, ITag, MainProduct, Supplier } from '~types/main';
import { api } from '@/src/services/api';
import { ErrorModal } from '@/src/components/ErrorModal';
import { SuccessModal } from '@/src/components/SuccessModal';
import { emptyFieldRegex, getUrl, isNotEmpty } from '@/src/utils/validation';
import { PostActionsButton } from '../styles';
import { useQuery } from 'react-query';
import { fetchProductsData } from '@/src/services/requests';
import { DragPicture } from '@/src/components/DragPicture';

export function SEO() {
  const { product, updateProduct, supplier } = useProduct();
  const { Canvas } = useQRCode();

  const printRef = useRef(null);

  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [color, setColor] = useColor("hex", "#3798CD");

  const [file, setFile] = useState('');
  const [secondFile, setSecondFile] = useState('');

  const [useQrCodePostTitle, setUseQrCodePostTitle] = useState(() =>
    !!product ?
      !!product.qrcode_custom_title ? // @ts-ignore
        product.qrcode_custom_title === 1 ? 'Sim'
          : 'Não'
        : 'Não'
      : 'Não'
  );
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [verifyingUrl, setVerifyingUrl] = useState(false);
  const [checkedUrl, setCheckedUrl] = useState('');

  const [savingProduct, setSavingProduct] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  // const [badges, setBadges] = useState<HighlightImage[]>([]);
  // const [badgeOptions, setBadgeOptions] = useState<DefaultValueProps[]>([]);

  const [openChooseImages, setOpenChooseImages] = useState(false);

  const [customUrl, setCustomUrl] = useState(() => product.full_url ?? '');

  const postTitle = useMemo(() =>
    useQrCodePostTitle === 'Sim' ?
      !!product.qrcode_title ? product.qrcode_title
        : product.title
      : product.title
    , [useQrCodePostTitle, product])

  const formRef = useRef<FormHandles>(null);

  const [title, setTitle] = useState(() =>
    !!product ?
      'seo_title' in product ? product.seo_title :
        'title' in product ? product.title : ''
      : ''
  );

  const [description, setDescription] = useState(() =>
    !!product ?
      'seo_description' in product ? product.seo_description : ''
      : ''
  );

  const [url, setUrl] = useState(() =>
    !!product ?
      'slug' in product ? product.slug : ''
      : ''
  );

  const [seoTags, setSeoTags] = useState<ITag[]>(() =>
    !!product ?
      !!product.seo_tags ? product.seo_tags.split(',').map(s => ({ id: s, value: s }))
        : []
      : []
  );

  const [disabled, setDisabled] = useState(false);
  const [firstImage, setFirstImage] = useState(() =>
    !!product ?
      'qrcode_image1' in product ? product.qrcode_image1 :
        'file' in product ? product.file :
          'pictures' in product ?
            !!product.pictures[0] ? product.pictures[0].image.JPG : ''
            : ''
      : ''
  );

  const [secondImage, setSecondImage] = useState(() =>
    !!product ?
      'qrcode_image2' in product ? product.qrcode_image2 :
        'pictures' in product ?
          !!product.pictures[0] ? product.pictures[0].image.JPG : ''
          : ''
      : ''
  );

  const [chosingImage, setChosingImage] = useState<'primeira' | 'segunda'>('primeira');

  const formattedPictures = useMemo(() =>
    !!product ?
      'images' in product ?
        !!product.images.length ?
          product.images.map(p => ({ banner: p.image.JPG, thumbs: p.image.JPG, })) :
          'pictures' in product ?
            product.pictures.map(p => ({ banner: p.image.JPG, thumbs: p.image.JPG, }))
            : []
        : []
      : []
    , [product]);

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
    if (!product.pictures.length) {
      alert('Você deve adicionar imagens na galeria primeiro.');
      return;
    }

    setChosingImage(value);
    setOpenChooseImages(true);
  }, [product.pictures]);

  const handleUpdateImage = useCallback((value: 'primeira' | 'segunda') => {
    chosingImage === 'primeira' ? setFirstImage(value) : setSecondImage(value);
    setOpenChooseImages(false);
  }, [chosingImage]);

  const handleDownloadImage = useCallback(async () => {
    // @ts-ignore
    const canvas = await html2canvas(document.getElementById('tagContainer', { allowTaint: true, logging: true, useCORS: true }));
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
  // const handleDownloadImage = useCallback(async () => {
  //   const element = printRef.current;

  //   if(!element) return;
  //   // @ts-ignore
  //   const canvas = await html2canvas(element, {
  //     allowTaint: false,
  //     backgroundColor: "none",
  //     logging: true,
  //     useCORS: true //to enable cross origin perms
  //   });

  //   const data = canvas.toDataURL("image/jpg");
  //   const link = document.createElement("a");

  //   if (typeof link.download === "string") {
  //     link.href = data;

  //     link.download = "image.jpg";

  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } else {
  //     window.open(data);
  //   }
  // }, []);
  // const createFileName = useCallback((extension = "", ...names) => {
  //   if (!extension) {
  //     return "";
  //   }

  //   return `${names.join("")}.${extension}`;
  // }, []);

  // const takeScreenShot = useCallback(async (node) => {
  //   const dataURI = await htmlToImage.toJpeg(node);
  //   return dataURI;
  // }, []);

  // const download = useCallback((image, { name = "img", extension = "jpg" } = {}) => {
  //   const a = document.createElement("a");
  //   a.href = image;
  //   a.download = createFileName(extension, name);
  //   a.click();
  // }, []);

  // const handleDownloadImage = useCallback(async () => 
  //   takeScreenShot(printRef.current).then(download)
  // , []);

  const handleVerifyUrl = useCallback(async () => {
    try {
      setVerifyingUrl(true);

      await api.post(`/products/${product.id}/routes/checks`, {
        url: customUrl
      })

      setCheckedUrl(customUrl);
    } catch (e) {
      console.log('e');
      // @ts-ignore
      setError(e.response.data.message);
      setCheckedUrl('');
    } finally {
      setVerifyingUrl(false);
    }
  }, [product, customUrl]);

  const handleUpdateUrl = useCallback(async () => {
    try {
      setVerifyingUrl(true);

      const {
        data: {
          data, message
        }
      } = await api.put(`/products/${product.id}/routes`, {
        url: customUrl
      })

      setMessage(message)

      if (!!Object.values(data).length) {
        updateProduct({
          ...product,
          url: data.url,
          full_url: data.full_url
        })
      }

    } catch (e) {
      console.log('e');
      // @ts-ignore
      setError(e.response.data.message)
    } finally {
      setVerifyingUrl(false);
    }
  }, [product, customUrl]);

  const { data: productsData, isLoading } = useQuery(['productsData', supplier.id], fetchProductsData, {
    staleTime: 1000 * 60 * 5,
  });

  const schema = useMemo(() =>
    Yup.object().shape({
      title: Yup.string().matches(emptyFieldRegex),
      supplier_id: Yup.string().matches(emptyFieldRegex),
      brand_id: Yup.string().matches(emptyFieldRegex),
      category_id: Yup.string().matches(emptyFieldRegex),
      reference: Yup.string().matches(emptyFieldRegex),
      ean13: Yup.string().matches(emptyFieldRegex),
    }), []);


  const handleRegisterProduct = useCallback(async () => {
    try {
      setSavingProduct(true);
      // @ts-ignore
      const formData = formRef?.current?.getData();

      const {
        certificationTags,
        expiration_date,
        file,
        tags,
        pictures,
        highlightImage,
        supplier_id,
        brand_id,
        category_id,
        // qrcode_image1,
        // qrcode_image2
      } = product;

      const supplier = suppliers.find(s => s.name === supplier_id);
      const brand = brands.find(b => b.name === brand_id);
      const category = categories.find(c => c.name === category_id);

      // const currentBadge =
      //   typeof highlightImage === 'string' ? highlightImage : highlightImage.value;

      // @ts-ignore 
      // const badge = badgeOptions.find(b => b.value === currentBadge);

      const baseProductData = {
        supplier_id: supplier?.id,
        brand_id: brand?.id,
        category_id: category?.id,
        // @ts-ignore
        use_video: product.useYoutubeLink === 'Sim' ? 1 : 0,
      };

      // if(!!product.highlightImage && !!currentBadge) {
      //   // @ts-ignore
      //   Object.assign(baseProductData, { badge_id: badge!.id })
      // }

      await schema.validate(baseProductData);

      const searcheable = tags?.reduce((init, value) => `${init},${value.value}`, '').replace(',', '');

      const certification =
        !!certificationTags ? certificationTags?.reduce((init, value) => `${init},${value.value}`, '').replace(',', '') : [];

      let hasImages = false;
      let hasFirstImage = false;
      const mainImageData = new FormData();
      const imagesData = new FormData();

      if (file?.includes('blob:')) {
        // @ts-ignore
        const formattedFile = await getUrl(file);
        hasFirstImage = true;
        mainImageData.append('images', formattedFile);
      }

      if (!!pictures.length) {
        await Promise.all(
          pictures.map(
            async (p, index) => {
              const url = p.image.JPG;
              if (!url?.includes('blob:')) return '';
              hasImages = true;

              return imagesData.append(`images[${index + 1}]`, await getUrl(url));
            })
        );
      }
      if (hasFirstImage)
        await api.post(`/products/${product.id}/main-images`, mainImageData);
      if (hasImages) {
        await api.post(`/products/${product.id}/images`, imagesData);
      }

      const formattedData = {
        ...product,
        ...formData,
        ...baseProductData,
        searcheable,
        certification,
        // published_at:
        //   typeof published_at === 'string' ? published_at :
        //     // @ts-ignore
        //     published_at.toISOString(),
        // featured_until:
        //   typeof featured_until === 'string' ? featured_until :
        //     // @ts-ignore
        //     featured_until.toISOString(),
        //   expiration_date: !!expiration_date ?
        //     typeof expiration_date === 'string' ?
        //       expiration_date :
        //       // @ts-ignore
        //       expiration_date.toISOString() : 
        //     new Date(),
      };

      // if (typeof 'a' === 'string') return;

      // @ts-ignore
      delete formattedData.dispay_code;

      // @ts-ignore
      delete formattedData.qrcode_image1;

      // @ts-ignore
      delete formattedData.qrcode_image2;

      // @ts-ignore
      delete formattedData.embed;
      // @ts-ignore
      delete formattedData.embed_id;
      // @ts-ignore
      delete formattedData.embed_title;
      // @ts-ignore
      delete formattedData.embed_type;

      await api.put(`/products/${product.id}`, formattedData);

      // updateProduct({} as unknown as MainProduct);
      setMessage('Salvo com sucesso')
    } catch (e) {
      console.log('e', e);
      // @ts-ignore
      const errorMessage = !!e.response ? e.response.data.message :
        'Houve um erro ao salvar o produto.';

      setError(errorMessage);
    } finally {
      setSavingProduct(false);
    }
  }, [
    suppliers,
    brands,
    categories,
    updateProduct,
    product,
    schema
    // badgeOptions
  ]);

  // useEffect(() => {
  // if(!!product.qrcode_color && color.hex !== product.qrcode_color)
  // setColor({...color, hex: product.qrcode_color })
  // }, [color, setColor, product.qrcode_color]);

  useEffect(() => {
    if (!!product.qrcode_color)
      setColor({ ...color, hex: product.qrcode_color })
  }, []);

  useEffect(() => {
    if ('images' in product) {
      if (!!product.images.length) {
        const { images } = product;

        // @ts-ignore
        setFirstImage(prev => !!prev ? prev : !!images[0] ? images[0].image.JPG : '')

        // @ts-ignore
        setSecondImage(prev => !!prev ? prev : !!images[1] ? images[1].image.JPG : '')
        return;
      }

    }

    if ('pictures' in product) {
      const { pictures } = product;

      // @ts-ignore
      setFirstImage(prev => !!prev ? prev : !!pictures[0] ? pictures[0].image.JPG : '')

      // @ts-ignore
      setSecondImage(prev => !!prev ? prev : !!pictures[1] ? pictures[1].image.JPG : '')
    }
  }, [product])

  useEffect(() => {
    if (!isLoading && !!productsData) {

      setSuppliers(productsData.suppliers);
      setBrands(productsData.brands);
      setCategories(productsData.categories);
      // setBadges(productsData.badges);
    }
  }, [isLoading, productsData]);

  return (
    <>
      <Header minimal route={['Loja Online', 'Produto', 'Editar Produto']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Form ref={formRef} onSubmit={() => { }} initialData={product}>
          <Container>
            <ProductHeader
              ref={formRef}
              disabled={disabled}
              data={{
                qrcode_color: color.hex,
                qrcode_image1: firstImage,
                qrcode_image2: secondImage,
              }}
            >
              <div
                style={{
                  margin: '0 1rem',
                  borderLeft: '2px solid #eee'
                }}
              >
                <PostActionsButton
                  className="viewing"
                  style={{ width: '14rem', marginLeft: '1rem' }}
                  onClick={handleRegisterProduct}
                  type="button"
                  disabled={savingProduct}
                >
                  {savingProduct ? 'Salvando...' : 'Salvar Produto'}
                </PostActionsButton>
              </div>
            </ProductHeader>
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
              />
              <TagInput
                title="Palavras-chave (SEO Google)"
                tags={seoTags}
                // @ts-ignore
                setTags={(value) => {
                  setSeoTags(value);
                  updateProduct({ ...product, seo_tags: value.map((e: ITag) => e.value).join(',') })
                }}
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
                  {product.url ?? 'augeapp.com.br/produtos/representada/categoria/nome-do-produto'}
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
                  updateProduct({ ...product, qrcode_custom_title: Number(value === 'Sim') })
                }}
              />
              <FormTitleInput
                name="qrcode_title"
                title="Título da Postagem QRCode (Ideal entre 15 e 65 caracteres)"
                width="26.25rem"
                disabled={useQrCodePostTitle === 'Não'}
                validated={false}
                onBlur={(e) =>
                  updateProduct({ ...product, qrcode_title: e.target.value })
                }
              />
            </QrCodeInputContainer>
            <QrCodeInputContainer>
              <TagContainer
                id="tagContainer"
                ref={printRef}
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
                <TagProductInfoContainer>
                  <TagBarcodeContainer>
                    <BarCode style={{ border: 'none' }} />
                    <p>Referência {product.reference}</p>
                  </TagBarcodeContainer>
                  <strong>
                    {postTitle}
                  </strong>
                  <Logo style={{ border: 'none' }} />
                </TagProductInfoContainer>
                <img
                  // @ts-ignore
                  src={!!firstImage ? typeof firstImage === 'string' ? firstImage : firstImage.image.JPG : ''}
                  // src="https://lh3.googleusercontent.com/acezh821GREUTqwpxvzCnLtRfEkmkLF1aHSj3d8RYRFMvdCA0KL-9IN7XvJnke2agLv3pq-dpU2ceTehC3MFB22EnOgps0UbLVU0ujg=w600"
                  alt=""
                  onClick={() => handleOpenImagesModal('primeira')}
                />
                {/* <DragPicture
                file={file}
                noCrop
                setFile={(file) => {
                  // updateProduct({...product, qrcode_image1: file });
                  // setFirstImage(file);
                  setFile(file);
                }}
                format="JPG | PNG"
                accept="image/jpeg, image/jpg, image/png"
                style={{
                  borderRadius: 0
                }}
              />
              <DragPicture
                file={secondFile}
                noCrop
                setFile={(file) => {
                  // updateProduct({...product, qrcode_image2: file });
                  // setSecondImage(file);
                  setSecondFile(file);
                }}
                format="JPG | PNG"
                accept="image/jpeg, image/jpg, image/png"
                style={{
                  borderRadius: 0
                }}
              /> */}
                <img
                  // @ts-ignore
                  src={!!secondImage ? typeof secondImage === 'string' ? secondImage : secondImage.image.JPG : ''}
                  // src="https://lh3.googleusercontent.com/acezh821GREUTqwpxvzCnLtRfEkmkLF1aHSj3d8RYRFMvdCA0KL-9IN7XvJnke2agLv3pq-dpU2ceTehC3MFB22EnOgps0UbLVU0ujg=w600"
                  alt=""
                  onClick={() => handleOpenImagesModal('segunda')}
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
                    <SmartphoneIcon style={{ border: 'none', height: 45, width: 33 }} />
                    <b>Compre pelo aplicativo!</b>
                  </div>
                  <strong>
                    {postTitle}
                  </strong>
                  <div>
                    <Logo style={{ width: '184px', height: '50px', border: 'none' }} />
                    <div>
                      <BarCode style={{ width: '27px', height: '20px', marginRight: '0.375rem', border: 'none' }} />
                      <p>Referência {product.reference}</p>
                    </div>
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
            updateProduct({ ...product, qrcode_color: c.hex })
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
