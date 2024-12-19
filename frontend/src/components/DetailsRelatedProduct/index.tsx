import { useMemo } from 'react';
import { parseISO } from 'date-fns';

import { ReactComponent as BarCode } from '~assets/barcode.svg';
import { ReactComponent as CloseIcon } from '~assets/close_white.svg';

import { ReactComponent as BagIcon } from '~assets/bag.svg'
import { ReactComponent as ViewIcon } from '~assets/eye.svg'

import {
  Container,
  Picture,
  Content,
  Title,
  TagContainer,
  PriceContainer,
  BrandsContainer,
  CloseButton,
  AdditionalInfo
} from './styles';

import { MainProduct } from '~types/main';

type Props = {
  closeAction: () => void;
  product: MainProduct;
  withBorder?: boolean;
  disabled?: boolean;
}

export function DetailsRelatedProduct({ closeAction, disabled = false, product, withBorder = true }: Props) {
  const formattedPrice = useMemo(() => {
    const { box_price_promotional, box_price } = product;
    const currentPrice = !!box_price_promotional ? box_price_promotional : box_price

    return currentPrice;
  }, [product]);

  const formattedDate = useMemo(() => 
    parseISO(product.created_at).toLocaleDateString('pt-BR')
  , [product]);

  const productImage = useMemo(() => {
    const { images } = product;
    
    // @ts-ignore
    return !!images ? !!images.length ? images[0].image.JPG : '' : '';
  }, [product]);

  return (
    <Container withBorder={withBorder} disabled={disabled}>
      <div>
        <Picture src={productImage} />
        <Content>
          <TagContainer>
            <BarCode />
            <p>
              {product.ean13}&nbsp;&nbsp;
              <b>{formattedDate}</b>
            </p>
          </TagContainer>
          {!!product.reference &&
            <AdditionalInfo>Referência: {product.reference}</AdditionalInfo>
          }
          <Title>
            {product.title}
          </Title>
          <PriceContainer>
            {!!product.box_price_promotional && <p>de R$&nbsp;{product.box_price} por</p>}
            <b>R$ {product.box_price_promotional ?? product.box_price}</b>
          </PriceContainer>
          {!!product.box_minimal && 
            <AdditionalInfo style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
              Mínimo Caixa Fechada: {product.box_minimal} peças
            </AdditionalInfo>
          }
        </Content>
      </div>
      <BrandsContainer>
        {!!product.brand &&
          !!Object.values(product.brand.image).length ?
            <img src={product.brand.image.JPG} alt="" /> :
            <></>
        }
        {/* @ts-ignore */}
        {!!product.supplier && <img src={product.supplier.image.JPG} alt="" />}
        <div>
          <ViewIcon />
          <p style={{ color: "#3699cf" }}>
            {product.views ?? 0}
          </p>
        </div>
        <div>
          <BagIcon />
          <p style={{ color: "#21d0a1" }}>
            {product.sales ?? 0}
          </p>
        </div>
      </BrandsContainer>
      <CloseButton onClick={closeAction} disabled={disabled}>
        <CloseIcon />
      </CloseButton>
    </Container>
  );
}
