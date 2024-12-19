import styled from 'styled-components';

export const Container = styled.div`  
  position: relative;
  transition: all 0.4s;
  color: #272e46;
  width: 12.0625rem;
  height: 12.0625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  margin: 0;
  background-color: #DBDFEB;

  img {
    object-fit: cover;
  }
  
  div {
    position: absolute;
    border-radius: 1rem;
    width: 100%;
    height: 100%;
    background-color: none;
  }

  &:hover {
    color: #fff;

    div {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

