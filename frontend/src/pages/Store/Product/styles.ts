import styled, { css, keyframes } from 'styled-components';
import { darken } from 'polished';

import { MainContainer, SectionTitle, buttonStyle } from '~styles/components';
import { TableActionButton } from '@/src/styles/components/tables';

type HighlightImageProps = {
  image: string;
}

export const Container = styled(MainContainer)`
  max-width: 1346px;
  padding-bottom: 4.5rem;
`;

export const HeaderContainer = styled.div`
  display: flex;

  a {
    & + a{
      margin-left: 2.5rem;
    }
  }
`;

export const CustomSectionTitle = styled(SectionTitle)`
  margin-top: 1.25rem;

  b {
    color: #3798CD;
  }
`;

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MainImageContainer = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 1.25rem;
`;

export const DimensionsContainer = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 1.25rem;
  
  p {
    margin: 0 0.375rem;
    color: #0F1331;
    height: 1.75rem;
  }
`;

export const GalleryContainer = styled.div<{ rowsLength: number }>`
  display: grid;
  grid-template-columns: repeat(2, 12.0625rem);
  grid-template-rows: ${({ rowsLength }) => `repeat(${rowsLength}, 12.0625rem)`};
  gap: 1.25rem;
  justify-content: space-between;
  padding: 1.25rem;
  width: 100%;
  height: 895px;
  margin-top: 1.25rem;
  background-color: #F3F4F7;
  border-radius: 1rem;
  overflow-y: scroll;
`;

export const GalleryImage = styled.div<{ disabled: boolean }>`
  position: relative;
  margin: 0;
  border-radius: 1rem;
  background-color: #DBDFEB;
  width: 12.0625rem;
  height: 12.0625rem;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ disabled }) => disabled && css`
    opacity: 0.6;
  `};

  img {
    margin: 0;
    border-radius: 1rem;
    background-color: #DBDFEB;
    width: 12.0625rem;
    height: 12.0625rem;
  
    /* position: absolute; */

    object-fit: cover;
    box-shadow: 0px 0px 30px #00000029;
  }

  button {
    position: absolute;
    width: 2.125rem;
    height: 2.125rem;
    border-radius: 50%;
    background-color: #FF7373;
    
    top: 0%;
    right: 0%;
    transform: translate(50%, -50%);
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 50%;
      height: 50%;
    }
  }
`;

// export const HighlightImage = styled.div<HighlightImageProps>`
export const HighlightImage = styled.div`
  width: 10rem;
  height: 10rem;
  border-radius: 1rem;
  background-color: #f4f5f8;
  position: relative;
  
  img {
    width: 10rem;
    height: 10rem;
    border-radius: 1rem;
    object-fit: cover;
    border: 0;
    outline: 0;
  
    &.overlay {
      position: absolute;
      top: 0;
      left: 0;
    }
  }

`;

export const PostActionsButton = styled.button.attrs({
  type: 'button'
})`
  ${buttonStyle}

  width: 14.375rem;
  color: #fff;
  font-family: "Roboto";

  svg {
    margin-right: 0.625rem;
  }

  &.reading {
    background-color: #FF6F6F;

    &:hover {
      transition: all 0.2s;
      background-color: ${darken('0.2', '#FF6F6F')};
    }
  }

  &.viewing {
    background-color: #25CFA1;
    margin-left: auto;

    &:hover {
      transition: all 0.2s;
      background-color: ${darken('0.2', '#25CFA1')};
    }
  }
  
  &.import {
    background-color: #DBDFEB;
    margin-top: 1.25rem;
    color: #0F1331;
    width: 100%;
  
    &:hover {
      transition: all 0.2s;
      background-color: ${darken('0.2', '#DBDFEB')};
    }
  }
`;

export const ViewProduct = styled.a`
  ${buttonStyle}
  width: 14.375rem;
  color: #fff;
  font-family: "Roboto";

  background-color: #25CFA1;
  margin-left: auto;

  &:hover {
    transition: all 0.2s;
    background-color: ${darken('0.2', '#25CFA1')};
  }
`;

export const MaxFilesizeText = styled.p`
  margin-top: 1.0625rem;
  font-size: 0.75rem;
  color: #0F1331;
  /* width: 100%; */
  text-align: center;
`;

const rotate = keyframes` /** widtwidtwidth: 840px;h: 840px;h: 840px;animação para rotacionar o icon. */
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Button = styled.button`
  ${buttonStyle}
  color: #0F1331;
  width: 100%;

  svg.revert {
    stroke: #fff;
    animation: ${rotate} 2s linear infinite;
  }
`;

export const Attachment = styled.div<{ disabled?: boolean }>`
  ${buttonStyle}
  cursor: pointer;
  color: #0F1331;
  width: 18rem;
  padding: 0 0.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  ${({ disabled }) => disabled && css`
    cursor: not-allowed;
    opacity: 0.6;
  `} 
  

  button {
    position: absolute;
    top: 0.25rem;
    right: 0.75rem;
    width: 0.1875rem;
    height: 0.1875rem;
  }

  svg {
    margin-right: 0.625rem;
  }

  a {
    color: #0F1331;
    /* display: -webkit-box; */
    /* -webkit-box-orient: vertical; */
    /* -webkit-line-clamp: 1; */
    /* text-overflow: ellipsis; */
    overflow: hidden;
    font-size: 1rem;
    /* width: 90%; */
    /* background-color: #f90; */
    text-align: center;
    /* max-width: 12.5rem; */
    /* max-width: 14.5rem; */
  }
`;

export const ProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* background-color: #ff0; */
  margin-top: 1.875rem;
  
  > div {
    display: flex;
    height: 2.75rem;
    align-items: center;
    width: 100%;
    /* background-color: #f90; */

    &:first-child, & + div {
      border-top: 1px solid #ccc;
    }
    
    &:last-child {
      border-bottom: 1px solid #ccc;
    }

  }
`;

export const AddingOptionalProduct = styled(TableActionButton)`
  &[disabled] {
    svg {
      height: 1rem;
      width: 1rem;
      margin-top: 0.175rem;
      stroke: #393939;
      animation: ${rotate} 2s linear infinite;
    }
  }
`;