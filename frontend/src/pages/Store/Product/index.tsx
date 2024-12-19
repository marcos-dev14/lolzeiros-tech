import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { subHours } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { ReactComponent as DeletePdfIcon } from '~assets/close.svg';
import { ReactComponent as CloseIcon } from '~assets/close_white.svg';
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';
import { ReactComponent as PdfIcon } from '~assets/pdf-ico.svg';
import { ReactComponent as PlusIcon } from '~assets/plus.svg';
import { ReactComponent as ReadingIcon } from '~assets/reading.svg';
import { ReactComponent as SeeIcon } from '~assets/see.svg';
import { ReactComponent as YoutubeIcon } from '~assets/youtube-ico.svg';

import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { FormInput } from '~components/FormInput';
import { FormSelect } from '~components/FormSelect';
import { FormTitleInput } from '~components/FormTitleInput';
import { GalleryPhoto } from '~components/GalleryPhoto';
import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { TitleInput } from '~components/TitleInput';
// import { MeasureBox } from '~components/MeasureBox';
import { DateBox } from '~components/DateBox';
import { ProductHeader } from '~components/ProductHeader';
import { RadioBox } from '~components/RadioBox';
import { SocialBox } from '~components/SocialBox';
import { TagInput } from '~components/TagInput';
// import { Editor } from '~components/Editor';
import { DragPicture } from '~components/DragPicture';
import { ErrorModal } from '~components/ErrorModal';
import { ImportPdf } from '~components/ImportPdf';
import { Modal } from '~components/Modal';
import { SuccessModal } from '~components/SuccessModal';

import { api } from '~api';
import {
  DefaultValueProps,
  IBrand,
  ICategory,
  HighlightImage as IHighlightImage,
  ITag,
  Image,
  MainProduct,
  PDFFile,
  Supplier
} from '~types/main';

import { emptyFieldRegex, getUrl, isNotEmpty } from '~utils/validation';

import { ContentEditor as Editor } from '@/src/components/CKEditor';
import { Input } from '@/src/components/Input';
import { fetchProductsData } from '@/src/services/requests';
import { TableActionButton } from '@/src/styles/components/tables';
import { calculateReadingTime } from '@/src/utils/calculateReadingTime';
import { useQuery } from 'react-query';
import { useProduct } from '~context/product';
import {
  Attachment,
  Button,
  ColumnContainer,
  Container,
  CustomSectionTitle,
  DimensionsContainer,
  GalleryContainer,
  GalleryImage,
  HighlightImage,
  MainImageContainer,
  MaxFilesizeText,
  PostActionsButton,
  ProductsContainer,
  ViewProduct
} from './styles';

