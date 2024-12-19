import styled from "styled-components";

export const CupomCard = styled.div`
  width: 100%;
  max-width: 23rem;
  /* max-height: 6.875rem; */
  padding: 1.25rem;
  background-color: #eceff6;
  display: flex;
  flex-direction: column;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    background-color: white;
    border-radius: 50%;
    top: 45%;
    left: -3%;
  }

  &:after {
    content: "";
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    background-color: white;
    border-radius: 50%;
    top: 45%;
    right: -3%;
  }
`;

export const TagTitle = styled.div`
  width: 8rem;
  height: 3rem;
  background-color: #0c5da7;
  padding: 0.6rem 1rem;
`;

export const WrapperInputCupom = styled.div`
  max-height: 1.875rem;
  display: flex;
  border-radius: 0.1875rem;
  overflow: hidden;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    background-color: #eceff6;
    border-radius: 50%;
    top: 39%;
    right: -1.75%;
  }

  input {
    max-width: 10.65rem;
    border: none;
    outline: none;
    padding-inline: 0.5rem;
    font-size: .8rem;

    &:disabled {
      background-color: #fff;
    }
  }
`;

export const CupomNameTag = styled.div`
  background-color: #0c5da7;
  padding: 0.3125rem 0.5rem 0.3125rem 0.625rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:before {
    content: "";
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    background-color: #eceff6;
    border-radius: 50%;
    top: 39%;
    left: -5%;
  }

  p {
    font-size: .8rem;
    font-weight: 700;
    color: #fff;
  }
`;

export const WrapperBox = styled.div`
  width: 100%;
  display: flex;
  gap: 0.625rem;

  button {
    margin: 0;
  }
`;

export const WrapperDates = styled.div`
  width: 7.5rem;
  height: 1.875rem;
`;
