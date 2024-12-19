import styled from "styled-components";

export const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  padding-top: 10vh;
  justify-content: center;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  top: 0;
  left: 0;
  z-index: 1099;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 1.25rem;
  padding: 2.5rem;
  z-index: 1199;
  position: relative;
  overflow-y: scroll;
  height: auto;
  max-height: 80vh;
`;