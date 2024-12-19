import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';

import { InputContainer, MenuAndTableContainer } from '~styles/components';

import { ReactComponent as PlusIcon } from '~assets/plus.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg'
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { Form } from '@unform/web';
import { Scope, FormHandles } from '@unform/core';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { AddingOptionalProduct, Container, CustomSectionTitle, ProductsContainer } from './styles';
import { FormTitleInput } from '~components/FormTitleInput';
import { FormInput } from '~components/FormInput';
import { FormInputMask } from '~components/FormInputMask';
import { TagInput } from '~components/TagInput';
import { FormSelect } from '~components/FormSelect';
import { CustomSelect as Select } from '~components/Select';
import { MeasureBox } from '~components/FormMeasureBox';
import { DateBox } from '~components/DateBox';
import { RadioBox } from '~components/RadioBox';
import { ProductHeader } from '~components/ProductHeader';
import { ProductAttribute } from '~components/ProductAttribute';
import { ProductOptionals } from '~components/ProductOptionals';
import { TableActionButton } from '~styles/components/tables';

import { useProduct } from '~context/product';
import { emptyFieldRegex, getUrl, isNotEmpty } from '~utils/validation';

import { api } from '~api';
import {
  DefaultValueProps,
  HighlightImage,
  IBrand,
  ICategory,
  Image,
  ITag,
  MainProduct,
  ProductAttribute as IProductAttribute,
  Supplier
} from '~types/main';
import { ProductOptionalsContainer, ProductOptionalsHeader } from '@/src/components/ProductOptionals/styles';
import { Input } from '@/src/components/Input';
import { Modal } from '@/src/components/Modal';
import { ErrorModal } from '@/src/components/ErrorModal';
import { useQuery } from 'react-query';
import { fetchProductsData } from '@/src/services/requests';
import { PostActionsButton } from '../styles';
import { SuccessModal } from '@/src/components/SuccessModal';
import { subHours } from 'date-fns';

