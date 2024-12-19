import { useCallback, useEffect, useMemo, useState } from 'react';
import { MenuAndTableContainer } from '~styles/components';
import * as Yup from 'yup';

import { ReactComponent as PlusIcon } from '~assets/plus.svg'
import { ReactComponent as LoadingIcon } from '~assets/loading.svg';

import { Header } from '~components/Header';
import { Menu } from '~components/Menu';
import { CustomSelect as Select } from '~components/Select';
import { DetailsRelatedProduct } from '~components/DetailsRelatedProduct';
import { ProductHeader } from '~components/ProductHeader';

import { DefaultValueProps, IBrand, ICategory, Image, MainProduct, Supplier } from '~types/main';
import { api } from '~api';

import {
  Container,
  CustomSectionTitle,
  SelectContainer,
  ProductsContainer,
  SearchProductsContainer,
  AddingRelatedProduct
} from './styles';
import { useProduct } from '~context/product';
import { Input } from '@/src/components/Input';
import { ErrorModal } from '@/src/components/ErrorModal';
import { TableActionButton } from '@/src/styles/components/tables';
import { Modal } from '@/src/components/Modal';
import { useQuery } from 'react-query';
import { fetchProductsData } from '@/src/services/requests';
import { SuccessModal } from '@/src/components/SuccessModal';
import { emptyFieldRegex, getUrl } from '@/src/utils/validation';
import { PostActionsButton } from '../styles';

export function RelatedProducts() {
  const { product, updateProduct, supplier } = useProduct();
  const [selectedProducts, setSelectedProducts] = useState<MainProduct[]>(() =>
    !!product ?
      !!product.related ? product.related : []
      : []
  )

  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(-1);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [savingProduct, setSavingProduct] = useState(false);

  const [currentProduct, setCurrentProduct] = useState('');
  const [searchProducts, setSearchProducts] = useState<MainProduct[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: productsData, isLoading } = useQuery(['productsData', supplier.id], fetchProductsData, {
    staleTime: 1000 * 60 * 5,
  });

  const handleLookupProduct = useCallback(async () => {
    try {
      setAdding(true);

      const {
        data: {
          data: { data }
        }
      } = await api.get(`/products`, {
        params: {
          reference: currentProduct
        }
      });

      if (!data.length) {
        setError('Nenhum produto foi encontrado.');
        return;
      }

      setSearchProducts(data);
      setIsModalOpen(true);
    } catch (e) {
      // @ts-ignore
      console.log('e', e.response.data.message);
    } finally {
      setAdding(false);
    }
  }, [currentProduct]);

  const handleAddProduct = useCallback(async (p: MainProduct) => {
    try {
      setIsModalOpen(false);
      setAdding(true);

      const data = {
        // @ts-ignore
        attach_product_id: p.id
      }

      await api.post(`/products/${product.id}/related`, data)

      setCurrentProduct('');
      setSelectedProducts(prev => [...prev, p]);

      updateProduct({ ...product, related: [...product.related, p] })

    } catch (e) {
      console.log('e', e);
    } finally {
      setAdding(false);
    }
  }, [product, updateProduct]);

  const handleRemoveProduct = useCallback(async (id: number) => {
    try {

      // @ts-ignore
      setDeleting(id);

      await api.delete(`/products/${product.id}/related/${id}`)

      setSelectedProducts(prev => prev.filter(p => p.id !== id));

      updateProduct({
        ...product,
        related: product.related.filter(p => p.id !== id)
      })


    } catch (e) {
      console.log('e', e);
    } finally {
      setDeleting(-1);
    }
  }, [product, updateProduct]);

  // @ts-ignore
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

      const {
        certificationTags,
        expiration_date,
        file,
        tags,
        pictures,
        highlightImage,
        supplier_id,
        brand_id,
        category_id
      } = product;

      // @ts-ignore
      const supplier = suppliers.find(s => s.name === supplier_id);

      // @ts-ignore
      const brand = brands.find(b => b.name === brand_id);

      // @ts-ignore
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

      // if (hasImages) {
      //   const {
      //     data: { data }
      //   } = await api.post(`/products/${product.id}/images`, imagesData);

      //   let updatedPictures: Image[] = [];
      //   let filteredPictures = pictures.filter(p => p.image.JPG.includes('augeapp.com.br'));
      //   updatedPictures = [...updatedPictures, ...data];

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
      // };

      const formattedData = {
        ...product,
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
      delete formattedData.embed;
      // @ts-ignore
      delete formattedData.embed_id;
      // @ts-ignore
      delete formattedData.embed_title;
      // @ts-ignore
      delete formattedData.embed_type;

      await api.put(`/products/${product.id}`, formattedData);

      updateProduct({} as unknown as MainProduct);
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
    schema,
    // badgeOptions
  ]);

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
      <Header minimal route={['Loja Online', 'Produto', 'Produtos Relacionados']} />
      <MenuAndTableContainer>
        <Menu minimal />
        <Container>
          <ProductHeader>
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
            Produtos Relacionados
          </CustomSectionTitle>
          <SelectContainer>
            <Input
              name="Produto"
              placeholder="Informe o produto..."
              width="30rem"
              value={currentProduct}
              onChange={ // @ts-ignore
                (e) => setCurrentProduct(e.target.value)
              }
            />
            <AddingRelatedProduct
              onClick={handleLookupProduct}
              disabled={adding}
            >
              {adding ? <LoadingIcon /> : <PlusIcon />}
            </AddingRelatedProduct>
          </SelectContainer>
          <ProductsContainer>
            {selectedProducts.map(p =>
              <DetailsRelatedProduct
                disabled={deleting === p.id}
                product={p}
                closeAction={() => handleRemoveProduct(p.id)}
              />
            )}
          </ProductsContainer>
        </Container>
      </MenuAndTableContainer>
      <Modal
        title="Selecione o produto"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        customOnClose={() => { }}
        style={{ width: 471 }}
      >
        <SearchProductsContainer>
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
                onClick={() => handleAddProduct(p)}
                style={{ marginLeft: '1rem' }}
              >
                <PlusIcon />
              </TableActionButton>
            </div>
          )}
        </SearchProductsContainer>
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
