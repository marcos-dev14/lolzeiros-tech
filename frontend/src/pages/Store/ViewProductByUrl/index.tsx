import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams, useLocation, useRouteMatch } from 'react-router-dom';

import { ReactComponent as BarcodeIcon } from '~assets/barcode.svg';
import { ReactComponent as PlusIcon } from '~assets/plus_icon.svg';
import { ReactComponent as MinusIcon } from '~assets/minus_icon.svg';
import { ReactComponent as BagIcon } from '~assets/bag_white.svg'
import { ReactComponent as FacebookIcon } from '~assets/facebook-icon.svg';
import { ReactComponent as WhatsappIcon } from '~assets/whatsapp-icon.svg';
import { ReactComponent as EmailIcon } from '~assets/email-icon.svg';
import { ReactComponent as BookmarkIcon } from '~assets/bookmark-icon.svg';

import { CustomSelect as Select } from '~components/Select';
import { ImagesCarousel } from '~components/ImagesCarousel';
import { Header } from '~components/Header';

import {
  BreadCrumb,
  Container,
  Content,
  ProductInfoContainer,
  Picture,
  ProductInfo,
  BarcodeContainer,
  BadgeContainer,
  AmountAndPriceContainer,
  AmountContainer,
  Price,
  AddToCartButton,
  SocialContainer,
  DescriptionContainer,
  Description,
  DescriptionValue,
  EmbedProduct,
  EmbedProductDescription,
  EmbedProductBrandsAndPrice
} from './styles';
import { useProduct } from '~context/product';
import { GoBackButton } from '@/src/components/ProductHeader/styles';

import { ReactComponent as GoBackIcon } from '~assets/goback_arrow.svg';
import { MainProduct } from '@/src/types/main';
import { api } from '@/src/services/api';
import { LoadingContainer } from '@/src/components/LoadingContainer';

