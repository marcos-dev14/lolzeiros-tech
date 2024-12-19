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
  CloseButton
} from './styles';

import { MainProduct } from '~types/main';

type Props = {
  closeAction: () => void;
  product: MainProduct;
  withBorder?: boolean;
  disabled?: boolean;
}

export function RelatedProduct({ closeAction, disabled = false, product, withBorder = true }: Props) {
  const formattedPrice = useMemo(() => {
    const { unit_price_promotional, unit_price } = product;
    const currentPrice = !!unit_price_promotional ? unit_price_promotional : unit_price

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
              {product.reference}&nbsp;&nbsp;
              <b>{formattedDate}</b>
            </p>
          </TagContainer>
          <Title>
            {product.title}
          </Title>
          <PriceContainer>
            <b>R$ {formattedPrice}</b>
            <p>1 unidade</p>
          </PriceContainer>
        </Content>
      </div>
      <BrandsContainer>
        {/* {product.brands.map(b => 
          <img key={b.name} src={b.image} alt={b.name} />  
        )} */}
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
