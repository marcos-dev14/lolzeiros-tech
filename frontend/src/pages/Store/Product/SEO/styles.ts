import styled, { css } from 'styled-components';

import { buttonStyle, InputContainer, MainContainer, SectionTitle } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1346px;
  padding-bottom: 4.5rem;
`;

export const CustomSectionTitle = styled(SectionTitle)`
  margin-top: 1.25rem;
`;

export const SEOAddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 607px;
  height: 11rem;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.medium_gray};
  padding: 1rem 2rem;
`;

const seoContent = css`
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  max-width: 97.5%;
`;

export const SEOAddress = styled.p`
  ${seoContent}
  line-height: 1.125rem;
  height: 1.25rem;
  margin-top: 0.75rem;
  color: #343437;
`;

export const SEOTitle = styled.p`
  ${seoContent}
  font-size: 1.3125rem;
  line-height: 1.5625rem;
  height: 1.5625rem;
  color: #352AB4;
  margin-top: 0.375rem;
`;

export const SEODescription = styled(SEOAddress)`
  font-size: 0.9375rem;
  color: #70757A;
  line-height: 1.25rem;
  height: 2.5rem;
  margin-top: 0.375rem;
  max-width: 90%;
  -webkit-line-clamp: 2;
`;

export const Button = styled.button`
  ${buttonStyle};

  width: 12.5rem;
  margin-left: 1.25rem;

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const QrCodeInputContainer = styled(InputContainer)`
  align-items: flex-start;

  > div {
    &:not(:first-child){
      margin-left: 2.5rem;
    }
  }

  canvas {
    border: 1px solid ${({ theme }) => theme.colors.medium_gray};
  }
`;

export const TagContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 12.5rem);
  grid-template-rows: repeat(2, 12.5rem);
  gap: 1.5625rem;
  
  width: 31.25rem;
  height: 31.25rem;
  
  border: 10px solid #3798CD;
  background-color: #fff;
  padding: 1.875rem;

  > div:not(:nth-child(2)), img, svg, canvas {
    width: 12.5rem;
    height: 12.5rem;
    border: 1px solid ${({ theme }) => theme.colors.medium_gray};
  }

  > div {
    background-position: center;
    background-size: cover;
  }

  img {
    object-fit: cover;
    cursor: pointer;
  }
`;

export const TagBarcodeContainer = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 27px;
    height: 20px;
    margin-right: 0.375px;
  }

  p {
    ${seoContent}
    color: #35363A;
  }
`;

export const TagProductInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
      
  strong {
    color: #000000;
    line-height: 1.5625rem;
    margin-top: 1.25rem;
    font-family: "Roboto";
    font-weight: bold;
  }

  p {
    ${seoContent}
    color: #35363A;
  }

  > svg {
    margin-top: auto;
    width: 184px;
    height: 50px;
  }
`;

export const HorizontalTagContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 47.875rem;
  height: 17.3125rem;
  border: 10px solid #3798CD;
  background-color: #fff;
  padding: 1.875rem;

  > div:not(:nth-child(2)), svg {
    width: 12.5rem;
    height: 12.5rem;
    border: 1px solid ${({ theme }) => theme.colors.medium_gray};
  }

  > svg {
    padding-left: 0.625rem;
  }
`;

export const HorizontalTagContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 12.5rem;
  margin-left: 1.25rem;
  flex: 1;

  strong {
    ${seoContent}
    color: #000000;
    font-family: "Roboto";
    font-weight: bold;
    font-size: 1.5625rem;
    line-height: 2.1875rem;
    margin-top: 0.75rem;
  }

  b {
    color: #3798CD;
    font-family: "Roboto";
    font-weight: bold;
    font-size: 1.125rem;
    margin-left: 0.5rem;
  }

  > div:not(:first-child) {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 1.5625rem;

    div {
      display: flex;
      align-items: center;

      p {
        ${seoContent}
        color: #35363A;
      }
    }
  }

  > div:first-child {
    display: flex;
    align-items: flex-start;
  }
`;