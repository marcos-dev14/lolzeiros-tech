import styled, { keyframes } from 'styled-components';
import { buttonStyle, MainContainer } from '~styles/components';
import { MainTable } from '~styles/components/tables';

export const Container = styled(MainContainer)`
  max-width: 1160px;
`;

export const Table = styled(MainTable)`
  margin-top: 1.25rem;
  padding-bottom: 2rem;
`;

export const TableHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  div {
    display: flex;
  }
`;

export const DropdownRowContent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const DropdownRowContentInfo = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;

  span {
    height: 0.5rem;
    width: 0.5rem;
    border-radius: 50%;
    background-color: #FE726E;
    margin-right: 0.375rem;
  }

  div {
    display: flex;
    align-items: center;
  }

  p {
    font-size: 0.75rem;

    strong {
      font-family: 'Roboto'; 
    }
    
    b {
      font-family: "Roboto";
      font-weight: bold;
    }
  }
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
  width: 8rem;

  &.newProduct {
    width: 14.375rem;
    margin-left: 2.5rem;
  }

  &.sendMail {
    width: 12.875rem;
    margin-left: 1.25rem;
  }

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg.load {
    stroke: #0F1331;
    animation: ${rotate} 2s linear infinite;
  }
`;

export const TagContainer = styled.div`
  width: 100%;
  border-radius: 0.25rem;  
  height: 2rem;
  display: flex;
  align-items: center;
  padding-left: 0.375rem;
  overflow-x: scroll;
  
  scrollbar-width: none;
  -ms-overflow-style: none;

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
  }
`;

export const Tag = styled.div`
  /* display: inline-flex; */
  display: flex;
  flex-shrink: 0;
  background-color: #25CFA1;
  height: 1.25rem;
  border-radius: 0.25rem;
  padding: 0 0.625rem 0 0.5rem;
  color: #fbfbfd;
  align-items: center;
  font-size: 0.75rem;

  & + div {
    margin-left: 0.625rem;
  }
`;