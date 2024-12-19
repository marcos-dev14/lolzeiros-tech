import styled from "styled-components";
import Carousel from "react-elastic-carousel";

type ImageProps = {
  url: string;
}

type ImagesProps = {
  imagesLength: number;
}

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 2.125rem;
  height: 2.125rem;
  margin-top: 1.5rem;
  border-radius: 50%;
  background-color: #F5B731;
`;

export const Images = styled(Carousel)<ImagesProps>`
  width: 18.75rem;
  width: ${({ imagesLength }) => imagesLength * 12.25 }rem;
  max-width: 60rem;
  background-color: #af9;
  align-self: flex-start;
  max-width: 50.5rem;
  height: 6.25rem;
  margin-top: 2.5rem;
  display: flex;
  /* flex: 0; */
  /* width: auto; */
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  padding: 0;
  background: none;

  div {
    background: none;
  }
`;

export const Image = styled.img.attrs({
  type: "button",
})<ImageProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6.25rem;
  width: 6.25rem;
  border-radius: 1rem;
  object-fit: cover;
  cursor: pointer;
`;