export function ViewProductByUrl() {
  const { push } = useHistory();
  const { pathname } = useLocation();

  const [product, setProduct] = useState(null as unknown as MainProduct) 
  
  const [amount, setAmount] = useState(1);
  const [currentBanner, setCurrentBanner] = useState('')
  const [error, setError] = useState('')
  
   const formattedUnitPrice = useMemo(() => 
     !!product ? product.unit_price : ''
   , [product]);

  const fetchProduct = useCallback(async () => {
    try {
      const [a,b,...productSlug] = pathname.split('/');
      const slug = productSlug.join('/');

      const {
        data: {
          data: product
        }
      } = await api.get('products');

      setProduct(product[0])
    } catch(e) {
      // @ts-ignore
      setError(e.response.data.message)
    }
  }, [pathname]);

  const banner = useMemo(() => 
    !!product ?
      'file' in product ? product.file :
      !!product.images ?
        !!product.images[0] ? 
            product.images[0].image.JPG :
            '' :
        '' :
      ''
  , [product]);

  const formattedPictures = useMemo(() => 
    !!product ?  
    // @ts-ignore
    product.images.map(p => ({ banner: p.image.JPG, thumbs: p.image.JPG, })) :
    []
  , [product]);

  const brandImage = useMemo(() => 
    !!product ?  
      !!product.brand ? 
        product.brand.image.JPG : ''
      : ''
  , [product])

  const supplierImage = useMemo(() => 
    !!product ?  
      !!product.supplier ? // @ts-ignore
        product.supplier.image.JPG : ''
      : ''
  , [product])

  const variations = useMemo(() => 
    !!product ?    
      !!product.variations ? 
        product.variations.map(p => ({ value: p.title, label: p.title, })) : []
    : []
  , [product]);

  const [price, decimal] = useMemo(() => {
    if(!product) return ['00', '00'];
    const { box_price, box_price_promotional } = product;

    const current =
      !!box_price_promotional ? box_price_promotional :
      !!box_price ? box_price :
      '0.00';

    if(current.includes('.'))
      return current.split('.');
    
    return [current, '00'];
  }, [product]);

  const { currentPrice, currentDecimal } = useMemo(() => {
    const formattedPrice = Number(price + '.' + decimal);
    // const formattedPrice = Number('49' + '.' + '49');

    const [int, dec] = String(formattedPrice * amount).split('.');

    const formattedDecimal =
      !!dec ?
        dec.length === 1 ? `,${dec}0` :
        dec.length > 2 ? `,${dec[0]}${dec[1]}` :
        `,${dec}` :
      ',00';

    return {
      currentPrice: int,
      currentDecimal: formattedDecimal
    }
  }, [price, decimal, amount]);

  const embedProduct = useMemo(() => {
    if(!product) return null;
    if(!product.embed) return null;

    const {
      embed: {
        title,
        reference,
        brand,
        images,
        supplier,
        unit_price: price,
      },
     } = product;

    const embedSupplierImage =
    !!supplier ? // @ts-ignore
      !!Object.values(supplier.image).length ? supplier.image.JPG : ''
      : '';
    
    const embedImage = 
    !!images ? // @ts-ignore
      !!Object.values(images).length ? images.image.JPG : ''
      : '';

    const embedBrandImage = // @ts-ignore
     !!Object.values(brand.image).length ? brand.image.JPG : '';
    
    
    return {
      embedImage,
      embedTitle: title,
      embedReference: reference,
      embedSupplierImage,
      embedBrandImage,
      embedPrice: !!price ? price.split('.')[0] : '00' ,
      embedDecimalPrice: !!price ? price.split('.')[1] : '00' 
    }

  }, [product]);

  useEffect(() => {
    fetchProduct()
  }, [])

  return (
    <>
    <Header route={['Loja Online', 'Visualizar Produto']}/>
    {!!product ?
      <Container>
      <Content>
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between'
          }}
        >
          <BreadCrumb>
            <p>{product.supplier.name} /&nbsp;</p>
            <p>{product.category_id ?? product.category.name} /&nbsp;</p>
            <p>{product.title}</p>
          </BreadCrumb>
          <GoBackButton
            onClick={() => push('/store/product')}
            type="button"
            className="goBack"
          >
            <GoBackIcon />
            <p>Voltar</p>
          </GoBackButton>
        </div>
      <ProductInfoContainer>
        <Picture src={!!currentBanner ? currentBanner : banner} />
        <ProductInfo>
          <h1>
            {product.title}
          </h1>
          <BarcodeContainer>
            <BarcodeIcon />
            Referência {product.reference}
          </BarcodeContainer>
          <BadgeContainer>
            <img src={brandImage} alt="" />
            <img src={supplierImage} alt="" />
          </BadgeContainer>
          {!!variations.length &&
            <Select
              title="Outras opções"
              placeholder="Selecione..."
              customWidth="27.75rem"
              setValue={() => {}}
              style={{ marginTop: '1.75rem' }}
              data={variations}
            />
          }
          <AmountAndPriceContainer>
            <AmountContainer>
              <button
                onClick={() => setAmount(prev => prev - 1)}
                disabled={amount === 1}
              >
                <MinusIcon />
              </button>
              <div>
                {amount}
              </div>
              <button
                onClick={() => setAmount(prev => prev + 1)}
              >
                <PlusIcon />
              </button>
            </AmountContainer>
            <Price>
              Valor Unitário
              <p>R$
                <strong>{price}</strong>,{decimal}
              </p>
            </Price>
            <Price>
              Valor Total
              <p style={{ color: '#3AB879' }}>R$
                <strong>{currentPrice}</strong>{currentDecimal}
              </p>
            </Price>
          </AmountAndPriceContainer>
          <AddToCartButton onClick={() => {}}>
            <BagIcon />
            Adicionar ao Cesto
          </AddToCartButton>
        </ProductInfo>
        </ProductInfoContainer>
        {!!formattedPictures.length &&
          <ImagesCarousel
            images={formattedPictures}
            setImage={setCurrentBanner}
          />
        }
      </Content>
      <SocialContainer>
        <button onClick={() => {}}>
          <FacebookIcon />  
          Facebook
        </button>
        <button onClick={() => {}}>
          <WhatsappIcon />  
          WhatsApp
        </button>
        <button onClick={() => {}}>
          <EmailIcon />  
          Email
        </button>
        <button onClick={() => {}}>
          <BookmarkIcon />  
          Favoritos
        </button>
      </SocialContainer>
      <DescriptionContainer>
        <Description style={{ width: '615px' }}>
          <h2>{product.title}</h2>
          <div dangerouslySetInnerHTML={{__html: product.primary_text ?? ''}}/>
          {!!embedProduct && 
            <EmbedProduct>
              <img src={embedProduct?.embedImage} alt="" />
              <EmbedProductDescription>
                <strong>{embedProduct?.embedTitle}</strong>
                <BarcodeContainer>
                  <BarcodeIcon />
                  Referência {embedProduct?.embedReference}
                </BarcodeContainer>
                <EmbedProductBrandsAndPrice>
                  <img src={embedProduct?.embedSupplierImage} alt="" />
                  <img src={embedProduct?.embedBrandImage} alt="" />
                  <Price>
                    Valor Unitário
                    <p>R$
                      <strong>{embedProduct?.embedPrice}</strong>,{embedProduct?.embedDecimalPrice}
                    </p>
                  </Price>
                </EmbedProductBrandsAndPrice>
              </EmbedProductDescription>
            </EmbedProduct>
          }
          <div dangerouslySetInnerHTML={{__html: product.secondary_text ?? ''}}/>
        </Description>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Description style={{ width: '557px' }}>
            <h2 className="title">Dados Técnicos</h2>
            <DescriptionValue>
              <div>Representada</div>
              <div>{product.supplier.name}</div>
            </DescriptionValue>
            <DescriptionValue>
              <div>Referência</div>
              <div>{product.reference}</div>
            </DescriptionValue>
            {!!product.release_year &&
              <DescriptionValue>
                <div>Lançamento</div>
                <div>{product.release_year}</div>
              </DescriptionValue>
            }
            {!!product.availability &&
              <DescriptionValue>
                <div>Estoque</div>
                <div>{product.availability}</div>
              </DescriptionValue>
            }
            <DescriptionValue>
              <div>Marca</div>
              <div>{product.brand_id}</div>
            </DescriptionValue>
            {!!product.origin &&
              <DescriptionValue>
                <div>Origem</div>
                <div>{product.origin}</div>
              </DescriptionValue>
            }
            {!!product.size_width && !!product.size_height && !!product.size_length &&
              <DescriptionValue>
                <div>Dimensões L x A x P</div>
                <div>{product.size_width} x {product.size_height} x {product.size_length} cm</div>
              </DescriptionValue>
            }
            {!!product.size_cubic && !!product.size_weight &&
              <DescriptionValue>
                <div>Cubagem x Peso</div>
                <div>{product.size_cubic} m3 x {product.size_weight} kg</div>
              </DescriptionValue>
            }
            {!!product.catalog_page &&
              <DescriptionValue>
                <div>Página do Catálogo</div>
                <div>{product.catalog_page}</div>
              </DescriptionValue>
            }
            {!!product.packing_type &&
              <DescriptionValue>
                <div>Tipo de Embalagem</div>
                <div>{product.packing_type}</div>
              </DescriptionValue>
            }
            {!!product.age_group &&
              <DescriptionValue>
                <div>Idade recomendada</div>
                <div>{product.age_group} anos</div>
              </DescriptionValue>
            }
            {!!product.ncm &&
              <DescriptionValue>
                <div>NCM</div>
                <div>{product.ncm}</div>
              </DescriptionValue>
            }
            {!!product.icms &&
              <DescriptionValue>
                <div>ICMS</div>
                <div>{product.icms}</div>
              </DescriptionValue>
            }
            {!!product.ipi &&
              <DescriptionValue>
                <div>IPI</div>
                <div>{product.ipi}</div>
              </DescriptionValue>
            }
            {!!product.ean13 &&
              <DescriptionValue>
                <div>EAN</div>
                <div>{product.ean13}</div>
              </DescriptionValue>
            }
            {!!product.dun14 &&
              <DescriptionValue>
                <div>DUN14</div>
                <div>{product.dun14}</div>
              </DescriptionValue>
            }
            {!!product.cst &&
              <DescriptionValue>
                <div>CST</div>
                <div>{product.cst}</div>
              </DescriptionValue>
            }
          </Description>
        </div>
      </DescriptionContainer>
      </Container> :
      <LoadingContainer
        content="o produto"
      />
      }
    </>
  );
}