export function PriceAndAttributes() {
  const {
    product,
    attributes,
    fetchAttributes,
    products,
    fetchProducts,
    updateProduct,
    supplier
  } = useProduct();

  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback((data) => console.log(data), []);

  const [gender, setGender] = useState(() => 
    !!product ?
      'gender' in product ? product.gender : 'Menina' : 
    'Menina'
  );

  const [savingProduct, setSavingProduct] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [suppliersOptions, setSuppliersOptions] = useState<DefaultValueProps[]>([]);
  
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [brandsOptions, setBrandsOptions] = useState<DefaultValueProps[]>([]);
  
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoriesOptions, setCategoriesOptions] = useState<DefaultValueProps[]>([]);
  
  const [badges, setBadges] = useState<HighlightImage[]>([]);
  const [badgeOptions, setBadgeOptions] = useState<DefaultValueProps[]>([]);

  const [availabilityOptions, setAvailabilityOptions] = useState([]);
  const [boxPackingOptions, setBoxPackingOptions] = useState([]);
  const [ageGroupOptions, setAgeGroupOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [originOptions, setOriginOptions] = useState([]);
  const [packingTypeOptions, setPackingTypeOptions] = useState([]);
  const [releaseOptions, setReleaseOptions] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addingOptionalProduct, setAddingOptionalProduct] = useState(false);

  // const [brandsOptions, setBrandsOptions] = useState<DefaultValueProps[]>([]);
  // const [categoriesOptions, setCategoriesOptions] = useState<DefaultValueProps[]>([]);

  const [disabled, setDisabled] = useState(false);

  const [certificationTags, setCertificationTags] = useState<ITag[]>(() => 
    !!product ?
      'certificationTags' in product ? product.certificationTags :
      !!product.certification ?
      product.certification.split(',').map(s => ({id: s, value: s})) : []
    : []
  );

  const handleProductVolume = useCallback(() => {
    const productHeight = formRef?.current?.getFieldValue('size_height').replace(',', '.');
    const productWidth = formRef?.current?.getFieldValue('size_width').replace(',', '.');
    const productLength = formRef?.current?.getFieldValue('size_length').replace(',', '.');

    let volume = +productHeight * +productWidth * +productLength
    
    if(isNaN(volume)) volume = 0;

    formRef?.current?.setFieldValue('size_cubic', volume / 10**6);
  }, [formRef]);

  const handleBoxVolume = useCallback(() => {
    const boxHeight = formRef?.current?.getFieldValue('box_height').replace(',', '.');
    const boxWidth = formRef?.current?.getFieldValue('box_width').replace(',', '.');
    const boxLength = formRef?.current?.getFieldValue('box_length').replace(',', '.');

    let volume = +boxHeight * +boxWidth * +boxLength
    
    if(isNaN(volume)) volume = 0;

    formRef?.current?.setFieldValue('box_cubic', volume / 10**6);
  }, [formRef]);

  const handleUnitSubtotal = useCallback(() => {
    const unitPrice = formRef?.current?.getFieldValue('unit_price').replace(',', '.');
    const unitMinimal = formRef?.current?.getFieldValue('unit_minimal').replace(',', '.');

    if(!isNotEmpty(unitPrice))
      return;  
    
    const unitSubtotal = +unitPrice * +unitMinimal;
    
    if(isNaN(unitSubtotal)) 
      formRef?.current?.setFieldValue('unit_subtotal', '');
    else {
      const formattedSubTotal =
        new Intl
              .NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
              .format(unitSubtotal).slice(3);
      
      formRef?.current?.setFieldValue('unit_subtotal', formattedSubTotal);
    }
  }, [formRef]);

  const handleUnitSubtotalPromotional = useCallback(() => {
    const unitPricePromotional = formRef?.current?.getFieldValue('unit_price_promotional').replace(',', '.');
    const unitMinimal = formRef?.current?.getFieldValue('unit_minimal').replace(',', '.');

    if(!isNotEmpty(unitPricePromotional))
      return;  
    
    const unitSubtotalPromotional = +unitPricePromotional * +unitMinimal;
    
    if(isNaN(unitSubtotalPromotional)) 
      formRef?.current?.setFieldValue('unit_subtotal_promotional', '');
    else {
      const formattedSubTotal =
        new Intl
              .NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
              .format(unitSubtotalPromotional).slice(3);
      
      formRef?.current?.setFieldValue('unit_subtotal_promotional', formattedSubTotal);
    }
  }, [formRef]);

  const handleBoxSubtotal = useCallback(() => {
    const boxPrice = formRef?.current?.getFieldValue('box_price').replace(',', '.');
    const boxMinimal = formRef?.current?.getFieldValue('box_minimal').replace(',', '.');

    if(!isNotEmpty(boxPrice)) 
      return;

    const boxSubtotal = +boxPrice * +boxMinimal;
      
    if(isNaN(boxSubtotal)) 
      formRef?.current?.setFieldValue('box_subtotal', '');
    else {
      const formattedBoxSubTotal =
        new Intl
            .NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
            .format(boxSubtotal).slice(3);

      formRef?.current?.setFieldValue('box_subtotal', formattedBoxSubTotal);
    }
  }, [formRef]);

  const handleBoxSubtotalPromotional = useCallback(() => {
    const boxPricePromotional = formRef?.current?.getFieldValue('box_price_promotional').replace(',', '.');
    const boxMinimal = formRef?.current?.getFieldValue('box_minimal').replace(',', '.');

    if(!isNotEmpty(boxPricePromotional)) 
      return;

    const boxSubtotalPromotional = +boxPricePromotional * +boxMinimal;
      
    if(isNaN(boxSubtotalPromotional)) 
      formRef?.current?.setFieldValue('box_subtotal_promotional', '');
    else {
      const formattedBoxSubTotal =
        new Intl
            .NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
            .format(boxSubtotalPromotional).slice(3);

      formRef?.current?.setFieldValue('box_subtotal_promotional', formattedBoxSubTotal);
    }
  }, [formRef]);

  const formattedProduct = useMemo(() => {
    const { 
      title,
      seo_title,
      category,
      brand,
     } = product;
    
    return {
      ...product,
      title: !!title ? title : seo_title,
      category: !!category ? { value: category.name, label: category.name } : null,
      brand: !!brand ? { value: brand.name, label: brand.name } : null,
    }
  }, [product]);

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
      const selectedSupplier = formRef?.current?.getFieldValue('supplier_id');
      const selectedBrand = formRef?.current?.getFieldValue('brand_id');
      const selectedCategory = formRef?.current?.getFieldValue('category_id');
      
      const supplier = suppliers.find(s => s.name === selectedSupplier);

      console.log(formData)
      const brand = brands.find(b => b.name === selectedBrand || b.id === selectedBrand);
      const category = categories.find(c => c.name === selectedCategory || c.id === selectedCategory);

      const baseProductData = {};
      
      const {
        certificationTags,
        published_at,
        featured_until,
        expiration_date,
        file,
        tags,
        pictures,
        highlightImage
      } = product;

      const currentBadge =
        typeof highlightImage === 'string' ? highlightImage : highlightImage?.value;
      
      // @ts-ignore 
      const badge = badgeOptions.find(b => b.value === currentBadge);
  

      // if(!!product.highlightImage && !!currentBadge) {
      if(!!product.highlightImage && !!badge) {
        // @ts-ignore
        Object.assign(baseProductData, { badge_id: badge!.id })
      }

      const searcheable = tags?.reduce((init, value) => `${init},${value.value}`, '').replace(',','');
      
      const certification =
        !!certificationTags ? certificationTags?.reduce((init, value) => `${init},${value.value}`, '').replace(',','') : [];
      
      let hasImages = false;
      let hasFirstImage = false;
      const mainImageData = new FormData();
      const imagesData = new FormData();
      
      if(file?.includes('blob:')) {
        // @ts-ignore
        const formattedFile = await getUrl(file);
        hasFirstImage = true;
        mainImageData.append('images', formattedFile);
      }
      
      if(!!pictures?.length) {  
        await Promise.all(
          pictures.map(
            async (p, index) => {
              const url = p.image.JPG;
              if(!url?.includes('blob:')) return '';
              hasImages = true;

              return imagesData?.append(`images[${index + 1}]`, await getUrl(url));
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
        brand_id: brand!.id,
        category_id: category!.id,
        searcheable,
        certification,
        // @ts-ignore
        published_at: subHours(published_at, 3),
        // @ts-ignore
        featured_until: subHours(featured_until, 3),
        // @ts-ignore
        expiration_date: subHours(expiration_date, 3),
      };

      // @ts-ignore
      delete formattedData.file;
      if(!!formattedData.main_image) {
        // @ts-ignore
        delete formattedData.main_image;
      }
      // @ts-ignore
      delete formattedData.dispay_code;
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
    } catch(e) {
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
      schema,
      badgeOptions
    ]);

  // const fetchProductOptions = useCallback(async () => {
  //   try {
  //     const { id } = supplier;


  //     const [
  //       categoriesResponse,
  //       brandsResponse,
  //       configurationsResponse,
  //     ] = await Promise.all([
  //       api.get(`products/suppliers/${id}/categories`),
  //       api.get('products/brands'),
  //       api.get('/configurations')
  //     ]);

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
  //         data: { products }
  //       }
  //     } = configurationsResponse;

  //     const {
  //       availability,
  //       box_packing,
  //       gender,
  //       origin,
  //       packing_type,
  //       release,
  //       age_group
  //     } = products;

  //     setBrandsOptions(brands.map((b: IBrand) => ({ value: b.name, label: b.name })));
  //     setCategoriesOptions(categories.map((c: ICategory) => ({ value: c.name, label: c.name })));

  //     setAvailabilityOptions(availability.map((a: string) => ({ value: a, label: a })))
  //     setBoxPackingOptions(box_packing.map((b: string) => ({ value: b, label: b })))
  //     setAgeGroupOptions(age_group.map((c: string) => ({ value: c, label: c })))
  //     setGenderOptions(gender);
  //     setOriginOptions(origin.map((o: string) => ({ value: o, label: o })))
  //     setPackingTypeOptions(packing_type.map((p: string) => ({ value: p, label: p })))
  //     setReleaseOptions(release.map((r: string) => ({ value: r, label: r })).reverse())
  //   } catch (e) {
  //     console.log('e', e);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [supplier]);

  const [currentAttributes, setCurrentAttributes] = useState<IProductAttribute[]>(() => 
    product.attributes ?? []
  );

  const [currentOption, setCurrentOption] = useState<DefaultValueProps>({} as DefaultValueProps);
  const [attributesOptions, setAttributesOptions] = useState<DefaultValueProps[]>(() =>
    attributes.map(a => ({ value: a.name,  label: a.name }))
  );

  const [currentProducts, setCurrentProducts] = useState<MainProduct[]>(
    () => !!product.variations ? product.variations : []
    );
  const [searchProducts, setSearchProducts] = useState<MainProduct[]>([]);
  const [currentProductOption, setCurrentProductOption] = useState('');
  const [productsOptions, setProductsOptions] = useState<DefaultValueProps[]>([]);
    
  const hasFractionalBoxEnabled = useMemo(() => 
    !!product ? !!product.enable_fractional_box : false
  , [product])

  const [optionalProducts, setOptionalProducts] = useState<MainProduct[]>([]);

  // const attributesOptions = useMemo(() => 
  //   attributes.map((a: MainAttribute) => ({ value: a.name, label: a.name }))
  // , [attributes]);

  const originRef = useRef(null);
  const boxPriceRef = useRef(null);

  const currentAttributeCategory = useMemo(() => {
    if(!product.attribute_category) return { value: '', label: '' };

    const { name } = product.attribute_category;

    return { value: name, label: name };
  }, [product])

  const handleAddAttributeGroup = useCallback(async () => {
    try {
      if(!Object.entries(currentOption).length) return;

      // @ts-ignore
      const { id, name, attributes: newAttributes } =
        attributes.find(p => p.name === currentOption.value);
            
      const data = {
        box_price: product.box_price,
        attribute_category_id: id
      }

      await api.put(`/products/${product.id}`, data)

      const attribute_category = {
        id,
        name,
        products_count: 0
      }

      setCurrentAttributes([]);
      // @ts-ignore
      setCurrentAttributes(newAttributes);
      // setAttributesOptions(prev => prev.filter(p => p.value !== currentOption.value));
      updateProduct({...product, attribute_category, attributes: newAttributes })
      setCurrentOption({} as DefaultValueProps);

    } catch(e) {
      console.log('e', e);
    }
  }, [product, updateProduct, currentOption, attributes]);

  const handleDeleteCategory = useCallback(async () => {
    try {
      await api.put(`/products/${product.id}`, {
        attribute_category_id: null
      })

      updateProduct({...product, attribute_category: null, attributes: [] })
      setCurrentAttributes([]);
    } catch(e) {
      console.log('e', e);
    }
  }, [product, updateProduct])

  const handleLookupProduct = useCallback(async () => {
    try {
      setAddingOptionalProduct(true);
      
      const {
        data: {
          data: { data }
        }
      } = await api.get(`/products`, {
        params: {
          reference: currentProductOption
        }
      });
      
      if (!data.length) {
        setError('Nenhum produto foi encontrado.');
        return;
      }

      setSearchProducts(data);
      setIsModalOpen(true);
    } catch(e) {
      // @ts-ignore
      console.log('e', e.response.data.message);
    } finally {
      setAddingOptionalProduct(false);
    }
  }, [currentProductOption]);

  const handleAddOptionalProduct = useCallback(async (p: MainProduct) => {
    try {
      setIsModalOpen(false);
      setAddingOptionalProduct(true);
  
      await api.post(`/products/${product.id}/variations`, {
        attach_product_id: p.id
      });

      setCurrentProductOption('');
      setCurrentProducts(prev => [...prev, p]);

      updateProduct({...product, variations: [...product.variations, p]})

      // setAttributesOptions(prev => )
      // mesmo esquema do RelatedProducts
    } catch(e) {
      // @ts-ignore
      console.log('e', e.response.data.message);
    } finally {
      setAddingOptionalProduct(false);
    }
  }, [product, updateProduct]);

  const handleOnDelete = useCallback(async (productName: string) => {
    setCurrentProducts(prev => prev.filter(p => p.title !== productName))
    setProductsOptions(prev => [...prev, { value: productName, label: productName }]);
    updateProduct({...product, variations: product.variations.filter(p => p.title !== productName)})
  }, [updateProduct, product]);

  useEffect(() => {
    fetchProducts();
    fetchAttributes()
  }, [])

  useEffect(() => {
    if(!products.length) {
      return;
    }
    
    const formattedProducts = products.map(a => ({ value: a.title,  label: a.title }));
    const productsWithoutCurrent = formattedProducts.filter(p => p.label !== product.title );
      
    if(!!product.variations) {
      const productsWithoutRelated = // @ts-ignore
        productsWithoutCurrent.filter((p) => product.variations.findIndex((i) => i.title === p.label) === -1);
      setProductsOptions(productsWithoutRelated);
      return;
    }
      
    setProductsOptions(productsWithoutCurrent);
  }, [products]);

  useEffect(() => {
    if(!!attributes.length)
      setAttributesOptions(attributes.map(a => ({ value: a.name,  label: a.name })))
  }, [attributes])

  useEffect(() => {
    if(!isLoading && !!productsData) {
console.log(product);

      setSuppliers(productsData.suppliers);
      setBrands(productsData.brands);
      setCategories(productsData.categories);
      setBadges(productsData.badges);

      setBrandsOptions(productsData.brands);
      setCategoriesOptions(productsData.categories);

      // @ts-ignore
      setAvailabilityOptions(productsData.availabilityOptions)
      // @ts-ignore
      setBoxPackingOptions(productsData.boxPackingOptions)
      // @ts-ignore
      setAgeGroupOptions(productsData.ageGroupOptions)
      // @ts-ignore
      setGenderOptions(productsData.genderOptions);
      // @ts-ignore
      setOriginOptions(productsData.originOptions)
      // @ts-ignore
      setPackingTypeOptions(productsData.packingTypeOptions)
      // @ts-ignore
      setReleaseOptions(productsData.releaseOptions)

      // @ts-ignore
      setSuppliersOptions(productsData.suppliersOptions)
      
      // @ts-ignore
      setBrandsOptions(productsData.brandsOptions)      
      
      // @ts-ignore
      setCategoriesOptions(productsData.categoriesOptions)      
      
      // @ts-ignore
      setBadgeOptions(productsData.badgeOptions)      
    }
  }, [isLoading, productsData]);

  return (
    <>
      <Header minimal route={['Loja Online', 'Produto', 'Editar Produto']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Form ref={formRef} onSubmit={handleSubmit} initialData={formattedProduct}>
        <Container>
          <ProductHeader
            ref={formRef}
            disabled={disabled}
            data={{
              gender,
              certificationTags
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
                placeholder="Selecione..."
                customWidth="15rem"
                disabled
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
                customWidth="20.125rem"
                data={categoriesOptions}
                customValue={{
                  value: product.category?.id ?? '',
                  label: product.category?.name ?? ''
                }}
              />
            </InputContainer>
            <CustomSectionTitle>
              Identificadores
            </CustomSectionTitle>
            <InputContainer>
              <FormInput
                name="inner_code"
                title="Código Automático"
                width="6.875rem"
                validated={false}
                disabled
              />
              <FormInput
                name="reference"
                title="Referência"
                width="6.875rem"
                validated={false}
              />
              <FormInput
                name="ean13"
                title="EAN13 (Código do Produto)"
                width="11.875rem"
                validated={false}
              />
              <FormInputMask
                name="display_code"
                title="Código do Display"
                width="11.875rem"
                validated={false}
                maxLength={13}
              />
              <FormInput
                name="dun14"
                title="DUN14 (Código da Caixa)"
                width="11.875rem"
                validated={false}
              />
              <DateBox
                name="expiration_date"
                title="Data de Validade"
                // width="6.1875rem"
                width="7.25rem"
                validated={false}
                hasHour={false}
                // empty
                // @ts-ignore
                focusOnNextElement={() => originRef?.current?.focus()}
              />
              <input ref={originRef} style={{ opacity: 0 }}/>
            </InputContainer>
            <InputContainer>
              <FormSelect
                name="origin"
                title="Origem"
                placeholder="Selecione..."
                customWidth="12.5rem"
                data={originOptions}
                disabled={isLoading}
                customValue={{
                  value: product.origin,
                  label: product.origin
                }}
                // ref={originRef}
              />
              <FormSelect
                name="release_year"
                title="Lançamento"
                placeholder="Selecione..."
                customWidth="6.25rem"
                data={releaseOptions}
                disabled={isLoading}
                customValue={{
                  value: product.release_year ?? '',
                  label: product.release_year ?? ''
                }}
              />
              <FormInput
                name="catalog_name"
                title="Nome do Catálogo"
                width="12.5rem"
                validated={false}
              />
              <FormInput
                name="catalog_page"
                title="Página"
                width="6.25rem"
                validated={false}
              />
              <RadioBox
                title="Gênero"
                value={gender}
                setValue={setGender}
                options={genderOptions}
              />
            </InputContainer>
            <CustomSectionTitle>
              Medidas do Produto
            </CustomSectionTitle>
            <InputContainer>
              <MeasureBox
                name="size_height"
                title="Produto Altura"
                measure="cm"
                validated={false}
                onBlur={handleProductVolume}
              />
              <MeasureBox
                name="size_width"
                title="Produto Largura"
                measure="cm"
                validated={false}
                onBlur={handleProductVolume}
              />
              <MeasureBox
                name="size_length"
                title="Produto Comprimento"
                measure="cm"
                validated={false}
                onBlur={handleProductVolume}
              />
              <MeasureBox
                name="size_cubic"
                title="Produto Cubagem"
                measure="m3"
                validated={false}
                disabled
              />
              <MeasureBox
                name="size_weight"
                title="Produto Peso"
                measure="kg"
                validated={false}
              />
              <FormSelect
                name="packing_type"
                title="Tipo de Embalagem do Produto"
                placeholder="Selecione..."
                customWidth="12.5rem"
                data={packingTypeOptions}
                disabled={isLoading}
                customValue={{
                  value: product.packing_type ?? '',
                  label: product.packing_type ?? ''
                }}
              />
              <FormInput
                name="packaging"
                title="Embalagem"
                width="8.875rem"
                validated={false}
              />
            </InputContainer>
            <CustomSectionTitle>
              Medidas da Caixa Master
            </CustomSectionTitle>
            <InputContainer>
              <MeasureBox
                name="box_height"
                title="Caixa Altura"
                measure="cm"
                validated={false}
                onBlur={handleBoxVolume}
              />
              <MeasureBox
                name="box_width"
                title="Caixa Largura"
                measure="cm"
                validated={false}
                onBlur={handleBoxVolume}
              />
              <MeasureBox
                name="box_length"
                title="Caixa Comprimento"
                measure="cm"
                validated={false}
                onBlur={handleBoxVolume}
              />
              <MeasureBox
                name="box_cubic"
                title="Caixa Cubagem"
                measure="m3"
                validated={false}
                disabled
              />
              <MeasureBox
                name="box_weight"
                title="Caixa Peso"
                measure="kg"
                validated={false}
              />
              <FormSelect
                name="box_packing_type"
                title="Tipo de Embalagem da Caixa"
                placeholder="Selecione..."
                customWidth="12.5rem"
                data={boxPackingOptions}
                disabled={isLoading}
                customValue={{
                  value: product.box_packing_type ?? '',
                  label: product.box_packing_type ?? ''
                }}
              />
            </InputContainer>
            <CustomSectionTitle>
              Preços Unitários
            </CustomSectionTitle>
            <InputContainer>
              <FormSelect
                name="availability"
                title="Disponibilidade"
                placeholder="Selecione..."
                customWidth="12.5rem"
                data={availabilityOptions}
                disabled={isLoading}
                customValue={{
                  value: product.availability,
                  label: product.availability
                }}
              />
              <DateBox
                name="expected_arrival"
                title="Previsão de Chegada da Representada"
                width="11.125rem"
                validated={false}
                hasHour={false}
                isClearable
                // @ts-ignore
                focusOnNextElement={() => boxPriceRef?.current?.focus()}
              />
              <input ref={boxPriceRef} style={{ opacity: 0 }}/>
            </InputContainer>
            {!!hasFractionalBoxEnabled && 
              <InputContainer>
                <MeasureBox
                  name="unit_price"
                  title="Caixa Fracionada"
                  measure="R$"
                  validated={false}
                  onBlur={handleUnitSubtotal}
                />
                <MeasureBox
                  name="unit_price_promotional"
                  title="Promocional Caixa Fracionada"
                  measure="R$"
                  width="10.625rem"
                  validated={false}
                  onBlur={handleUnitSubtotalPromotional}
                />
                <FormInput
                  name="unit_minimal"
                  title="Quantidade Mínima"
                  width="6.875rem"
                  validated={false}
                  onBlur={() => {
                    handleUnitSubtotal();
                    handleUnitSubtotalPromotional();
                  }}
                />
                <MeasureBox
                  name="unit_subtotal"
                  title="Sub Total"
                  measure="R$"
                  validated={false}
                  disabled
                />
                <MeasureBox
                  name="unit_subtotal_promotional"
                  title="Sub Total Promocional"
                  measure="R$"
                  validated={false}
                  disabled
                />
              </InputContainer>
            }
            <InputContainer>
              <MeasureBox
                name="box_price"
                title="Caixa Fechada"
                measure="R$"
                validated={false}
                onBlur={handleBoxSubtotal}
              />
              <MeasureBox
                name="box_price_promotional"
                title="Promocional Caixa Fechada"
                measure="R$"
                width="10.625rem"
                validated={false}
                onBlur={handleBoxSubtotalPromotional}
              />
              <FormInput
                name="box_minimal"
                title="Quantidade Mínima"
                width="6.875rem"
                validated={false}
                onBlur={() => {
                  handleBoxSubtotal();
                  handleBoxSubtotalPromotional();
                }}
              />
              <MeasureBox
                name="box_subtotal"
                title="Sub Total"
                measure="R$"
                validated={false}
                disabled
              />
              <MeasureBox
                name="box_subtotal_promotional"
                title="Sub Total Promocional"
                measure="R$"
                validated={false}
                disabled
              />
            </InputContainer>
            <CustomSectionTitle>
              Tributação e Regulamentação
            </CustomSectionTitle>
            <InputContainer>
              <MeasureBox
                name="ipi"
                title="IPI"
                measure="%"
                width="6.25rem"
                validated={false}
              />
              <FormInput
                name="ncm"
                title="NCM"
                width="6.875rem"
                validated={false}
              />
              <FormInput
                name="cst"
                title="CST"
                width="6.25rem"
                validated={false}
              />
              <FormInput
                name="cfop"
                title="CFOP"
                width="6.25rem"
                validated={false}
              />
              <MeasureBox
                name="icms"
                title="ICMS"
                measure="%"
                width="6.25rem"
                validated={false}
              />
              {/* <FormSelect
                name="certification"
                title="Certificação"
                placeholder="Selecione..."
                customWidth="12.5rem"
                customDefaultValue={{
                  value: 'Inmetro',
                  label: 'Inmetro'
                }}
                data={certificationOptions}
                disabled={loading}
              /> */}
              <TagInput
                title="Certificação"
                tags={certificationTags}
                setTags={setCertificationTags}
                width="12.5rem"
                validated={false}
                onFocus={() => setDisabled(true)}
                onBlur={() => 
                  setTimeout(() => setDisabled(false), 2000)
                }
              />
              <FormSelect
                name="age_group"
                title="Faixa Etária"
                customWidth="12.5rem"
                data={ageGroupOptions}
                disabled={isLoading}
                customValue={{
                  value: product.age_group,
                  label: product.age_group
                }}
              />
            </InputContainer>
            <CustomSectionTitle>
              Atributos
            </CustomSectionTitle>
            <InputContainer style={{ alignItems: 'flex-end' }}>
              <Select
                title="Grupo de Categorias de Atributos"
                placeholder="Selecione..."
                customWidth="18.75rem"
                data={attributesOptions}
                defaultValue={currentAttributeCategory}
                setValue={
                  (value: string) => setCurrentOption({ value, label: value})
                }
              />
              <TableActionButton
                onClick={handleAddAttributeGroup}
                style={{ marginLeft: '1.25rem' }}
              >
                <PlusIcon />
              </TableActionButton>
              {!!product.attribute_category &&
                <TableActionButton
                  onClick={handleDeleteCategory}
                  style={{ marginLeft: '0.5rem' }}
                >
                  <TrashIcon />
                </TableActionButton>
              }
            </InputContainer>
            {!!currentAttributes.length &&
              <ProductAttribute
                attributes={currentAttributes}
              />
            }
            <CustomSectionTitle>
              Opcionais
            </CustomSectionTitle>
            <InputContainer style={{ alignItems: 'flex-end' }}>
              <Input
                name="Produto"
                placeholder="Informe o produto..."
                width="30rem"
                value={currentProductOption}
                onChange={ // @ts-ignore
                  (e) => setCurrentProductOption(e.target.value)
                }
              />
              <AddingOptionalProduct
                onClick={handleLookupProduct}
                disabled={addingOptionalProduct}
                style={{ marginLeft: '1.25rem' }}
              >
                {addingOptionalProduct ? <LoadingIcon /> : <PlusIcon />}
              </AddingOptionalProduct>
            </InputContainer>
            <ProductOptionalsHeader>
              <div>
                <strong>Mover</strong>
              </div>
              <div>
                <strong>Nome do Opcional</strong>
              </div>
              <div>
                <strong>Referência</strong>
              </div>
              <div>
                <strong>EAN13</strong>
              </div>
              <div>
                <strong>DUN14</strong>
              </div>
              <div>
                <strong>Ação</strong>
              </div>
            </ProductOptionalsHeader>
            <ProductOptionalsContainer>
            {currentProducts.map((p, index) =>
              <Scope key={p.id} path={`optionals[${index}]`}>
                <ProductOptionals
                  product={p}
                  productId={product.id}
                  productIndex={index}
                  onDelete={() => handleOnDelete(p.title)}
                  />
              </Scope>
            )}
            </ProductOptionalsContainer>
        </Container>
        </Form>
      </MenuAndTableContainer>
      <Modal
        title="Selecione o produto"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        customOnClose={() => {}}
        style={{ width: 471 }}
      >
        <ProductsContainer>
          {searchProducts.map((p) => 
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
                onClick={() => handleAddOptionalProduct(p)}
                style={{ marginLeft: '1rem' }}
              >
                <PlusIcon />
              </TableActionButton>
            </div>
          )}
        </ProductsContainer>
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