export function Product() {
  const { product, updateProduct, supplier } = useProduct();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [useYoutubeLink, setUseYoutubeLink] = useState<'Sim' | 'Não'>('Não');
  const [importPdfModalOpen, setImportPdfProductModalOpen] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [isDeletingPicture, setIsDeletingPicture] = useState(-1);
  const [embedValue, setEmbedValue] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [embedOptions, setEmbedOptions] = useState<MainProduct[]>([]);
  const [addingEmbed, setAddingEmbed] = useState(false);
  const [cleaningEmbed, setCleaningEmbed] = useState(false);

  const [pictures, setPictures] = useState<Image[]>(() =>
    !!product ?
      'pictures' in product ? product.pictures :
        !!product.images ? product.images : [] :
      []
  );
  const [primaryContent, setPrimaryContent] = useState<string>(
    () => !!product.primary_text ? product.primary_text : '');
  const [readingTime, setReadingTime] = useState('0');
  const [secondaryContent, setSecondaryContent] = useState<string>(
    () => !!product.secondary_text ? product.secondary_text : ''
  );

  const [tags, setTags] = useState<ITag[]>(() =>
    !!product ?
      'tags' in product ? product.tags :
        !!product.searcheable ? product.searcheable.split(',').map(s => ({ id: s, value: s })) : []
      : []
  );

  const [file, setFile] = useState(() =>
    product && 'file' in product ? product.file :
      product && product.main_image ? product.main_image.image.JPG :
        ''
  );

  const [highlightImage, setHighlightImage] = useState<DefaultValueProps>(() =>
    !!product ?
      'highlightImage' in product ? product.highlightImage : // @ts-ignore
        !!product.badge ? product.badge.image.JPG :
          !!product.images ? !!product.images[0] ? product.images[0].image.JPG : ''
            : ''
      : ''
  );

  const [pdf, setPdf] = useState<PDFFile[]>(() =>
    !!product ?
      'pdf' in product ? product.pdf : // @ts-ignore
        !!product.files ? // @ts-ignore
          !!product.files.length ? product.files.map(f => ({ ...f, fileUrl: f.url })) : []
          // !!product.files.length ? { ...product.files[0], fileUrl: product.files[0].url }: {} as PDFFile
          : []
      : []
  );

  const [currentPdf, setCurrentPdf] = useState<PDFFile>({} as PDFFile);

  const [pdfName, setPdfName] = useState('');

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [suppliersOptions, setSuppliersOptions] = useState<DefaultValueProps[]>([]);

  const [brands, setBrands] = useState<IBrand[]>([]);
  const [brandsOptions, setBrandsOptions] = useState<DefaultValueProps[]>([]);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoriesOptions, setCategoriesOptions] = useState<DefaultValueProps[]>([]);

  const [badges, setBadges] = useState<IHighlightImage[]>([]);
  const [badgeOptions, setBadgeOptions] = useState<DefaultValueProps[]>([]);

  const [savingProduct, setSavingProduct] = useState(false);
  const [loopingPlaceholder, setLoopingPlaceholder] = useState('');

  const [deletingPdf, setDeletingPdf] = useState('-1');

  const formRef = useRef<FormHandles>(null);

  const { push } = useHistory();

  // @ts-ignore
  const { data: productsData, isLoading } = useQuery(['productsData', supplier.id], fetchProductsData, {
    staleTime: 1000 * 60 * 5,
  });

  // const fetchSupplierData = useCallback(async () => {
  //   try {
  //     const { id } = supplier;

  //     const [
  //       suppliersResponse,
  //       categoriesResponse,
  //       brandsResponse,
  //       badgesResponse,
  //       productsResponse
  //     ] = await Promise.all([
  //       api.get('products/suppliers'),
  //       api.get(`products/suppliers/${id}/categories`),
  //       api.get('products/brands'),
  //       api.get('products/badges'),
  //       api.get(`products?by_supplier=${id}`),
  //     ]);

  //     const {
  //       data: {
  //         data: suppliers
  //       }
  //     } = suppliersResponse;

  //     const {
  //       data: {
  //         data: categories
  //       }
  //     } = categoriesResponse;

  //     const {
  //       data: {
  //         data: brands
  //       }
  //     } = brandsResponse;

  //     const {
  //       data: {
  //         data: badges
  //       }
  //     } = badgesResponse;

  //     const {
  //       data: {
  //         data: { data: products }
  //       }
  //     } = productsResponse;

  //     setSuppliers(suppliers);
  //     setBrands(brands);
  //     setCategories(categories);
  //     setBadges(badges);

  //     setSuppliersOptions(suppliers.map((s: Supplier) => ({ value: s.name, label: s.name })));
  //     setBrandsOptions(brands.map((b: IBrand) => ({ value: b.name, label: b.name })));
  //     setCategoriesOptions(categories.map((c: ICategory) => ({ value: c.name, label: c.name })));
  //     setBadgeOptions(badges.map((b: IHighlightImage) => ({ id: b.id, value: b.image.JPG, label: b.name })));
  //   } catch (error) {
  //     console.log('Aconteceu um erro');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [supplier])

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
      const selectedSupplier = formRef?.current?.getFieldValue('supplier_id');
      const selectedBrand = formRef?.current?.getFieldValue('brand_id');
      const selectedCategory = formRef?.current?.getFieldValue('category_id');
      const published_at = formRef?.current?.getFieldValue('published_at');
      const featured_until = formRef?.current?.getFieldValue('featured_until');
      const embed_type = formRef?.current?.getFieldValue('embed_type');
      const embed_title = formRef?.current?.getFieldValue('embed_title');
      const badgeValue = formRef?.current?.getFieldValue('badge');

      const supplier = suppliers.find(s => s.name === selectedSupplier);



      const brand = brands.find(b => b.name === selectedBrand);


      const category = categories.find(c => c.name === selectedCategory);

      const currentBadge = typeof highlightImage === 'string' ? highlightImage : highlightImage.value;
      // @ts-ignore
      const badge = badgeOptions.find(b => b.value === currentBadge);

      const baseProductData = {
        //   supplier_id: supplier!.id,
        //   brand_id: brand!.id,
        //   category_id: category!.id,
        //   use_video: useYoutubeLink === 'Sim' ? 1 : 0,
      };

      // @ts-ignore
      if (!!highlightImage && !!badgeValue && (!!badge && !!badge.id)) {
        // @ts-ignore
        Object.assign(baseProductData, { badge_id: badge!.id })
      }

      await schema.validate(baseProductData);

      const {
        certificationTags,
        expiration_date,
        // qrcode_image1,
        // qrcode_image2
      } = product;

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

      console.log('hasImages', hasImages)
      console.log('imagesData', imagesData.entries())


      if (hasFirstImage)
        await api.post(`/products/${product.id}/main-images`, mainImageData);
      if (hasImages) {
        await api.post(`/products/${product.id}/images`, imagesData);
      }

      // if (hasImages) {
      //   const {
      //     data: { data }
      //   } = await api.post(`/products/${product.id}/images`, imagesData);

      //   let updatedPictures: Image[] = [];
      //   let filteredPictures = pictures.filter(p => !p.image.JPG.includes('blob:'));

      //   if(hasFirstImage) {
      //     const [firstImage, ...rest] = data;
      //     updatedPictures[0] = firstImage;

      //     updatedPictures = [...updatedPictures, ...filteredPictures, ...rest];
      //     // @ts-ignore
      //     setFile(updatedPictures[0].image.JPG);
      //   }
      //   else {
      //     updatedPictures = [...updatedPictures, ...filteredPictures, ...data];
      //   }

      //   updateProduct({
      //     ...product,
      //     pictures: updatedPictures,
      //     images: updatedPictures,
      //     file: hasFirstImage ? updatedPictures[0].image.JPG : file
      //   });

      //   setPictures(updatedPictures);
      // };

      const formattedData = {
        ...product,
        ...formData,
        ...baseProductData,
        brand_id: brand?.id,
        category_id: category?.id,
        use_video: useYoutubeLink === 'Sim' ? 1 : 0,
        primary_text: primaryContent,
        secondary_text: secondaryContent,
        searcheable,
        certification,
        embed_type,
        embed_title,
        published_at: subHours(published_at, 3),
        // published_at,
        featured_until: subHours(featured_until, 3),
        // featured_until,
        // @ts-ignore
        expiration_date: subHours(expiration_date, 3),
        // expiration_date,
      };

      // if (typeof 'a' === 'string') return;

      // @ts-ignore
      delete formattedData.dispay_code;

      // @ts-ignore
      delete formattedData.qrcode_image1;

      // @ts-ignore
      delete formattedData.qrcode_image2;

      // @ts-ignore
      // delete formattedData.embed;
      // @ts-ignore
      // delete formattedData.embed_id;
      // @ts-ignore
      // delete formattedData.embed_title;
      // @ts-ignore
      delete formattedData.file;
      if (!!formattedData.main_image) {
        // @ts-ignore
        delete formattedData.main_image;
      }
      // @ts-ignore
      delete formattedData.images;
      // @ts-ignore
      delete formattedData.pictures;
      // @ts-ignore
      delete formattedData.highlightImage;
      // @ts-ignore
      delete formattedData.supplier;
      // @ts-ignore
      delete formattedData.category;
      // @ts-ignore
      delete formattedData.brand;

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
  }, [suppliers, brands, categories, highlightImage, file, pictures, product, primaryContent, secondaryContent, useYoutubeLink, schema, tags, badgeOptions]);

  const formattedProduct = useMemo(() => {
    if (!product) return {} as unknown as MainProduct;
    const {
      supplier,
      supplier_id,
      category,
      category_id,
      brand_id,
      brand,
      badge,
      highlightImage,
      // @ts-ignore
      embed_title,
      // @ts-ignore
      embed_type
    } = product;

    const currentEmbedType =
      !!embed_type ?
        embed_type.toLowerCase().includes('prod') ?
          'Produto'
          : 'Postagem'
        : '';

    const currentEmbedProduct = !!embed_title ? embed_title : '';

    if (!!embed_type) {
      setLoopingPlaceholder('Carregando');
      setLoopingPlaceholder(
        currentEmbedType === 'Postagem' ?
          'Digite parte do título da postagem' :
          'Digite a referência do produto'
      );
    }

    const formattedProduct = {
      ...product,
      embed_type: currentEmbedType,
      embed_title: currentEmbedProduct,
      invisible_title: !!product.invisible_title ? product.invisible_title : '',
      supplier_id:
        !!supplier_id ? supplier_id :
          !!supplier ? supplier.name : null,
      category_id:
        !!category_id ? category_id :
          !!category ? category.name : null,
      brand_id:
        !!brand_id ? brand_id :
          !!brand ? brand.name : null,
      badge: // @ts-ignore
        !!highlightImage ? highlightImage.label : !!badge ? badge.name : null
    };

    return formattedProduct;
  }, [product]);

  const handleDeleteMainPicture = useCallback(async () => {
    try {
      // setIsDeletingPicture(id);

      if (!file.includes('blob:'))
        await api.delete(`/products/${product.id}/main-images/${product.main_image.id}`)

      updateProduct({
        ...product,
        // @ts-ignore
        main_image: undefined,
      });
      setFile('');
    } catch (e) {
      console.log("e", e);
    } finally {
      setIsDeletingPicture(-1);
    }
  }, [file, product, updateProduct]);

  const handleAddPictures = useCallback((pics: Image[]) => {
    // if(pictures.length === 0) {
    // if(pictures.length === 0 && !file) {
    //   const currentPicture = pics[0].image.JPG;
    //   setFile(currentPicture);
    //   updateProduct({...product, file: currentPicture })
    // }
    setPictures([...pictures, ...pics]);
  }, [pictures]);

  const handleDeletePicture = useCallback(async (id: number, order: number, index: number) => {
    try {
      setIsDeletingPicture(id);

      if (order !== -1)
        await api.delete(`/products/${product.id}/images/${id}`)

      // if(index === 0) {
      //   const currentPicture = pictures.length > 1 ? pictures[1].image.JPG : '';
      //   setFile(currentPicture);
      //   updateProduct({...product, file: currentPicture })
      // }
      const formattedPictures = pictures.filter(p => p.id !== id);

      updateProduct({ ...product, pictures: formattedPictures, images: formattedPictures, })
      setPictures(formattedPictures);

    } catch (e) {
      console.log("e", e);
    } finally {
      setIsDeletingPicture(-1);
    }
  }, [updateProduct, product, pictures]);

  const handleUploadPdf = useCallback(async () => {
    try {
      setUploadingPdf(true);
      const upload = new FormData();
      const { catalog_name } = product;
      const pdfFileName =
        isNotEmpty(pdfName) ? pdfName :
          !!catalog_name ? catalog_name :
            !!product.title ? product.title.substring(0, 30).trim() :
              `pdf-${Date.now()}`

      upload.append('name', pdfFileName);
      // @ts-ignore
      upload.append('file', currentPdf);

      await api.post(`/products/${product.id}/files`, upload);
      setPdf(prev => [...prev, currentPdf]);
      setCurrentPdf({} as PDFFile);
      setImportPdfProductModalOpen(false);
      setMessage('PDF enviado com sucesso.');
    } catch (e) {
      setError('Houve um erro no envio do PDF.')
      console.log('e', e);
    } finally {
      setUploadingPdf(false);
    }
  }, [currentPdf, product, pdfName]);

  const handleDeletePdf = useCallback(async (id: string) => {
    try {
      setDeletingPdf(id);
      await api.delete(`/products/${product.id}/files/${id}`);
      // @ts-ignore
      setPdf(prev => prev.filter(f => f.id !== id));
    } catch (e) {
      setError("Erro ao deletar o anexo.")
      console.log('e', e);
    } finally {
      setDeletingPdf('-1');
    }
  }, [product]);


  const handleDeleteProduct = useCallback(async () => {
    try {
      await api.delete(`/products/${product.id}`);
      push('/store/products');
    } catch (e) {
      setError("Erro ao deletar o produto.")
      console.log('e', e);
    }
  }, [product, push]);

  const handleLookupEmbed = useCallback(async (value: string) => {
    try {
      if (!value) {
        setCleaningEmbed(true);

        if (!!product.embed_title) await api.put(`/products/${product.id}`, { embed_id: null, embed_type: null });
        // @ts-ignore
        updateProduct({ ...product, embed_id: null, embed_title: null, embed_type: null });
        formRef.current?.setFieldValue('embed_title', '')

        return;
      }

      setIsModalOpen(false);
      setAddingEmbed(true);

      const type = formRef.current?.getFieldValue('embed_type');

      const { endpoint, errorMessage, params } =
        type === 'Postagem' ?
          {
            endpoint: '/blogs/posts',
            errorMessage: 'Nenhuma postagem foi encontrada',
            params: { title: value }
          } :
          {
            endpoint: '/products',
            errorMessage: 'Nenhum produto foi encontrado',
            params: { reference: value }
          }

      const {
        data: {
          data: { data }
        }
      } = await api.get(endpoint, { params });

      if (!data.length) {
        setError(errorMessage);
        return;
      }

      setEmbedOptions(data);
      setIsModalOpen(true);
    } catch (e) {
      // @ts-ignore
      console.log('e', e.response.data.message);
    } finally {
      setAddingEmbed(false);
      setCleaningEmbed(false);
    }
  }, [product, updateProduct]);

  const handleLookupProduct = useCallback(async (search: string) => {
    try {
      if (!isNotEmpty(search)) return;
      setAddingEmbed(true);

      const embed_type = formRef.current?.getFieldValue('embed_type');

      const endpoint = embed_type === 'Postagem' ? '/blogs/posts' : '/products';
      const params =
        embed_type === 'Postagem' ?
          { title: search.toLowerCase() } :
          { reference: search.toLowerCase(), by_supplier: product.supplier.id };

      const {
        data: {
          data: {
            data
          }
        }
      } = await api.get(endpoint, { params });

      setLoopingPlaceholder('Carregando')
      // @ts-ignore
      setEmbedOptions(data.map(p => ({ id: p.id, value: p.title, label: p.title })));
      setLoopingPlaceholder(`Selecione ${embed_type === 'Postagem' ? 'a postagem' : 'o produto'}`)
      console.log('a')
    } catch (e) {
      console.log("e", e);
    } finally {
      setAddingEmbed(false);
    }
  }, [product]);

  const handleEmbedProduct = useCallback(async (embed_id: number) => {
    try {
      setIsModalOpen(false);
      setAddingEmbed(true);

      const embed_type = formRef.current?.getFieldValue('embed_type');

      const endpoint = embed_type === 'Postagem' ? '/blogs/posts' : '/products';

      const {
        data: { data: embed }
      } = await api.get(`${endpoint}/${embed_id}`);

      const currentEmbedType =
        embed_type === 'Postagem' ? 'blog_post' : 'product';

      await api.put(`/products/${product.id}`, {
        embed_type: currentEmbedType,
        embed_id
      });

      formRef.current?.setFieldValue('embed_title', embed.title)

      // @ts-ignore
      updateProduct({ ...product, embed_title: embed.title, embed_id, embed_type: currentEmbedType })
    } catch (e) {
      console.log('e', e);
    } finally {
      setAddingEmbed(false);
    }
  }, [product, updateProduct]);

  useEffect(() => {
    setReadingTime(calculateReadingTime(`${primaryContent}${secondaryContent}`));
  }, [primaryContent, secondaryContent])

  useEffect(() => {
    if (!isLoading && !!productsData) {

      // @ts-ignore
      setSuppliers(productsData.suppliers);

      // @ts-ignore
      setBrands(productsData.brands);

      // @ts-ignore
      setCategories(productsData.categories);

      // @ts-ignore
      setBadges(productsData.badges);

      // @ts-ignore
      setSuppliersOptions(productsData.suppliersOptions)

      // @ts-ignore
      setBrandsOptions(productsData.brandsOptions)

      // @ts-ignore
      setCategoriesOptions(productsData.categoriesOptions)

      // @ts-ignore
      setBadgeOptions([ ...productsData.badgeOptions])
    }
  }, [isLoading, productsData]);

  return (
    <>
      <Header minimal route={['Loja Online', 'Produto', 'Editar Produto']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Form ref={formRef} onSubmit={() => { }} initialData={formattedProduct}>
          <Container>
            <ProductHeader
              ref={formRef}
              data={{
                primary_text: primaryContent,
                secondary_text: secondaryContent,
                tags,
                pictures,
                file,
                highlightImage,
                pdf
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
              Informação do Produto
            </CustomSectionTitle>
            <InputContainer>
              <FormTitleInput
                name="title"
                title="Título do Produto (Ideal entre 15 e 65 caracteres)"
                width="26.25rem"
                validated={false}
              />
              <FormSelect
                name="supplier_id"
                title="Representada"
                disabled
                placeholder="Selecione..."
                customWidth="15rem"
                data={suppliersOptions}
                customValue={{
                  value: product.supplier?.id ?? '',
                  label: product.supplier?.name ?? ''
                }}
              />
              <FormSelect
                name="brand_id"
                title="Marca"
                placeholder="Selecione..."
                customWidth="12.5rem"
                data={brandsOptions}
                customValue={{
                  value: product.brand?.id ?? '',
                  label: product.brand?.name ?? ''
                }}

              />
              <FormSelect
                name="category_id"
                title="Categoria do Produto"
                placeholder="Selecione..."
                customWidth="24.125rem"
                data={categoriesOptions}
                customValue={{
                  value: product.category?.id ?? '',
                  label: product.category?.name ?? ''
                }}
              />
            </InputContainer>
            <InputContainer>
              <TagInput
                title="Título Invisível para Busca no Site (IA)"
                tags={tags}
                setTags={setTags}
                fullW
                validated={false}
              />
            </InputContainer>
            <InputContainer>
              <FormInput
                name="reference"
                title="Referência"
                validated={false}
                disabled
              />
              <FormInput
                name="ean13"
                title="EAN13"
                validated={false}
              />
            </InputContainer>
            <InputContainer>
              <ColumnContainer style={{ width: '794px' }}>
                <CustomSectionTitle>
                  Imagem Principal da Postagem
                </CustomSectionTitle>
                <MainImageContainer>
                  <DragPicture
                    file={file}
                    setFile={(f) => {
                      setFile(f);
                      // @ts-ignore
                      setHighlightImage(f);
                    }}
                    deletePicture={handleDeleteMainPicture}
                  />
                  <ColumnContainer style={{ marginLeft: '1.25rem' }}>
                    <DimensionsContainer>
                      <FormInput
                        name="imageWidth"
                        title="Largura"
                        width="3.75rem"
                        validated={false}
                        value="1.200"
                        disabled
                      />
                      <p>X</p>
                      <FormInput
                        name="imageHeight"
                        title="Altura"
                        width="3.75rem"
                        validated={false}
                        value="1.200"
                        disabled
                      />
                    </DimensionsContainer>
                    <InputContainer>
                      <FormSelect
                        name="badge"
                        title="Selecione um Destaque"
                        placeholder="Selecione..."
                        customWidth="12.5rem"
                        onChange={
                          (value: string, id: number, label: string) =>
                            value === 'Nenhum' ? // @ts-ignore
                              setHighlightImage(null) : // @ts-ignore
                              setHighlightImage({ value, id, label })
                        }
                        data={badgeOptions}
                      />
                    </InputContainer>
                    <InputContainer>
                      <HighlightImage>
                        {/* {!!file && <img src={file} alt="" />} */}
                        {/* @ts-ignore */}
                        {!!highlightImage && highlightImage !== 'Nenhum' ?
                          <img
                            src={typeof highlightImage === 'string' ? highlightImage : highlightImage.value}
                            className="overlay"
                            alt=""
                          /> :
                          <></>
                        }
                      </HighlightImage>
                    </InputContainer>
                  </ColumnContainer>
                </MainImageContainer>
              </ColumnContainer>
              <ColumnContainer style={{ width: '492px' }}>
                <CustomSectionTitle>
                  Data e Hora da Publicação
                </CustomSectionTitle>
                <InputContainer>
                  <DateBox
                    name="published_at"
                    title="Data da Publicação"
                    width="10rem"
                    noMinDate
                    validated={false}
                  />
                  <DateBox
                    name="featured_until"
                    title="Destacar até"
                    width="10rem"
                    validated={false}
                  />
                </InputContainer>
                <InputContainer>
                  <DateBox
                    name="created_at"
                    title="Data da Criação"
                    width="10rem"
                    validated={false}
                    disabled
                  />
                  <DateBox
                    name="updated_at"
                    title="Data da Atualização"
                    width="10rem"
                    validated={false}
                    disabled
                  />
                </InputContainer>
                <CustomSectionTitle>
                  YouTube
                </CustomSectionTitle>
                <InputContainer>
                  <RadioBox
                    title="Usar link do YouTube"
                    value={useYoutubeLink}
                    // @ts-ignore
                    setValue={setUseYoutubeLink}
                  />
                  <SocialBox
                    name="youtube_link"
                    title="YouTube"
                    type="social"
                    validated
                    disabled={useYoutubeLink === 'Não'}
                    badge={YoutubeIcon}
                    style={{ marginLeft: 'auto' }}
                  />
                </InputContainer>
                <CustomSectionTitle>
                  Tempo de Leitura e Visualização da Postagem
                </CustomSectionTitle>
                <InputContainer style={{ marginTop: '1.75rem' }}>
                  <PostActionsButton className="reading">
                    <ReadingIcon />
                    Leitura {readingTime}
                  </PostActionsButton>
                  <ViewProduct
                    href={product.full_url}
                    target="_blank"
                  >
                    <SeeIcon />
                    Visualizar
                  </ViewProduct>
                </InputContainer>
              </ColumnContainer>
            </InputContainer>
            <InputContainer style={{ alignItems: 'flex-start' }}>
              <ColumnContainer style={{ width: '794px' }}>
                <CustomSectionTitle>
                  Editor da Postagem Principal
                </CustomSectionTitle>
                <Editor
                  content={primaryContent}
                  setContent={setPrimaryContent}
                />
                <InputContainer>
                  <FormSelect
                    name="embed_type"
                    title="Adicionar um looping no conteúdo"
                    placeholder="Selecione..."
                    customWidth="15rem"
                    // @ts-ignore
                    onChange={(value) => {
                      handleLookupEmbed('');
                      formRef.current?.setFieldValue('embed_title', '');
                      if (value === 'Selecione...') {
                        setEmbedOptions([])
                      }
                      setLoopingPlaceholder('Carregando');
                      setLoopingPlaceholder(
                        value === 'Selecione...' ? 'Selecione...' :
                          `Digite parte do título ${value === 'Postagem' ? 'da postagem' : 'do produto'}`
                      );
                    }}
                    data={[
                      { value: 'Selecione...', label: 'Selecione...' },
                      { value: 'Produto', label: 'Produto' },
                      { value: 'Postagem', label: 'Postagem' },
                    ]}
                  />
                  <InputContainer
                    style={{ marginTop: 0, alignItems: 'flex-end' }}
                  >
                    {/* {loopingPlaceholder !== 'Carregando' ?
                    <FormInput
                      name="embed_title"
                      title="Tipo"
                      placeholder={loopingPlaceholder}
                      disabled={addingEmbed || cleaningEmbed}
                      width="30.4375rem"
                      // @ts-ignore
                      onBlur={(e) => !isNotEmpty(e.target.value) && handleLookupEmbed("")}
                    /> :
                    <></>
                  } */}
                    {!!embedOptions.length ?
                      <FormSelect
                        name="embed_title"
                        title="Tipo"
                        // @ts-ignore
                        onChange={(value, id) => handleEmbedProduct(id)}
                        customWidth="33.4375rem"
                        // @ts-ignore
                        // onKeyDown={(value) => handleLookupProduct(value)}
                        // @ts-ignore
                        data={embedOptions}
                        disabled={addingEmbed}
                        placeholder={loopingPlaceholder}
                      /> :
                      <FormInput
                        name="embed_title"
                        title="Tipo"
                        width="33.4375rem"
                        // value={embedValue}
                        // onChange={(e) => setEmbedValue(e.target.value)}
                        onBlur={(e) => handleLookupProduct(e.target.value)}
                        validated
                      />
                    }
                    {/* <AddingOptionalProduct
                    onClick={() =>
                      handleLookupEmbed(
                        !!product.embed_title ?  '' :
                        formRef.current?.getFieldValue('embed_title')
                      )
                    }
                    disabled={addingEmbed || cleaningEmbed}
                    style={{
                      marginLeft: "1rem"
                    }}
                  >
                    {addingEmbed || cleaningEmbed ? <LoadingIcon /> :
                      !!product.embed_title ? <TrashIcon/> : <PlusIcon />}
                  </AddingOptionalProduct> */}
                  </InputContainer>
                </InputContainer>
                <CustomSectionTitle>
                  Editor da Postagem Secundária
                </CustomSectionTitle>
                <Editor
                  content={secondaryContent}
                  setContent={setSecondaryContent}
                />
              </ColumnContainer>
              <ColumnContainer style={{ width: '492px' }}>
                <CustomSectionTitle>
                  Galeria de Imagens&nbsp;<b>(clique na imagem para copiar)</b>
                </CustomSectionTitle>
                <GalleryContainer rowsLength={Math.ceil(pictures.length + 1 / 2)}>
                  {pictures.map(({ id, order, image: { JPG }, name }, index) =>
                    <GalleryImage key={id} disabled={isDeletingPicture === id}>
                      <img src={JPG} alt={name} />
                      <button
                        onClick={() => handleDeletePicture(id, order, index)}
                        disabled={isDeletingPicture === id}
                      >
                        <CloseIcon />
                      </button>
                    </GalleryImage>
                  )}
                  <GalleryPhoto
                    addPictures={
                      (newPicture) => handleAddPictures(newPicture)
                    }
                  />
                </GalleryContainer>
                <PostActionsButton className="import" onClick={() => setImportPdfProductModalOpen(true)}>
                  Importar PDF
                </PostActionsButton>
                <MaxFilesizeText>Máximo de 3MB</MaxFilesizeText>
                {!!pdf.length &&
                  pdf.map((f) =>
                    <Attachment
                      key={`${f.name}-${f.size}`}
                      style={{ alignSelf: 'center', marginTop: '1rem' }}
                      disabled={deletingPdf !== '-1'}
                    >
                      <PdfIcon />
                      <a href={f.fileUrl} target="_blank" rel="noreferrer">{f.name}</a>
                      <button
                        // @ts-ignore
                        onClick={() => handleDeletePdf(f.id)}
                        disabled={deletingPdf !== '-1'}
                      >
                        <DeletePdfIcon />
                      </button>
                    </Attachment>
                  )
                }
                {/* <PostActionsButton
                  className="viewing"
                  style={{ width: '100%', marginTop: '11rem' }}
                  onClick={handleRegisterProduct}
                  type="button"
                  disabled={loading}
                >
                  {savingProduct ? 'Salvando...' : 'Salvar Produto'}
                </PostActionsButton> */}
                <PostActionsButton
                  className="reading"
                  style={{ width: '100%', marginTop: '1rem' }}
                  onClick={handleDeleteProduct}
                >
                  Excluir Produto
                </PostActionsButton>
              </ColumnContainer>
            </InputContainer>
          </Container>
        </Form>
      </MenuAndTableContainer>
      <Modal
        title="Importar PDF"
        isModalOpen={importPdfModalOpen}
        setIsModalOpen={setImportPdfProductModalOpen}
      >
        <InputContainer style={{ marginTop: '2.25rem' }}>
          <ImportPdf
            file={currentPdf}
            setFile={(value) => {
              setCurrentPdf(value);
              setPdfName(value.name.replace('.pdf', ''));
            }}
            style={{ width: '21.375rem' }}
          />
        </InputContainer>
        <MaxFilesizeText>
          Máximo de 3MB
        </MaxFilesizeText>
        <InputContainer>
          {!!Object.values(currentPdf).length &&
            <Attachment>
              <PdfIcon />
              <a href={currentPdf.fileUrl} target="_blank" rel="noreferrer">{pdfName}</a>
            </Attachment>
          }
        </InputContainer>
        <CustomSectionTitle>
          Alterar nome do arquivo
        </CustomSectionTitle>
        <InputContainer>
          <TitleInput
            name="pdfName"
            title="Nome do PDF"
            width="100%"
            max={30}
            fullW
            value={pdfName}
            onChange={(e) => setPdfName(e.target.value)}
            validated={false}
          />
        </InputContainer>
        <Button
          type="button"
          style={{ marginTop: '1.25rem' }}
          onClick={handleUploadPdf}
        >
          {
            uploadingPdf ? <LoadingIcon className="revert" /> :
              'Salvar'
          }
        </Button>
      </Modal>
      <ErrorModal
        error={error}
        setIsModalOpen={() => setError('')}
      />
      <SuccessModal
        message={message}
        setIsModalOpen={() => setMessage('')}
      />
      <Modal
        title="Selecione o produto"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        customOnClose={() => { }}
        style={{ width: 471 }}
      >
        <ProductsContainer>
          {embedOptions.map((p) =>
            <div key={p.id}>
              <Input
                name=""
                noTitle
                disabled
                width="100%"
                fullW
                value={p.title}
                validated
              />
              <TableActionButton
                onClick={() => handleEmbedProduct(p.id)}
                style={{ marginLeft: '1rem' }}
              >
                <PlusIcon />
              </TableActionButton>
            </div>
          )}
        </ProductsContainer>
      </Modal>
    </>
  );
}
