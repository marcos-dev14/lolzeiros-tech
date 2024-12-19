import styled from 'styled-components';

import { buttonStyle } from '~styles/components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 7.5rem;
  background-color: #fff;
`;

export const BreadCrumb = styled.p`
  font-size: 0.875rem;
  color: #35363A;
  margin: 0.875rem 0 1.25rem;
  display: flex;
  align-self: flex-start;
  
  p:last-child {
    font-family: "Roboto";
    font-weight: bold;
  }
`;

export const Content = styled.div`
  width: 100%;
  max-width: 1192px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ProductInfoContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const Picture = styled.img`
  width: 500px;
  height: 500px;
  border-radius: 1rem;
  box-shadow: 0px 0px 30px #00000029;
  object-fit: cover;
`;

export const ProductInfo = styled.div`
  width: 100%;
  height: 500px;
  max-width: 635px;
  margin-left: 1.875rem;
  display: flex;
  flex-direction: column;

  h1 {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    width: 100%;
    height: 4.75rem;
    font-size: 1.5625rem;
    line-height: 2.375rem;
    color: #35363A;
    font-family: "Roboto";
    font-weight: bold;
  }
`;

export const BarcodeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1.375rem;

  svg {
    width: 27px;
    height: 20px;
    margin-right: 0.375rem;
  }

  font-size: 1rem;
  color: #35363A;
`;

export const BadgeContainer = styled.div`
  margin-top: 1.875rem;
  display: flex;

  img {
    width: 9.375rem;
    height: 4.6875rem;
    border-radius: 0.5rem;
    object-fit: cover;

    & + img {
      margin-left: 1.25rem;
    }
  }
`;

export const AmountAndPriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2rem;
`;

export const AmountContainer = styled.div`
  display: flex;
  height: 3rem;

  div {
    background-color: #fff;
    border-top: 2px solid ${({ theme }) => theme.colors.medium_gray};
    border-bottom: 2px solid ${({ theme }) => theme.colors.medium_gray};
    width: 3rem;
    height: 3rem;
    line-height: 2.75rem;
    color: #35363A;
    font-size: 1rem;
    text-align: center;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3rem;
    width: 2.25rem;
    background-color: #EBEBEB;
    color: #35363A;
    
    &[disabled] {
      color: #fff;
      cursor: not-allowed;
    }
  
    &:first-child {
      border-radius: 0.5rem 0 0 0.5rem;
    }

    &:last-child {
      border-radius: 0 0.5rem 0.5rem 0;
    }
  }
`;

export const Price = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1.875rem;

  font-size: 1rem;
  color: #35363A;

  p {
    line-height: 1.25rem;
    margin-top: 0.75rem;
    font-size: 1.0625rem;
    color: #D6D6D6;

    strong {
      font-family: "Roboto";
    font-weight: bold;
      font-size: 2.5rem;
    }
  }
`;

export const AddToCartButton = styled.button`
  width: 23.5rem;
  height: 4rem;
  border-radius: 0.5rem;
  background-color: #3AB879;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1rem;
  text-transform: uppercase;
  margin-top: auto;
  font-family: "Roboto";
    font-weight: bold;

  svg {
    margin-right: 0.5rem;
  }
`;

export const SocialContainer = styled.div`
  margin-top: 1.5rem;
  width: 100%;
  background-color: #F0F0F0;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    width: 11.25rem;
    height: 2.75rem;
    border-radius: 0.5rem;
    background-color: #1378AF;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.875rem;
    text-transform: uppercase;
    font-family: "Roboto";
    font-weight: bold;

    & + button {
      margin-left: 1.25rem;
    }

    svg {
      margin-right: 0.625rem;
    }
  }
`;

export const DescriptionContainer = styled.div`
  display: flex;
  margin-top: 2.5rem;
  width: 100%;
  /* align-items: center; */
  max-width: 1192px;
  justify-content: space-between;
`;

export const Description = styled.div`
  padding: 1.25rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.medium_gray};
  
  h1, h2, h3, h4, h5, h6, strong {
    font-family: "Roboto";
    font-weight: bold;
  }

  h2 {
    width: 100%;
    font-size: 1.5625rem;
    line-height: 2.375rem;
    color: #35363A;
    font-family: "Roboto";
    font-weight: bold;
    
    &:not(.title) {
      margin-bottom: 2.625rem;
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
    }
  }

  p, a, strong {
    color: #141319;
    font-size: 1.125rem;
    line-height: 1.875rem;

    a {
      color: #1378AF;
    }

    strong {
      font-family: "Roboto";
    font-weight: bold;
    }
  }

  iframe {
    margin: 1rem 0;
    width: 100%;
    height: 20rem;
    border-radius: 1rem;
  }
`;

export const DescriptionValue = styled.div`
  display: flex;
  width: 100%;
  
  margin-top: 1.625rem;  

  & + div {
    margin-top: 0.25rem;
  }

  div {
    display: flex;
    align-items: center;
    font-size: 1rem;
    color: #141319;
    height: 2.125rem;

    &:first-child {
      background-color: #D6D6D6;
      min-width: 12.25rem;
      padding-left: 1rem;
      border-radius: 0.25rem 0 0 0.25rem;
    }
    
    &:last-child {
      background-color: #F0F0F0;
      width: 100%;
      padding-left: 1.25rem;
      border-radius: 0 0.25rem 0.25rem 0;
    }
  }
`;

export const EmbedProduct = styled.div`
  margin: 2rem 0 1.25rem;
  width: 100%;
  border-radius: 1rem;
  background-color: #fff;
  box-shadow: 0px 0px 20px #00000029;
  display: flex;
  
  > img {
    width: 12.25rem;
    min-width: 12.25rem;
    height: 12.25rem;
    border-radius: 1rem;
    box-shadow: 0px 0px 20px #00000029;
  }
`;

export const EmbedProductDescription = styled.div`
  height: 12.25rem;
  display: flex;
  flex-direction: column;
  padding: 1rem 1.25rem;
  justify-content: space-between;
  width: 100%;

  div {
    margin-top: 0;
  }

  > strong {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    max-width: 97.5%;
    height: 2.75rem;
    font-size: 1rem;
    font-family: "Roboto";
    font-weight: bold;
    line-height: 1.375rem;
  }
`;

export const EmbedProductBrandsAndPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    width: 5.5rem;
    height: 2.75rem;
    border-radius: 0.5rem;
  }
  
  p, strong {
    color: #3AB879;
  }
`;