import styled from 'styled-components';

export const Container = styled.div`
  width: 25rem;
  height: 11.25rem;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.medium_gray};
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0.625rem;

  > div {
   display: flex;
  }

  &[disabled] {
    opacity: 0.7;
  }
`;

export const Picture = styled.img`
  width: 7.5rem;
  height: 7.5rem;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.medium_gray};
  object-fit: cover;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 7.5rem;
  margin-left: 0.625rem;
`;

export const TagContainer = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    width: 14px;
    height: 11px;
    margin-right: 5px;
  }
  
  p {
    font-size: 0.875rem;
    
    b {
      font-weight: normal;
      color: #8073FC;
    }
  }
`;

export const Title = styled.strong`
  font-family: "Roboto";
  font-weight: bold;
  line-height: 1.375rem;
  max-width: 15.625rem;
  margin-top: 0.75rem;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  height: 2.75rem;
`;

export const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: auto;
  
  p {
    font-size: 0.75rem;
    color: #B7BFC9;

    & + b {
      margin-left: 0.75rem;
    }
  }

  b {
    font-family: "Roboto";
    font-weight: bold;
  }
`;

export const BrandsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.625rem;
  
  img {
    object-fit: contain;
  }

  div, img {
    display: flex;
    align-items: center;
    justify-content: center;

    p {
      margin-left: 0.375rem;
      font-size: 0.75rem;
    }

    width: 3.75rem;
    height: 2rem;
    border-radius: 0.25rem;
    background-color: #F3F4F7;
  }
  
  div:not(:first-child), img:not(:first-child) {
    margin-left: 0.625rem;
  }
  
  button {
    margin-left: auto;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    background-color: #21D0A1;
    display: grid;
    place-items: center;
    padding-left: 2.5px;
    padding-bottom: 2px;
  }
`;
