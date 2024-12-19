import { darken } from 'polished';
import styled, { keyframes } from 'styled-components';
import { buttonStyle, MainContainer } from '~styles/components';

export const Container = styled(MainContainer)`
  max-width: 1346px;
`;

const rotate = keyframes` /** widtwidtwidth: 840px;h: 840px;h: 840px;animação para rotacionar o icon. */
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
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
  
  top: 62.5%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const DropPicture = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #FF7373;
  top: 0;
  left: 0;
`;

export const ButtonsContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 3.125rem);
  gap: 3.125rem;
  margin-top: 4.5rem;
  margin-left: auto;
`;

export const Badge = styled.div`
  width: 14.6875rem;
  min-height: 5.3125rem;
  border-radius: 1rem;
  border: 1px solid #DBDFEB;
  padding: 0.625rem;
  display: grid;
  grid-template-columns: 4rem auto;
  gap: 0 0.625rem;

  > img {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    object-fit: cover;
  }

  > div {
    display: flex;
    flex-direction: column;

    strong {
      font-family: "Roboto";
      font-weight: bold;
      font-size: 0.875rem;
    }
    
    p {
      font-size: 0.75rem;
    }

    div {
      display: grid;
      grid-template-columns: repeat(5, 1.5rem);
      gap: 0 0.25rem;
      margin-top: 0.5rem;

      button {
        width: 1.5rem;
        height: 1.5rem;
        background-color: #3699CF;
        border-radius: 50%;
      }
    }
  }
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