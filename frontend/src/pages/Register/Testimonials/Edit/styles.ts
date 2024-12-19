import { darken } from 'polished';
import styled, { keyframes } from 'styled-components';
import { buttonStyle, MainContainer } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1346px;
  height: 595px;
`;

const rotate = keyframes` /** widtwidtwidth: 840px;h: 840px;h: 840px;animação para rotacionar o icon. */
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const StarsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 2.125rem);
  gap: 0 1.25rem;
  margin-left: 2.5rem;
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
  
  top: 62.5%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const ButtonsContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 3.125rem);
  gap: 3.125rem;
  margin-top: 7.5rem;
`;

export const Button = styled.button.attrs({
  type: 'button'
})`
  ${buttonStyle}

  width: 23.75rem;
  color: #fff;
  font-family: "Roboto";

  &.delete {
    background-color: #FF6F6F;

    &:hover {
      transition: all 0.2s;
      background-color: ${darken('0.2', '#FF6F6F')};
    }
  }

  &.save {
    background-color: #25CFA1;
    margin-left: auto;

    &:hover {
      transition: all 0.2s;
      background-color: ${darken('0.2', '#25CFA1')};
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