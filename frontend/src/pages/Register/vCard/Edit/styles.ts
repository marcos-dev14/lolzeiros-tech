import { darken } from 'polished';
import styled from 'styled-components';

import { buttonStyle, MainContainer, SectionTitle } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1346px;
  padding-bottom: 4.5rem;
`;

export const CustomSectionTitle = styled(SectionTitle)`
  margin-top: 1.25rem;
`;

export const Button = styled.button`
  ${buttonStyle}
  width: 12.375rem;
  margin-left: 1.25rem;

  &.vCard {
    width: 15.25rem;
  } 
`;

export const ColumnInputContainer = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    &:not(:first-child){
      margin-top: .75rem;
    }
  }
`;

export const GoBackButton = styled.button`
  ${buttonStyle}

  margin-left: auto;
  width: 6.25rem;
  background-color: #78C5F0;
  color: #fff;
  
  svg {
    margin-right: 0.25rem;
    width: 0.9375rem;
    height: 0.9375rem;
  }
  
  &:hover {
    transition: all 0.2s;
    background-color: ${darken('0.2', '#78C5F0')};
  }
`;

export const DownloadVCardGrid = styled.div`
  display: grid;
  grid-template-columns: 13.125rem 9.375rem 26.25rem;
  margin-top: 2.5rem;
  gap: 0 6rem;
`;

export const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 13.125rem;

  button {
    ${buttonStyle};
    margin-top: 0.5rem;
    width: 100%;
  }
`;

export const PictureContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  img {
    width: 9.375rem;
    height: 9.375rem;
    border-radius: 50%;
    object-fit: cover;
  }

  > p {
    font-size: 0.75rem;
    margin: 2.25rem auto;
    color: #000;
  }
`;

export const SetPicture = styled.button`
  position: absolute;
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 50%;
  background-color: #FF7373;
  
  top: 57.5%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const AugePictureContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  
  div {
    width: 26.25rem;
    height: 9.375rem;
    border-radius: 0.25rem;
    border: 1px solid #dbdfeb;
    display: grid;
    place-items: center;

    svg {
      width: 85%;
      height: 85%;
    }
  }

  > p {
    font-size: 0.75rem;
    margin: 2.25rem auto;
    color: #000;
  }
`;

export const SignatureContainer = styled.div`
  display: flex;
  margin-top: 2.5rem;
`;

export const SignatureProfile = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 11.5rem;

  > img {
    width: 8rem;
    height: 8rem;
    border-radius: 50%;
    object-fit: cover;
  }

  > svg {
    width: 8rem;
    margin-top: 1.5rem;
  }

  div {
    display: grid;
    margin-top: 2rem;
    grid-template-columns: repeat(5, 1.5rem);
    gap: 0 0.25rem;

    a {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background-color: #3699CF;
    }
  }
`;

export const SignatureInfo = styled.div`
  margin-left: 1.875rem;
  
  strong {
    font-size: 1.125rem;
  }

  span {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    display: flex;
    align-items: center;

    svg {
      margin-right: 1.25rem;
    }
  }

  hr {
    margin: 1rem 0;
    background-color: #3699CF;
    color: #3699CF;
  }
  
  button {
    width: 21rem;
    height: 2.5rem;
    border-radius: 0.25rem;
    background-color: #3699CF;
    margin-top: 1.875rem;
    font-size: 1rem;
    color: #fff;
    text-align: center;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 23.75rem;
  margin-top: -0.375rem;
  margin-left: auto;

  button {
    width: 100%;
    height: 3.125rem;
    border-radius: 0.25rem;
    background-color: #DBDFEB;
    margin-top: 1.875rem;
    font-size: 1rem;
    color: #0F1331;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      margin-right: 0.25rem;
    }
    
    &.save {
      color: #fff;
      background-color: #25CFA1;
    }
    
    &.delete {
      color: #fff;
      background-color: #FF7373;
    }

    & + button {
      margin-top: 3.125rem;
    }
  }
`;