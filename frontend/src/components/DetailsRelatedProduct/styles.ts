import styled from 'styled-components';

type ContainerProps = {
  withBorder: boolean;
  disabled: boolean;
}

export const Container = styled.div<ContainerProps>`
  width: 25rem;
  min-height: 11.375rem;
  height: auto;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.medium_gray};
  border-style: ${({ withBorder }) => withBorder ? 'solid' : 'none'};
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0.75rem;

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
  min-height: 7.5rem;
  height: auto;
  margin-left: 1.25rem;
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
      color: #3798CD;
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

export const AdditionalInfo = styled.p`
  font-family: "Roboto";
  font-size: 0.8125rem;
  line-height: 1;
  margin-top: 0.5rem;
`;

export const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  /* margin-top: auto; */
  margin-top: 0.75rem;
  
  p {
    font-size: 0.75rem;
    margin-right: 0.5rem;
    color: #B7BFC9;
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
  
  div, img {
    display: flex;
    align-items: center;
    justify-content: center;

    p {
      margin-left: 0.375rem;
      font-size: 0.75rem;
    }

    width: 4rem;
    height: 2rem;
    border-radius: 0.25rem;
    background-color: #F3F4F7;
    object-fit: cover;
  }
  
  div:not(:first-child), img:not(:first-child) {
    margin-left: 1.25rem;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #FF7373;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 50%;
    height: 50%;
  }
`;